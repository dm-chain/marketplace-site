import React from 'react';
import styles from 'src/components/forms/radio/scss/radio-group.module.scss';
import formStyles from 'src/components/forms/scss/form.module.scss';

type RadioGroupProps = {
  name: string;
  id: string;
  description: string;
  items: SelectOption[];
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export default function RadioGroup(props: RadioGroupProps) {
  return <><div className={`${styles.radio} ${props.className}`}>
    {props.items.map((item, key) =>
      <div key={key} className={`${styles.radio__item}`}>
        <input className={`${styles.radio__input}`}
          name={props.name}
          type="radio"
          id={item.value}
          defaultChecked={key === 0}
          onChange={props.onChange}
          disabled={props.disabled}
        />
        <label className={`${styles.radio__label} ${props.disabled ? styles['radio__label--disabled'] : ''}`}
          htmlFor={item.value}>
          {item.label}
        </label>
      </div>)
    }
  </div>
  {props.description
    ? <div className={formStyles['form__field-description']}>{props.description}</div>
    : ''}
  </>;
}
