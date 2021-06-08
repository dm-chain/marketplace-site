import React from 'react';
import styles from 'src/components/modal/scss/modal.module.scss';
import Button from 'src/components/button/button';
import Checkbox from 'src/components/forms/checkbox/checkbox';

export default function TermsOfService() {
  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>Grandbazar Terms
        of Service</div>
    </div>
    <div className={styles.modal__main}>
      <div className={styles['modal__main-content']}>
        Please take a few minutes to read and understand <a href={'#'}>Grandbazar Terms of Service.</a>
        To continue, you’ll need to accept the Terms of Service by checking the box.
      </div>
      <Checkbox name={'years'} id={'years'} text={'I am at least 13 years old'} className={styles.modal__checkbox}/>
      <Checkbox name={'Terms'} id={'Terms'} text={'I accept the Grandbazar Terms of Service'} className={styles.modal__checkbox}/>
      <Button size={'md'} style={'full'} className={styles.modal__btn}>Proceed</Button>
    </div>
  </>;
}
