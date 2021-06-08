import React, { useContext } from 'react';
import styles from 'src/components/token-info/scss/token-info.module.scss';
import Price from 'src/components/price/price';
import ButtonModal from 'src/components/button/button-modal';
import Button from 'src/components/button/button';
import Timer from 'src/components/timer/timer';
import PlaceABid from 'src/components/modal/content/place-a-bid';
import BuyNow from 'src/components/modal/content/buy-now';
import { SERVICE_FEE } from 'src/config/offer';
import { calculatePrice, calculateNextBid } from 'src/utils/common';
import CancelSale from 'src/components/modal/content/cancel-sale';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import ConnectWallet from 'src/components/modal/content/connect-wallet';
import { ConnectedStatus } from 'src/types/connect';
import PutOnSale from 'src/components/modal/content/put-on-sale';
import PutOnAuctionModal from 'src/components/modal/content/put-on-auction-modal';

type TokenInfoProps = {
  item: INftItemExtended;
  offerState: TOffer | null;
  profile: TUser;
  auctionState: TAuction | null;
  setAuctionState: React.Dispatch<React.SetStateAction<TAuction | null>>;
  setOfferState: React.Dispatch<React.SetStateAction<TOffer | null>>;
  setOwnerProfile: React.Dispatch<React.SetStateAction<TUser>>;
  finishAuction: Function;
  bids: Array<TBid> | [];
};

export default function TokenInfo({
  item,
  auctionState,
  setAuctionState,
  offerState,
  setOfferState,
  profile,
  setOwnerProfile,
  bids,
  finishAuction,
}: TokenInfoProps) {
  const { connectedStatus } = useContext(ExtratonContext);
  const currentBid = bids?.length ? bids[bids.length - 1] : null;

  const modalContentBuyNow = <BuyNow item={item} setOwnerProfile={setOwnerProfile} setOfferState={setOfferState} />;

  const modalContentBid = (
    <PlaceABid profile={profile} auctionState={auctionState} setAuctionState={setAuctionState} item={item} />
  );

  const modalCancelSale = <CancelSale item={item} setOfferState={setOfferState} offerState={offerState} />;

  const modalPutOnSale = <PutOnSale item={item} setOfferState={setOfferState} profile={profile} />;

  const modalAuction = (
    <PutOnAuctionModal
      auctionState={auctionState}
      setAuctionState={setAuctionState}
      item={item}
      setOfferState={setOfferState}
      profile={profile}
    />
  );

  return (
    <div className={styles['token-info']}>
      <h1 className={styles['token-info__title']}>{item.name}</h1>
      <div className={styles['token-info__description']}>{item.description}</div>
      {!auctionState && !offerState && item.owner === profile?.id && (
        <div className={`${styles['token-info__buttons']} ${styles['token-info__buttons--col']}`}>
          <ButtonModal
            size={'md'}
            style={'full'}
            className={`${styles['token-info__buttons-item']} ${styles['token-info__buttons-item--col']}`}
            modalContent={
              connectedStatus === ConnectedStatus.Connected ? modalPutOnSale : <ConnectWallet type={'notice'} />
            }
          >
            Put on Sale
          </ButtonModal>
          <ButtonModal
            size={'md'}
            style={'empty'}
            className={`${styles['token-info__buttons-item']} ${styles['token-info__buttons-item--col']}`}
            modalContent={
              connectedStatus === ConnectedStatus.Connected ? modalAuction : <ConnectWallet type={'notice'} />
            }
          >
            Start auction
          </ButtonModal>
        </div>
      )}

      {auctionState && (
        <>
          <Timer endTime={auctionState.endTime} finishAuction={finishAuction} />
          <Price
            price={auctionState.currentBid ?? auctionState.startPrice}
            type={'auction'}
            user={currentBid?.sender}
            bids={!!bids?.length}
          />
          {auctionState.currentBid && <Price price={calculateNextBid(auctionState.currentBid)} type={'auction'} />}
          {item.owner !== profile?.id && (
            <div className={styles['token-info__buttons']}>
              <ButtonModal
                size={'wide'}
                style={'full'}
                modalContent={
                  connectedStatus === ConnectedStatus.Connected ? modalContentBid : <ConnectWallet type={'notice'} />
                }
              >
                Place a Bid
              </ButtonModal>
            </div>
          )}
        </>
      )}

      {offerState && (
        <>
          <Price price={offerState.price} />
          {item.offer && (
            <div className={styles['token-info__buttons']}>
              {offerState.owner === profile?.id && (
                <div className={styles['token-info__buttons-item']}>
                  <ButtonModal
                    size={'wide'}
                    style={'empty'}
                    modalContent={
                      connectedStatus === ConnectedStatus.Connected ? (
                        modalCancelSale
                      ) : (
                        <ConnectWallet type={'notice'} />
                      )
                    }
                  >
                    Cancel Sale
                  </ButtonModal>
                </div>
              )}
              {offerState.owner !== profile?.id && (
                <div className={styles['token-info__buttons-item']}>
                  <ButtonModal
                    size={'wide'}
                    style={'full'}
                    modalContent={
                      profile && connectedStatus === ConnectedStatus.Connected ? (
                        modalContentBuyNow
                      ) : (
                        <ConnectWallet type={'notice'} />
                      )
                    }
                  >
                    Buy Now
                  </ButtonModal>
                </div>
              )}
            </div>
          )}
          {/*{offer.owner !== profile?.id && <div className={styles['token-info__conditions']}>*/}
          {/*  Service fee {SERVICE_FEE}%.*/}
          {/*  1000 TON (~$2,566.08)*/}
          {/*</div>}*/}
        </>
      )}
    </div>
  );
}
