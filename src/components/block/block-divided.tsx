import React, { ReactNode } from 'react';
import Container from 'src/components/container/container';
import styles from 'src/components/block/scss/block.module.scss';

type BlockDividedPropTypes = {
    bg: string;
    contentLeft?: ReactNode;
    contentRight?: ReactNode;
    modifier?: 'first' | 'topline';
}

export default function BlockDivided(props: BlockDividedPropTypes) {
  return <section className={`${styles.block} ${styles['block--flex']} ${styles['block--' + props.bg]} ${styles['block--p-0']} `}>
    <Container type={'divided'}>
      <div className={styles.block__row}>
        <div className={`${styles.block__col} ${props.modifier ? styles[`block__col--${props.modifier}`] : ''}`}>
          <div className={styles['block__col-container']}>
            {props.contentLeft}
          </div>
        </div>
        <div className={`${styles.block__col} ${props.modifier ? styles[`block__col--${props.modifier}`] : ''}`}>
          <div className={styles['block__col-container']}>
            {props.contentRight}
          </div>
        </div>
      </div>
    </Container>
  </section>;
}
