import React from 'react';
import Button from 'src/components/button/button';
import { FILE_EXTENSIONS } from 'src/config/files';

import formStyles from 'src/components/forms/scss/form.module.scss';
import styles from 'src/components/account/scss/settings.module.scss';

import EditIcon from 'src/resources/img/pen-dark.svg';
import FileInputIcon from 'src/resources/img/input-avatar.svg';

export default function FileInputAvatar(props: FileInputProps) {

  return <div className={`${props.className ? props.className : ''} ${formStyles.form__field} ${props.label ? formStyles['form__field--label'] : ''}`}>
    <div className={`${formStyles.form__control} ${formStyles['form__control--file']}`}>
      {props.label && <div className={formStyles.form__label}><label htmlFor={props.type}>{props.label}{props.required === false ? <span>(Optional)</span> : ''}</label></div>}
      {(props.file || props.defaultFile)
        ? <>
          <div className={styles['settings__avatar-preview']}>
            {typeof props.file === 'string' && props.file && <img src={props.file ? props.file : props.defaultFile} alt=""/>}
            <Button
              size={'circle-sm'}
              style={'light'}
              icon={<EditIcon/>}
              className={styles['settings__avatar-edit-btn']}
              onClick={props.clickFileInput}/>
          </div>
          {props.file !== props.defaultFile && <Button
            size={'sm'}
            style={'empty'}
            onClick={props.deleteFile}
            className={styles['settings__avatar-btn']}>
            Delete
          </Button>}
        </>
        : <>
          <label htmlFor="avatar" className={styles['settings__avatar-label']}>
            <div className={styles.settings__avatar}>
              <FileInputIcon/>
              <Button
                size={'circle-sm'}
                style={'empty'}
                icon={<EditIcon/>}
                className={styles['settings__avatar-edit-btn']}
                onClick={props.clickFileInput}/>
            </div>
          </label>
          <div className={styles['settings__avatar-text']}>
          We recommend an image
          of at least 400x400.
          Gifs work too.
          </div>
          <Button
            size={'sm'}
            style={'empty'}
            onClick={props.clickFileInput}
            className={styles['settings__avatar-btn']}
          >
          Choose file
          </Button>
        </>
      }
      <input
        ref={props.fileInput}
        type="file"
        id={props.type}
        className={styles['settings__avatar-input']}
        onChange={props.changeFileInput}
        accept={FILE_EXTENSIONS.image.map(ext => '.' + ext).join(', ')}
      />
    </div>
  </div>;
}
