import React from 'react';
import styles from 'src/components/cards/scss/card.module.scss';
import cardsStyles from 'src/components/cards/cards-row/scss/cards-row.module.scss';
import Person from 'src/components/person/person';

type ColletionsCardProps = {
  item: ICollectionItemExtended;
};

export default function CardCollections({ item }: ColletionsCardProps) {
  return (
    <div className={`${styles.card} ${styles['card--collections']} ${styles['card--link']} ${cardsStyles.card}`}>
      <a className={`${styles.card__link}`} href={'/collection/' + item.slug}></a>
      <div className={styles.card__header}>
        <Person person={item.author} />
      </div>
      <div className={styles.card__content} style={{ backgroundImage: `url(${item.image})` }}>
        <div className={styles.card__contentInner}>
          <div className={styles.card__title}>{item.name}</div>
          <div className={styles.card__description}>{item.description}</div>
        </div>
      </div>
    </div>
  );
}
