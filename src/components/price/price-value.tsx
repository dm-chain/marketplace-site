import React, { useContext } from 'react';
import styles from 'src/components/price/scss/price.module.scss';
import GlobalContext from 'src/components/global-provider';
import { toUSD } from 'src/utils/common';

type PriceProps = {
  price: number | string;
}

export default function PriceValue({ price }: PriceProps) {
  const { rate } = useContext(GlobalContext);

  return <div className={styles.price__row}>
    <div className={`${styles.price__value}`}>{price}</div>
    <div className={`${styles.price__currency}`}>TON</div>
    {rate && <div className={`${styles.price__additional}`}>{toUSD(rate, Number(price))}</div>}
  </div>;
}

