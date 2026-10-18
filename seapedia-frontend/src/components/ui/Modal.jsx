import { useEffect, useId, useRef } from 'react'
import PropTypes from 'prop-types'
import { X } from '@phosphor-icons/react'

// ============================================================
// MODAL COMPONENT
// ============================================================
// Popup dialog overlay

/**
 * Modal component untuk dialog/popup
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className = '',
}) => {
  const dialogRef = useRef(null)
  const titleId = useId()
  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4',
  }
  
  useEffect(() => {
    if (!isOpen) return undefined

    const previousFocus = document.activeElement
    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector(focusableSelector)?.focus()
    })

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll(focusableSelector)]
        if (focusable.length === 0) {
          e.preventDefault()
          dialogRef.current.focus()
        } else if (e.shiftKey && document.activeElement === focusable[0]) {
          e.preventDefault()
          focusable.at(-1).focus()
        } else if (!e.shiftKey && document.activeElement === focusable.at(-1)) {
          e.preventDefault()
          focusable[0].focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [isOpen, onClose])
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  // Don't render if not open
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="modal">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/55 backdrop-blur-[2px] transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div
          ref={dialogRef}
          tabIndex={-1}
          className={`
            relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.2)]
            ${sizeStyles[size]}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 id={titleId} className="text-lg font-extrabold tracking-tight text-ink">
                {title}
              </h3>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Tutup dialog"
                >
                  <X size={20} weight="bold" />
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  closeOnOverlay: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
}

export default Modal
