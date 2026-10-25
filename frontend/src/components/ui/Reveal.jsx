// Bloc de contenu affiché tel quel : plus d'apparition au défilement.
// `as` : balise rendue (div par défaut). `delay`, `y` et `amount`, hérités de
// l'ancienne animation, sont acceptés et ignorés.
// eslint-disable-next-line no-unused-vars
export default function Reveal({ as: Tag = 'div', children, delay, y, amount, ...rest }) {
  return <Tag {...rest}>{children}</Tag>
}
