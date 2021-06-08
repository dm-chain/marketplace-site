import React, { useContext } from 'react';
import { signOut, useSession } from 'next-auth/client';

import UserContext from 'src/components/user-provider/user-provider';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import { stripAddress } from 'src/utils/common';

import ButtonModal from 'src/components/button/button-modal';
import SignIn from 'src/components/modal/content/sign-in';
import Dropdown from 'src/components/dropdown/dropdown';
import ButtonLink from 'src/components/button/button-link';
import { ConnectedStatus } from 'src/types/connect';

import styles from 'src/components/header/auth/scss/auth.module.scss';
import dropdownStyles from 'src/components/dropdown/scss/dropdown.module.scss';
// import Notification from 'src/resources/img/notik.svg';
import LogoutIcon from 'src/resources/img/logout.svg';
import ConnectWalletModal from 'src/components/modal/content/connect-wallet-modal';

export default function HeaderAuth() {
  const [session] = useSession();
  const { avatar, slug } = useContext(UserContext);
  const { address, connectedStatus } = useContext(ExtratonContext);

  // @ts-ignore
  const profile: TUser = session?.profile;
  let defaultAvatar, dropdownToggler;

  if (profile) {
    defaultAvatar = profile.image ? profile.image : profile.defaultImage;
    dropdownToggler = <button
      className={styles.auth__avatar}>
      {(avatar || defaultAvatar) && <img src={avatar ? avatar : defaultAvatar} alt=""/>}
    </button>;
  }

  return <>
    {
      (!profile || !profile.id) && <ButtonModal
        className={styles.header__btn}
        size={'sm'}
        style={'full'}
        modalContent={<SignIn />}>Sign In</ButtonModal>
    }
    {
      profile && profile.id && <div className={styles.auth}>
        {
          // show if wallet connected
          (connectedStatus === ConnectedStatus.Connected) && <div className={styles.auth__money}>
            { stripAddress(address) }
          </div>
        }
        {
          // show if wallet is not connected
          (connectedStatus !== ConnectedStatus.Connected) && <ButtonModal
            className={styles.auth__btn}
            size={'sm'}
            style={'full'}
            modalContent={<ConnectWalletModal/>}>Connect Wallet</ButtonModal>
        }
        <Dropdown
          align={'right'}
          type={'account'}
          toggler={dropdownToggler}
          className={styles.auth__dropdown}>
          <>
            <div className={dropdownStyles.dropdown__main}>
              <div className={dropdownStyles.dropdown__list}>
                <a
                  href={`/user/${slug ? slug : profile?.slug}`}
                  className={dropdownStyles['dropdown__list-item']}>
                  My Profile
                </a>
                <a
                  href={'/account'}
                  className={dropdownStyles['dropdown__list-item']}>
                  Settings
                </a>
              </div>
            </div>
            <div className={dropdownStyles.dropdown__footer}>
              <ButtonLink
                size={'xxs'}
                style={'simple'}
                icon={<LogoutIcon/>}
                iconLocation={'left'}
                onClick={() => signOut()}>
                Logout
              </ButtonLink>
            </div>
          </>
        </Dropdown>
        {/*
          Notification

          <Button
          size={'circle-sm'}
          style={'empty'}
          className={styles.auth__notifications}
          icon={<Notification/>}
          onClick={}/>
          */}
      </div>
    }
  </>;
}
