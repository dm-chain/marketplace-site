import React from 'react';
import Button from 'src/components/button/button';
import { FILE_EXTENSIONS, MAX_FILE_SIZE_MB } from 'src/config/files';
import { getFileType } from 'src/utils/common';

import styles from 'src/components/create/scss/create.module.scss';
import formStyles from 'src/components/forms/scss/form.module.scss';

import CloseIcon from 'src/resources/img/close.svg';

export default function FileInputToken(props: FileInputProps) {
  let errorMsg = props.error ? <span className={formStyles.errorMsg}>{props.error}</span> : '';
  const type = getFileType(typeof props.file !== 'string' && props.file.data?.type ? props.file.data.type : '');
  const fileExtensions = [...FILE_EXTENSIONS.image, ...FILE_EXTENSIONS.gif, ...FILE_EXTENSIONS.video];

  return <div className={`${props.className ? props.className : ''} ${formStyles.form__field} ${props.label ? formStyles['form__field--label'] : ''}`}>
    <div className={`${formStyles.form__control} ${formStyles['form__control--file']}`}>
      {props.label && <div className={formStyles.form__label}>
        <label htmlFor={props.type}>{props.label}{props.required === false ? <span>(Optional)</span> : ''}</label>
      </div>}
      <div className={`${styles.create__file} ${props.error ? styles['create__file--error'] : ''}`}>
        {typeof props.file !== 'string' && props.file.src ?
          <>
            <div className={styles['create__file-preview']}>
              {type === 'video'
                ? <video controls>
                  <source src={props.file.src}/>
                </video>
                : <img src={props.file.src} alt=""/>}
              <Button
                size={'sm'}
                style={'light'}
                icon={<CloseIcon/>}
                className={styles['create__file-edit-btn']}
                onClick={props.deleteFile}/>
            </div>
          </>
          :
          <>
            <label htmlFor="file" className={styles['create__file-label']}>
              <div className={styles['create__file-field']}>
                <div className={styles['create__file-text']}>
                  <div>
                    {fileExtensions.map(item => item.toUpperCase()).join(', ')}.
                  </div>
                  Max {MAX_FILE_SIZE_MB}mb.
                </div>
                <Button
                  size={'sm'}
                  style={'empty'}
                  onClick={props.clickFileInput}
                  className={`${styles['create__file-btn']} ${props.error ? styles['create__file-btn--error'] : ''}`}>
              Choose file
                </Button>
              </div>
            </label>
          </>
        }
        <input
          ref={props.fileInput}
          type="file"
          id={props.type}
          className={styles['create__file-input']}
          onChange={props.changeFileInput}
          accept={fileExtensions.map(ext => '.' + ext).join(', ')}
        />
        {errorMsg}
      </div>
    </div>
  </div>;
}
