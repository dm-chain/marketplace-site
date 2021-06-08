import React from 'react';
import Button from 'src/components/button/button';
import { FILE_EXTENSIONS } from 'src/config/files';
import styles from 'src/components/file-input/scss/file-input.module.scss';
import formStyles from 'src/components/forms/scss/form.module.scss';
import CloseIcon from 'src/resources/img/close.svg';

export default function FileInputCollection(props: FileInputProps) {
  let errorMsg = props.error ? <span className={formStyles.errorMsg}>{props.error}</span> : '';

  return <div className={`${props.className ? props.className : ''} ${formStyles.form__field} ${props.label ? formStyles['form__field--label'] : ''}`}>
    <div className={`${formStyles.form__control} ${formStyles['form__control--file']}`}>
      <div className={`${styles['file-input']} ${props.error ? styles['file-input--error'] : ''}`}>
        {props.label && <div className={formStyles.form__label}>
          <label htmlFor={props.type}>{props.label}{props.required === false ? <span>(Optional)</span> : ''}</label>
        </div>}
        {props.file ?
          <>
            <div className={styles['file-input__preview']}>
              {typeof props.file === 'string' && props.file && <img src={props.file} alt=""/>}
              <Button
                size={'sm'}
                style={'light'}
                icon={<CloseIcon/>}
                className={styles['file-input__edit-btn']}
                onClick={props.deleteFile}/>
            </div>
          </>
          :
          <>
            <label htmlFor="file" className={styles['file-input__label']}>
              <div className={styles['file-input__text']}>
              PNG, GIF, WEBP.
              Max 10mb.
              </div>
              <Button
                size={'sm'}
                style={'empty'}
                onClick={props.clickFileInput}>
              Choose file
              </Button>
            </label>
          </>
        }
        <input
          ref={props.fileInput}
          type="file"
          id={props.type}
          className={styles['file-input__input']}
          onChange={props.changeFileInput}
          accept={FILE_EXTENSIONS.image.map(ext => '.' + ext).join(', ')}
        />
        {errorMsg}
      </div>
    </div>
  </div>;
}
