import { useReveal } from '../hooks/useReveal'

// Thin wrapper around useReveal so any element can fade-and-rise on scroll.
// `as` chooses the rendered tag; `delay` (ms) staggers grouped reveals.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, isVisible] = useReveal()
  const classes = ['reveal', isVisible ? 'is-visible' : '', className].filter(Boolean).join(' ')

  return (
    <Tag
      ref={ref}
      className={classes}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
