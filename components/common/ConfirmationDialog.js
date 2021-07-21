import { Dialog, DialogOverlay } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import dialogStyles from '../../styles/dialog.module.css'
import { useState } from 'react'
import { Button } from './Button'
import { signOut } from 'next-auth/client'

export function ConfirmationDialog() {
  const [ showDialog, setShowDialog ] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const onConfirm = () => {
      close()
      signOut('instagram')
  }

  return (
    <div id={dialogStyles.confirmationDialogWrapper}>
    <a href="#" onClick={open}>Sign out</a>
      <DialogOverlay
        className={dialogStyles.confirmationDialogOverlay}
        style={{ background: "hsla(0, 100%, 100%, 0.7) !important" }}
        isOpen={showDialog}
        onDismiss={close}
      >
        <Dialog className={dialogStyles.confirmationDialog} aria-label="confirmation-dialog" isOpen={showDialog} onDismiss={close}>
          <button className={dialogStyles.closeButton} onClick={close}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </button>
          <div>Are you sure?</div>
          <div className={dialogStyles.confirmationDialogButtons}>
              <Button primary onClick={onConfirm}>Yes</Button>
              <Button primary onClick={close}>No</Button>
          </div>
        </Dialog>
      </DialogOverlay>
    </div>
  )
}