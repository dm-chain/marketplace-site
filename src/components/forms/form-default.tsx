import React from 'react';
import FormControl from 'src/components/forms/form-control/form-control';
import styles from 'src/components/forms/scss/form.module.scss';
import Button from 'src/components/button/button';

type FormProps = {
  fields: Field[];
  state: FormState;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleInputChange: React.FormEventHandler<HTMLInputElement>;
  btnText?: string;
}

export default function FormDefault({ btnText, fields, state, handleSubmit, handleInputChange }: FormProps) {
  return <form className={styles.form} onSubmit={handleSubmit}>
    <div className={`${styles.form__wrap}`}>
      {fields.map(field =>
        <FormControl
          id={field.id}
          label={field.label ?? ''}
          name={field.name}
          placeholder={field.placeholder}
          type={field.type}
          key={field.id}
          value={state.values[field.name]}
          onChange={handleInputChange}
          error={state.errors[field.name]}
          description={field.description}
          disabled={field.disabled}
        />
      )}

      <div className={`${styles.form__field} ${styles['form__field--btn']}`}>
        <Button size={'md'} style={'full'} type={'submit'}>
          {btnText}
        </Button>
      </div>
    </div>
  </form>;
}
