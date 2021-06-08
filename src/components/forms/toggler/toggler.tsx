import React from 'react';

import styles from 'src/components/forms/toggler/scss/toggler.module.scss';
import formStyles from 'src/components/forms/scss/form.module.scss';

type TogglerProps = {
    id: string;
    name: string;
    title: string;
    className?: string;
    checked?: boolean;
    description?: string;
    disclaimer?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Toggler(props: TogglerProps) {
  return <div className={`${props.className} ${styles.toggler}`}>
    <input
      className={styles.toggler__input}
      type="checkbox"
      name={props.name}
      id={props.id}
      defaultChecked={props.checked}
      onChange={props.onChange}/>
    <label
      className={styles.toggler__label}
      htmlFor={props.id}>{props.title}
      {props.description ? <span>{props.description}</span> : ''}
    </label>
    {props.disclaimer && <div className={formStyles['form__field-description']}>{props.disclaimer}</div> }
  </div>;
}
