import React, { MouseEventHandler, ReactNode } from 'react';

import styles from './scss/btn.module.scss';

export type ButtonLinkProps = {
  link?: string;
  size: 'md' | 'sm' | 'xs' | 'circle-sm' | 'circle-md' | 'circle-lg' | 'wide' | string;
  style: 'full' | 'empty' | 'simple' | 'light';
  transform?: 'left' | 'right' | 'top' | 'bottom';
  group?: boolean;
  children?: ReactNode;
  className?: string;
  role?: string;
  direction?: 'next' | 'prev';
  aria?: string;
  onClick?: MouseEventHandler;
  icon?: React.ReactNode;
  iconLocation?: 'left' | 'right';
  target?: string ;
}

export default function ButtonLink(props: ButtonLinkProps) {
  const className = `${styles.btn} ${styles['btn--link']} ${styles[`btn--${props.style}`]}
    ${styles[`btn--${props.size}`]} 
    ${props.size.includes('circle') ? styles['btn--circle'] : ''} 
    ${props.className ? props.className : ''} 
    ${props.group ? styles['btn--group'] : ''}
    ${props.direction ? styles[`btn--${props.direction}`] : ''}
    ${props.transform ? styles[`btn--transform-${props.transform}`] : ''}
    ${!props.children && props.icon ? styles['btn--icon'] : ''}`;

  return (
    <a href={props.link}
      className={className}
      data-role={props.role}
      data-direction={props.direction}
      aria-label={props.aria}
      target={props.target}
      onClick={props.onClick} rel="noreferrer">
      {props.iconLocation === 'left' && props.icon ? <span className={`${styles.btn__icon} ${styles['btn__icon--left']}`}>{props.icon}</span> : ''}
      <span>{props.children}</span>
      {props.iconLocation !== 'left' && props.icon ? <span className={`${styles.btn__icon} ${styles['btn__icon--right']}`}>{props.icon}</span> : ''}
    </a>
  );
}
