import React, { useContext, useState } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

import Button from 'src/components/button/button';
import ContractsControllerWeb from 'src/blockchain/contracts/ContractsControllerWeb';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';

import styles from 'src/components/modal/scss/modal.module.scss';
import { getOffer, getWallet, requestApiJson } from 'src/utils/request';
import ModalContext from 'src/components/modal/modal-provider';
import { checkWallet, notify } from 'src/utils/common';
import { ConnectedStatus } from '../../../types/connect';

type PutOnSaleProps = {
  offerState: TOffer | null,
  item: INftItemExtended;
  setOfferState: React.Dispatch<React.SetStateAction<TOffer | null>>;
}

export default function CancelSale({ item, offerState, setOfferState }: PutOnSaleProps) {
  const { setIsShowModal } = useContext(ModalContext);
  const [loading, setLoading] = useState(false);
  const { client, connectedStatus } = useContext(ExtratonContext);


  async function cancelSale() {
    if (client && connectedStatus === ConnectedStatus.Connected && offerState && offerState._id) {
      setLoading(true);
      const controller = new ContractsControllerWeb(client);
      const offer = await getOffer(offerState._id);
      const publicKey = await client.getPublicKey();
      const wallet = publicKey ? await getWallet(publicKey) : null;

      if (controller && offer && offer.status === 'opened' && offerState.contractAddress && wallet && checkWallet(wallet, item)) {
        try {
          const cancelSell = await controller.cancelSell(offerState.contractAddress);

          if (cancelSell) {
            const reqUpdate = await requestApiJson('/api/items', 'PUT', { id: item.id, offer: null, cancel: true });
            const resUpdateOffer = await requestApiJson('/api/offers', 'PUT', { id: offerState._id, status: 'cancelled' });

            if (reqUpdate.status === 200 && resUpdateOffer.status == 200) {
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

    notify('Failed to cancel. Please reload the page and try again.');
    setLoading(false);
    setIsShowModal(false);
  }

  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>Cancel sale</div>
    </div>
    <div className={styles.modal__main}>
      <div className={styles['modal__main-content']}>
        Do you want to cancel the sale of <b>{item.name}</b>?
      </div>
      <div className={styles['modal__btn-row']}>
        <Button
          size={'md'}
          style={'full'}
          className={styles.modal__btn}
          onClick={() => cancelSale()}>
          Confirm
        </Button>
        <Button
          size={'md'}
          style={'empty'}
          className={styles.modal__btn}
          onClick={() => setIsShowModal(false)}>
          Close
        </Button>
      </div>
    </div>
    {
      loading && <div className={styles.modal__loader}>
        <MoonLoader loading={loading} size={75} />
      </div>
    }
  </>;
}
