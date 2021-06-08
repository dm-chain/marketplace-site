import React, { useContext, useState } from 'react';

import Button from 'src/components/button/button';
import ModalContext from '../modal-provider';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import { useSession } from 'next-auth/client';
import { notify } from 'src/utils/common';
import { ConnectedStatus } from 'src/types/connect';
import { requestApiJson } from 'src/utils/request';
import MoonLoader from 'react-spinners/MoonLoader';

import styles from 'src/components/modal/scss/modal.module.scss';

type ConnectWalletProps = {
  type: 'like' | 'notice' | 'default' | 'same' | 'connect' | 'wrong-wallet' | 'wrong-network';
}

export default function ConnectWallet({ type }: ConnectWalletProps) {
  const [session] = useSession();
  // @ts-ignore
  const profile: TUser = session?.profile;
  const { setIsShowModal } = useContext(ModalContext);
  const { address, publicKey, connectedStatus, setConnectedStatus, setProfileWalletAddress } = useContext(ExtratonContext);
  let [loading, setLoading] = useState(false);

  let text;

  switch (type) {
    case 'like':
      text = <>You should sign in and connect your wallet to like this artwork.</>;
      break;
    case 'notice':
      text = <>You should sign in and connect your wallet to sign messages and send transactions to buy items.</>;
      break;
    case 'connect':
      text = <>You are about to connect a wallet with an address: <b>{address}</b></>;
      break;
    case 'wrong-wallet':
      text = <>You are about to connect a wallet with an address: <b>{address}</b></>;
      break;
    case 'same':
      text = <>You are trying to connect the same wallet.</>;
      break;
    case 'wrong-network':
      text = <>Your Extraton wallet extension is connected to the wrong network.</>;
      break;
    case 'default':
      text = <>You should login to your Extraton wallet browser extension.
        If you don`t have one, you can install it from&nbsp;
        <a href="https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm" target="_blank" rel="noreferrer">
          Chrome Web Store
        </a>.
      </>;
  }

  const connectWallet = async () => {
    if (profile.slug) {
      const userData = {
        profileId: profile.id,
        slug: profile.slug,
        extraton: {
          walletAddress: address,
          walletPublicKey: publicKey
        }
      };

      setLoading(true);
      const tip3WalletRes = await requestApiJson('/api/wallets', 'POST', userData);

      if (tip3WalletRes.status === 200 || tip3WalletRes.status === 201) {
        const extratonWalletRes = await requestApiJson('/api/users?wallet=true', 'PUT', userData);

        if (extratonWalletRes.status === 200) {
          setConnectedStatus(ConnectedStatus.Connected);
          setProfileWalletAddress(address);
          setLoading(false);
          setIsShowModal(false);
          notify('Your wallet successfully connected!');
        }
      }
    }
  };

  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>
        {connectedStatus === ConnectedStatus.WrongWallet && 'Connect another Extraton wallet'}
        {connectedStatus !== ConnectedStatus.WrongWallet && 'Connect your wallet'}
      </div>
    </div>
    <div className={styles.modal__main}>
      <div className={styles['modal__main-content']}>
        {text}
      </div>
      {(type === 'connect' || type === 'same' || type === 'wrong-wallet') &&
      <div className={styles['modal__btn-row']}>
        <Button
          size={'md'}
          style={'full'}
          className={styles.modal__btn}
          disabled={type === 'same'}
          onClick={connectWallet}>
          Connect
        </Button>
        <Button
          size={'md'}
          style={'empty'}
          className={styles.modal__btn}
          onClick={() => setIsShowModal(false)}>
          Cancel
        </Button>
      </div>
      }
      {(type === 'connect' || type === 'wrong-wallet') && <div className={styles.modal__info}>
        We do not own your private keys and cannot access your funds without your confirmation.
      </div>}
    </div>
    {
      loading && <div className={styles.modal__loader}>
        <MoonLoader loading={loading} size={75} />
      </div>
    }
  </>;
}
