import React from 'react';

import Button from 'src/components/button/button';
import Person from 'src/components/person/person';
import BidInfo from 'src/components/bid-info/bid-info';
import { useSession } from 'next-auth/client';

import styles from 'src/components/modal/scss/modal.module.scss';

export default function ConfirmYourPayment() {
  const [session] = useSession();
  // @ts-ignore
  const profile: TUser = session?.profile;

  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>Confirm your payment</div>
    </div>
    <div className={styles.modal__main}>
      <div className={`${styles['modal__main-content']} ${styles['modal__main-content--sm']}`}>
        You are about to purchase Slow Motion Discovery <b>Slow Motion Discovery</b> from <Person person={profile} size={'sm'}/>
      </div>
      <BidInfo list={[
        {
          leftCol: '12 582.45 TON',
          rightCol: '~$34 456',
        }
      ]} reverse={true}/>
    </div>
    <div className={styles.modal__footer}>
      <BidInfo list={[
        {
          leftCol: 'Your balance',
          rightCol: '34 454.56 TON'
        },
        {
          leftCol: 'Service fee',
          rightCol: '100 TON'
        },
        {
          leftCol: 'You will pay',
          rightCol: '12 682.45 TON'
        }
      ]}/>
      <Button size={'md'} style={'full'} className={styles.modal__btn}>Confirm</Button>
    </div>
  </>;
}
