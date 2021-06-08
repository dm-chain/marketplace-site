import React, { useContext, useState } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import Button from 'src/components/button/button';
import Person from 'src/components/person/person';
import BidInfo from 'src/components/bid-info/bid-info';
import { useSession } from 'next-auth/client';

import styles from 'src/components/modal/scss/modal.module.scss';
import { formatPrice, notify, toUSD } from 'src/utils/common';
import ContractsControllerWeb from 'src/blockchain/contracts/ContractsControllerWeb';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import ModalContext from 'src/components/modal/modal-provider';
import { getOffer, getWallet, requestApiJson } from 'src/utils/request';
import { ConnectedStatus } from 'src/types/connect';
import GlobalContext from 'src/components/global-provider';

type BuyNowProps = {
  item: INftItemExtended;
  setOwnerProfile: React.Dispatch<React.SetStateAction<TUser>>;
  setOfferState: React.Dispatch<React.SetStateAction<TOffer | null>>;
}

export default function BuyNow({ item, setOwnerProfile, setOfferState }: BuyNowProps) {
  const { rate } = useContext(GlobalContext);
  const { client, connectedStatus } = useContext(ExtratonContext);
  const { setIsShowModal } = useContext(ModalContext);
  let [loading, setLoading] = useState(false);
  // @ts-ignore
  const isLowBalance = false;
  const [session] = useSession();
  // @ts-ignore
  const profile: TUser = session?.profile;

  async function buyToken() {
    if (connectedStatus === ConnectedStatus.Connected && client) {
      setLoading(true);

      const controller = new ContractsControllerWeb(client);
      const publicKey = await client.getPublicKey();
      const wallet = publicKey ? await getWallet(publicKey) : null;

      if (controller && wallet && wallet.address && item?.offerDetails?._id && item?.offerDetails?.contractAddress) {
        const offer = await getOffer(item?.offerDetails?._id);

        if (offer && offer.status === 'opened') {
          try {
            const buyTransaction = await controller.buyToken(wallet.address, parseFloat(String(item.offerDetails.price)), item.offerDetails.contractAddress);

            if (buyTransaction) {
              const tokenInfo = {
                id: item.id,
                owner: profile.id,
                wallet: wallet._id
              };

              const resUpdateNft = await requestApiJson('/api/items', 'PUT', tokenInfo);
              const resUpdateOffer = await requestApiJson('/api/offers', 'PUT', { id: item.offer, status: 'closed' });

              if (resUpdateNft.status === 200 && resUpdateOffer.status === 200) {
                setOwnerProfile(profile);
                setOfferState(null);
                setLoading(false);
                setIsShowModal(false);
                return;
              }
            }
          } catch (error) {
            // console.log(error.text);
          }
        }
      }
    }

    setLoading(false);
    setIsShowModal(false);
    notify('Failed to buy. Please reload the page and try again.');
  }

  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>Buy now</div>
    </div>
    <div className={styles.modal__main}>
      <div className={`${styles['modal__main-content']} ${styles['modal__main-content--sm']}`}>
        You are about to purchase <b>{item.name}</b> from <Person person={item.ownerProfile} size={'sm'}/>
      </div>
      {/*{item?.offerDetails?.price && rate && <BidInfo list={[*/}
      {/*  {*/}
      {/*    leftCol: formatPrice(item.offerDetails.price) + ' TON',*/}
      {/*    rightCol: `{toUSD(rate, item.offerDetails.price)}`,*/}
      {/*  }*/}
      {/*]} reverse={true}/>}*/}
    </div>
    <div className={styles.modal__footer}>
      {item?.offerDetails?.price && <BidInfo list={[
        // {
        //   leftCol: 'Your balance',
        //   rightCol: formatPrice(balance) + ' TON'
        // },
        {
          leftCol: 'You will pay',
          rightCol: <><b>{formatPrice(item.offerDetails.price) + ' TON'}</b>{rate && <span>{toUSD(rate, item.offerDetails.price)}</span>}</>
        }
      ]} error={isLowBalance ? 'Not enough funds' : ''}/>}

      {isLowBalance ?
        <>
          {/*<Button size={'md'} style={'full'} className={styles.modal__btn} disabled>Buy</Button>*/}
          {/*<Button size={'md'} style={'empty'} className={styles.modal__btn}>Add Funds</Button>*/}
        </>
        :
        <Button
          size={'md'}
          style={'full'}
          className={styles.modal__btn}
          onClick={() => buyToken()}>
          Buy
        </Button>
      }
    </div>
    {
      loading && <div className={styles.modal__loader}>
        <MoonLoader loading={loading} size={75} />
      </div>
    }
  </>;
}
