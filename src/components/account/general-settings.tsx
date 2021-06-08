import React, { useContext, useEffect, useState } from 'react';

import FileInput from 'src/components/file-input/file-input';
import { useSession } from 'next-auth/client';
import FormControl from 'src/components/forms/form-control/form-control';
import Button from 'src/components/button/button';
import { siteUrl } from 'src/config/auth';
import UserContext from 'src/components/user-provider/user-provider';

import styles from 'src/components/account/scss/settings.module.scss';
import formStyles from 'src/components/forms/scss/form.module.scss';
import { notify } from 'src/utils/common';
import { requestApiJson, requestApiMultipart } from 'src/utils/request';

export default function GeneralSettings() {
  const [session] = useSession();

  const formFields = {
    name: {
      label: 'Display name',
      type: 'text',
      placeholder: 'Enter your display name',
      required: true,
      disabled: false
    },
    slug: {
      label: 'Custom URL',
      type: 'text',
      placeholder: 'Enter your display name',
      required: true,
      pattern: new RegExp(/^[a-zA-Z0-9_-]{5,30}$/),
      error: 'You can use a-z, 0-9, -, _. Length 5-30 characters.',
      disabled: false
    },
    bio:  {
      label: 'Bio',
      type: 'text',
      placeholder: 'Tell about yourself in a few words',
      required: false,
      disabled: false
    },
    email: {
      label: 'Email Address',
      type: 'text',
      disabled: true,
      placeholder: 'Your email for marketplace notifications',
      required: true,
    }
  };

  const { avatar, setAvatar, setSlug } = useContext(UserContext);
  // @ts-ignore
  const profile: TUser = session?.profile;

  const initialProfileSettings = Object.keys(formFields).reduce((settings, key) => {
    return { ...settings, [key]: profile[key] };
  }, {});

  const initialErrors = Object.keys(formFields).reduce((carry, key) => {
    carry[key] = '';
    return carry;
  }, {});

  const [profileSettings, setProfileSettings] = useState(initialProfileSettings);
  const [errors, setErrors] = useState(initialErrors);
  const [file, setFile] = useState<TFile>({
    src: avatar,
    data: null
  });

  const setField = function (name: string, value: string | File | null) {
    setProfileSettings({ ...profileSettings, [name]: value });
    setErrors(errors => ({ ...errors, [name]: '' }));
  };

  const validForm = () => {
    let emptyFields = Object.keys(profileSettings)
      .filter((key) => (formFields[key].required && (profileSettings[key] === null || profileSettings[key] === '')));

    let notValidFields = Object.keys(profileSettings)
      .filter((key) => formFields[key]?.pattern && typeof profileSettings[key] === 'string' && !profileSettings[key].match(formFields[key].pattern));

    emptyFields.forEach((key) => setErrors(errors => ({ ...errors, [key]: 'required' })));
    notValidFields.forEach((key) => setErrors(errors => ({ ...errors, [key]: formFields[key].error })));

    return !(emptyFields.length || notValidFields.length);
  };

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (validForm()) {
      const res = await fetch(`${siteUrl}/api/users`,{
        method: 'PUT',
        body: JSON.stringify({ ...profileSettings, id: profile.id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200) {
        setSlug(profileSettings['slug']);
        notify('Profile updated successfully');
      } else {
        const data = await res.json();
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, error]) => {
            setErrors({ ...errors, [field]: error });
          });
        }
      }
    }
  };

  const setNewAvatar = (img: string) => {
    notify('Your image succesfully updated!');
    const newAvatar = img;
    setAvatar(newAvatar);
    setFile({ src: newAvatar, data: null });
  };

  useEffect(() => {
    const uploadImage = async () => {
      if (file.data) {
        let formData = new FormData();
        formData.append('file', file.data);
        const res = await requestApiMultipart(`/api/upload/?id=${profile.id}&type=image`, 'POST', formData);

        if (res.status === 201) {
          const data = await res.json();
          const resUpdate = await requestApiJson('/api/users/', 'PUT',{ id: profile.id, image: data.image });

          if (resUpdate.status === 200) {
            const user = await resUpdate.json();

            if (!user.image) {
              setNewAvatar(data.image ? data.image : profile.defaultImage);
            } else {
              const resDelete = await requestApiJson('/api/upload/', 'DELETE', { src: user.image });

              if (resDelete.status === 200) {
                setNewAvatar(data.image ? data.image : profile.defaultImage);
              }
            }
          }
        } else {
          // if err
        }
      } else {
        const resDelete = await requestApiJson('/api/upload/', 'DELETE', { src: avatar });
        const resUpdate = await requestApiJson('/api/users/', 'PUT', { id: profile.id, image: '' });

        if (resDelete.status === 200 && resUpdate.status === 200) {
          setNewAvatar(profile.defaultImage);
        }
      }
    };

    if (file.src !== avatar) {
      uploadImage();
    }
  }, [file]);

  return  <div className={styles.settings}>
    <div className={styles.settings__title}>General Settings</div>
    <div className={styles.settings__row}>
      <div className={styles.settings__block}>
        {session && <form className={formStyles.form} onSubmit={handleSubmit}>
          <div className={`${formStyles.form__wrap}`}>
            {Object.entries(formFields).map(([key, field]) =>
              <FormControl
                id={key}
                label={field.label ?? ''}
                name={key}
                placeholder={field.placeholder}
                type={field.type}
                key={key}
                defaultValue={profileSettings[key]}
                onChange={(e) => setField(e.target.name, e.target.value)}
                error={errors[key]}
                disabled={field.disabled}
                required={field.required}
              />
            )}
            <div className={`${formStyles.form__field} ${formStyles['form__field--btn']}`}>
              <Button size={'md'} style={'full'} type={'submit'}>
                Update Profile
              </Button>
            </div>
          </div>
        </form>}
      </div>
      <div className={styles.settings__aside}>
        <form encType="multipart/form-data" action="">
          <FileInput
            type={'avatar'}
            defaultFile={profile.defaultImage}
            file={avatar}
            setFile={setFile}/>
        </form>
      </div>
    </div>
  </div>;
}
