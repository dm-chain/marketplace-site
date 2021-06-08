import React from 'react';
import styles from 'src/components/bid-info/scss/bid-info.module.scss';

type BidInfoProps = {
  list: Array<{
    leftCol: string;
    rightCol: string | number | React.ReactNode;
  }>,
  reverse?: boolean;
  error?: string;
}

export default function BidInfo({ list, reverse, error } : BidInfoProps) {
  return <div className={`${styles['bid-info']}`}>
    {list.map((item, key) =>
      <div key={key} className={`${styles['bid-info__item']} ${reverse ? styles['bid-info__item--reverse'] : ''}`}>
        <div className={`${styles['bid-info__title']} ${reverse ? styles['bid-info__title--reverse'] : ''}`}>
          {item.leftCol}
        </div>
        <div className={`${styles['bid-info__value']} ${reverse ? styles['bid-info__value--reverse'] : ''}`}>
          {item.rightCol}
        </div>
      </div>)}
    {error
      ? <div className={`${styles['bid-info__item']}`}>
        <div className={`${styles['bid-info__title']} ${styles['bid-info__title--error']}`}>{error}</div>
      </div>
      : ''}
  </div>;
}
