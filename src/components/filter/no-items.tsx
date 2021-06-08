import React from 'react';
import styles from './scss/filter.module.scss';
import ButtonLink from '../button/button-link';

type NoItemsProps = {
  modifier?: string;
  isExplorePage?: boolean;
}

export default function NoItems({ modifier, isExplorePage }: NoItemsProps) {
  return <div className={`${styles.info} ${modifier ? styles[`info--${modifier}`] : ''}`}>
    <div className={styles.info__title}>No items found</div>
    {!isExplorePage && <>
      <div className={styles.info__description}>Come back soon! Or try to browse something for you on our marketplace</div>
      <ButtonLink
        link={'/explore'}
        size={'md'}
        style={'full'}>Browse marketplace</ButtonLink>
    </>}
  </div>;
}
