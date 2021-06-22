import { useState } from 'react'
import { Dialog } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import dialogStyles from "../styles/dialog.module.css"
import tableStyles from "../styles/table.module.css"

export function AddChannelDialog(props) {
  const [showDialog, setShowDialog] = useState(false)
  const [channelValid, setChannelValid] = useState(null)

  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  let channelID, description = '';
  const onChannelIDChange = (event) => {
    channelID = event.target.value
    !channelValid && setChannelValid(null)
  }

  const onDescriptionChange = (event) => {
    description = event.target.value
  }

  const onSubmit = async (event) => {
    event.stopPropagation()
    event.preventDefault()

    const validateChannelURL = `http://localhost:3000/api/validate?id=${channelID}`
    const channelResponse = await fetch(validateChannelURL, {
      headers: { 'credentials': 'include'}
    })
    const channel = await channelResponse.json()
    setChannelValid(channel.isValid)

    return
  }

  const onLastStepClick = () => {
    console.log("...Proceed to payment!")
  }

  return (
    <div>
       <button
        className={tableStyles.addChannelCell}
        onClick={open}
        style={{'width': props.tableParams.cellWidth, 'height': props.tableParams.rowHeight}}
        >+</button>
      <Dialog className={dialogStyles.dialog} aria-label="add-channel-dialog" isOpen={showDialog} onDismiss={close}>
        <button className={dialogStyles.closeButton} onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
          <div id={dialogStyles.title}>Join the club</div>
          <form onSubmit={onSubmit}>
            <div className={dialogStyles.formField}>
              <div className={dialogStyles.inputWrapper}>
                <label htmlFor="url">Channel ID</label>
                <input disabled={channelValid} id="url" name="url" onChange={onChannelIDChange} type="text" autoComplete="url" required />
              </div>
       
              <span>You know where to get your channel ID, right? WE NEITHER! But</span>
              <a href="https://support.google.com/youtube/answer/3250431?hl=en" target="_blank"> those </a>
                <span>guys might know...</span>
                <button id={dialogStyles.verifyButton} type="submit">Verify</button>        
                {(!channelValid && channelValid !== null) && <span id={dialogStyles.channelInvalid}>Not that one, I'm sure you have a better one... Let's go one more time</span>}
                {channelValid && <span id={dialogStyles.channelValid}>Hm, this looks promising. I know a good channel when I see one because, trust me, I have seen things...</span>}
            </div>

            <div className={dialogStyles.formField}>
              <div className={dialogStyles.inputWrapper}>
                <label htmlFor="url">Channel description</label>
                <input disabled={!channelValid} id="description" onChange={onDescriptionChange} name="description" type="text" autoComplete="description" />
              </div>

              <span>Write some amazing words to show when your channel gets hovered over</span>
              <span>We strongly suggest grabbing a bite or two of an apple. You know, an apple a day keeps a bug away.</span>
              <span>When submit does it's job and when we make sure your channel is allright (which we already knew, but anyhow), we can move on the grand finale.</span>
            </div>

          </form>
          <button disabled={!channelValid} onClick={onLastStepClick}>Last step</button>

      </Dialog>
    </div>
  )
}