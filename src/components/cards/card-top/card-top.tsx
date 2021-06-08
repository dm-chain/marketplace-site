import React, { useEffect } from 'react';
import styles from 'src/components/cards/scss/card.module.scss';
import cardsStyles from 'src/components/cards/cards-row/scss/cards-row.module.scss';
import Button from 'src/components/button/button';
import Person from 'src/components/person/person';
import Arrow from 'src/resources/img/arrow-r.svg';

type CardTopProps = {
  card: TCardTop
}

export default function CardTop({ card }: CardTopProps) {
  return <div className={`${styles.card} ${styles['card--top']} ${cardsStyles.card}`}>
    <div className={styles.card__header}>
      <div className={styles.card__title}>
        {card.title}
      </div>
      <div className={styles.card__subtitle}>
        {card.subtitle}
      </div>
    </div>
    <div className={styles.card__items}>
      {card.items && card.items.map((item: any, key: any) =>
        <div
          key={key}
          className={styles.card__item}>
          <Person person={item.profile} count={item.items} modifier={'wide'} type={card?.type}/>
        </div>)}
    </div>
    {/*
     <Button
      className={styles.card__btn}
      size={'sm'}
      style={'empty'}
      transform={'right'}
      icon={<Arrow/>}>View All</Button>
    */}
  </div>;
}
