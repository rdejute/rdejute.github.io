// Skill config — the grids render from these arrays so content stays in one
// place. `icon` maps to a symbol id in /icons.svg; title/desc resolve via i18n.
export const TECHNICAL_SKILLS = [
  { key: 'frontend', icon: 'code', titleKey: 'home.skills.frontend.title', descKey: 'home.skills.frontend.desc' },
  { key: 'backend', icon: 'server', titleKey: 'home.skills.backend.title', descKey: 'home.skills.backend.desc' },
  { key: 'data', icon: 'database', titleKey: 'home.skills.data.title', descKey: 'home.skills.data.desc' },
  { key: 'ai', icon: 'sparkles', titleKey: 'home.skills.ai.title', descKey: 'home.skills.ai.desc' },
]

// "What I bring to a team" — the final card set (home-page.feature §2.E).
export const SOFT_SKILLS = [
  { key: 'resilience', icon: 'refresh', titleKey: 'home.skills.resilience.title', descKey: 'home.skills.resilience.desc' },
  { key: 'communication', icon: 'chat', titleKey: 'home.skills.communication.title', descKey: 'home.skills.communication.desc' },
  { key: 'accountability', icon: 'shield', titleKey: 'home.skills.accountability.title', descKey: 'home.skills.accountability.desc' },
  { key: 'selfDirection', icon: 'compass', titleKey: 'home.skills.selfDirection.title', descKey: 'home.skills.selfDirection.desc' },
]
