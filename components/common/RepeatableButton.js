import Repeatable from 'react-repeatable'
import { classNames } from '../../lib/util'
import styles from "../../styles/form.module.css"

export function RepeatableButton (props) {
    const buttonClasses = classNames({
        disabled: props.disabled,
        [styles.repeatableButton]: true
    })
    return <div className={buttonClasses}>
            <Repeatable
                tag="button"
                type="button"
                disabled={props.disabled}
                repeatInterval={Repeatable.defaultProps.repeatInterval / 5}
                repeatDelay={Repeatable.defaultProps.repeatDelay / 5}
                onHold={props.onHold}
                {...props}
            />
    </div>
}