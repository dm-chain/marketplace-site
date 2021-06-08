import React, { useContext } from 'react';
import { ConnectedStatus } from 'src/types/connect';
import ConnectWallet from 'src/components/modal/content/connect-wallet';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';

type ConnectWalletModalProps = {
  type?: 'notice' | 'like'
}

export default function ConnectWalletModal({ type }: ConnectWalletModalProps) {
  const { connectedStatus } = useContext(ExtratonContext);

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
      modalContent = <ConnectWallet type={type ?? 'default'}/>;
  }

  return modalContent;
}
