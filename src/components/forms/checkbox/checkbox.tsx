import React from 'react';
import styles from 'src/components/forms/checkbox/scss/checkbox.module.scss';

type CheckboxProps = {
  name: string;
  id: string;
  text: string;
  className?: string;
}

export default function Checkbox(props: CheckboxProps) {
  return <div className={`${styles.checkbox} ${props.className}`}>
    <input className={`${styles.checkbox__input}`}
      name={props.name}
      type="checkbox"
      id={props.id}/>
    <label className={styles.checkbox__label}
      htmlFor={props.id}>
      {props.text}
    </label>
  </div>;
}
