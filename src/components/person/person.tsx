import React from 'react';
import styles from 'src/components/person/scss/person.module.scss';
import { siteUrl } from 'src/config/auth';

type PersonProps = {
  type?: 'creator' | 'collection' | 'owner' | string;
  person: TUser | ICollectionItem,
  size?: 'xs' | 'sm' | 'md';
  count?: string | number;
  modifier?: 'wide';
}

export default function Person({ person, size, type, count, modifier }: PersonProps) {
  const url = `${siteUrl}/${type === 'collection' ? 'collection' : 'user'}/${person?.slug}`;

  return <div className={`${styles.person} ${modifier ? styles[`person--${modifier}`] : ''}`}>
    <a className={styles.person__info} href={url}>
      <div className={`${styles.person__img} ${size ? styles[`person__img--${size}`] : ''} ${styles[`person__img--${type ? type : 'round'}`]}`}>
        <img src={person?.image ? person.image : person?.defaultImage}/>
      </div>
      <div
        className={`${styles.person__name} ${styles['person__name--link']} ${size ? styles[`person__name--${size}`] : ''}`}>
        <span className={`${styles.person__text}`}>{person?.name}</span>
      </div>
    </a>
    {count ? <div className={styles.person__rating}>{count}</div> : ''}
  </div>;
}
