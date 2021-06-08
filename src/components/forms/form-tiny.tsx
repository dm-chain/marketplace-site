import React from 'react';
import FormControl from 'src/components/forms/form-control/form-control';
import styles from 'src/components/forms/scss/form.module.scss';
import Button from 'src/components/button/button';

type FormProps = {
  fields: Field[];
  state: FormState;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleInputChange: React.FormEventHandler<HTMLInputElement>;
}

export default function FormTiny({ fields, state, handleSubmit, handleInputChange }: FormProps) {
  return <form className={styles.form} onSubmit={handleSubmit}>
    <div className={`${styles.form__wrap} ${styles['form__wrap--group']}`}>
      {fields.map(field =>
        <FormControl
          id={field.id}
          label={field.label ?? ''}
          name={field.name}
          placeholder={field.placeholder}
          type={field.type}
          key={field.id}
          group={true}
          value={state.values[field.name]}
          onChange={handleInputChange}
          required={field.required}
          error={state.errors[field.name]}/>
      )}

      <div className={`${styles.form__field} ${styles['form__field--group']}`}>
        <Button
          size={'md'}
          style={'full'}
          type={'submit'}
          group={true}>
          Subscribe
        </Button>
      </div>
    </div>
  </form>;
}
