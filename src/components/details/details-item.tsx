import React, { useContext } from 'react';
import styles from 'src/components/details/scss/details-item.module.scss';
import Person from 'src/components/person/person';
import { toUSD } from 'src/utils/common';
import GlobalContext from 'src/components/global-provider';

type DetailsItemProps = {
  item: DetailsItem;
}

export default function DetailsItem({ item }: DetailsItemProps) {
  const { rate } = useContext(GlobalContext);

  return <div className={`${styles['details-item']}`}>

    {item.type === 'details' &&  <>
      <div className={`${styles['details-item__title']} ${styles['details-item__title--lg']}`}>
        {item.title}
      </div>
      {item.person?.profile && <Person person={item.person.profile} type={item.person?.type}/>}
    </>}

    {item.type === 'history' && <>
      <div className={styles['details-item__title']}>
        {item.person?.profile && <Person person={item.person.profile} type={item.person?.type} size={'xs'}/>}
        <div className={styles['details-item__date']}>
          {item.date && item.date.toString()}
        </div>
      </div>

      {item.price && <div className={styles['details-item__price-row']}>
        <div className={`${styles['details-item__price-value']} ${styles['details-item__price-value--bold']}`}>
          {item.price} TON
        </div>
        {item.price && rate && <div className={styles['details-item__price-value']}>
          {toUSD(rate, Number(item.price))}
        </div>}
      </div>}

      {!item.price && <div className={styles['details-item__text']}>
        {item.text}
      </div>}
    </>}
  </div>;
}
