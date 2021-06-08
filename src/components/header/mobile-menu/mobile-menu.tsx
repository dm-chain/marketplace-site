import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from 'src/components/header/mobile-menu/scss/mobile-menu.module.scss';
import { isMobileDevice } from 'src/resources/ts/_functions';
// @ts-ignore
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import ButtonModal from 'src/components/button/button-modal';
import SignIn from 'src/components/modal/content/sign-in';
import ConnectWallet from 'src/components/modal/content/connect-wallet';
import ButtonLink from 'src/components/button/button-link';
import Person from 'src/components/person/person';

import { menuItems } from 'src/components/header/menu/menu';
import ModalContext from 'src/components/modal/modal-provider';
import { useSession } from 'next-auth/client';

import LogoutIcon from 'src/resources/img/logout.svg';
import Close from 'src/resources/img/close.svg';
import ConnectWalletModal from 'src/components/modal/content/connect-wallet-modal';
import { ConnectedStatus } from 'src/types/connect';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';

type TMobileMenuProps = {
  scrolled: boolean;
}

export default function MobileMenu({ scrolled }: TMobileMenuProps) {
  const { connectedStatus } = useContext(ExtratonContext);
  const { isShowMobileMenu, setIsShowMobileMenu, setProcessingModal, setScrollbarWidth } = useContext(ModalContext);
  const [session] = useSession();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // @ts-ignore
  const profile: TUser = session?.profile;

  useEffect(() => {
    let openMenu = () => {
      let body = document.body;

      if (!isMobileDevice()) {
        let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        body.classList.add('modal-open');
        setProcessingModal(true);
        body.style.paddingRight = scrollbarWidth + 'px';
        setScrollbarWidth(scrollbarWidth);
      }

      if (isMobileDevice()) {
        disableBodyScroll(menuRef.current);
      }

      setTimeout(() => {
        setIsOpenMenu(isShowMobileMenu);
      }, 200);
    };

    let closeMenu = () => {
      setIsOpenMenu(false);
      setProcessingModal(true);

      let body = document.body;

      if (isMobileDevice()) {
        enableBodyScroll(menuRef.current);
      }

      setTimeout(() => {
        setProcessingModal(false);
        body.classList.remove('modal-open');
        body.style.paddingRight = '';
      }, 200);
    };

    isShowMobileMenu ? openMenu() : closeMenu();
  }, [isShowMobileMenu]);

  return <div
    className={`${styles['mobile-wrapper']} ${isOpenMenu ? styles.show : ''}`}
    ref={menuRef}>
    <div className={styles['mobile-overlay']}
      onClick={() => setIsShowMobileMenu(false)}></div>
    <nav className={styles['mobile-menu']}>
      <button
        className={styles['mobile-menu__close']}
        type="button"
        onClick={() => setIsShowMobileMenu(false)}>
        <Close/>
      </button>
      <div className={`${styles['mobile-menu__header']} ${scrolled ? styles['mobile-menu__header--scrolled'] : ''}`}>
        {session && <>
          <div className={styles['mobile-menu__header-item']}>
            <Person person={profile}/>
          </div>
          <div className={styles['mobile-menu__header-item']}>
            <ButtonLink
              link={'#'}
              size={'xxs'}
              style={'simple'}
              icon={<LogoutIcon/>}
              iconLocation={'left'}>
            Logout
            </ButtonLink>
          </div>
        </>}
      </div>
      <div className={styles['mobile-menu__body']} id="mobile-menu-body">
        <ul className={styles['mobile-menu__list']}>
          {menuItems.map((item, key) => <li key={key} className={styles['mobile-menu__item']}>
            <a href={item.link} className={styles['mobile-menu__link']}>{item.title}</a>
          </li>)}
        </ul>
      </div>
      <div className={styles['mobile-menu__footer']}>
        <div className={styles['mobile-menu__btn-wrap']}>
          {!session && <ButtonModal
            className={styles.header__btn}
            size={'wide'}
            style={'full'}
            modalContent={<SignIn />}>Sign In</ButtonModal>}
          {session && connectedStatus !== ConnectedStatus.Connected && <ButtonModal
            className={styles.header__btn}
            size={'wide'}
            style={'full'}
            modalContent={<ConnectWalletModal/>}>Connect Wallet</ButtonModal>}
        </div>
      </div>
    </nav>
  </div>;
}
