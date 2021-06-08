import React, { ReactNode } from 'react';
import styles from './scss/block-footer.module.scss';

type BlockFooterProps = {
    children: ReactNode,
}

export default function BlockFooter({ children }: BlockFooterProps) {
  return (
    <div className={styles.block__footer} >
      {children}
    </div>
  );
}
