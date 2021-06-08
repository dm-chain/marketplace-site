import React from 'react';
import styles from 'src/components/bids/scss/bids.module.scss';
import Details from 'src/components/details/details';

type BidsProps = {
  items?: DetailsItem[];
}

export default function Bids({ items = [] }: BidsProps) {
  const expiredBids = items?.length ? items.slice(1) : [];
  return <>
    {items?.length
      ? <div>
        <Details items={items.slice(0, 1)}/>
        {expiredBids.length ? <div className={styles.bids__expired}>
          <Details items={expiredBids}/>
        </div> : ''}
      </div>
      : ''}
    {!items.length && <div className={styles.bids__text}>
      <span>No active bids yet.</span>
      <span>Be the first to make a bid!</span>
    </div>}
  </>;
}
