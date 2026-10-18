import { CircleNotch } from '@phosphor-icons/react'
import PropTypes from 'prop-types'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  leftIcon,
  rightIcon,
  as: Component = 'button',
  ...props
}) => {
  // Ocean Blue palette variants
  const variantStyles = {
    primary:   'bg-primary-900 text-white shadow-sm hover:bg-primary-800 active:bg-primary-950',
    cobalt:    'bg-cobalt-500 text-white shadow-blue hover:bg-cobalt-600 active:bg-cobalt-700',
    accent:    'bg-primary-600 text-white shadow-sm hover:bg-primary-700 active:bg-primary-800',
    secondary: 'bg-slate-100 text-ink hover:bg-slate-200 active:bg-slate-300',
    danger:    'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
    outline:   'border border-slate-300 bg-white text-ink hover:border-primary-400 hover:bg-primary-50 hover:text-primary-800',
    'outline-navy': 'border border-primary-900 bg-transparent text-primary-900 hover:bg-primary-900 hover:text-white',
    ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-ink',
    'ghost-blue': 'bg-transparent text-primary-700 hover:bg-primary-50',
  }

  const sizeStyles = {
    xs: 'min-h-7  px-2.5 py-1   text-xs   rounded-lg',
    sm: 'min-h-9  px-3.5 py-1.5 text-sm   rounded-xl',
    md: 'min-h-10 px-4   py-2   text-sm   rounded-xl',
    lg: 'min-h-11 px-5   py-2.5 text-base rounded-xl',
    xl: 'min-h-12 px-6   py-3   text-base rounded-2xl',
  }

  const isNativeButton = Component === 'button'

  return (
    <Component
      {...(isNativeButton ? { type, disabled: disabled || isLoading } : { 'aria-disabled': disabled || isLoading || undefined })}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-[-0.01em] transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50
        ${variantStyles[variant] ?? variantStyles.secondary}
        ${sizeStyles[size] ?? sizeStyles.md}
        ${className}`}
      {...props}
    >
      {isLoading ? <CircleNotch aria-hidden="true" className="animate-spin" size={18} weight="bold" /> : leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </Component>
  )
}

Button.propTypes = {
  children:  PropTypes.node.isRequired,
  variant:   PropTypes.oneOf(['primary', 'cobalt', 'accent', 'secondary', 'danger', 'outline', 'outline-navy', 'ghost', 'ghost-blue']),
  size:      PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  isLoading: PropTypes.bool,
  disabled:  PropTypes.bool,
  className: PropTypes.string,
  type:      PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick:   PropTypes.func,
  leftIcon:  PropTypes.node,
  rightIcon: PropTypes.node,
  as:        PropTypes.elementType,
}

export default Button
