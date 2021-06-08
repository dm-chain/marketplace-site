import React from 'react';
import styles from 'src/components/lightbox-image/scss/lightbox.module.scss';
import ZoomIcon from 'src/resources/img/zoom-out-2.svg';
// import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

type LightboxProps = {
  type: 'image' | 'video',
  src: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function Lightbox({type, src, onClick}: LightboxProps) {
  return <button type='button' className={styles.lightbox} onClick={onClick}>
    <div className={styles.lightbox__wrapper}>
      <div className={styles.lightbox__content}>
        {/*<TransformWrapper>*/}
        {/*  <TransformComponent>*/}
        {type === 'image' ? <img src={src}/> : ''}
        {/*</TransformComponent>*/}
        {/*</TransformWrapper>*/}
      </div>
      <div className={styles.lightbox__close}>
        <ZoomIcon/>
      </div>
    </div>
  </button>;
}
