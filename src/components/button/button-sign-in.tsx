import React, { MouseEventHandler, ReactNode } from 'react';
import styles from './scss/btn.module.scss';

export type ButtonLinkProps = {
  size: 'md' | 'sm' | 'xs' | 'wide';
  style: 'full' | 'empty' | 'simple' | 'light';
  children?: ReactNode;
  className?: string;
  role?: string;
  aria?: string;
  onClick?: MouseEventHandler;
  icon?: React.ReactNode;
}

export default function ButtonSignIn(props: ButtonLinkProps) {
  const className = `${styles.btn} ${styles[`btn--${props.style}`]} ${styles[`btn--${props.size}`]} ${styles['btn--sign-in']} ${props.className ? props.className : ''}`;

  return (
    <button
      className={className}
      data-role={props.role}
      aria-label={props.aria}
      onClick={props.onClick}>
      <span>{props.children}</span>
      <span className={`${styles.btn__icon} ${styles['btn__icon--sign-in']}`}>
        {props.icon}
      </span>
    </button>
  );
}
