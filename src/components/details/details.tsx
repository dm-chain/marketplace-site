import React from 'react';
import styles from 'src/components/details/scss/details.module.scss';
import DetailsItem from './details-item';

type DetailsProps = {
    items: DetailsItem[],
}

export default function Details({ items }: DetailsProps) {

  return <div className={styles.details}>
    {items.map((item, key) =>
      <div
        key={key}
        className={styles.details__item}>
        <DetailsItem
          item={item}/>
      </div>)}
  </div>;
}
