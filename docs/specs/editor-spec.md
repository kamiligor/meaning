---
type: spec
name: Editor Specification (TipTap)
version: "1.0"
last_updated: "2026-02-27"
---

# Specyfikacja Edytora — TipTap

## 1. Przegląd

Edytor to serce programu Pisz Siebie. Użytkownik spędza w nim większość czasu. Musi być:
- Prosty (nie rozpraszający)
- Niezawodny (nigdy nie traci tekstu)
- Dostępny (WCAG 2.1 AA)
- Responsywny (działa dobrze na mobile)

**Biblioteka:** TipTap (headless rich text editor, oparty na ProseMirror)

---

## 2. Funkcjonalności Edytora

### 2.1 Formatowanie (minimalne)

Tylko te opcje, które wspierają proces pisania — bez rozpraszania:

| Funkcja | Skrót | Ikona | Uzasadnienie |
|---------|-------|-------|--------------|
| Pogrubienie | Ctrl+B | **B** | Podkreślenie ważnych myśli |
| Kursywa | Ctrl+I | *I* | Cytat, wspomnienie, dialog wewnętrzny |
| Lista punktowana | — | • | Strukturyzowanie myśli |
| Separator | — | — | Rozdzielenie sekcji/myśli |

### Celowo BRAK:
- Nagłówków (H1-H6) — to nie dokument
- Linków — to nie artykuł
- Kolorów tekstu — rozpraszające
- Obrazków — to program do pisania
- Tabel — niepotrzebne
- Kodu — niepotrzebny
- Wyrównania tekstu — niepotrzebne

### 2.2 Toolbar

```
┌────────────────────────────────────────────┐
│  B  I  •  —                    Zapisano ✓  │
└────────────────────────────────────────────┘
```

- Toolbar widoczny na desktop, ukryty na mobile (dostępny przez long-press lub bubble menu)
- "Zapisano ✓" — status autosave, zawsze widoczny
- Bez licznika słów (presja) — opcjonalnie w ustawieniach

### 2.3 Placeholder

Kiedy edytor jest pusty, wyświetl placeholder dopasowany do kontekstu:
- Domyślny: "Zacznij pisać..."
- Można nadpisać per ćwiczenie (np. "Zacznij od momentu, który pamiętasz najwyraźniej...")

Placeholder znika przy pierwszym znaku.

### 2.4 Bubble Menu (mobile)

Na mobile — zaznaczenie tekstu pokazuje bubble menu z opcjami B / I:
```
        ┌─────────┐
        │  B   I  │
        └────▲────┘
             │
    "zaznaczony tekst"
```

---

## 3. Autosave

### 3.1 Strategia

```
Użytkownik pisze → debounce 5s bezczynności → szyfruj client-side → wyślij na serwer
                 → co 30s niezależnie (safety net)
                 → przy opuszczeniu strony (beforeunload)
```

### 3.2 Stany autosave

| Stan | Wskaźnik UI | Opis |
|------|------------|------|
| `idle` | "Zapisano ✓" | Wszystko zsynchronizowane |
| `saving` | "Zapisywanie..." | Trwa zapis na serwer |
| `saved` | "Zapisano ✓" | Zapis ukończony (fade do idle) |
| `offline` | "Zapisano lokalnie" | Brak połączenia, zapis do localStorage |
| `error` | "Nie udało się zapisać. Tekst bezpieczny w przeglądarce." | Błąd serwera |
| `conflict` | "Wykryto starszą wersję. [Użyj aktualnej] [Użyj starszej]" | Konflikt wersji |

### 3.3 Lokalne przechowywanie (fallback)

- Przy każdym autosave: zapis do localStorage (zaszyfrowany)
- Przy ładowaniu ćwiczenia: porównaj timestamp serwera vs localStorage
- Jeśli localStorage nowsze → zaproponuj przywrócenie
- localStorage czyszczony po potwierdzeniu synchronizacji z serwerem

### 3.4 Nigdy nie trać tekstu

**Absolutna reguła:** Tekst użytkownika NIE MOŻE zostać utracony. Scenariusze:
- Zamknięcie karty → beforeunload zapis do localStorage
- Utrata połączenia → localStorage + synchronizacja po powrocie
- Crash przeglądarki → localStorage przetrwa
- Błąd serwera → retry 3x, potem localStorage
- Wyczyszczenie cache → tekst na serwerze (zaszyfrowany)

---

## 4. Integracja z Ćwiczeniami

### 4.1 Layout ćwiczenia z edytorem

Dwa warianty:

**Wariant A: Jeden edytor na ćwiczenie** (dla prostszych ćwiczeń)
```
[Pytanie 1]
[Pytanie 2]
[Pytanie 3]

┌──────────────────────────────┐
│  Edytor (jeden dla całości)  │
│                              │
│                              │
└──────────────────────────────┘
```

**Wariant B: Edytor per pytanie** (dla ćwiczeń wieloczęściowych, np. II-5)
```
[Pytanie 1: "Napisz za co się krytykujesz"]
┌──────────────────────────────┐
│  Edytor A                    │
└──────────────────────────────┘

[Pytanie 2: "List od przyjaciela"]
┌──────────────────────────────┐
│  Edytor B                    │
└──────────────────────────────┘
```

**Rekomendacja:** Wariant B jako domyślny — osobny edytor per pytanie. Ułatwia:
- Nawigację (widać ile zostało)
- Autosave (granularny)
- Refleksję (widoczne porównanie odpowiedzi)

### 4.2 Metadane edytora

Każdy zapis zawiera:
```json
{
  "exercise_id": "past_03",
  "question_index": 1,
  "content_encrypted": "...",
  "word_count": 247,
  "created_at": "2026-02-27T23:15:00Z",
  "updated_at": "2026-02-27T23:42:00Z",
  "time_spent_seconds": 1620
}
```

`word_count` i `time_spent_seconds` — obliczane client-side, NIE z treści (bo zaszyfrowana). Używane do statystyk na dashboardzie (opcjonalnie).

---

## 5. Dostępność (a11y)

### 5.1 Wymagania WCAG 2.1 AA

- **Kontrast:** min. 4.5:1 dla tekstu, 3:1 dla dużego tekstu
- **Klawiatura:** pełna obsługa klawiatury (Tab, Enter, Escape)
- **Screen reader:** aria-label na edytorze, aria-live dla statusu autosave
- **Focus:** widoczny focus ring na edytorze i toolbarze
- **Rozmiar czcionki:** bazowy 16px (body), edytor 18px (komfort czytania)
- **Line-height:** 1.6-1.8 w edytorze (luźne, czytelne)

### 5.2 Preferencje użytkownika

- **Tryb ciemny/jasny:** automatycznie z preferencji systemu, przełącznik w ustawieniach
- **Rozmiar czcionki:** opcja powiększenia/zmniejszenia w edytorze
- **Dyslexia-friendly font:** opcja w ustawieniach (OpenDyslexic lub Lexie Readable)

---

## 6. Konfiguracja TipTap

### 6.1 Wymagane rozszerzenia

```
@tiptap/starter-kit          — bazowe rozszerzenia
@tiptap/extension-placeholder — placeholder text
@tiptap/extension-character-count — opcjonalny licznik (ukryty domyślnie)
@tiptap/extension-bubble-menu — bubble menu na mobile
@tiptap/extension-history     — undo/redo (Ctrl+Z / Ctrl+Y)
```

### 6.2 Konfiguracja bazowa

```typescript
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: false,      // brak nagłówków
      codeBlock: false,    // brak kodu
      blockquote: false,   // brak cytatów blokowych
      horizontalRule: true, // separator
      bulletList: true,    // lista punktowana
      orderedList: false,  // brak list numerowanych
    }),
    Placeholder.configure({
      placeholder: 'Zacznij pisać...',
    }),
    BubbleMenu,
    History,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-lg max-w-none focus:outline-none',
      'aria-label': 'Edytor tekstu ćwiczenia',
    },
  },
})
```

---

## 7. Typografia Edytora

### Czcionka:
- **Body / edytor:** Inter (lub system font stack) — czytelna, neutralna
- **Opcja dyslexia:** OpenDyslexic

### Rozmiary:
- Tekst edytora: 18px / 1.75 line-height
- Toolbar: 14px
- Status autosave: 12px, muted color

### Kolory (light mode):
- Tekst: #1a1a1a
- Tło edytora: #ffffff
- Border edytora: #e5e5e5 (idle), #3b82f6 (focus)
- Placeholder: #9ca3af
- Status saved: #22c55e (green, subtelny)

### Kolory (dark mode):
- Tekst: #f5f5f5
- Tło edytora: #1a1a1a
- Border edytora: #333333 (idle), #60a5fa (focus)
- Placeholder: #6b7280
- Status saved: #4ade80

---

## 8. Eksport

### PDF
- Użytkownik może eksportować wszystkie teksty do PDF z dziennika
- Format: czytelny, z nagłówkami ćwiczeń i datami
- Generowany client-side (html2pdf lub jsPDF) — serwer nie widzi treści

### Clipboard
- Ctrl+A → Ctrl+C kopiuje tekst z formatowaniem
- Prawy klik → "Kopiuj" działa standardowo
