# Supabase Auth: własny SMTP i polskie szablony

Do zrobienia w panelu Supabase przed startem. Powód: domyślna poczta Supabase
ma limit kilku wiadomości na godzinę i angielskie szablony, a rejestracja
i reset hasła idą właśnie tędy.

## 1. SMTP (Authentication → Settings → SMTP Settings)

Ta sama skrzynka, co przypomnienia kursów (`docs/specs/kurs-przypomnienia.md`):

| Pole | Wartość |
|------|---------|
| Enable Custom SMTP | włączone |
| Sender email | kurs@poprostusens.pl (lub osobna skrzynka konto@) |
| Sender name | po prostu sens |
| Host | smtp.hostinger.com |
| Port | 465 |
| Username | kurs@poprostusens.pl |
| Password | hasło skrzynki |
| Minimum interval between emails | 60 s (domyślne) |

Po zapisaniu podnieść „Rate limit for sending emails” (Authentication → Rate
Limits) z domyślnych 2 na godzinę do np. 60.

## 2. Adresy przekierowań (Authentication → URL Configuration)

- Site URL: `https://poprostusens.pl`
- Redirect URLs: `https://poprostusens.pl/program/auth/callback`,
  `https://justmeaning.com/program/auth/callback`, `http://localhost:3000/**`,
  `http://pl.localhost:3000/**`

## 3. Szablony (Authentication → Email Templates)

Zmienne Supabase zostają w podwójnych klamrach. Szablony są po polsku, bo
konta zakłada się dziś tylko na polskiej domenie (kursy i program są
polskie). Jeśli konta ruszą po angielsku, Supabase pozwala na jeden szablon
per typ, więc wtedy trzeba przejść na wysyłkę własnym kodem albo na
dwujęzyczną treść.

### Confirm signup

Temat: `Potwierdź konto w po prostu sens`

```html
<div style="font-family:Georgia,serif;color:#1E2A36;line-height:1.6;max-width:560px">
  <p>Cześć,</p>
  <p>jeszcze jedno kliknięcie i konto jest gotowe. Konto służy do jednego: żeby kurs pamiętał, na którym jesteś dniu, i żeby twoje notatki czekały tam, gdzie je zostawisz.</p>
  <p><a href="{{ .ConfirmationURL }}" style="color:#7B9E8C">Potwierdzam adres e-mail</a></p>
  <p style="font-size:12px;color:#8A99A8">Jeśli to nie ty zakładałeś konto, po prostu zignoruj tę wiadomość. Nic się nie stanie.</p>
</div>
```

### Reset password

Temat: `Nowe hasło do po prostu sens`

```html
<div style="font-family:Georgia,serif;color:#1E2A36;line-height:1.6;max-width:560px">
  <p>Cześć,</p>
  <p>ktoś poprosił o zmianę hasła do twojego konta. Jeśli to ty, kliknij poniżej i ustaw nowe.</p>
  <p><a href="{{ .ConfirmationURL }}" style="color:#7B9E8C">Ustawiam nowe hasło</a></p>
  <p style="font-size:12px;color:#8A99A8">Link działa przez godzinę. Jeśli to nie ty, zignoruj tę wiadomość, hasło zostaje bez zmian.</p>
</div>
```

### Magic link

Nieużywany (logowanie hasłem i przez Google), ale na wypadek włączenia:

Temat: `Twój link do logowania`

```html
<div style="font-family:Georgia,serif;color:#1E2A36;line-height:1.6;max-width:560px">
  <p>Cześć,</p>
  <p>oto link, który loguje bez hasła:</p>
  <p><a href="{{ .ConfirmationURL }}" style="color:#7B9E8C">Loguję się</a></p>
  <p style="font-size:12px;color:#8A99A8">Link działa raz i przez godzinę.</p>
</div>
```

### Change email address

Temat: `Potwierdź nowy adres e-mail`

```html
<div style="font-family:Georgia,serif;color:#1E2A36;line-height:1.6;max-width:560px">
  <p>Cześć,</p>
  <p>potwierdź, że nowy adres tego konta to {{ .NewEmail }}:</p>
  <p><a href="{{ .ConfirmationURL }}" style="color:#7B9E8C">Potwierdzam nowy adres</a></p>
  <p style="font-size:12px;color:#8A99A8">Jeśli nie zmieniałeś adresu, zignoruj tę wiadomość.</p>
</div>
```

## 4. Test po konfiguracji

1. Rejestracja nowym adresem na produkcji: mail ma przyjść w minutę, po
   polsku, od „po prostu sens”, i nie wpaść do spamu.
2. Reset hasła z `/lost-password`.
3. Trzy rejestracje pod rząd z różnych adresów: żadna nie może dostać
   „rate limit exceeded”.
