# Przypomnienia mailowe kursów przez MailerLite

## Jak to działa

MailerLite (marketingowy) nie ma API do pojedynczych maili transakcyjnych,
więc używamy natywnego wzorca: **automatyzacja z triggerem "dołączył do
grupy"**. Nasz dzienny cron:

1. znajduje zapisy, którym odblokował się nowy dzień (przypomnienia włączone,
   kurs nieukończony, dzień nieukończony),
2. ustawia subskrybentowi pola: `kurs_nazwa`, `kurs_dzien`, `kurs_dni`,
   `kurs_link`,
3. usuwa go i ponownie dodaje do grupy-triggera, co odpala automatyzację,
   która wysyła mail złożony z tych pól.

Grupy i pola tworzą się same przy pierwszym uruchomieniu crona.
Grupy: `kurs-przypomnienie-dnia` (codzienny "Dzień N czeka") oraz
`kurs-powrot` (jednorazowy "kurs czeka, wracasz kiedy chcesz").

Polityka (zgodna z zasadą braku presji): maksymalnie jeden mail dziennie;
o każdym odblokowanym dniu przypominamy raz; po 3 dniach ciszy jeden mail
powrotny i potem cisza na dobre. Logika: `src/lib/course-reminders.ts`
(`decideReminder`, pokryta testami), wysyłka: `src/lib/mailerlite.ts`,
endpoint: `POST /api/course/reminders` (autoryzacja `Bearer CRON_SECRET`).
Przebieg jest idempotentny w obrębie doby — powtórne odpalenie nic nie doda.

## Konfiguracja (jednorazowa, ręczna)

1. **ENV (Coolify):** `CRON_SECRET` — długi losowy sekret
   (`openssl rand -hex 32`). `MAILERLITE_API_TOKEN` już jest.
2. **Migracja:** `supabase/migrations/20260810_course_reminder_tracking.sql`
   (3 kolumny w `course_enrollments`) — wykonać w Supabase SQL Editor.
3. **Automatyzacja nr 1 (przypomnienie dnia):** MailerLite → Automations →
   trigger "When a subscriber joins a group" → grupa `kurs-przypomnienie-dnia`
   → w ustawieniach automatyzacji WŁĄCZYĆ ponowne wejście ("Allow subscribers
   to repeat this automation" / re-entry) → krok E-mail.
   Sugerowany temat: `Dzień {$kurs_dzien} czeka` — treść np.:

   > Cześć,
   > w kursie „{$kurs_nazwa}" odblokował się dzień {$kurs_dzien}
   > z {$kurs_dni}. To kilka minut, reszta dzieje się poza ekranem.
   > → {$kurs_link}
   > (Jedno przypomnienie dziennie, zero presji. Możesz je wyłączyć
   > linkiem na dole.)

4. **Automatyzacja nr 2 (powrót):** trigger jak wyżej, grupa `kurs-powrot`,
   re-entry włączone. Sugerowany temat: `Kurs czeka, nic nie przepadło` —
   treść np.:

   > Kilka dni ciszy to normalna rzecz. W kursie „{$kurs_nazwa}" nic nie
   > przepadło: dzień {$kurs_dzien} dalej czeka, bez licznika i bez spóźnienia.
   > → {$kurs_link}
   > To ostatnia wiadomość od nas w tej sprawie. Wracasz, kiedy chcesz.

5. **Cron (Coolify → Scheduled Tasks):** codziennie, np. 08:00 Europe/Warsaw
   (dni kursu odblokowują się o 6:00, więc cron po tej godzinie; logika
   i tak pilnuje bramki 6:00, wcześniejszy bieg po prostu nic nie wyśle):

   ```
   curl -sf -X POST https://poprostusens.pl/api/course/reminders \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

## Ograniczenia i uwagi

- Rezygnacja: standardowy unsubscribe MailerLite (stopka maila) wyłącza
  WSZYSTKIE maile MailerLite; checkbox przy zapisie na kurs steruje polem
  `reminders_enabled` w bazie (cron pomija takich użytkowników). Docelowo
  warto dodać przełącznik na /profil.
- Użytkownik dwóch kursów z dwoma zaległymi dniami dostanie jednego maila
  dziennie (kursy przetwarzane w kolejności rejestru; drugi kurs przypomni
  się kolejnego dnia).
- E-maile użytkowników pobierane przez `auth.admin.listUsers` (paginacja
  1000/stronę) — przy większej skali do podmiany na widok SQL.
