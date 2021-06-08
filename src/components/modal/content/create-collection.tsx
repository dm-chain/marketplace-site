import React, { useContext, useEffect, useState } from 'react';
import styles from 'src/components/modal/scss/modal.module.scss';
import Button from 'src/components/button/button';
import FormControl from 'src/components/forms/form-control/form-control';
import FileInput from 'src/components/file-input/file-input';
import ModalContext from 'src/components/modal/modal-provider';
import { requestApiJson } from 'src/utils/request';
import { siteUrl } from 'src/config/auth';

type CreateCollectionProps = {
  profile: TUser;
  setNewCollection: React.Dispatch<React.SetStateAction<ICollectionItem|null>>;
}

export default function CreateCollection({ setNewCollection, profile }: CreateCollectionProps) {
  const { setIsShowModal } = useContext(ModalContext);

  const formFields = {
    image: {
      required: true,
      defaultValue: null
    },
    name: {
      required: true,
      defaultValue: ''
    },
    slug: {
      required: true,
      defaultValue: '',
      pattern: new RegExp(/^[a-zA-Z0-9_-]{5,30}$/),
      error: 'You can use a-z, 0-9, -, _. Length 5-30 characters.'
    },
    description: {
      required: false,
      defaultValue: ''
    }
  };

  const initialFields = Object.keys(formFields).reduce((acc, key) => {
    return { ...acc, [key]: formFields[key].defaultValue };
  }, {});

  const initialErrors = Object.keys(formFields).reduce((acc, key) => {
    return { ...acc, [key]: '' };
  }, {});

  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState(initialErrors);

  const setField = (name: string, value: string | File | null) => {
    setErrors(errors => ({ ...errors, [name]: '' }));
    setFields({ ...fields, [name]: value });
  };

  const [file, setFile] = useState<TFile>({
    src: '',
    data: null
  });

  useEffect(() => {
    setField('image', file.data);
  }, [file]);

  const validForm = () => {
    let emptyFields = Object.keys(fields)
      .filter((key) => (formFields[key].required && (fields[key] === null || fields[key] === '')));

    let notValidFields = Object.keys(fields)
      .filter((key) => formFields[key]?.pattern && typeof fields[key] === 'string' && !fields[key].match(formFields[key].pattern));

    emptyFields.forEach((key) => setErrors(errors => ({ ...errors, [key]: 'required' })));
    notValidFields.forEach((key) => setErrors(errors => ({ ...errors, [key]: formFields[key].error })));

    return !(emptyFields.length || notValidFields.length);
  };

  const addCollectionItem = async () => {
    if (validForm()) {
      const formData = new FormData();
      formData.append('file', fields['image']);

      const resImg = await fetch(`${siteUrl}/api/upload/?id=${profile.id}&type=collection`,{
        method: 'POST',
        body: formData
      });

      if (resImg.status === 201) {
        const data = await resImg.json();

        const collection = {
          image: data.image,
          name: fields['name'],
          description: fields['description'],
          slug: fields['slug'],
          author: profile._id,
          dateCreated: new Date()
        };

        const resCollection = await requestApiJson('/api/collections/', 'POST', collection);

        if (resCollection.status === 201) {
          const newCollection = await resCollection.json();
          setNewCollection(newCollection);
          setIsShowModal(false);
        } else if (resCollection.status === 409) {
          setErrors(errors => ({ ...errors, slug: 'Already exist' }));
        }
      }
    }
  };

  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>Create Collection</div>
    </div>
    <div className={styles.modal__main}>
      <FileInput
        label={'Upload collection image'}
        type={'collection'}
        file={file.src}
        error={errors['image']}
        setFile={setFile}/>
      <FormControl
        id={'name'}
        name={'name'}
        type={'text'}
        label={'Collection name'}
        error={errors['name']}
        placeholder={'e.g. “Redeemable T-Shirt with logo”'}
        onChange={(e) => setField('name', e.target.value)}
      />
      <FormControl
        id={'description'}
        name={'description'}
        type={'textarea'}
        label={'Description'}
        onChange={(e) => setField('description', e.target.value)}
        placeholder={'e.g. “After purchasing you’ll be able to get the real T-Shirt”'}
        description={'With preserved line-breaks'}
        required={false}
      />
      <FormControl
        id={'slug'}
        name={'slug'}
        type={'text'}
        error={errors['slug']}
        label={'Short url'}
        onChange={(e) => setField(e.target.name, e.target.value)}
        placeholder={'Enter your collection url'}/>
      <Button
        size={'md'}
        style={'full'}
        className={styles.modal__btn}
        onClick={() => addCollectionItem()}>
        Submit
      </Button>
    </div>
  </>;
}
