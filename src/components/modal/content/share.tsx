import React from 'react';
import styles from 'src/components/modal/scss/modal.module.scss';
import Share from 'src/components/share/share';

export default function ModalContentShare() {
  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>Share this NFT</div>
    </div>
    <div className={`${styles.modal__main} ${styles['modal__main--center']}`}>
      <Share size={'md'}/>
    </div>
  </>;
}
