// Single source for the four public nav items, so the desktop top-nav and the
// mobile bottom-nav always render from the same config (never drift apart).
// `labelKey` resolves through i18n; `icon` maps to a symbol id in /icons.svg.
// Secret routes (Login, Back Office) are intentionally absent here.
export const NAV_ITEMS = [
  { key: 'home', labelKey: 'nav.home', icon: 'home' },
  { key: 'portfolio', labelKey: 'nav.portfolio', icon: 'portfolio' },
  { key: 'links', labelKey: 'nav.links', icon: 'links' },
  { key: 'contact', labelKey: 'nav.contact', icon: 'contact' },
]
