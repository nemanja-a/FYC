import { classNames } from "../../lib/util"
import styles from "../../styles/form.module.css"

    export function Checkbox(props) {
        const wrapperClasses = classNames({
            [styles.input]: true,
            [styles.inputWrapper]: true,
            [styles.checkbox]: true
        })

        return <div className={wrapperClasses}>
            <label className={props.disabled ? styles.disabled : null } htmlFor={props.name}>{props.label} {props.required ? '*' : null}</label>
             <input
                disabled={props.disabled}
                onChange={props.onChange}
                id={props.name}
                name={props.name}
                value={props.value}
                checked={props.value}
                type='checkbox'
                required={props.required}    
            />
        </div>
    }


       