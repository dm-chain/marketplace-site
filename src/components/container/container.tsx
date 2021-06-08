import React, { ReactNode } from 'react';
import styles from 'src/components/container/scss/container.module.scss';

type ContainerPropTypes = {
    children: ReactNode;
    mobWide?: boolean;
    mod?: 'sm' | 'flex';
    type?: 'divided'
}

export default function Container({ children, mobWide, mod, type }: ContainerPropTypes): JSX.Element {
  return <div className={`${styles.container} ${mod ? styles[`container--${mod}`] : ''} ${type ? styles[`container--${type}`] : ''} ${mobWide ? styles['container--mob-p-0'] : ''}`}>{children}</div>;
}
