import PropTypes from 'prop-types'
import { CheckCircle, ShieldCheck, Warning } from '@phosphor-icons/react'
import Button from './Button'
import Modal from './Modal'

const toneStyles = {
  primary: {
    icon: ShieldCheck,
    iconClass: 'bg-primary-50 text-primary-700',
    buttonVariant: 'primary',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'bg-emerald-50 text-emerald-700',
    buttonVariant: 'primary',
  },
  danger: {
    icon: Warning,
    iconClass: 'bg-danger-50 text-danger-600',
    buttonVariant: 'danger',
  },
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  details = [],
  confirmLabel = 'Ya, lanjutkan',
  cancelLabel = 'Periksa lagi',
  tone = 'primary',
  isLoading = false,
}) {
  const config = toneStyles[tone] || toneStyles.primary
  const Icon = config.icon

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} title={title} size="sm" closeOnOverlay={false} showCloseButton={!isLoading}>
      <div className="flex items-start gap-4">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${config.iconClass}`}>
          <Icon size={23} weight="duotone" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 text-slate-600">{description}</p>
          {details.length > 0 && (
            <dl className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">
              {details.map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4 text-sm">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>{cancelLabel}</Button>
        <Button variant={config.buttonVariant} onClick={onConfirm} isLoading={isLoading}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.node.isRequired })),
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  tone: PropTypes.oneOf(['primary', 'success', 'danger']),
  isLoading: PropTypes.bool,
}
