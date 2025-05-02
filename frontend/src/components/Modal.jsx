import { createPortal } from 'react-dom'
import { useRef, useEffect } from 'react'
import './Modal.css';

export default function Modal({ children, open, onClose, onOK, okText = "OK", closeText = "Close", noMaxWidth = false }) {
  const dialog = useRef()

  useEffect(() => {
    if (dialog.current) {
      if (open) {
        dialog.current.showModal();
      } else {
        dialog.current.close();
      }
    }
  }, [open]);

  useEffect(() => {
    const handleClose = () => onClose();
    const dialogEl = dialog.current;

    if (dialogEl) {
      dialogEl.addEventListener('close', handleClose);
    }

    return () => {
      if (dialogEl) {
        dialogEl.removeEventListener('close', handleClose);
      }
    };
  }, [onClose]);

  return createPortal( //dom
    <dialog ref={dialog} className={noMaxWidth ? 'dialog-no-max-width' : ''}>
      <div className="modal-content">
        {children}
        <div className="buttons-modal">
          <button onClick={onOK} variant="ok">{okText}</button>
          <button onClick={onClose} variant="close">{closeText}</button>
        </div>
      </div>
    </dialog>
    ,
    document.getElementById('modal')
  )
}