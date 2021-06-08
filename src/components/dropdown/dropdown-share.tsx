import React from 'react';
import Share from 'src/components/share/share';
import Dropdown from './dropdown';
import Button from '../button/button';

import styles from 'src/components/dropdown/scss/dropdown.module.scss';
import ShareIcon from 'src/resources/img/share.svg';

type TDropdownShare = {
  className?: string;
  align: 'left' | 'right';
}

export default function DropdownShare({ className, align }: TDropdownShare) {
  const shareBtn = <Button
    size={'sm'}
    style={'empty'}
    icon={<ShareIcon/>}/>;

  return <Dropdown
    type={'share'}
    toggler={shareBtn}
    className={className}
    align={align}>
    <>
      <div className={styles.dropdown__header}>
        <div className={`${styles.dropdown__item} ${styles['dropdown__item--light']}`}>
        Share
        </div>
      </div>
      <div className={`${styles.dropdown__main} ${styles['dropdown__main--share']}`}>
        <Share size={'sm'} />
      </div>
    </>
  </Dropdown>;
}
