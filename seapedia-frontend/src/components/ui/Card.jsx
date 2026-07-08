import PropTypes from 'prop-types'

// ============================================================
// CARD COMPONENT
// ============================================================
// Komponen container/card yang reusable

/**
 * Card component untuk container berbagai konten
 */
const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'sm',
  border = true,
  onClick,
  ...props
}) => {
  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  }
  
  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  }
  
  // Hover effect
  const hoverStyles = hover
    ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200'
    : ''
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl
        ${border ? 'border border-gray-200' : ''}
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${hoverStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  border: PropTypes.bool,
  onClick: PropTypes.func,
}

// ============================================================
// CARD HEADER
// ============================================================
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
)

// ============================================================
// CARD BODY
// ============================================================
Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

// ============================================================
// CARD FOOTER
// ============================================================
Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
)

export default Card