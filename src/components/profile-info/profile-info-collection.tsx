import React, { useContext } from 'react';
import Button from 'src/components/button/button';

import styles from 'src/components/profile-info/scss/profile-info.module.scss';
import Copy from 'src/resources/img/copy.svg';
import OverflowIcon from 'src/resources/img/overflow.svg';
import DropdownShare from '../dropdown/dropdown-share';
import GlobalContext from '../global-provider';

type ProfileInfoCollectionProps = {
  collection: ICollectionItemExtended;
}

export default function ProfileInfoCollection({ collection } : ProfileInfoCollectionProps) {
  return <div className={`${styles['profile-info']} ${styles['profile-info--center'] }`}>
    <div className={`${styles['profile-info__img']} ${styles['profile-info__img--center']}`}>
      <img
        className={`${styles['profile-info__avatar']} ${styles['profile-info__avatar--center']}`}
        src={collection.image}
        alt=""/>
    </div>
    <div className={`${styles['profile-info__content']} ${styles['profile-info__content--center']}`}>
      <div className={`${styles['profile-info__header']} ${styles['profile-info__header--center']}`}>
        <h1 className={styles['profile-info__name']}>
          {collection.name}
        </h1>
        <DropdownShare
          align={'right'}
          className={styles['profile-info__header-btn']}/>
      </div>
      {/*
       <div className={`${styles['profile-info__id']} ${styles['profile-info__id--center']}`}>
        <span>{collection._id}</span>
        <Button
          size={'xxs'}
          style={'simple'}
          icon={<Copy/>}
          className={styles['profile-info__copy']}
        />
      </div>
      */}
      <div className={styles['profile-info__description']}>
        {collection.description}
      </div>
      <div className={styles['profile-info__footer']}>
        {/*
        <Button
          className={styles['profile-info__header-btn']}
          size={'sm'}
          style={'empty'}
          icon={<OverflowIcon/>}/>
        */}
      </div>
    </div>
  </div>;
}
