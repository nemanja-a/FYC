import { classNames } from "../../lib/util"
import styles from "../../styles/form.module.css"
import utilStyles from "../../styles/utils.module.css"
import { RepeatableButton } from "./RepeatableButton"

export function Input(props) {

    let inputClasses = classNames({
      [styles.input]: true,
      [styles.inputNumber]: props.type === 'number',
      [styles.incrementerInput]: props.withIncrement,
      [styles.fullWidth]: props.maxWidth,
    })

    const inputNumberwrapperClasses = classNames({
        [utilStyles.displayFlex]: true,
    })

    const onIncrement = () => { 
        props.onChange({name: props.name, value: props.value + 1})
    }

    const onDecrement = () => { 
        props.onChange({name: props.name, value: props.value - 1})
    }

    const onKeyPress = (event) => { 
        if (event.which != 8 && event.which != 0 && event.which < 48 || event.which > 57) {
            event.preventDefault()
        }
    }

    const onChange = (event) => { 
        let value = event.target.value
        event.target.value = event.target.value.replace(/[\e\+\-\.]/g, "")
        if (event.key < 31 && (event.key > 48 || event.key < 57)) return
        if (Number(value) < Number(props.min) || Number(value > Number(props.max))) {
            event.target.value = value.substring(0, value.length - 1);    
        }
        props.onChange && props.onChange({name: props.name, value: Number(value)})
    }
    
    const labelStyles = classNames({
        [styles.disabled]: props.disabled,
        [styles.label]: true
    })

    let wrapperStyles = classNames({
        [styles.input]: true,
        [styles.fullWidth]: props.maxWidth
    })

    if (props.maxWidth) {
        wrapperStyles = `${wrapperStyles} ${styles.fullWidth}`
    }
    
    if (props.classes && props.classes.wrapper) {
        wrapperStyles =  `${wrapperStyles} ${props.classes.wrapper}`
    }
    
    const onKeyDown = (event) => { 
        let value = event.target.value
        props.onKeyDown && props.onKeyDown({name: props.name, value: Number(value), eventKey: event.key})
    }
    return <div className={wrapperStyles}>
            <label
                className={labelStyles}
                htmlFor={props.name}>{props.label}
                {props.required ? '*' : null}
            </label>
            {/* Input type number */}
            {props.type === 'number' && <div className={inputNumberwrapperClasses}>
                {props.withIncrement && <RepeatableButton
                    style={{background: '#ffaa4e', borderRadius: '5px 0 0 5px'}}

                     disabled={props.disabled}
                     onPress={onDecrement}
                     onHold={onDecrement}>
                         -
                </RepeatableButton>}
            <input
                disabled={props.disabled}
                id={props.name}
                onChange={onChange}
                name={props.name}
                type="number"
                value={props.value}
                required={props.required}
                min={props.min}
                max={props.max}
                maxLength={props.maxLength}
                className={inputClasses}
                onKeyDown={onKeyDown}
                onKeyPress={onKeyPress}
            />
                {props.withIncrement && <RepeatableButton 
                    style={{background: '#ffaa4e', borderRadius: '0 5px 5px 0'}}
                    disabled={props.disabled}
                    onPress={onIncrement}
                    onHold={onIncrement}>
                    +
                </RepeatableButton>}
            </div>
            }
            {/* Input type number */}

            {/* Input type text */}
            {!props.type && <input
                disabled={props.disabled}
                id={props.name}
                onChange={props.onChange}
                name={props.name}
                type={'text'}
                value={props.value}
                required={props.required}
                min={props.min}
                max={props.max}
                maxLength={props.maxLength}
                className={inputClasses}
            />}      
         
            </div>
}