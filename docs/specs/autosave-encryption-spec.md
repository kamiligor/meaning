---
type: spec
name: Autosave & Server-Side Encryption
version: "2.0"
last_updated: "2026-02-27"
---

# Specyfikacja Autosave i Szyfrowania Server-Side

## 1. Zasada Nadrzędna

**Treści użytkownika są szyfrowane w bazie danych.** Szyfrowanie odbywa się server-side za pomocą klucza derivowanego z `APP_SECRET` (zmienna środowiskowa w Coolify) i `user_id`. Nawet przy wycieku bazy danych, zaszyfrowane treści są bezużyteczne bez `APP_SECRET`.

---

## 2. Architektura Szyfrowania

### 2.1 Algorytm

- **Szyfrowanie:** AES-256-GCM (Galois/Counter Mode)
- **Derivacja klucza:** PBKDF2 z APP_SECRET + user_id
- **Klucz:** APP_SECRET przechowywany WYŁĄCZNIE w zmiennych środowiskowych Coolify
- **Nigdy w:** kodzie źródłowym, bazie danych, logach, repozytorium

### 2.2 Flow Szyfrowania

```
               CLIENT                              SERVER
               ──────                              ──────

Użytkownik pisze → plaintext
                     │
              [HTTPS / TLS]
                     │
                     ──────────────────→  Odbiór plaintext
                                                │
                                         [Node.js crypto]
                                         key = PBKDF2(APP_SECRET + user_id, salt, 600000)
                                         AES-256-GCM encrypt(plaintext, key, iv)
                                                │
                                         Zapis do Supabase (PostgreSQL):
                                           ciphertext + iv + salt
                                                │
              Odczyt: serwer ←──────────  Decrypt → plaintext
              otrzymuje plaintext
                     │
              Wyświetlenie w edytorze
```

### 2.3 Derivacja Klucza

```
APP_SECRET (env var w Coolify, np. 64-char random string)
    +
user_id (UUID z tabeli users)
    │
    ▼
PBKDF2(APP_SECRET + user_id, random_salt, iterations=600000, hash=SHA-256)
    │
    ▼
256-bit AES key
```

- `APP_SECRET + user_id` = unikalny klucz per użytkownik
- `random_salt` = generowany dla każdego rekordu, zapisany obok ciphertext
- Zmiana APP_SECRET = potrzeba re-enkrypcji wszystkich danych (migracja)

### 2.4 Model Zagrożeń

| Scenariusz | Atakujący ma | Rezultat |
|------------|-------------|----------|
| Wyciek bazy danych | ciphertext + salt + iv | Bezużyteczne bez APP_SECRET |
| Wyciek kodu źródłowego | algorytm szyfrowania | Bezużyteczne bez APP_SECRET |
| Wyciek bazy + kodu | ciphertext + algorytm | Bezużyteczne bez APP_SECRET |
| Wyciek APP_SECRET (sam) | klucz bazowy | Bezużyteczny bez bazy |
| Pełna kompromitacja (baza + APP_SECRET) | wszystko | Dane odszyfrowane — jedyny scenariusz |

**Akceptowalne ryzyko:** pełna kompromitacja infrastruktury to scenariusz, w którym żaden system nie jest bezpieczny. Server-side encryption chroni przed najczęstszymi wektorami: wyciek bazy i wyciek kodu.

---

## 3. Implementacja (Node.js)

### 3.1 Moduł szyfrowania

```typescript
// lib/encryption.ts
import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'crypto';

const APP_SECRET = process.env.APP_SECRET!;
const ITERATIONS = 600_000;
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;  // GCM standard
const SALT_LENGTH = 16;

function deriveKey(userId: string, salt: Buffer): Buffer {
  return pbkdf2Sync(
    APP_SECRET + userId,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    'sha256'
  );
}

export function encrypt(plaintext: string, userId: string): {
  ciphertext: string;
  iv: string;
  salt: string;
} {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(userId, salt);

  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: Buffer.concat([encrypted, authTag]).toString('base64'),
    iv: iv.toString('base64'),
    salt: salt.toString('base64'),
  };
}

export function decrypt(
  ciphertextB64: string,
  ivB64: string,
  saltB64: string,
  userId: string
): string {
  const salt = Buffer.from(saltB64, 'base64');
  const iv = Buffer.from(ivB64, 'base64');
  const data = Buffer.from(ciphertextB64, 'base64');

  const authTag = data.subarray(data.length - 16);
  const encrypted = data.subarray(0, data.length - 16);

  const key = deriveKey(userId, salt);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  return decipher.update(encrypted) + decipher.final('utf8');
}
```

### 3.2 Użycie w API Route

```typescript
// app/api/responses/[exerciseId]/route.ts
import { encrypt, decrypt } from '@/lib/encryption';

// Zapis
const { ciphertext, iv, salt } = encrypt(body.content, session.user.id);
await db.exerciseResponse.upsert({
  where: { userId_exerciseId_questionIndex: { ... } },
  update: { ciphertext, iv, salt, wordCount, updatedAt: new Date() },
  create: { userId, exerciseId, questionIndex, ciphertext, iv, salt, wordCount },
});

// Odczyt
const response = await db.exerciseResponse.findUnique({ ... });
const plaintext = decrypt(response.ciphertext, response.iv, response.salt, session.user.id);
```

---

## 4. Model Danych (Supabase / PostgreSQL)

### 4.1 Tabela `exercise_responses`

```sql
CREATE TABLE exercise_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id     VARCHAR(20) NOT NULL,       -- np. "past_03"
  question_index  SMALLINT NOT NULL DEFAULT 0,

  -- Zaszyfrowane dane
  ciphertext      TEXT NOT NULL,              -- base64-encoded (AES-256-GCM)
  iv              TEXT NOT NULL,              -- base64-encoded (12 bytes)
  salt            TEXT NOT NULL,              -- base64-encoded (16 bytes)

  -- Metadane (NIE zaszyfrowane — potrzebne do funkcji aplikacji)
  word_count      INTEGER DEFAULT 0,
  time_spent_sec  INTEGER DEFAULT 0,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, exercise_id, question_index)
);

CREATE INDEX idx_responses_user ON exercise_responses(user_id);
CREATE INDEX idx_responses_exercise ON exercise_responses(exercise_id);
```

### 4.2 Tabela `user_progress`

```sql
CREATE TABLE user_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id     VARCHAR(20) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'not_started',
                  -- not_started | in_progress | completed | skipped
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,

  UNIQUE(user_id, exercise_id)
);
```

### 4.3 Row Level Security (Supabase RLS)

```sql
-- Użytkownik widzi TYLKO swoje dane
ALTER TABLE exercise_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own responses"
  ON exercise_responses FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress"
  ON user_progress FOR ALL
  USING (auth.uid() = user_id);
```

---

## 5. Autosave — Specyfikacja

### 5.1 Triggery Zapisu

| Trigger | Opóźnienie | Priorytet |
|---------|-----------|-----------|
| Bezczynność (brak keystroke) | 5 sekund | Normalny |
| Interwał czasowy | Co 30 sekund | Safety net |
| Opuszczenie strony (beforeunload) | Natychmiast | Krytyczny |
| Utrata focus (visibilitychange) | Natychmiast | Wysoki |
| Klik "Zakończ ćwiczenie" | Natychmiast | Krytyczny |
| Klik "Pomiń" / "Wróć później" | Natychmiast | Krytyczny |

### 5.2 Pipeline Autosave

```
1. Edytor zmieniony (onChange)
   │
2. Debounce 5s (reset przy każdym keystroke)
   │
3. Pobierz plaintext z edytora
   │
4. Wyślij na serwer (PUT /api/responses/:exerciseId)
   │   Serwer szyfruje → zapisuje do Supabase
   │
   ├─ Sukces → "Zapisano ✓"
   │
   └─ Błąd → retry 3x (exponential backoff: 1s, 3s, 9s)
              │
              └─ Nadal błąd → Zapisz plaintext do localStorage
                              "Zapisano lokalnie. Zsynchronizujemy gdy wrócisz online."
```

### 5.3 Synchronizacja Offline → Online

```
1. Przy każdym ładowaniu strony:
   - Sprawdź localStorage pod klucz `pisz_siebie_pending_sync`
   - Jeśli są oczekujące zapisy → wyślij plaintext na serwer
   - Porównaj `updated_at` z serwerem:
     - localStorage nowsze → nadpisz serwer
     - Serwer nowszy → zaproponuj wybór użytkownikowi
   - Po synchronizacji → wyczyść localStorage
```

### 5.4 Dane w localStorage (fallback offline)

```json
{
  "pisz_siebie_pending_sync": {
    "past_03_q1": {
      "plaintext": "Treść użytkownika...",
      "word_count": 247,
      "updated_at": "2026-02-27T23:42:00Z"
    }
  }
}
```

**Uwaga:** localStorage przechowuje plaintext jako fallback offline. Dane są wysyłane na serwer (który je szyfruje) przy pierwszej okazji, a następnie czyszczone z localStorage. To akceptowalne, bo localStorage jest per-urządzenie i per-origin.

---

## 6. API Endpoints

### 6.1 Zapis odpowiedzi

```
PUT /api/responses/:exerciseId

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "question_index": 1,
  "content": "plaintext treści użytkownika",
  "word_count": 247,
  "time_spent_sec": 1620
}

Response: 200 OK
{
  "updated_at": "2026-02-27T23:42:00Z"
}
```

Serwer: `encrypt(content, user.id)` → zapis ciphertext do DB.

### 6.2 Odczyt odpowiedzi

```
GET /api/responses/:exerciseId

Headers:
  Authorization: Bearer <token>

Response: 200 OK
{
  "responses": [
    {
      "question_index": 0,
      "content": "odszyfrowany plaintext",
      "word_count": 185,
      "updated_at": "2026-02-27T22:15:00Z"
    }
  ]
}
```

Serwer: odczyt ciphertext z DB → `decrypt(...)` → zwrot plaintext.

### 6.3 Eksport danych (RODO)

```
GET /api/data-export

Headers:
  Authorization: Bearer <token>

Response: 200 OK
{
  "user": { "email": "...", "created_at": "..." },
  "responses": [
    {
      "exercise_id": "past_03",
      "question_index": 1,
      "content": "odszyfrowany plaintext",
      "word_count": 247,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "progress": [
    { "exercise_id": "past_01", "status": "completed" }
  ]
}
```

Eksport zwraca odszyfrowany plaintext — użytkownik jest zalogowany, więc serwer może odszyfrować.

### 6.4 Usunięcie konta (prawo do zapomnienia)

```
DELETE /api/account

Headers:
  Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Konto i wszystkie dane zostały usunięte."
}
```

Operacja:
- Usuwa użytkownika (CASCADE usuwa responses, progress)
- Czyści sesje Supabase
- Nieodwracalne

---

## 7. Bezpieczeństwo

### 7.1 Zagrożenia i Mitygacje

| Zagrożenie | Mitygacja |
|------------|-----------|
| Wyciek bazy danych | Ciphertext bez APP_SECRET jest bezużyteczny |
| Wyciek kodu źródłowego | APP_SECRET nie jest w kodzie — jest w env var Coolify |
| XSS | CSP headers, sanityzacja inputu TipTap |
| MITM | HTTPS only, HSTS header |
| Brute force auth | Rate limiting, Supabase Auth built-in protection |
| Kradzież tokenu sesji | HttpOnly cookies, krótki TTL, Supabase refresh token rotation |

### 7.2 Headers Bezpieczeństwa

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 7.3 Rate Limiting

```
API responses: 60 req/min per user
Auth endpoints: 10 req/min per IP (Supabase built-in)
Data export: 1 req/hour per user
Account deletion: 1 req/day per user
```

---

## 8. Prywatność

### 8.1 Co serwer WIE

- Email użytkownika (auth)
- Które ćwiczenia ukończone (progress)
- Liczba słów per ćwiczenie (word_count)
- Czas spędzony na pisaniu (time_spent)
- Daty utworzenia/modyfikacji

### 8.2 Czego serwer NIE przechowuje w plaintext

- Treść tekstów użytkownika (zaszyfrowana AES-256-GCM w DB)

### 8.3 Kto może odszyfrować

- Tylko serwer aplikacji z dostępem do APP_SECRET (env var w Coolify)
- NIE: admin bazy danych (widzi tylko ciphertext)
- NIE: osoba z dostępem do kodu (nie ma APP_SECRET)
- TAK: osoba z dostępem do serwera aplikacji (ma APP_SECRET + DB) — to administrator systemu

### 8.4 Zero Tracking

- Brak Google Analytics
- Brak cookies śledzących (tylko sesja Supabase)
- Brak telemetrii
- Brak fingerprinting
- Brak third-party scripts (poza płatnościami)
- Jedyne cookies: Supabase session (HttpOnly, Secure, SameSite=Strict)

---

## 9. Rotacja APP_SECRET

Jeśli zajdzie potrzeba zmiany APP_SECRET (np. podejrzenie wycieku):

```
1. Ustaw nowy APP_SECRET_NEW w env var Coolify
2. Uruchom skrypt migracji:
   - Dla każdego rekordu w exercise_responses:
     - decrypt(ciphertext, APP_SECRET_OLD, user_id)
     - encrypt(plaintext, APP_SECRET_NEW, user_id)
     - Zapisz nowy ciphertext + nowy salt + nowy iv
3. Usuń APP_SECRET_OLD z env var
4. Restart aplikacji
```

**Czas migracji:** zależy od ilości danych. Przy 10 000 rekordów: ~minuty.

---

## 10. Komunikacja do Użytkownika

### Na stronie prywatności:

```
Twoje teksty są szyfrowane w naszej bazie danych.
Nawet gdyby ktoś uzyskał dostęp do bazy — zobaczy tylko zaszyfrowane dane,
nie Twoje słowa.

Nie używamy Google Analytics ani żadnych narzędzi śledzących.
Nie sprzedajemy Twoich danych. Nie czytamy Twoich tekstów.
```

### Czego NIE obiecujemy:

- NIE: "nawet my nie możemy odczytać Twoich tekstów" (to byłoby kłamstwo — server-side encryption = serwer ma dostęp)
- TAK: "Twoje teksty są szyfrowane w bazie danych i chronione"
- Uczciwość > marketing
