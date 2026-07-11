import React, { useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { X } from "lucide-react"

export const ModalPortal = ({ children }) => {
  const elRef = useRef(null)

  if (!elRef.current) {
    elRef.current = document.createElement("div")
    elRef.current.className = "modal-root"
  }

  useEffect(() => {
    document.body.appendChild(elRef.current)
    return () => document.body.removeChild(elRef.current)
  }, [])

  return ReactDOM.createPortal(children, elRef.current)
}

export default function Modal({ open, onClose, children, maxWidth = "max-w-2xl" }) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <ModalPortal>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`modal-enter fixed z-[9999] left-1/2 top-1/2 w-[95vw] ${maxWidth} overflow-hidden`}
        style={{
          transform: 'translate(-50%, -50%)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            zIndex: 10, background: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: '50%', width: '2rem', height: '2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <X size={14} />
        </button>

        {children}
      </div>
    </ModalPortal>
  )
}
