import React, { useContext } from 'react';
import FormControl from 'src/components/forms/form-control/form-control';
import ButtonModal from 'src/components/button/button-modal';
import { ConnectedStatus } from 'src/types/connect';
import { ExtratonContext } from '../extraton/extraton-provider';
import ConnectWallet from '../modal/content/connect-wallet';

import styles from 'src/components/account/scss/settings.module.scss';

export default function Wallet() {
  const { address, connectedStatus, profileWalletAddress } = useContext(ExtratonContext);

  let modalContent;

  switch (connectedStatus) {
    case ConnectedStatus.WrongWallet:
      modalContent = <ConnectWallet type={'wrong-wallet'}/>;
      break;
    case ConnectedStatus.WrongNetwork:
      modalContent = <ConnectWallet type={'wrong-network'}/>;
      break;
    case ConnectedStatus.Disconnected:
      modalContent = <ConnectWallet type={'connect'}/>;
      break;
    default:
      modalContent = <ConnectWallet type={'same'}/>;
  }

  return  <div className={styles.settings}>
    <div className={styles.settings__title}>Wallet</div>
    <div className={styles.settings__block}>
      <div className={styles.settings__description}>
        {connectedStatus === ConnectedStatus.Unavailable && <>
          <div>Connect with one of available wallet providers or
            create a new wallet.</div>
          <a href={'https://extraton.io/'}>What is a wallet?</a>
        </>}
      </div>
      {connectedStatus !== ConnectedStatus.Unavailable && <>
        <div className={styles.settings__item}>
          <div className={styles['settings__wallet-field']}>
            <FormControl
              id={'wallet'}
              name={'wallet'}
              type={'text'}
              // className={styles['settings__wallet-input']}
              label={'Your Connected Wallet Address'}
              value={profileWalletAddress}
              disabled={true}/>
            {
              profileWalletAddress && profileWalletAddress !== address && <label className={styles['settings__wallet-error']}>Warning:
                the current Extraton address is different from the one you have connected to your account.</label>
            }
            {/*
             <Button
              size={'sm'}
              style={'simple'}
              icon={<CopyIcon/>}
              iconLocation={'left'}
              className={styles['settings__balance-input-btn']}>
            Copy
            </Button>
            */}
          </div>
        </div>
        <div className={styles.settings__item}>
          <ButtonModal
            size={'md'}
            style={'full'}
            modalContent={modalContent}
            className={styles.settings__btn}>
            Connect{profileWalletAddress && ' another'} wallet
          </ButtonModal>
        </div>
      </>}
    </div>
  </div>;
}
