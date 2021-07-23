import { HexColorPicker } from "react-colorful"
import { Input } from "./Input"
import styles from "../../styles/colorpicker.module.css"
import formStyles from "../../styles/form.module.css"
import { classNames, useClickOutside } from "../../lib/util"
import { useCallback, useRef, useState } from "react"

export function ColorPicker (props) {
    const [isOpen, toggle] = useState(false);
    const colorPickerRef = useRef();
    const collapsedClasses = classNames({
      [styles.colorPickerCollapsed]: true,
      [formStyles.input]: true,
      [formStyles.disabled ]: props.disabled
    })
    
    const onColorChange = (value) => { props.onChange(props.name, value)}
    const close = useCallback(() => toggle(false), []);
    useClickOutside(colorPickerRef, close);
   
  return <section className={styles.container}>
        <input
          type="button"
          style={{'background': props.value}}
          className={collapsedClasses}
          onClick={() => toggle(true)}
          disabled={props.disabled}
        />
  
      {isOpen && <div ref={colorPickerRef}>
        <HexColorPicker
            className={styles.colorPicker}
            color={props.value} 
            onChange={onColorChange}
        />
      </div>}
      <Input
            width={props.width}
            label={props.label}
            disabled={props.disabled}
            name={props.name}
            onChange={props.onInputChange}
            required={props.required}
            value={props.value}
            maxLength={7}
            className={formStyles.input}
      />
  </section>
}