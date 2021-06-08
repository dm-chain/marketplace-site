import React, { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import ModalContext from 'src/components/modal/modal-provider';

import styles from 'src/components/header/scss/header.module.scss';
import Menu from 'src/components/header/menu/menu';
import Search from 'src/components/header/search/search';
import HeaderAuth from 'src/components/header/auth/auth';
import MobileMenu from './mobile-menu/mobile-menu';

import Logo from 'src/resources/img/logo.svg';
import TopLine from 'src/components/header/topline/topline';
import GlobalContext from 'src/components/global-provider';
import TopLoader from '../filter/top-loader';

type HeaderProps = {
    bg: 'light' | 'brand';
    isMainPage: boolean;
}

export default function Header({ bg, isMainPage }: HeaderProps) {
  const { topline, windowSize } = useContext(GlobalContext);
  const [scrolled, setScrolled] = useState(false);
  const headerFixedPaddingTop = windowSize > 768 ? 14 : 6;

  const headerRow = useRef<HTMLDivElement>(null);
  const { isShowMobileMenu, setIsShowMobileMenu, processingModal, scrollbarWidth } = useContext(ModalContext);
  let inlineStyles: object = {};

  const handleScroll = () => {
    if (headerRow.current) {
      // const HEADER_PADDING = parseInt(window.getComputedStyle(headerRow.current as Element).getPropertyValue('padding-top'), 10) - headerFixedPaddingTop;

      setScrolled(window.pageYOffset > 0);
    }
  };

  inlineStyles = processingModal ? { right: `${scrollbarWidth}px` } : {};

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, handleScroll]);

  return (
    <>
      <header className={`${styles.header} ${styles[`header--${bg}`]} ${scrolled ? styles['header--scrolled'] : ''}  ${topline && scrolled ? styles['header--gap'] : ''}`}
        style={inlineStyles}>
        {topline && <TopLine scrolled={scrolled} windowSize={windowSize}/>}
        <div className={styles.header__row} ref={headerRow}>
          {isMainPage
            ? <div className={`${styles.logo} ${!isMainPage ? styles['logo--link'] : ''}`}>
              <Logo/>
            </div>
            : <Link href={'/'}>
              <div className={`${styles.logo} ${!isMainPage ? styles['logo--link'] : ''}`}>
                <Logo/>
              </div>
            </Link>
          }
          <div className={styles.header__search}>
            <Search/>
          </div>
          <div className={styles.header__menu}>
            <Menu/>
          </div>
          <div className={styles.header__auth}>
            <HeaderAuth  />
          </div>
          <div className={styles.header__burger}>
            <button
              className={`${styles['mobile-btn']} ${isShowMobileMenu ? styles['mobile-btn--close'] : ''}`}
              type="button"
              id="mobileOpen"
              aria-label="open-mobile-menu"
              onClick={() => setIsShowMobileMenu(!isShowMobileMenu)}>
              <>
                <span className={`${styles['mobile-btn__bar']} ${styles[`mobile-btn__bar--${bg}`]}`}></span>
                <span className={`${styles['mobile-btn__bar']} ${styles[`mobile-btn__bar--${bg}`]}`}></span>
                <span className={`${styles['mobile-btn__bar']} ${styles[`mobile-btn__bar--${bg}`]}`}></span>
              </>
            </button>
          </div>
        </div>
        <TopLoader/>
      </header>
      <MobileMenu scrolled={scrolled}/>
    </>);
}
