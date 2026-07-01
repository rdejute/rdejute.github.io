import cryptoImg from '../assets/crypto-risk-desk.png'
import groceryImg from '../assets/grocery-graphic.png'
import rocketImg from '../assets/rdelivery.png'
import portfolioImg from '../assets/portfolio-graphic.png'

// Education & work — ordered newest-first (reverse chronological) at the source.
export const EDUCATION = [
  { key: 'codeboxx', titleKey: 'portfolio.edu.codeboxx.title', orgKey: 'portfolio.edu.codeboxx.org', datesKey: 'portfolio.edu.codeboxx.dates' },
  { key: 'crps', titleKey: 'portfolio.edu.crps.title', orgKey: 'portfolio.edu.crps.org', datesKey: 'portfolio.edu.crps.dates' },
  { key: 'diploma', titleKey: 'portfolio.edu.diploma.title', orgKey: 'portfolio.edu.diploma.org', datesKey: 'portfolio.edu.diploma.dates' },
]

export const WORK = [
  { key: 'coordinator', titleKey: 'portfolio.jobs.coordinator.title', orgKey: 'portfolio.jobs.coordinator.org', datesKey: 'portfolio.jobs.coordinator.dates', descKey: 'portfolio.jobs.coordinator.desc' },
  { key: 'humanServices', titleKey: 'portfolio.jobs.humanServices.title', orgKey: 'portfolio.jobs.humanServices.org', datesKey: 'portfolio.jobs.humanServices.dates', descKey: 'portfolio.jobs.humanServices.desc' },
]

// Projects — mix of real screenshots and AI-generated thematic images.
// `tech` are proper nouns (not translated). isAIImage flags the AI thematic ones.
export const PROJECTS = [
  {
    key: 'crypto',
    nameKey: 'portfolio.proj.crypto.name',
    tech: ['React', 'Recharts', 'CoinGecko API', 'Alternative.me API'],
    descKey: 'portfolio.proj.crypto.desc',
    image: cryptoImg,
    imageAltKey: 'portfolio.proj.crypto.alt',
    isAIImage: false,
  },
  {
    key: 'grocery',
    nameKey: 'portfolio.proj.grocery.name',
    tech: ['React', 'JavaScript'],
    descKey: 'portfolio.proj.grocery.desc',
    image: groceryImg,
    imageAltKey: 'portfolio.proj.grocery.alt',
    isAIImage: true,
  },
  {
    key: 'rocket',
    nameKey: 'portfolio.proj.rocket.name',
    tech: ['React Native', 'Expo', 'Spring Boot'],
    descKey: 'portfolio.proj.rocket.desc',
    image: rocketImg,
    imageAltKey: 'portfolio.proj.rocket.alt',
    isAIImage: false,
  },
  {
    key: 'portfolio',
    nameKey: 'portfolio.proj.portfolio.name',
    tech: ['React', 'Vite', 'Supabase', 'GitHub Actions'],
    descKey: 'portfolio.proj.portfolio.desc',
    image: portfolioImg,
    imageAltKey: 'portfolio.proj.portfolio.alt',
    isAIImage: true,
  },
]
