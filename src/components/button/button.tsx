import React, { MouseEventHandler, ReactNode } from 'react';
import styles from './scss/btn.module.scss';

export type ButtonProps = {
  size: 'xxs' | 'md' | 'sm' | 'xs' | 'circle' | 'circle-sm' | 'circle-lg' |'wide';
  style: 'full' | 'empty' | 'simple' | 'light' | 'like';
  type?: 'button' | 'submit' | 'reset',
  transform?: 'left' | 'right' | 'top' | 'bottom';
  group?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  role?: string;
  direction?: 'next' | 'prev';
  aria?: string;
  onClick?: MouseEventHandler;
  icon?: React.ReactNode;
  iconLocation?: 'left' | 'right';
}

export default function Button (props: ButtonProps) {
  const className = `${styles.btn} ${styles[`btn--${props.style}`]}
    ${styles[`btn--${props.size}`]}
    ${props.size.includes('circle') ? styles['btn--circle'] : ''} 
    ${props.className ? props.className : ''} 
    ${props.group ? styles['btn--group'] : ''}
    ${props.direction ? styles[`btn--${props.direction}`] : ''}
    ${props.transform ? styles[`btn--transform-${props.transform}`] : ''}
    ${!props.children && props.icon ? styles['btn--icon'] : ''}`;

  return (
    <button type={props.type ?? 'button'}
      className={className}
      data-role={props.role}
      data-direction={props.direction}
      aria-label={props.aria}
      onClick={props.onClick}
      disabled={props.disabled}>
      {props.iconLocation === 'left' && props.icon ? <span className={`${styles.btn__icon} ${styles['btn__icon--left']}`}>{props.icon}</span> : ''}
      <span>{props.children}</span>
      {props.iconLocation !== 'left' && props.icon ? <span className={`${styles.btn__icon} ${styles['btn__icon--right']}`}>{props.icon}</span> : ''}
    </button>
  );
}
