# Przypomnienia mailowe kursów

Stan: od 2026-09-18 przypomnienia wychodzą z własnej skrzynki SMTP
(`src/lib/mailer.ts`, Nodemailer), tak jak w NoComply. MailerLite zostaje do
newslettera i tagów kampanii. Wcześniejszy wariant z automatyzacjami
MailerLite (grupy `kurs-przypomnienie-dnia`, `kurs-powrot`) nie jest już
używany; grupy można usunąć w panelu MailerLite.

## Jak to działa

1. Coolify raz dziennie (np. 08:00 Europe/Warsaw) woła
   `POST /api/course/reminders` z nagłówkiem `Authorization: Bearer $CRON_SECRET`.
2. `runCourseReminders` (`src/lib/course-reminders.ts`) przechodzi po zapisach
   z włączonymi przypomnieniami i nieukończonym kursem. `decideReminder`
   wybiera: mail o odblokowanym dniu (najwyżej jeden dziennie), mail powrotny
   po trzech dniach ciszy (jeden, potem cisza), albo nic. Powtórne
   uruchomienie tego samego dnia nic nie wysyła.
3. Treść buduje `buildReminderMail` (`src/lib/course-mail.ts`): tekst i HTML,
   link do dnia, link wyłączenia przypomnień. Wysyłka: `sendMail` z nagłówkami
   `List-Unsubscribe` (jedno kliknięcie w kliencie poczty).
4. Wyłączenie: `GET|POST /api/course/reminders/off?e=<id zapisu>&t=<podpis>`.
   Podpis to HMAC z `APP_SECRET`, więc link działa bez logowania i tylko dla
   jednego zapisu. Po kliknięciu `reminders_enabled = false` i przekierowanie
   na landing kursu z komunikatem.

## Konfiguracja

Zmienne w Coolify (i lokalnie w `.env.local`):

```
SMTP_HOST=smtp.hostinger.com   # domyślna wartość, można pominąć
SMTP_PORT=465                  # 465 = TLS od razu; inny port = STARTTLS
SMTP_USER=kurs@poprostusens.pl
SMTP_PASS=...
SMTP_FROM=po prostu sens <kurs@poprostusens.pl>
CRON_SECRET=...                # openssl rand -hex 32
```

Skrzynka w Hostingerze: konto e-mail w domenie poprostusens.pl. Warto
sprawdzić, czy domena ma SPF i DKIM (panel Hostingera dodaje je przy
tworzeniu skrzynki), inaczej przypomnienia trafią do spamu.

Bez `SMTP_USER` i `SMTP_PASS` zadanie kończy się błędami wysyłki liczonymi w
`failures`, nic więcej się nie psuje.

## Treści

Tekst maili jest w `src/lib/course-mail.ts`, po polsku, w tonie kursu: jedno
przypomnienie dziennie, zero presji, wyłączenie jednym kliknięciem. Zmiany
treści to zmiana w kodzie i test w `src/lib/__tests__/course-mail.test.ts`.

## Ograniczenia

- Jedna skrzynka SMTP ma limity dzienne u Hostingera (zwykle kilkaset
  wiadomości). Przy kilkuset aktywnych uczestnikach naraz trzeba przejść na
  dostawcę transakcyjnego (Resend, Brevo) przez te same zmienne.
- Rezygnacja z przypomnień nie wypisuje z newslettera i odwrotnie; to dwie
  różne zgody.
