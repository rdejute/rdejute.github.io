import linkedinImg from '../assets/links/linkedin.jpg'
import githubImg from '../assets/links/github.jpg'
import youtubeImg from '../assets/links/youtube.jpg'
import cryptoImg from '../assets/links/crypto.jpg'
import codeboxxImg from '../assets/links/codeboxx.jpg'

// Curated links — profiles plus a couple of "sites I value". A card shows an
// `image` banner when provided, otherwise the `icon` (a symbol id in
// /icons.svg) centered on a sage tint.
export const LINKS = [
  {
    key: 'linkedin',
    titleKey: 'links.items.linkedin.title',
    descKey: 'links.items.linkedin.desc',
    url: 'https://www.linkedin.com/in/rainadejute',
    image: linkedinImg,
    imageAltKey: 'links.items.linkedin.alt',
  },
  {
    key: 'youtube',
    titleKey: 'links.items.youtube.title',
    descKey: 'links.items.youtube.desc',
    url: 'https://www.youtube.com/@RainaDeJute',
    image: youtubeImg,
    imageAltKey: 'links.items.youtube.alt',
  },
  {
    key: 'github',
    titleKey: 'links.items.github.title',
    descKey: 'links.items.github.desc',
    url: 'https://github.com/rdejute',
    image: githubImg,
    imageAltKey: 'links.items.github.alt',
  },
  {
    key: 'codeboxx',
    titleKey: 'links.items.codeboxx.title',
    descKey: 'links.items.codeboxx.desc',
    url: 'https://www.codeboxx.com',
    image: codeboxxImg,
    imageAltKey: 'links.items.codeboxx.alt',
  },
  {
    key: 'cryptoverse',
    titleKey: 'links.items.cryptoverse.title',
    descKey: 'links.items.cryptoverse.desc',
    url: 'https://intothecryptoverse.com',
    image: cryptoImg,
    imageAltKey: 'links.items.cryptoverse.alt',
  },
]
