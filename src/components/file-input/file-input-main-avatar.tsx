import React from 'react';
import styles from 'src/components/profile-info/scss/profile-info.module.scss';
import Button from 'src/components/button/button';
import EditIcon from 'src/resources/img/pen-dark.svg';
import { FILE_EXTENSIONS } from 'src/config/files';

export default function FileInputMainAvatar(props: FileInputProps) {
  return <>
    {typeof props.file === 'string' && props.file && <img
      className={`${styles['profile-info__avatar']}`}
      src={props.file}
      alt=""/>}
    <Button
      size={'circle-sm'}
      style={'light'}
      icon={<EditIcon/>}
      onClick={props.clickFileInput}
      className={styles['profile-info__avatar-edit-btn']}/>
    <input
      ref={props.fileInput}
      type="file"
      id={props.type}
      className={styles['profile-info__avatar-edit-input']}
      onChange={props.changeFileInput}
      accept={FILE_EXTENSIONS.image.map(ext => '.' + ext).join(', ')}
    />
  </>;
}
