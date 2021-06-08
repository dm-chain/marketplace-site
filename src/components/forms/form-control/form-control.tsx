import React, { EventHandler } from 'react';

import styles from 'src/components/forms/form-control/scss/control.module.scss';
import formStyles from 'src/components/forms/scss/form.module.scss';

type ControlProps = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'textarea' | string;
  label?: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number | undefined;
  onChange?: EventHandler<any>;
  onInput?: EventHandler<any>;
  error?: string;
  group?: boolean;
  suffix?: string;
  description?: string | React.ReactNode;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export default class FormControl extends React.Component<ControlProps> {
  constructor(props: ControlProps) {
    super(props);

    this.state = {};
  }

  render() {
    const { id, name, type, label, placeholder,
      value, onChange, onInput, error, group, suffix, description,
      disabled, className, defaultValue, required = true } = this.props;
    let collectClassName = `${styles.control} ${group ? styles['control--group'] : ''} ${suffix ? styles['control--suffix'] : ''}  ${type === 'textarea' ? styles['control--textarea'] : ''}`;
    collectClassName += error ? ` ${styles.error}` : '';

    let errorMsg = error ? <span className={styles.errorMsg}>{error}</span> : '';

    const control = type !== 'textarea'
      ? <>
        <input
          className={collectClassName}
          type={type}
          id={id}
          name={name}
          title={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          onInput={onInput}
          disabled={disabled}
          required={required}
        />
        {errorMsg}
      </>
      : <>
        <textarea
          className={collectClassName}
          name={name}
          id={id}
          title={name}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        >
        </textarea>
        {errorMsg}
      </>;

    return (<div className={`${className ? className : ''} ${formStyles.form__field} ${group ? formStyles['form__field--group'] : ''} ${label ? formStyles['form__field--label'] : ''} ${disabled ? formStyles['form__field--disabled'] : ''}`}>
      <div className={`${formStyles.form__control} ${group ? formStyles['form__control--group'] : ''}`}>
        {label && <div className={formStyles.form__label}><label htmlFor={id}>{label}{!required ? <span>(Optional)</span> : ''}</label></div>}
        {control}
        {suffix ? <span className={`${formStyles['form__field-suffix']} ${error ? formStyles['form__field-suffix--error'] : ''}`}>{suffix}</span> : ''}
      </div>
      {description
        ? <div className={formStyles['form__field-description']}>{description}</div>
        : ''}
    </div>);
  }
}
