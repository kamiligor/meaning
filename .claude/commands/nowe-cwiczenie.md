---
description: Utwórz nowe ćwiczenie pisemne dla programu The Life Writing Program
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Tworzenie Nowego Ćwiczenia

Utwórz nowe ćwiczenie dla modułu: $ARGUMENTS

## Procedura:

1. **Konsultacja naukowa** — Użyj agenta `psycholog-badawczy` aby:
   - Zdefiniować cel psychologiczny ćwiczenia
   - Wskazać bazę teoretyczną (min. 2 źródła)
   - Określić kontrwskazania
   - Zaproponować mechanizm działania

2. **Projektowanie ćwiczenia** — Użyj agenta `terapeuta-narracyjny` aby:
   - Napisać ćwiczenie w formacie YAML
   - Stworzyć prompt questions (4-5 pytań, od łatwego do głębokiego)
   - Napisać stuck helpers (min. 3 podpowiedzi)
   - Napisać wprowadzenie i sekcję „dlaczego to działa"

3. **Wyjaśnienie naukowe** — Użyj agenta `edukator` aby:
   - Napisać sekcję „Dlaczego to działa" w prostym języku

4. **Zapis** — Zapisz ćwiczenie w:
   - `docs/exercises/[module]_[number].yaml` — definicja
   - `content/exercises/[module]_[number].mdx` — treść MDX

5. **Walidacja** — Użyj agenta `psycholog-badawczy` aby zwalidować finalną treść (checklist)
