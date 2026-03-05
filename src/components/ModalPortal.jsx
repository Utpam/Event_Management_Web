import React, { useEffect, useRef } from "react"
import ReactDOM from "react-dom"


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

export default function Modal({
  open,
  onClose,
  children,
  maxWidth = "max-w-xl",
}) {
  // ESC key close
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <ModalPortal>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed z-[9999] left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[95vw] ${maxWidth}
          rounded-2xl glass-card
          shadow-2xl
          p-0
          overflow-hidden
          animate-modalIn
        `}
      >
        {children}
      </div>
    </ModalPortal>
  )
}
