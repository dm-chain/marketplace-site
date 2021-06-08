import React, { ReactNode } from 'react';
import styles from './scss/block-head.module.scss';

type BlockHeadProps = {
  title: string,
  right?: ReactNode,
  left?: ReactNode
}

export default function BlockHead({ title, right, left }: BlockHeadProps) {
  return (
    <div className={styles.block__head} >
      <h2>{title}</h2>
      {(left || right) && <div className={styles['block__head-row']}>
        <div className={styles['block__head-col']}>
          {left}
        </div>
        <div className={styles['block__head-col']}>
          {right}
        </div>
      </div>}
    </div>
  );
}
