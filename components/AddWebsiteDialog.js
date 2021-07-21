import { useRef, useState } from 'react'
import { Dialog, DialogOverlay } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import dialogStyles from "../styles/dialog.module.css"
import tableStyles from "../styles/table.module.css"
import utilStyles from "../styles/utils.module.css"
import formStyles from "../styles/form.module.css"
import Image from "next/image"
import 'react-toastify/dist/ReactToastify.css';
import { REFERER_HEADER_MAX_LENGTH, WEBSITE } from '../util/variables'
import { Input } from './common/Input'
import { ColorPicker } from './common/ColorPicker'
import { Incrementer } from './common/Incrementer'
import { Checkbox } from './common/Checkbox'
import { getIncrementerValue, hexToRgb } from '../lib/util'
import BadWordsFilter from 'bad-words'
import { Button } from './common/Button'
import FadeIn from 'react-fade-in';
import { Payment } from './Payment'
import { server } from '../config'
import { classNames } from '../lib/util'
import { ModalLoader } from './ModalLoader'
import { showError } from '../lib/toast'
import { useDropzone } from 'react-dropzone'

export function AddWebsiteDialog(props) {
  const websiteUrlInputRef = useRef()
  const { tableParams } = props
  const defaultWebsite = {
    url: '',
    title: 'Website title',
    titleOpacity: 10,
    titleColor: "#000000",
    titleBackgroundColor: "#D8DDDE",
    titlePosition: 0,
    description: 'Website description',
    descriptionOpacity: 10,
    descriptionColor: "#000000",
    descriptionBackgroundColor: "#D8DDDE",
    descriptionPosition: 155,
    page: props.website.page,
    rowIndex: props.website.rowIndex,
    columnIndex: props.website.columnIndex,
    image: null,
    thumbnail: { url: WEBSITE.THUMBNAIL_SOURCE.DEFAULT },
    imageWidth: 0,
    imageHeight: 0
  }
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
    accept: "image/jpeg, image/jpg, image/png",
    multiple: false,
    disabled: state.step === 3,
    onDropRejected: () => { 
      setState({...state, fileTypeError: true})
    },
    onDrop: (acceptedFiles) => { 
      acceptedFiles[0] && onImageChange(acceptedFiles[0])
     }
  })

  const updateData = (event) => { 
    setState({
      ...state,
      website: {
        ...state.website,
        [event.target.name]: event.target.value
      }
    })
  }
  
  const open = () => setState({...state, showDialog: true})
  const close = async() => {
    if (state.website.image) {
      deleteUnusedUploadedImage()
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
      websiteValid: null
    })
  }

  const onInputChange = (event) => { 
    updateData(event)
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

  // const onNumberInputChange = (control) => {     
  //   if (Number(event.target.value) > 10) return
  //   event.target.value = event.target.value.replace(/[^\d]/g, "");
  //   updateData(event)
  // }

  const onTextInputChange = (event) => {
    const filter = new BadWordsFilter()
    setState({
      ...state,
      website: {
        ...state.website,
        [event.target.name]: event.target.value
      },
      [event.target.name + "Profane"]: filter.isProfane(event.target.value)
    })
  }

  const onSelectChange = (event) => {
    setState({
      ...state,
      website: {
        ...state.website,
        [event.target.name]: Number(event.target.value)
      }
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

  const clearUrl = () => { 
    websiteUrlInputRef.current.value = websiteUrlInputRef.current && null
    setState({
      ...state,
      websiteValid: false,
      showDialog: true,
      website: {...state.website, url: ''} 
    })
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
  const onPreviousStep = () => setState({...state, step: state.step - 1})

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
      thumbnail: state.website.thumbnail
    } 
    if (state.showTitle) {
      website.title = state.website.title
      website.titleOpacity = state.website.titleOpacity
      website.titleColor = state.website.titleColor
      website.titleBackgroundColor = state.website.titleBackgroundColor
      website.titlePosition = state.website.titlePosition
    } 
    if (state.showDescription) {
      website.description = state.website.description
      website.descriptionOpacity = state.website.descriptionOpacity
      website.descriptionColor = state.website.descriptionColor
      website.descriptionBackgroundColor = state.website.descriptionBackgroundColor
      website.descriptionPosition = state.website.descriptionPosition
    }
    return website
  }

  const cellClasses = classNames({
      [tableStyles.cell]: true,
      [tableStyles.firstCellInRow]: props.firstCellInRow  
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
            src={WEBSITE.THUMBNAIL_SOURCE.DEFAULT}
            className={tableStyles.websiteImage}
            height={tableParams.rowHeight}
            width={tableParams.cellWidth}
            alt={state.website.url}
          />

        </a>
      {/* Collapsed grid cell  */}

      {/* Dialog */}
      <DialogOverlay
        style={{ background: "hsla(0, 100%, 100%, 0.7) !important" }}
        isOpen={state.showDialog}
        onDismiss={close}
      />
      <Dialog className={dialogStyles.dialog} aria-label="add-website-dialog" isOpen={state.showDialog} onDismiss={close}>
        <FadeIn transitionDuration={500}>
          <button className={utilStyles.closeButton} onClick={close}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </button>
          <div className={dialogStyles.title}>Add website</div>
        {/* temp */}
          {state.loading && <ModalLoader/>}        

        <div id={dialogStyles.websitePreview}>
          {/* Image preview */}
          <p>Customize appearance of website in 3 simple steps</p>

          <div>
            <div id={dialogStyles.imagePreviewWrapper}
             onMouseEnter={() => { state.step !== 3 && setState({...state, imagePreviewHovered: true })} }
             onMouseLeave={() => setState({...state, imagePreviewHovered: false})}
            >
              {showTitlePreview && <FadeIn transitionDuration={50}>
                <span id={dialogStyles.websiteTitlePreview}
                style={{
                  opacity: state.website.titleOpacity < 10 ? `0.${state.website.titleOpacity}` : 1,
                  color: state.website.titleColor,
                  background: state.website.titleBackgroundColor,
                  top: `${state.website.titlePosition}px`
                }} 
              >{state.website.title}</span> </FadeIn>}
                  {showDescriptionPreview && <FadeIn transitionDuration={50}>
                  <span id={dialogStyles.websiteDescriptionPreview}
                  style={{
                    opacity: state.website.descriptionOpacity < 10 ? `0.${state.website.descriptionOpacity}` : 1,
                    color: state.website.descriptionColor,                
                    background: state.website.descriptionBackgroundColor,
                    top: `${state.website.descriptionPosition}px`
                  }}
              >{state.website.description}</span> </FadeIn>}
              <div {...getRootProps({className: dropZoneClasses})}>
                <input {...getInputProps()} />                          
                <div id={dialogStyles.imageUploadOverlay}>Drop or click here to upload</div>
                <Image
                  priority
                  src={state.website.thumbnail.url || WEBSITE.THUMBNAIL_SOURCE.DEFAULT}
                  className={imagePreviewClasses}
                  layout="fixed"
                  width={230}
                  height={180}
                  alt={state.website.url}
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
          <span className={utilStyles.footnote}>*Enter valid URL before filling other fields</span>
              <div id={dialogStyles.websiteInputWrapper}>
                <span>
                  <label htmlFor="url" className={utilStyles.formItemSpacing}>Website Address*</label>
                  <input
                  style={{minWidth: '14vw'}}
                  className={urlInputClasses}
                  disabled={state.websiteValid}
                  value={state.website.url}
                  id="url" 
                  name="url"
                  onChange={onWebsiteUrlChange}
                  type="text"
                  autoComplete="url"
                  maxLength={REFERER_HEADER_MAX_LENGTH}
                  ref={websiteUrlInputRef}
                  required />
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
                    <button disabled={!state.websiteValid} className={utilStyles.closeButton} type="button" onClick={clearUrl}>x</button>
                </span>
              </div>
              {(!state.websiteValid && state.websiteValid !== null) && <span className={utilStyles.error}>{state.invalidWebsiteText}</span>}
                {state.websiteAlreadyExist && <span className={utilStyles.warning}>Website already exists... But to tell you a secret, If you pick a spot 10 or more pages before/after this website current position, it is allright to add it again </span>}
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
              label='Title'
              disabled={!state.websiteValid || !state.showTitle}
              name='title'
              value={state.website.title}
              onChange={onTextInputChange}
              maxLength={WEBSITE.TITLE_MAX_LENGTH}
              />
          </div>
          <div className={dialogStyles.row}>
              <div className={dialogStyles.titleWarnings}>
                {state.website.title && (state.website.title.length === WEBSITE.TITLE_MAX_LENGTH) && <span>Maximum title character limit reached</span>}
                {state.titleProfane && <span>No need for offensive language, let's put it in other way</span>}
              </div>
          </div>
          <div className={dialogStyles.row}>
            <Input 
                label='Description'
                disabled={!state.websiteValid || !state.showDescription}
                name='description'
                value={state.website.description}
                onChange={onTextInputChange}
                maxLength={WEBSITE.DESCRIPTION_MAX_LENGTH}
              />
          </div>
          <div className={dialogStyles.row}>
            <div className={dialogStyles.descriptionWarnings}>
              {state.website.description && (state.website.description.length === WEBSITE.DESCRIPTION_MAX_LENGTH) && <span>That will do it. I can remember more than {WEBSITE.DESCRIPTION_MAX_LENGTH} characters, by the way, so this one is on the programmer </span>}
              {state.descriptionProfane && <span>No need for offensive language, let's put it in other way</span>}
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
          </div>
          <div className={dialogStyles.row}>
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

        <div className={dialogStyles.row}>
          <span className={utilStyles.footnote} style={{paddingBottom: '1.5rem'}}>
            *When Title and Description are selected, either of them will be visible on list when mouse hover over it
          </span>
        </div>  
      </FadeIn>}
      {/* Second step end */}

      {/* Third step */}
      {state.step === 3 && <FadeIn transitionDuration={500}>
        <Payment close={close} toggleLoading={toggleLoading} getFormData={getFormData}/>
      </FadeIn>}
      {/* Third step end*/}
      <div id={dialogStyles.stepButtonsWrapper}>
        <Button primary onClick={onPreviousStep} disabled={state.step === 1} className={dialogStyles.stepButton}>Previous Step</Button>
        <Button primary onClick={onNextStep} disabled={nextButtonDisabled} className={dialogStyles.stepButton}>Next Step</Button>
      </div>
      </Dialog>
      {/* Dialog */}
    </div>
  )
}