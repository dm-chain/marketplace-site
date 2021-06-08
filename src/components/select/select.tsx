import React from 'react';
import { default as SelectPlugin } from 'react-select';
import formStyles from 'src/components/forms/scss/form.module.scss';

type SelectProps = {
  id: string;
  options: SelectOption[];
  label?: string;
  className?: string;
  onChange?: Function;
  description?: string;
  size?: 'md';
  disabled?: boolean;
  defaultValue?: string;
}

export default function Select(props: SelectProps) {
  return (
    <div className={`${formStyles.form__field} ${props.className} ${props.label ? formStyles['form__field--label'] : ''} ${props.disabled ? formStyles['form__field--disabled'] : ''}`}>
      <div className={`${formStyles.form__control}`}>
        {props.label ? <div className={formStyles.form__label}>
          <label className="" htmlFor={props.id}>{props.label}</label>
        </div> : ''}
        <SelectPlugin id={props.id}
          instanceId={props.id}
          defaultValue={props.options[0]}
          className={`select ${props.className} ${props.size ? `select--${props.size}` : ''}`}
          classNamePrefix={'select'}
          options={props.options}
          onChange={(option: SelectOption) => props.onChange ? props.onChange(option.value) : ''}
          isDisabled={props.disabled}
        />
      </div>
      {props.description
        ? <div className={formStyles['form__field-description']}>{props.description}</div>
        : ''}
    </div>
  );
}
