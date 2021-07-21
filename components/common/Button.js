import { classNames } from "../../lib/util"
import styles from "../../styles/utils.module.css"

export function Button(props) {
    const buttonClasses = classNames({
        [styles.buttonPrimary]: props.primary,
        [styles.buttonSecondary]: props.secondary,
        [styles.formItemSpacing]: true,
        [props.className]: true
    })
    return <div>
        <button
            type={props.type || 'button'}
            onClick={() => props.onClick()}
            className={buttonClasses}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    </div>
}