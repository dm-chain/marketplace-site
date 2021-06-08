import React, { useContext } from 'react';
import styles from 'src/components/main-screen/scss/main-screen.module.scss';
import Container from 'src/components/container/container';
import GlobalContext from 'src/components/global-provider';

type MainScreenInnerProps = {
  title?: string;
  description?: string;
  bg?: 'light' | 'brand' | 'main';
  paddings?: 'sm' | 'base';
  containerSize?: 'sm'
}

export default function MainScreenInner(props : MainScreenInnerProps) {
  const { topline } = useContext(GlobalContext);
  
  return (<div
    className={`${styles.main} ${styles[`main--${props.bg ?? 'light'}`]} ${topline ? styles['main--topline'] : ''}`}>
    <Container mod={props.containerSize}>
      <div className={`${styles.main__wrap} ${styles['main__wrap--inner']} ${props.paddings ? styles[`main__wrap--${props.paddings}`] : ''}`}>
        {props.title ? <h1 className={`${styles.main__title} ${styles['main__title--inner']}`}>{props.title}</h1> : ''}
        {props.description ? <div className={`${styles.main__description} ${styles['main__description--inner']}`}>{props.description}</div> : ''}
      </div>
    </Container>
  </div>);
}
