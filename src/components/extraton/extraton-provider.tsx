import React, { createContext, ReactNode, useEffect, useState } from 'react';
import ExtratonClient from 'src/blockchain/extraton/ExtratonClient';
import { useSession } from 'next-auth/client';
import { ConnectedStatus } from 'src/types/connect';

type TContextExtraton = {
  client: ExtratonClient | null;
  address: string;
  connectedStatus: ConnectedStatus;
  publicKey: string;
  setConnectedStatus: React.Dispatch<React.SetStateAction<ConnectedStatus>>;
  updateConnectedStatus: Function;
  profileWalletAddress: string;
  setProfileWalletAddress: React.Dispatch<React.SetStateAction<string>>;
};

const ExtratonContext = createContext<TContextExtraton>({
  client: null,
  address: '',
  connectedStatus: ConnectedStatus.Unavailable,
  publicKey: '',
  setConnectedStatus: () => false,
  updateConnectedStatus: () => null,
  profileWalletAddress: '',
  setProfileWalletAddress: () => '',
});

type ExtratonPropTypes = {
  children: ReactNode;
}

function ExtratonProvider({ children }: ExtratonPropTypes) {
  const [client, setClient] = useState<ExtratonClient | null>(null);
  const [publicKey, setPublicKey] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [profileWalletAddress, setProfileWalletAddress] = useState<string>('');
  const [isProperNetwork, setIsProperNetwork] = useState<boolean>(false);
  const [connectedStatus, setConnectedStatus] = useState<ConnectedStatus>(ConnectedStatus.Unavailable);

  const [session] = useSession();
  // @ts-ignore
  const profile: TUser = session?.profile;

  useEffect(() => {
    setClient(new ExtratonClient(window));
    setProfileWalletAddress(profile?.extraton?.walletAddress || '');
  }, []);

  const setWalletParameters = () => {
    if (client) {
      client.getAddress().then(address => setAddress(address ?? ''));
      client.getPublicKey().then(key => setPublicKey(key ?? ''));
      client.isProperNetwork().then(isProperNetwork => setIsProperNetwork(isProperNetwork));
    }
  };

  const updateConnectedStatus = () => {
    if (address && !isProperNetwork) {
      setConnectedStatus(ConnectedStatus.WrongNetwork);
    } else if (address && isProperNetwork && profileWalletAddress && address === profileWalletAddress) {
      setConnectedStatus(ConnectedStatus.Connected);
    } else if (address && isProperNetwork && profileWalletAddress && address !== profileWalletAddress) {
      setConnectedStatus(ConnectedStatus.WrongWallet);
    } else if (address && isProperNetwork) {
      setConnectedStatus(ConnectedStatus.Disconnected);
    } else {
      setConnectedStatus(ConnectedStatus.Unavailable);
    }
  };

  useEffect(() => {
    updateConnectedStatus();
  }, [address, isProperNetwork, publicKey]);

  useEffect(() => {
    if (client) {
      setWalletParameters();

      client.addEventListener(() => {
        setWalletParameters();
      });
    }
  }, [client]);

  useEffect(() => {
    // console.log(connectedStatus);
  }, [connectedStatus]);

  return (
    <ExtratonContext.Provider value={{ client, address, connectedStatus, publicKey, setConnectedStatus, updateConnectedStatus, profileWalletAddress, setProfileWalletAddress }}>
      {children}
    </ExtratonContext.Provider>
  );
}

export type { TContextExtraton };
export { ExtratonProvider, ExtratonContext };
