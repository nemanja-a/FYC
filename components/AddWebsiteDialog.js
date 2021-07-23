import { useRef, useState } from 'react'
import { Dialog, DialogOverlay } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import dialogStyles from "../styles/dialog.module.css"
import tableStyles from "../styles/table.module.css"
import utilStyles from "../styles/utils.module.css"
import formStyles from "../styles/form.module.css"
import Image from "next/image"
import 'react-toastify/dist/ReactToastify.css';
import { ALLOWED_FORMATS, REFERER_HEADER_MAX_LENGTH, WEBSITE } from '../util/variables'
import { Input } from './common/Input'
import { ColorPicker } from './common/ColorPicker'
import { Incrementer } from './common/Incrementer'
import { Checkbox } from './common/Checkbox'
import { getIncrementerValue } from '../lib/util'
import BadWordsFilter from 'bad-words'
import { Button } from './common/Button'
import FadeIn from 'react-fade-in';
import { Payment } from './Payment'
import { server } from '../config'
import { classNames } from '../lib/util'
import { ModalLoader } from './ModalLoader'
import { useDropzone } from 'react-dropzone'

export function AddWebsiteDialog(props) {
  const websiteUrlInputRef = useRef()
  const titlePreviewRef = useRef()
  const descriptionPreviewRef = useRef()
  const { tableParams } = props
  let defaultWebsite = WEBSITE.DEFAULT
  defaultWebsite.page = props.website.page
  defaultWebsite.rowIndex = props.website.rowIndex
  defaultWebsite.columnIndex = props.website.columnIndex
  const defaultState = {
    showDialog: false,
    websiteValid: null,
    websiteAlreadyExist: false,
    step: 1,
    amount: 2,
    showTitle: false,
    showDescription: false,
    website: defaultWebsite,
    loading: false
  }
  const [ state, setState ] = useState(defaultState)

  const { getRootProps, getInputProps } = useDropzone({
    accept: ALLOWED_FORMATS,
    multiple: false,
    disabled: state.step === 3,
    onDropRejected: () => { 
      setState({...state, fileTypeError: true})
    },
    onDrop: (acceptedFiles) => { 
      acceptedFiles[0] && onImageChange(acceptedFiles[0])
     }
  })
  
  const open = () => setState({...state, showDialog: true})
  const close = async(afterAddSuccess) => {
    if (state.website.image) {
       deleteUnusedUploadedImage()
    }
    localStorage.removeItem('amount')
    if (afterAddSuccess) {
      props.afterAddSuccess()
    }
    setState({...defaultState, showDialog: false})
  }

  const deleteUnusedUploadedImage = async() => { 
    return await fetch(
      `${server}/api/deleteimage?filename=${state.website.thumbnail.cloudinaryId}`, {
      method: "DELETE"
    })
  }
  const onWebsiteUrlChange = (event) => {
    event.target.value = event.target.value.replace(/\s/g, "");

    setState({
      ...state,
      fileTypeError: false,
      website: {
        ...state.website,
        [event.target.name]: event.target.value
      },
      websiteValid: null,
      websiteAlreadyExist: false
    })
  }

  const onInputChange = (event) => { 
    setState({
      ...state,
      website: {
        ...state.website,
        [event.target.name]: event.target.value
      }
    })
  }

  const onNumberInputChange = (control) => {     
    if (control.value > 10 || control.value < 0) return
    setState({
      ...state,
      website: {
        ...state.website,
        [control.name]: control.value
      }
    })
  }

  const onTextInputChange = (event, control) => {
    const filter = new BadWordsFilter()    
    setState({
      ...state,
      website: {
        ...state.website,
        [event.target.name]: event.target.value,
        [event.target.name + "Height"]: control.current.clientHeight
      },
      [event.target.name + "Profane"]: filter.isProfane(event.target.value)
    })
  }

  const onColorPickerChange = (target, value) => {
    setState({
      ...state,
      website: {
        ...state.website,
        [target]: value
      }
    })
  }

  const onIncrementerUpClick = (control, currentValue) => { 
    const position = getIncrementerValue(currentValue, 'up')
    setState({
      ...state,
      website: {
        ...state.website,
        [control]: position
      }
    })
  }

  const onIncrementerDownClick = (control, currentValue) => { 
    const position = getIncrementerValue(currentValue, 'down')
    setState({
      ...state,
      website: {
        ...state.website,
        [control]: position
      }
    })
  }

  const onCheckboxChange = (event) => { 
    const value = event.target.value === 'true' ? false : true
    setState({
      ...state,
      [event.target.name]: value
    })
  }

  const onImageChange = async(file) => {
    toggleLoading(true)
    const formData = new FormData()
    if (!file && file.type.substr(0,5) !== "image") return
    if (state.website.image) {
      deleteUnusedUploadedImage()
    }
    formData.append('image', file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET)
    const uploadUrl = `${server}/api/upload`
    const uploadRequest = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
    const uploadResponse = await uploadRequest.json()
    if (!uploadResponse.uploaded) {
      setState({
        ...state,
        imagePreviewHovered: false,
        imageUnsafeText: uploadResponse.message
      })
      toggleLoading(false)
      return
    } else {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async() => {
        toggleLoading(false)
         setState({
           ...state,
           imageUnsafeText: '',
           imagePreviewHovered: false,
           fileTypeError: false,
           website: {
             ...state.website,
             thumbnail: { 
               url: uploadResponse.url,
               cloudinaryId: uploadResponse.cloudinaryId
             },
             image: file
           }
         })
        }
    }
  }

  const onVerifyWebsiteClick = async (event) => {
    event.stopPropagation()
    event.preventDefault()
    toggleLoading(true)
    
    const validateWebsiteURL = `${server}/api/validate?url=${state.website.url}&page=${state.website.page}`
    const websiteResponse = await fetch(validateWebsiteURL)
    if (websiteResponse.status === 409) {
      setState({
        ...state,
        websiteAlreadyExist: true,
        websiteValid: null
      })
    } else if (websiteResponse.status === 404) {
      let data = await websiteResponse.json()
      if (data.error.length > 650) {
        data.error = data.error.slice(0, 650) + '... is not valid.'
      }
      toggleLoading(false)
      setState({
        ...state,
        websiteValid: false,
        websiteAlreadyExist: null,
        invalidWebsiteText: data.error
      }) 
    } else if (websiteResponse.status === 200) {
      toggleLoading(false)
      setState({
        ...state,
        websiteValid: true,
        websiteAlreadyExist: null,
        showTitle: true,
        showDescription: true
      })
    } else {
      toggleLoading(false)
      setState({
        ...state,
        websiteValid: false,
        websiteAlreadyExist: null,
        invalidWebsiteText: `URL ${state.website.url} is not valid. Try again`
      })
    }
    return
  }
  const toggleLoading = (value) => { 
    setState( {...state, loading: value} )
  }
  const onNextStep = () => setState({...state, step: state.step + 1}) 
  const onPreviousStep = () => { 
    localStorage.removeItem('amount')
    setState({...state, step: state.step - 1}) 
  }

  const urlInputClasses = classNames({
    [dialogStyles.urlInput]: true,
    [formStyles.input]: true
  })

  const getFormData = () => {
    let website = {
      url: state.website.url,
      page: Number(state.website.page),
      rowIndex: state.website.rowIndex,
      columnIndex: state.website.columnIndex,
      thumbnail: state.website.thumbnail,
      createdAt: new Date()
    } 
    if (state.showTitle) {
      website.title = state.website.title
      website.titleOpacity = state.website.titleOpacity
      website.titleColor = state.website.titleColor
      website.titleBackgroundColor = state.website.titleBackgroundColor
      website.titlePosition = state.website.titlePosition,
      website.titleHeight = state.website.titleHeight
    } 
    if (state.showDescription) {
      website.description = state.website.description
      website.descriptionOpacity = state.website.descriptionOpacity
      website.descriptionColor = state.website.descriptionColor
      website.descriptionBackgroundColor = state.website.descriptionBackgroundColor
      website.descriptionPosition = state.website.descriptionPosition
      website.descriptionHeight = state.website.descriptionHeight
    }
    return website
  }

  // Handle when user uploads an image and then reloads the page
  if (process.browser) {
    window.addEventListener('unload', () => {
      state.website.thumbnail.url !== WEBSITE.THUMBNAIL.DEFAULT && deleteUnusedUploadedImage()                  
    })
  }

  const cellClasses = classNames({
      [tableStyles.emptyCell]: true
  })

  const imagePreviewClasses = classNames({
    [tableStyles.websiteImage]: true,
    [dialogStyles.imagePreviewHovered]: state.imagePreviewHovered
  })

  const dropZoneClasses = classNames({
    [utilStyles.dropZone]: true,
    [utilStyles.dropZoneDisabled]: state.step === 3
  })
  const showTitlePreview = (state.showTitle && state.step !== 1) && !state.imagePreviewHovered
  const showDescriptionPreview = (state.showDescription && state.step !== 1) && !state.imagePreviewHovered
  const nextButtonDisabled = state.step === 3 || !state.websiteValid || state.titleProfane || state.descriptionProfane

  return (
    <div className={cellClasses}>
      {/* Collapsed grid cell  */}
        <a
            onClick={open}
            key={state.website.columnIndex}
            style={{'width': tableParams.cellWidth, 'height': tableParams.rowHeight }}
            className={tableStyles.emptyFieldWrapper}
          > 
          <Image
            priority
            src={WEBSITE.THUMBNAIL.DEFAULT}
            className={tableStyles.websiteImage}
            height={tableParams.rowHeight}
            width={tableParams.cellWidth}
            alt={state.website.url}
          />

        </a>
      {/* Collapsed grid cell  */}

      {/* Dialog */}
      <Dialog className={dialogStyles.dialog} aria-label="add-website-dialog" isOpen={state.showDialog} onDismiss={close}>
        <FadeIn transitionDuration={500}>
          <button className={utilStyles.closeButton} onClick={close}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </button>
          <div className={dialogStyles.title}>Add website</div>
          {state.step === 1 && <div className={utilStyles.stepTitle}>URL and Image</div>}
          {state.step === 2 && <div className={utilStyles.stepTitle}>Image appearance</div>}
          {state.step === 3 && <div className={utilStyles.stepTitle}>Payment</div>}
          
          {state.loading && <ModalLoader/>}        

        <div id={dialogStyles.websitePreview}>
          {/* Image preview */}
          {state.step === 1 && <p>
          - <strong>Upload image</strong> by clicking on <strong>image</strong> field or by dropping file into drop area. Accepted
          image formats are <strong>JPG</strong>, <strong>JPEG</strong> and <strong>PNG</strong>. <br/>
          - Enter <strong>URL</strong> of site. <br/>
          - <strong>Verify</strong> that <strong>URL</strong> is not in the table already and that 
          site's content is safe by clicking on <strong>verify</strong>.
          </p>}

          {state.step === 2 && <p>
            - <strong>Show/hide</strong> title or description <br/>
            - Adjust their <strong>position</strong> <br/>
            - Add custom <strong>title/description</strong> text <br/>
            - Adjust <strong>opacity</strong> <br/>
            - Choose <strong>text color</strong> <br/>
            - Choose <strong>background color</strong> <br/>
          </p>}

          {state.step === 3 && <p>That's it.  If you want to change any attribute, now is the time to back go to 
            <strong> previous step</strong>. <br/> <br/>
            *After publishing <strong>site</strong>, it can not be modified or deleted by no one other then <strong>World in 2021</strong> admin. <br/>
          </p>}

          <div>
            <div id={dialogStyles.imagePreviewWrapper}
             onMouseEnter={() => { state.step !== 3 && setState({...state, imagePreviewHovered: true })} }
             onMouseLeave={() => setState({...state, imagePreviewHovered: false})}
            >
              {showTitlePreview && <FadeIn transitionDuration={50}>
                <span ref={titlePreviewRef} id={dialogStyles.websiteTitlePreview}
                style={{
                  opacity: state.website.titleOpacity < 10 ? `0.${state.website.titleOpacity}` : 1,
                  color: state.website.titleColor,
                  background: state.website.titleBackgroundColor,
                  top: `${state.website.titlePosition}%`
                }} 
              >{state.website.title}</span> </FadeIn>}
                  {showDescriptionPreview && <FadeIn transitionDuration={50}>
                  <span ref={descriptionPreviewRef} id={dialogStyles.websiteDescriptionPreview}
                  style={{
                    opacity: state.website.descriptionOpacity < 10 ? `0.${state.website.descriptionOpacity}` : 1,
                    color: state.website.descriptionColor,                
                    background: state.website.descriptionBackgroundColor,
                    top: `${state.website.descriptionPosition}%`
                  }}
              >{state.website.description}</span> </FadeIn>}
              
              <div {...getRootProps({className: dropZoneClasses})}>
                <input {...getInputProps()} />                          
                <div id={dialogStyles.imageUploadOverlay}>Drop or click here to upload</div>
                <Image
                  priority
                  src={state.website.thumbnail.url || WEBSITE.THUMBNAIL.DEFAULT}
                  className={imagePreviewClasses}
                  layout="fill"
                  alt={WEBSITE.THUMBNAIL.NO_IMAGE_FOUND}
                />   
              </div>
              {state.fileTypeError && <span className={utilStyles.error}>Invalid file type. Try again.</span>}
            </div>
            {/* Image preview end*/}
          </div>
        </div>
      </FadeIn>
      {/* First step */}
      {state.step === 1 && <FadeIn transitionDuration={500}>
        <div className={dialogStyles.step}>
          <div id={dialogStyles.websiteInputWrapper}>
            <span style={{display: "flex"}}>
              <span>
                <label htmlFor="url" className={utilStyles.formItemSpacing}>*Website Address</label>
                <input
                  style={{minWidth: '14vw'}}
                  className={urlInputClasses}
                  value={state.website.url}
                  id="url" 
                  name="url"
                  onChange={onWebsiteUrlChange}
                  onKeyDown={() => event.key === 'Enter' && onVerifyWebsiteClick(event) }
                  type="text"
                  autoComplete="url"
                  maxLength={REFERER_HEADER_MAX_LENGTH}
                  ref={websiteUrlInputRef}
                />
              </span>
            {state.websiteValid && <span className={dialogStyles.checkmark}>
                <div className={dialogStyles.checkmarkStem}></div>
                <div className={dialogStyles.checkmarkKick}></div>
            </span>}
            </span>
            <span className={dialogStyles.websiteInputUtils}>
                <Button
                    primary
                    onClick={() => onVerifyWebsiteClick(event)}
                    disabled={state.websiteValid || !state.website.url}
                >
                  Verify
                </Button>
            </span>
          </div>
          {(!state.websiteValid && state.websiteValid !== null) && <span className={utilStyles.error}>{state.invalidWebsiteText}</span>}
          {state.websiteAlreadyExist && <span className={utilStyles.warning}>Website with url <strong>{state.website.url}</strong> has been found. But, that's allright. If site is located 10 or more pages before/after it's current location, it can be added again.</span>}

          <p id={dialogStyles.firstStepDescriptionText}>*This page is made for people of all age. To make it's surfing experience as safe as possible,
             all website pages are checked by  <strong><a href="https://cloud.google.com/web-risk" target="_blank">Google Web Risk</a></strong> for detecting adult, racy, violence, and other kind
             of innapropriate content. Also, every image is checked by <strong><a href="https://cloud.google.com/vision" target="_blank">Google Cloud Vision</a></strong> in order to prevent advertising
             of nudity, violence, criminal activities and other disturbing content.</p>
        </div>
        <div id={dialogStyles.stepButtonsWrapper}>
            <Button primary onClick={onPreviousStep} disabled={state.step === 1} className={dialogStyles.stepButton}>Previous Step</Button>
            <Button primary onClick={onNextStep} disabled={nextButtonDisabled} className={dialogStyles.stepButton}>Next Step</Button>
        </div>
      </FadeIn>}
      {/* First step end */}

      {/* Second step */}
      {state.step === 2 && <FadeIn transitionDuration={500}>
      <form>
        <section id={dialogStyles.attributesSection}>

          <div className={dialogStyles.row}>
          <Checkbox 
            label='Show Title'
            disabled={!state.websiteValid}
            name='showTitle'
            onChange={onCheckboxChange}
            value={state.showTitle}
          />
          <Checkbox 
            label='Show Description'
            disabled={!state.websiteValid}
            name='showDescription'
            onChange={onCheckboxChange}
            value={state.showDescription}
          />
          <Incrementer 
            label='Title Position'
            disabled={!state.websiteValid || !state.showTitle}
            name='titlePosition'
            onUpClick={() => onIncrementerUpClick('titlePosition', state.website.titlePosition)}
            onDownClick={() => onIncrementerDownClick('titlePosition', state.website.titlePosition)}
          />
          <Incrementer 
            label='Description Position'
            disabled={!state.websiteValid || !state.showDescription}
            name='descriptionPosition'
            onUpClick={() => onIncrementerUpClick('descriptionPosition', state.website.descriptionPosition)}
            onDownClick={() => onIncrementerDownClick('descriptionPosition', state.website.descriptionPosition)}
          />
          </div>
          <div className={dialogStyles.row}>
            <Input 
              maxWidth
              label='Title'
              disabled={!state.websiteValid || !state.showTitle}
              name='title'
              value={state.website.title}
              onChange={(event) => onTextInputChange(event, titlePreviewRef)}
              maxLength={WEBSITE.TITLE_MAX_LENGTH}
              />
          </div>
          <div className={dialogStyles.row}>
            <div>
              {state.website.title && (state.website.title.length === WEBSITE.TITLE_MAX_LENGTH) && <span>Maximum title character limit reached</span>}
              {state.titleProfane && <span className={utilStyles.error}>Bad words are not allowed.</span>}
            </div>
          </div>
          <div className={dialogStyles.row}>
              <Input 
                maxWidth
                label='Description'
                disabled={!state.websiteValid || !state.showDescription}
                name='description'
                value={state.website.description}              
                onChange={(event) => onTextInputChange(event, descriptionPreviewRef)}
                maxLength={WEBSITE.DESCRIPTION_MAX_LENGTH}
              />
          </div>
          <div className={dialogStyles.row}>
            <div>
              {state.website.description && (state.website.description.length === WEBSITE.DESCRIPTION_MAX_LENGTH) && <span>That will do it. I can remember more than {WEBSITE.DESCRIPTION_MAX_LENGTH} characters, by the way, so this one is on the programmer </span>}
              {state.descriptionProfane && <span className={utilStyles.error}>Bad words are not allowed.</span>}
            </div>
          </div>
          <div className={dialogStyles.row}>                  
              <Input 
                withIncrement
                label='Title Opacity'
                disabled={!state.websiteValid || !state.showTitle}
                type="number"
                name='titleOpacity'
                min="0"
                max="10"
                value={state.website.titleOpacity}
                onChange={onNumberInputChange}
                onIncrement={() => onNumberInputChange(event, 'increment')}
                onDecrement={() => onNumberInputChange(event, 'decrement')}
              />
              <Input 
                withIncrement
                label='Description Opacity'
                disabled={!state.websiteValid || !state.showDescription}
                type="number"
                name='descriptionOpacity'
                min="0"
                max="10"
                value={state.website.descriptionOpacity}
                onChange={onNumberInputChange}
                onIncrement={() => onNumberInputChange(event, 'increment')}
                onDecrement={() => onNumberInputChange(event, 'decrement')}
              />
          </div>
          <div className={dialogStyles.row}>
            <ColorPicker
              label='Title Color'
              disabled={!state.websiteValid || !state.showTitle}
              name='titleColor'
              value={state.website.titleColor}
              onChange={onColorPickerChange}
              onInputChange={onInputChange}
            />
            <ColorPicker
              label='Description Color'
              disabled={!state.websiteValid || !state.showDescription}
              name='descriptionColor'
              value={state.website.descriptionColor}
              onChange={onColorPickerChange}
              onInputChange={onInputChange}
            />
          </div>
          <div className={dialogStyles.row}>
            <ColorPicker
                label='Title Background Color'
                disabled={!state.websiteValid || !state.showTitle}
                name='titleBackgroundColor'
                value={state.website.titleBackgroundColor}
                onChange={onColorPickerChange}
                onInputChange={onInputChange}
              />
            <ColorPicker
              label='Description Background Color'
              disabled={!state.websiteValid || !state.showDescription}
              name='descriptionBackgroundColor'
              value={state.website.descriptionBackgroundColor}
              onChange={onColorPickerChange}
              onInputChange={onInputChange}
            />
          </div>

        </section>
        </form>
        <div id={dialogStyles.stepButtonsWrapper}>
            <Button primary onClick={onPreviousStep} disabled={state.step === 1} className={dialogStyles.stepButton}>Previous Step</Button>
            <Button primary onClick={onNextStep} disabled={nextButtonDisabled} className={dialogStyles.stepButton}>Next Step</Button>
        </div>     
      </FadeIn>}
      {/* Second step end */}

      {/* Third step */}
      {state.step === 3 && <FadeIn transitionDuration={500}>
        <Payment close={close} toggleLoading={toggleLoading} getFormData={getFormData}/>
        <div id={dialogStyles.stepButtonsWrapper}>
          <Button primary onClick={onPreviousStep} disabled={state.step === 1} className={dialogStyles.stepButton}>Previous Step</Button>
          <Button primary onClick={onNextStep} disabled={nextButtonDisabled} className={dialogStyles.stepButton}>Next Step</Button>
        </div>
      </FadeIn>}
      {/* Third step end*/}
      </Dialog>
      {/* Dialog */}
    </div>
  )
}