import s from './ScrollWords.module.css'

// Découpe les morceaux de texte en mots ; { em } = mots en accent.
function tokenize(parts) {
  return parts.flatMap((part) => {
    const accent = typeof part !== 'string'
    const text = accent ? part.em : part
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, accent }))
  })
}

// Paragraphe aux mots en accent, affiché d'emblée (plus d'illumination au défilement).
export default function ScrollWords({ as: Tag = 'p', parts, className }) {
  return (
    <Tag className={className}>
      {tokenize(parts).map((token, index) => (
        <span key={index} className={token.accent ? s.accent : undefined}>
          {token.word}{' '}
        </span>
      ))}
    </Tag>
  )
}
