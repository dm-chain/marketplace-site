import React from 'react';
import styles from 'src/components/main-screen/scss/main-screen.module.scss';
import Button from 'src/components/button/button';
import EditIcon from 'src/resources/img/pen.svg';
import { FILE_EXTENSIONS } from 'src/config/files';

export default function FileInputCover(props: FileInputProps) {
  return <>
    {typeof props.file === 'string' && props.file && <img src={props.file} alt=""/>}
    <div className={styles['main__bg-edit-btns']}>
      <Button
        size={'sm'}
        style={'full'}
        icon={<EditIcon/>}
        className={styles['main__bg-edit-btn']}
        onClick={props.clickFileInput}>
        Edit Cover
      </Button>
      {props.file && props.file !== props.defaultFile && <Button
        size={'sm'}
        style={'empty'}
        className={styles['main__bg-edit-btn']}
        onClick={props.deleteFile}>
        Delete
      </Button>}
    </div>
    <input
      ref={props.fileInput}
      type="file"
      id={props.type}
      className={styles['main__bg-edit-input']}
      onChange={props.changeFileInput}
      accept={FILE_EXTENSIONS.image.map(ext => '.' + ext).join(', ')}
    />
  </>;
}
