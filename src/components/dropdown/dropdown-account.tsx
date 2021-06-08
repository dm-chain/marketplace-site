import React from 'react';
import ButtonLink from '../button/button-link';

import styles from 'src/components/dropdown/scss/dropdown.module.scss';
import LogoutIcon from 'src/resources/img/logout.svg';

export default function DropdownAccount() {
  return <>
    <div className={styles.dropdown__header}>
      <div className={styles.dropdown__item}>
        Balance
      </div>
      <div className={`${styles.dropdown__item} ${styles['dropdown__item--balance']}`}>
        234 455.56 TON
      </div>
    </div>
    <div className={styles.dropdown__main}>
      <div className={styles.dropdown__list}>
        <a href={'/user/username'} className={styles['dropdown__list-item']}>
          My Profile
        </a>
        <a href={'/account'} className={styles['dropdown__list-item']}>
            Account Settings
        </a>
      </div>
    </div>
    <div className={styles.dropdown__footer}>
      <ButtonLink
        link={'#'}
        size={'xxs'}
        style={'simple'}
        icon={<LogoutIcon/>}
        iconLocation={'left'}>
        Logout
      </ButtonLink>
    </div>
  </>;
}
