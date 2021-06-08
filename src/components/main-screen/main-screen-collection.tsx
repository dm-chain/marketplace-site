import React, { useEffect, useState } from 'react';
import styles from 'src/components/main-screen/scss/main-screen.module.scss';
import Container from 'src/components/container/container';
import bgImgSrc from 'src/resources/img/cover-collection.png';
import ProfileInfoCollection from 'src/components/profile-info/profile-info-collection';
import FileInput from 'src/components/file-input/file-input';
import { requestApiJson, requestApiMultipart } from 'src/utils/request';
import { notify } from 'src/utils/common';

type MainScreenCollectionProps = {
  collection: ICollectionItemExtended;
  profile: TUser;
}

export default function MainScreenCollection({ collection, profile }: MainScreenCollectionProps) {
  const [cover, setCover] = useState(bgImgSrc);
  const [file, setFile] = useState<TFile>({
    src: cover,
    data: null
  });

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
        const res = await requestApiMultipart(`/api/upload/?id=${profile.id}&type=coll_cover`, 'POST', formData);

        if (res.status === 201) {
          const data = await res.json();
          const resUpdate = await requestApiJson('/api/collections/', 'PUT',{ _id: collection._id, cover: data.image });

          if (resUpdate.status === 200) {
            const collection = await resUpdate.json();

            if (!collection.cover) {
              setNewCover(data.image);
            } else {
              const resDelete = await requestApiJson('/api/upload/', 'DELETE', { src: collection.cover });

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
        const resUpdate = await requestApiJson('/api/collections/', 'PUT', { _id: collection._id, cover: '' });

        if (resDelete.status === 200 && resUpdate.status === 200) {
          setNewCover(bgImgSrc);
        }
      }
    };

    if (file.src !== cover) {
      uploadImage();
    }
  }, [file]);

  return (<div
    className={`${styles.main} ${styles['main--light']} ${cover ? styles['main--image'] : ''}`}>
    <div className={`${styles.main__bg}`}>
      {profile && collection.author.id === profile?.id
        ? <FileInput
          type={'cover'}
          file={cover}
          defaultFile={bgImgSrc}
          setFile={setFile}/>
        : <img src={cover ? cover : bgImgSrc} alt=""/>}
    </div>
    <Container>
      <div className={`${styles.main__wrap} ${cover ? styles['main__wrap--image'] : ''} ${styles['main__wrap--base']} ${styles['main__wrap--collection']}`}>
        <ProfileInfoCollection collection={collection}/>
      </div>
    </Container>
  </div>);
}
