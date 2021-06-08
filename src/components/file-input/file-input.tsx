import React, { useRef } from 'react';
import FileInputAvatar from 'src/components/file-input/file-input-avatar';
import FileInputToken from 'src/components/file-input/file-input-token';
import FileInputCollection from 'src/components/file-input/file-input-collection';
import FileInputCover from 'src/components/file-input/file-input-cover';
import FileInputMainAvatar from 'src/components/file-input/file-input-main-avatar';
import { MAX_FILE_SIZE, FILE_SIZE_ERROR, FILE_EXTENSION_ERROR } from 'src/config/files';
import { notify } from 'src/utils/common';

type FileInputProps = {
  type: 'avatar' | 'token' | 'collection' | 'cover' | 'main-avatar';
  file: TFile | string;
  defaultFile?: string;
  setFile: React.Dispatch<React.SetStateAction<TFile>>;
  label?: string;
  required?: boolean;
  className?: string;
  error?: string;
  src?: string
}

export default function FileInput(props: FileInputProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  const clickFileInput = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const changeFileInput = () => {
    if (fileInput.current && fileInput.current.files && fileInput.current.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e: ProgressEvent<FileReader>) {
        const fileExtensions = fileInput.current?.accept ? fileInput.current.accept.split(', ').map(ext => ext.replace('.', '')) : [];

        if (e.target && typeof e.target.result === 'string') {
          if (fileInput.current && fileInput.current.files) {
            const file = fileInput.current.files[0];
            const fileInfo = file.type.split('/');
            const extension = fileInfo[fileInfo.length - 1].toLowerCase();

            if (fileExtensions && !fileExtensions.includes(extension)) {
              notify(FILE_EXTENSION_ERROR);
            } else if (file.size > MAX_FILE_SIZE) {
              notify(FILE_SIZE_ERROR);
            } else {
              props.setFile({ data: fileInput.current.files[0], src: e.target.result });
            }
          }
        }
      };

      reader.readAsDataURL(fileInput.current.files[0]);
    }
  };

  const deleteFile = () => {
    if (fileInput.current) {
      fileInput.current.value = '';
    }

    props.setFile({
      src: '',
      data: null,
    });
  };

  return <>
    {props.type === 'token'
      ? <FileInputToken
        label={props.label}
        className={props.className}
        required={props.required}
        type={props.type}
        file={props.file}
        deleteFile={deleteFile}
        changeFileInput={changeFileInput}
        clickFileInput={clickFileInput}
        fileInput={fileInput}
        error={props.error}/>
      : ''}
    {props.type === 'avatar'
      ? <FileInputAvatar
        label={props.label}
        className={props.className}
        required={props.required}
        type={props.type}
        file={props.file}
        defaultFile={props.defaultFile}
        deleteFile={deleteFile}
        changeFileInput={changeFileInput}
        clickFileInput={clickFileInput}
        fileInput={fileInput}/>
      : ''}
    {props.type === 'collection'
      ? <FileInputCollection
        label={props.label}
        className={props.className}
        required={props.required}
        type={props.type}
        file={props.file}
        deleteFile={deleteFile}
        changeFileInput={changeFileInput}
        clickFileInput={clickFileInput}
        fileInput={fileInput}
        error={props.error}/>
      : ''}
    {props.type === 'cover'
      ? <FileInputCover
        type={props.type}
        file={props.file}
        deleteFile={deleteFile}
        defaultFile={props.defaultFile}
        changeFileInput={changeFileInput}
        clickFileInput={clickFileInput}
        fileInput={fileInput}/>
      : ''}
    {props.type === 'main-avatar'
      ? <FileInputMainAvatar
        type={props.type}
        file={props.file}
        deleteFile={deleteFile}
        changeFileInput={changeFileInput}
        clickFileInput={clickFileInput}
        fileInput={fileInput}/>
      : ''}
  </>;

}
