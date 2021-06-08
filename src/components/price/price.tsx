import React from 'react';

import Person from 'src/components/person/person';
import PriceValue from 'src/components/price/price-value';

import styles from 'src/components/price/scss/price.module.scss';

type PriceProps = {
  price: string | number;
  user?: TUser;
  type?: 'auction' | 'fixed';
  bids?: boolean;
}

export default function Price({ price, user, bids, type = 'fixed' }: PriceProps) {
  return <div className={styles.price}>
    <div className={styles.price__above}>
      {type === 'auction' && <>
        {bids && <>
          Current bid by
          {user && <div className={styles['price__above-person']}>
            <Person person={user} size={'xs'}/>
          </div>}
        </>}
        {!bids && 'Minimum bid'}
      </>}
      {type === 'fixed' && 'Current price'}
    </div>
    <PriceValue price={price}/>
  </div>;
}
