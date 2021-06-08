import React, { useContext } from 'react';

import Container from 'src/components/container/container';
import ButtonLink from 'src/components/button/button-link';

import styles from 'src/components/main-screen/scss/main-screen.module.scss';
import GlobalContext from '../global-provider';

export default function MainScreen() {
  const { topline } = useContext(GlobalContext);

  return (<div className={`${styles.main} ${styles['main--brand']} ${topline ? styles['main--topline'] : ''}`}>
    <Container>
      <div className={styles.main__wrap}>
        <div className={styles.main__content}>
          <div className={styles.main__abovetitle}>
            The first NFT marketplace on Free TON
          </div>
          <h1 className={styles.main__title}>
            Buy, sell, and create rare digital items
          </h1>
          <div className={styles.main__btns}>
            <ButtonLink
              className={`${styles.main__btn}`}
              size={'md'}
              style={'full'}
              link={'/explore'}>
              Explore Items
            </ButtonLink>
            <ButtonLink
              className={`${styles.main__btn}`}
              size={'md'}
              style={'empty'}
              link={'/faq'}>
              Start Guide
            </ButtonLink>
          </div>
        </div>
      </div>
    </Container>
  </div>);
}
