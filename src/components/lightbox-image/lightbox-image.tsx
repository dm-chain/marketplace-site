import React, { useEffect, useState } from 'react';
import Lightbox from 'src/components/lightbox-image/lightbox';
import ZoomIcon from 'src/resources/img/zoom-out.svg';
import styles from 'src/components/lightbox-image/scss/lightbox.module.scss';

type LightboxProps = {
    src: string;
}

export default function LightboxImage({ src }: LightboxProps) {
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let body = document.body;
    let header: HTMLElement | null = document.querySelector('header');
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      body.classList.add('lightbox-open');
      body.style.paddingRight = scrollbarWidth + 'px';
      if (header) {
        header.style.paddingRight = scrollbarWidth + 'px';
      }
    } else {
      body.classList.remove('lightbox-open');
      body.style.paddingRight = '';
      if (header) {
        header.style.paddingRight = '';
      }
    }

  }, [isOpen]);

  return (
    <>
      <button type='button' className={`image ${styles['lightbox-image']}`} onClick={() => setIsOpen(true)}>
        <img
          src={src}
          alt=""
        />
        <div className={styles['lightbox-zoom-btn']}>
          <ZoomIcon/>
        </div>
      </button>
      {isOpen && <Lightbox type={'image'} src={src} onClick={() => setIsOpen(false)}/>}
    </>
  );
}
