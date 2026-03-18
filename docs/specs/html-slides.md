# Migracja slajdów: PNG → HTML/CSS

## Cel

Zastąpienie obrazków PNG slajdów na stronie komponentami HTML/CSS, które wyglądają identycznie. PNG zostaje dla Instagramu.

## Zyski

- **SEO** — cały tekst slajdów w DOM, pełna waga Google
- **Performance** — zero ciężkich PNG (~700KB/post → ~5KB danych), szybszy LCP
- **A11y** — tekst dostępny dla screen readerów natywnie
- **UX** — tekst zaznaczalny, kopiowalny, tłumaczalny przeglądarką

## Obecna architektura

```
content/posts/*.md (frontmatter + markdown)
  → src/lib/posts.ts (parsowanie)
  → src/scripts/generate-slides.ts (Satori JSX → SVG → PNG)
  → data/slides/{translationGroup}/{locale}/slide-{N}.png
  → /api/slides/[...path] (serwowanie PNG)
  → carousel-viewer.tsx (<img> elementy)
```

### Typy slajdów

| Nr | Szablon | Plik | Opis |
|----|---------|------|------|
| 1 | SlideTitleTemplate | slide-title.tsx | Tytułowy: topicTag pill, ikona SVG, headline z {akcentami}, subtitle |
| 2..N+1 | SlideContentTemplate | slide-content.tsx | Ciemne tło, numer sekcji, tag z linią, body z {highlightami} |
| N+2 | SlideQuoteTemplate | slide-quote.tsx | Jasne tło, koncentryczne koła, ikona, cytat, atrybucja |
| N+3 | SlideCTATemplate | slide-cta.tsx | Logo, handle, CTA, przycisk Follow, hashtagi |
| 100 | SlideTitleTemplate (wariant) | - | Web: strzałka w dół |
| 101 | SlideQuoteTemplate (wariant) | - | Web: bez ikony |

### Wymiary

- Canvas: 1080×1350px (proporcja 4:5, standard Instagram)
- Container w przeglądarce: `aspect-[4/5]`, zmienna szerokość

### Fonty (11 wariantów)

- **Outfit** (sans-serif): Regular 400, Medium 500, SemiBold 600, Bold 700
- **Fraunces** (serif display): SemiBold 600, Bold 700, ExtraBold 800, Black 900
- **LibreBaskerville** (serif): Regular 400, Italic 400, Bold 700

Pliki .woff w `public/fonts/`.

## Docelowa architektura

```
content/posts/*.md
       │
  src/lib/posts.ts (parsePostFile)
       │
    PostData
       │
  ┌────────────────────────┬──────────────────────┐
  │                        │                      │
  getSlideRenderData()     │              getPostSlides()
  (HTML na stronę)         │              (PNG na Instagram)
       │                   │                      │
  SlideRenderData[]        │                SlideInfo[]
       │                   │                      │
  HTML Components          │              Satori Templates
  (src/components/slides/) │              (src/templates/)
       │                   │                      │
  Rendering w przeglądarce │              Generowanie PNG
  (CarouselViewer)         │              (generate-slides.ts)
                           │
                    /api/slides/ (PNG)
                    → OG images (meta tags)
                    → Eksport na Instagram
```

## Co się zmienia, co zostaje

| Element | Przed | Po |
|---------|-------|----|
| Slajdy na stronie | `<img src="/api/slides/...">` (PNG) | React + Tailwind (HTML/CSS) |
| Dane do karuzeli | filenames PNG | SlideRenderData (post data + palette + typ) |
| Fonty w slajdach | Binary .woff w Satori | CSS @font-face (te same pliki .woff) |
| Transfer per post | ~700KB (7 PNG) | ~5KB (dane JSON) |

| Element | Status |
|---------|--------|
| Pliki Markdown | Bez zmian |
| src/lib/posts.ts | Bez zmian |
| src/lib/palettes.ts | Bez zmian |
| src/templates/ (Satori) | **Zostaje** — dla generowania PNG na Instagram |
| src/scripts/generate-slides.ts | **Zostaje** — dla PNG na Instagram |
| /api/slides/ | Zostaje — zmiana roli: OG images + Instagram, nie web |
| data/slides/ | Zostaje — PNG dla IG i OG |

## Nowe pliki

```
src/components/slides/
  accent-text.tsx          # Przeglądarkowy parser {akcentów}
  highlight-text.tsx       # Przeglądarkowy HighlightText
  slide-wrapper.tsx        # Kontener 4:5 ze skalowaniem
  slide-logo.tsx           # LogoMark (inline SVG, bez fs.readFileSync)
  slide-watermark.tsx      # Watermark (CSS)
  slide-icons.tsx          # SVG ikony (reeksport z templates lub kopia)
  html-slide-title.tsx     # Port SlideTitleTemplate
  html-slide-content.tsx   # Port SlideContentTemplate
  html-slide-quote.tsx     # Port SlideQuoteTemplate
  html-slide-cta.tsx       # Port SlideCTATemplate

src/lib/
  slide-data.ts            # Typ SlideRenderData + getSlideRenderData()
```

### Modyfikowane pliki

```
src/components/feed/carousel-viewer.tsx  # <img> → komponenty HTML
src/components/feed/post-card.tsx        # SlideRenderData zamiast filenames
src/app/page.tsx                         # getSlideRenderData()
src/app/post/[slug]/page.tsx             # getSlideRenderData() + HTML cytat
src/app/api/posts/route.ts              # Zwraca dane do HTML renderingu
src/hooks/use-infinite-posts.ts          # Nowy typ danych
src/app/globals.css                      # @font-face deklaracje
```

## Skalowanie: podejście scale transform

Slajdy Satori są zaprojektowane na 1080×1350px. W przeglądarce kontener ma zmienną szerokość.

**Podejście**: renderowanie w wirtualnym kontenerze 1080×1350, skalowanie CSS `transform: scale()`.

```tsx
function SlideWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / 1080);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-[4/5] overflow-hidden">
      <div style={{ width: 1080, height: 1350, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}
```

**Zaleta**: zachowuje oryginalne wartości px z szablonów Satori — minimalne ryzyko różnic wizualnych.

**Alternatywa na później**: CSS Container Queries (cqi units) — czystszy kod, ale wymaga przeliczenia każdej wartości (px / 1080 * 100 = cqi).

## Obsługa {akcentów} w HTML

Satori wymaga word-by-word flex z marginRight 0.3em (ograniczenie silnika). W przeglądarce wystarczy inline `<span>`:

```tsx
function AccentText({ text, accentColor }: { text: string; accentColor: string }) {
  const parts = text.split(/(\{[^}]+\})/);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("{") && part.endsWith("}") ? (
          <span key={i} style={{ color: accentColor }}>{part.slice(1, -1)}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
```

HighlightText analogicznie, z `background` + `padding` na akcentowanych słowach.

## LogoMark — zmiana podejścia

Satori version: `fs.readFileSync('public/logo.svg')` → string replace kolorów → base64 data URI.

HTML version: inline SVG w React component z dynamicznym kolorem przez props. Bez filesystem, bez base64.

## Kroki implementacji

### Faza 0: Przygotowanie

1. @font-face deklaracje w globalnym CSS (11 wariantów)
2. Tailwind config: `font-outfit`, `font-fraunces`, `font-libre`
3. Typ `SlideRenderData` w `src/lib/slide-data.ts`
4. Funkcja `getSlideRenderData(post: PostData): SlideRenderData[]`

### Faza 1: Komponenty wspólne

5. `accent-text.tsx` — parser {akcentów}
6. `highlight-text.tsx` — parser z background highlight
7. `slide-icons.tsx` — SVG ikony
8. `slide-logo.tsx` — LogoMark jako inline SVG
9. `slide-watermark.tsx` — watermark CSS
10. `slide-wrapper.tsx` — kontener 4:5 ze scale transform

### Faza 2: Szablony slajdów HTML

11. `html-slide-title.tsx` — port SlideTitleTemplate
12. `html-slide-content.tsx` — port SlideContentTemplate (najzłożoniejszy)
13. `html-slide-quote.tsx` — port SlideQuoteTemplate
14. `html-slide-cta.tsx` — port SlideCTATemplate

### Faza 3: Integracja z CarouselViewer

15. Nowy interfejs danych dla CarouselViewer
16. carousel-viewer.tsx: `<img>` → komponenty HTML
17. post-card.tsx: SlideRenderData zamiast filenames
18. Aktualizacja page.tsx (feed) i post/[slug]/page.tsx
19. Aktualizacja API `/api/posts` i `use-infinite-posts.ts`

### Faza 4: Warianty webowe + cytat

20. html-slide-title.tsx: prop `arrowDown` (wariant 100)
21. html-slide-quote.tsx: prop `hideIcon` (wariant 101)
22. Strona posta: cytat jako `<blockquote>` HTML

### Faza 5: OG Images

23. OG image w meta tags nadal wskazuje na PNG — bez zmian
24. Social media crawlery potrzebują statycznego obrazka

### Faza 6: Cleanup i QA

25. Visual regression: Playwright screenshot HTML vs PNG
26. Testy responsywności (mobile/tablet/desktop)
27. Pomiar LCP: HTML vs PNG
28. Aktualizacja CLAUDE.md

## Ryzyka

### Różnice wizualne Satori vs HTML (WYSOKIE)

Satori używa własnego layout engine (Yoga). Mogą być różnice w line-height, letter-spacing, word-breaking. Scale transform minimalizuje to, bo zachowuje oryginalne wartości px. Cel: "wyglądają identycznie", nie "piksel-perfect".

### Podwójna konserwacja szablonów (ŚREDNIE)

Dwa zestawy szablonów (Satori + HTML) mogą dryftować. Mitygacja: wspólne stałe, konwencja "zmiana = update obu", visual regression testy. Długoterminowo: rozważenie generowania PNG z HTML (Playwright screenshot zamiast Satori), co wyeliminowałoby Satori.

### Fonty i rendering tekstu (NISKIE)

Ten sam font może renderować się nieco inaczej w przeglądarce vs Satori/resvg. Akceptowalne — użytkownik nie widzi PNG i HTML obok siebie.

### LogoMark (NISKIE)

Wymaga przepisania z fs.readFileSync na inline SVG. Prosty refactor.

### Transfer danych w API (NISKIE)

API response będzie zawierał dane slajdów zamiast filenames (nieco większy JSON). Netto zysk: eliminacja ~700KB PNG per post.

## Długoterminowa opcja: eliminacja Satori

Jeśli HTML slajdy będą wyglądać identycznie, można rozważyć generowanie PNG z HTML za pomocą Playwright screenshot zamiast Satori. To wyeliminowałoby:
- Zależność od Satori + @resvg/resvg-js
- Podwójną konserwację szablonów
- Różnice wizualne między PNG a HTML

Pipeline byłby: HTML component → Playwright screenshot → PNG → Instagram.
