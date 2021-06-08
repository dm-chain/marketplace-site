import React, { useContext, useEffect, useState } from 'react';

import Button from 'src/components/button/button';
import Person from 'src/components/person/person';
import FormControl from 'src/components/forms/form-control/form-control';
import BidInfo from 'src/components/bid-info/bid-info';

import styles from 'src/components/modal/scss/modal.module.scss';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import { calculateNextBid, checkWallet, notify, validNumberField } from 'src/utils/common';
import { SERVICE_FEE } from 'src/config/offer';
import { createLabels } from 'src/resources/content/create';
import ContractsControllerWeb from 'src/blockchain/contracts/ContractsControllerWeb';
import { getWallet, getAuction, requestApiJson } from 'src/utils/request';
import ModalContext from '../modal-provider';
import MoonLoader from 'react-spinners/MoonLoader';

type PlaceABidProps = {
  profile: TUser;
  item: INftItemExtended;
  auctionState: TAuction | null;
  setAuctionState: React.Dispatch<React.SetStateAction<TAuction | null>>;
}

export default function PlaceABid({ item, auctionState, setAuctionState, profile }: PlaceABidProps) {
  const [bid, setBid] = useState<string>(auctionState?.currentBid ? String(calculateNextBid(auctionState?.currentBid)) : String(auctionState?.startPrice));
  const [loading, setLoading] = useState(false);
  const { client, connectedStatus } = useContext(ExtratonContext);
  const { setIsShowModal } = useContext(ModalContext);
  const minimumBid = auctionState?.currentBid ? calculateNextBid(auctionState?.currentBid) : auctionState?.startPrice;
  const [error, setError] = useState('');
  const updateBid = (value: string) => validNumberField(value) && setBid(value);

  const validForm = () => {
    if (Number(bid) < Number(minimumBid)) {
      setError(`Bid cannot be less than minimum (${minimumBid} TON)`);
      return false;
    } else {
      return true;
    }
  };

  const submitBid = async () => {
    if (validForm()) {
      setLoading(true);
      const controller = client ? new ContractsControllerWeb(client) : null;
      const key = await client?.getPublicKey();
      const wallet = key ? await getWallet(key) : null;

      if (bid && controller && wallet && auctionState && auctionState.contractAddress) {
        const auction = auctionState._id ? await getAuction(auctionState._id) : null;
        setAuctionState(auction);

        if (auction && +new Date(auction.endTime) > Date.now()) {
          const minBid = auction.currentBid ?? auction.startPrice;

          if (Number(bid) >= Number(minBid)) {
            const placeBid = await controller.placeBid(wallet.address, parseFloat(bid), auction.contractAddress);

            if (placeBid) {
              const newBid = {
                sender: profile._id,
                item: item._id,
                value: bid,
                senderPubKey: key,
                dateCreated: new Date()
              };

              const resBid = await requestApiJson('/api/bids', 'POST', newBid);

              if (resBid.status === 201) {
                const bid = await resBid.json();
                const resAuctionUpdate = await requestApiJson('/api/auctions', 'PUT', { id: auctionState._id, bid: bid._id, currentBid: bid.value });

                if (resAuctionUpdate.status === 200) {
                  const auction = await resAuctionUpdate.json();
                  setAuctionState(auction);
                  setLoading(false);
                  setIsShowModal(false);
                  return;
                }
              }
            }
          }
        }
      }

      setLoading(false);
      setIsShowModal(false);
      notify('Failed to place bid. Please reload the page and try again.');
    }
  };

  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>Place a bid</div>
    </div>
    <div className={styles.modal__main}>
      <div className={`${styles['modal__main-content']} ${styles['modal__main-content--sm']}`}>
        You are about to place a bid for <b>{item.name}</b> by <Person person={item.authorProfile} size={'sm'}/>
      </div>
      <div className={`${styles.modal__field} ${styles['modal__field--sm']}`}>
        <FormControl
          id={'bid'}
          name={'bid'}
          type={'text'}
          label={'Your bid'}
          placeholder={'Enter bid'}
          value={bid}
          error={error}
          onChange={(e) => {updateBid(e.target.value); setError('');}}
          suffix={'TON Crystals'}/>
      </div>
    </div>
    <div className={styles.modal__footer}>
      <Button size={'md'} style={'full'} className={styles.modal__btn} onClick={() => submitBid()}>Place a bid</Button>
      <div className={styles.modal__description}>{createLabels.newtworkFee}</div>
    </div>
    {loading && <div className={styles.modal__loader}>
      <MoonLoader loading={loading} size={75}/>
    </div>}
  </>;
}
