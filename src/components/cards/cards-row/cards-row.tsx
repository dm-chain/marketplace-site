import React, { ReactNode } from 'react';
import styles from 'src/components/cards/cards-row/scss/cards-row.module.scss';
import Button from 'src/components/button/button';

type CardsPropTypes = {
  sm?: 2 | 3 | 4,
  md?: 2 | 3 | 4,
  lg?: 2 | 3 | 4,
  xl?: 2 | 3 | 4,
  xxl?: 2 | 3 | 4,
  isLoadMore: boolean;
  loadMore?: Function;
  cards: ReactNode[]
}

export default function CardsRow(props: CardsPropTypes) {
  return <>
    <div className={`${styles['cards-row']} ${styles['cards-row--wrapped']} 
      ${props.sm ? styles['cards-row--sm-' + props.sm] : ''} 
      ${props.md ? styles['cards-row--md-' + props.md] : ''}
      ${props.lg ? styles['cards-row--lg-' + props.lg] : ''}
      ${props.xl ? styles['cards-row--xl-' + props.xl] : ''}
      ${props.xxl ? styles['cards-row--xxl-' + props.xxl] : ''}
    `}>
      {props.cards}
    </div>
    {props.isLoadMore
      ? <div className={styles['load-more']}>
        <Button
          size={'wide'}
          style={'empty'}
          onClick={() => props.loadMore ? props.loadMore() : ''}>Load more</Button>
      </div>
      : ''}
  </>;
}
