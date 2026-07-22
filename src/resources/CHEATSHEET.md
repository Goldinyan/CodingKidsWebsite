╔════════════════════════════════════════════════════════════════════════════════╗
║                     DESIGN CHEATSHEET - QUICK REFERENCE                       ║
║                    Schnelle Übersicht für Developers                          ║
╚════════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 FARBEN - SCHNELL ZUGEGRIFFEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIMARY CTA (Knöpfe):
  bg-green-600 (Light) / bg-green-500 (Dark)
  text-white (Light) / text-black (Dark)

SECONDARY TEXT:
  text-slate-500/600 (Light) / text-gray-400 (Dark)

CARDS/GLASS:
  bg-slate-50 / rgba(248, 250, 252, 0.7) (Light)
  bg-zinc-900/20 / rgba(255,255,255,0.025) (Dark)

BORDERS:
  border-slate-200 (Light) / border-white/[0.07] (Dark)

HOVER ACCENT:
  border-green-500/50 (Light) / border-green-400/40 (Dark)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 TYPOGRAFIE - HÄUFIGE KOMBINATIONEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HAUPTÜBERSCHRIFT (H1):
  text-4xl md:text-5xl font-black font-gro tracking-medium

SEKTIONSÜBERSCHRIFT (H2):
  text-lg font-black font-gro leading-snug

KARTENTITEL (H3):
  text-2xl font-black font-gro

LABEL (klein, Mono):
  text-[10px] font-mono uppercase tracking-widest text-gray-500

BODY TEXT:
  text-base font-normal / text-[14px] font-thin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧩 KOMPONENTEN-TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GLASS CARD:
```tsx
<GlassCard className="p-6">
  Content
</GlassCard>
```

PRIMARY BUTTON:
```tsx
<button className={`px-4 py-2 font-medium text-xs border rounded-lg transition-colors
  ${isDark 
    ? "bg-green-500 text-black border-green-500 hover:bg-green-400" 
    : "bg-green-600 text-white border-green-600 hover:bg-green-700"
  }`}>
  Button Text
</button>
```

SECONDARY BUTTON:
```tsx
<button className={`px-4 py-2 font-thin text-xs border rounded-lg transition-colors
  ${isDark 
    ? "bg-black text-white border-white/10 hover:bg-white/5" 
    : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
  }`}>
  Button Text
</button>
```

ICON BOX (Dynamische Farbe):
```tsx
<div className="w-10 h-10 rounded-xl flex items-center justify-center"
  style={{
    background: `${color}15`,
    border: `1px solid ${color}30`
  }}>
  <Icon className="w-5 h-5" style={{ color }} />
</div>
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 SPACING & LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION PADDING:
  py-14 / py-20 (oben/unten)
  px-4 (links/rechts auf Mobile)

GRID GAPS:
  gap-3 (mobile), gap-4 (desktop), gap-6 (wide)

MARGIN BOTTOM (Spacing):
  mb-4, mb-6, mb-8, mb-10, mb-14, mb-20

CONTAINER MAX WIDTH:
  max-w-7xl (1280px)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 RESPONSIVE BREAKPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tablet & oben:        sm:
Tablet vertikal:      md:
Desktop klein:        lg:
Desktop normal:       xl:
Sehr breit:           xxl:

HÄUFIGE PATTERNS:
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
  flex-col md:flex-row
  text-3xl md:text-4xl lg:text-5xl

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌙 DARK MODE - PATTERN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```tsx
const { theme, isRounded } = useTheme();
const isDark = theme === "dark";

className={`
  ${isDark 
    ? "bg-zinc-950 text-white" 
    : "bg-white text-slate-900"
  }
`}
```

STANDARD DARK COLORS:
  BG:       bg-zinc-950 / bg-black
  TEXT:     text-white (primary), text-gray-400 (secondary)
  BORDER:   border-zinc-900 / border-white/[0.07]
  HOVER:    hover:bg-zinc-900 / hover:border-green-400/40

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ANIMATIONEN - COPY & PASTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FADE IN:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
>
```

SLIDE UP:
```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

BUTTON HOVER:
```tsx
<motion.button
  whileHover={{ scale: 1.03, y: -1 }}
  whileTap={{ scale: 0.9 }}
>
```

STAGGER GRID:
```tsx
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.07, duration: 0.4 }}
  >
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 HÄUFIGE FEHLER (AVOID!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Vergessen Dark Mode zu prüfen
   └─ Immer mit `isDark` conditional classNames nutzen

❌ Eigene Farben statt Tailwind verwenden
   └─ Nutze nur definierte Farbpalette

❌ Margin statt Gap in Flex/Grid
   └─ Nutze gap="4" für Abstände

❌ Hardcoded Breakpoints
   └─ Nutze sm: md: lg: xl: Präfixe

❌ Keine Animationen
   └─ Animationen machen die UX besser!

❌ Zu kleine Touch Targets
   └─ Minimum: px-4 py-2 (44px ideal)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 WEITERE RESSOURCEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Vollständiges Design System: style.txt
→ Komponenten Demo: src/app/homepage/
→ Theme Context: src/context/ThemeContext.tsx
→ Globals CSS: src/app/globals.css
→ Tailwind Docs: https://tailwindcss.com/docs

╔════════════════════════════════════════════════════════════════════════════════╗
║                           Happy Coding! 🚀                                    ║
║                          v1.0 - 2026-07-21                                    ║
╚════════════════════════════════════════════════════════════════════════════════╝
