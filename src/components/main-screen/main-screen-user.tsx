import React, { useContext, useEffect, useState } from 'react';
import styles from 'src/components/main-screen/scss/main-screen.module.scss';
import Container from 'src/components/container/container';
import UserContext from 'src/components/user-provider/user-provider';
import FileInput from 'src/components/file-input/file-input';
import { requestApiJson, requestApiMultipart } from 'src/utils/request';
import { notify } from 'src/utils/common';
import GlobalContext from 'src/components/global-provider';
import ProfileInfoUser from '../profile-info/profile-info-user';

type MainScreenUserProps = {
  profile: TUser;
}

export default function MainScreenUser({ profile }: MainScreenUserProps) {
  const { topline } = useContext(GlobalContext);
  const { isAuthorizedUser, cover, setCover } = useContext(UserContext);
  const [file, setFile] = useState<TFile>({
    src: cover,
    data: null
  });
  const showCover = isAuthorizedUser || profile.cover;

  const setNewCover = (img: string) => {
    notify('Your image succesfully updated!');
    setCover(img);
    setFile({ src: img, data: null });
  };

  useEffect(() => {
    const uploadImage = async () => {
      if (file.data) {
        let formData = new FormData();
        formData.append('file', file.data);
        const res = await requestApiMultipart(`/api/upload/?id=${profile.id}&type=cover`, 'POST', formData);

        if (res.status === 201) {
          const data = await res.json();
          const resUpdate = await requestApiJson('/api/users/', 'PUT',{ id: profile.id, cover: data.image });

          if (resUpdate.status === 200) {
            const user = await resUpdate.json();

            if (!user.cover) {
              setNewCover(data.image);
            } else {
              const resDelete = await requestApiJson('/api/upload/', 'DELETE', { src: user.cover });

              if (resDelete.status === 200) {
                setNewCover(data.image);
              }
            }
          }
        } else {
          // if err
        }
      } else {
        const resDelete = await requestApiJson('/api/upload/', 'DELETE', { src: cover });
        const resUpdate = await requestApiJson('/api/users/', 'PUT', { id: profile.id, cover: '' });

        if (resDelete.status === 200 && resUpdate.status === 200) {
          setNewCover('');
        }
      }
    };

    if (file.src !== cover) {
      uploadImage();
    }
  }, [file]);

  return (<div
    className={`${styles.main} ${styles['main--light']} ${showCover ? styles['main--image'] : ''} ${topline ? styles['main--topline'] : ''}`}>
    {isAuthorizedUser && <div className={`${styles.main__bg}`}>
      <FileInput
        type={'cover'}
        file={cover}
        setFile={setFile}/>
    </div>
    }
    {!isAuthorizedUser && profile.cover && <div className={`${styles.main__bg}`}>
      <img src={profile.cover} alt=""/>
    </div>}
    <Container>
      <div className={`${styles.main__wrap} ${showCover ? styles['main__wrap--image'] : ''} ${styles['main__wrap--base']}`}>
        <ProfileInfoUser profile={profile}/>
      </div>
    </Container>
  </div>);
}
