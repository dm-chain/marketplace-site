import React, { useContext, useEffect, useState } from 'react';
import styles from 'src/components/profile-info/scss/profile-info.module.scss';

import Button from 'src/components/button/button';
import ButtonLink from 'src/components/button/button-link';
import DropdownShare from 'src/components/dropdown/dropdown-share';

import Copy from 'src/resources/img/copy.svg';
import OverflowIcon from 'src/resources/img/overflow.svg';
import IgIcon from 'src/resources/img/ig.svg';
import TwIcon from 'src/resources/img/tw.svg';
import EditIcon from 'src/resources/img/pen-dark.svg';
import UserContext from '../user-provider/user-provider';
import FileInput from '../file-input/file-input';
import { notify } from '../../utils/common';
import { requestApiJson, requestApiMultipart } from 'src/utils/request';

type ProfileInfoUserProps = {
  profile: TUser
}

export default function ProfileInfoUser({ profile } : ProfileInfoUserProps) {
  const { isAuthorizedUser, avatar, setAvatar } = useContext(UserContext);
  const [file, setFile] = useState<TFile>({
    src: avatar,
    data: null
  });

  const setNewAvatar = (img: string) => {
    notify('Succesfully updated!');
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

  return <div className={`${styles['profile-info']}`}>
    <div className={`${styles['profile-info__img']} `}>
      {!isAuthorizedUser && (profile.image || profile.defaultImage) && <img
        className={`${styles['profile-info__avatar']}`}
        src={profile.image ? profile.image : profile.defaultImage}
        alt=""/>}
      {isAuthorizedUser &&
        <FileInput
          type={'main-avatar'}
          file={avatar}
          setFile={setFile}
          defaultFile={profile.defaultImage}/>
      }
      {/* isAuthorizedUser && <Button
        size={'circle-sm'}
        style={'light'}
        icon={<EditIcon/>}
        className={styles['profile-info__avatar-edit-btn']}/> */}
    </div>
    <div className={`${styles['profile-info__content']}`}>
      <div className={`${styles['profile-info__header']}`}>
        <h1 className={styles['profile-info__name']}>
          {profile.name}
        </h1>
        {/*<Button
          className={styles['profile-info__header-btn']}
          size={'sm'}
          style={'empty'}
        icon={<OverflowIcon/>}/>*/}
        <DropdownShare
          align={'left'}
          className={styles['profile-info__header-btn']}/>
        {isAuthorizedUser
          ? <ButtonLink
            link={'/account'}
            className={styles['profile-info__header-btn']}
            size={'sm'}
            style={'empty'}>Edit Profile</ButtonLink>
          : ''}
      </div>
      {/*profile?.extraton?.walletAddress && <div className={`${styles['profile-info__id']}`}>
        <span>{profile.extraton.walletAddress}</span>
        <Button
          size={'xs'}
          style={'simple'}
          icon={<Copy/>}
          className={styles['profile-info__copy']}
        />
        </div>*/}
      {profile.bio && <div className={styles['profile-info__description']}>
        {profile.bio}
      </div>}
      { /* user.socials
        <div className={styles['profile-info__socials']}>
          <a href="#" className={`${styles['profile-info__socials-item']} ${styles['socials-item']}`}>
            <div className={styles['socials-item__icon']}><TwIcon/></div>
            <div className={styles['socials-item__name']}>@username_1337</div>
          </a>
          <a href="#" className={`${styles['profile-info__socials-item']} ${styles['socials-item']}`}>
            <div className={styles['socials-item__icon']}><IgIcon/></div>
            <div className={styles['socials-item__name']}>@username_username</div>
          </a>
        </div>
        */
      }
    </div>
  </div>;
}
