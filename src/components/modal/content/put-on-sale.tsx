import React, { useContext, useState } from 'react';

import MoonLoader from 'react-spinners/MoonLoader';
import Button from 'src/components/button/button';
import FormControl from 'src/components/forms/form-control/form-control';
import BidInfo from 'src/components/bid-info/bid-info';
import { SERVICE_FEE } from 'src/config/offer';
import ModalContext from 'src/components/modal/modal-provider';

import { calculatePrice, formatPrice, notify, toUSD, validNumberField } from 'src/utils/common';
import { getOfferByItemId, putOnSale } from 'src/utils/request';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import { createLabels } from 'src/resources/content/create';

import styles from 'src/components/modal/scss/modal.module.scss';
import { ConnectedStatus } from 'src/types/connect';
import GlobalContext from 'src/components/global-provider';

type PutOnSaleProps = {
  item: INftItemExtended;
  setOfferState: React.Dispatch<React.SetStateAction<TOffer | null>>;
  profile: TUser;
};

export default function PutOnSale({ item, setOfferState, profile }: PutOnSaleProps) {
  const { rate } = useContext(GlobalContext);
  const { setIsShowModal } = useContext(ModalContext);
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { client, connectedStatus } = useContext(ExtratonContext);
  const updatePrice = (value: string) => validNumberField(value) && setPrice(value);

  async function localPutOnSale() {
    if (connectedStatus === ConnectedStatus.Connected && profile.id && client && item) {
      setLoading(true);
      const offerExist = await getOfferByItemId(item.id);

      if (!offerExist) {
        const res = await putOnSale(client, item, price);

        if (res && res.offer) {
          setOfferState(res.offer);
          setIsShowModal(false);
          setLoading(false);
          return;
        } else if (res.error) {
          // console.log(res.error);
        }
      }
    }

    // console.log(error ?? 'Failed to put an item on sale. Please reload the page and try again.');
    notify('Failed to put an item on sale. Please reload the page and try again.');
    setIsShowModal(false);
    setLoading(false);
  }

  const totalPrice = price ? calculatePrice(Number(price)) : null;

  return (
    <>
      <div className={styles.modal__header}>
        <div className={styles.modal__title}>Put on sale</div>
      </div>
      <div className={styles.modal__main}>
        <div className={styles['modal__main-content']}>
          You are about to put your item <b>{item.name}</b> up for sale.
        </div>
        <div className={`${styles.modal__field} ${styles['modal__field--sm']}`}>
          <FormControl
            id={'price'}
            name={'price'}
            type={'text'}
            label={'Price'}
            placeholder={'Enter price'}
            value={price}
            onChange={e => updatePrice(e.target.value)}
            suffix={'TON Crystals'}
            required={true}
          />
        </div>
      </div>
      <div className={styles.modal__footer}>
        <BidInfo
          list={[
            {
              leftCol: 'Service fee',
              rightCol: SERVICE_FEE + '%',
            },
            {
              leftCol: 'You will receive',
              rightCol: totalPrice
                ? <><b>{formatPrice(Number(totalPrice)) + ' TON'}</b>{rate && <span>{toUSD(rate, Number(totalPrice))}</span>}</>
                : '...'
            },
          ]}
        />
        <Button size={'md'} style={'full'} className={styles.modal__btn} onClick={() => localPutOnSale()}>
          Sell
        </Button>
        <div className={styles.modal__description}>{createLabels.newtworkFee}</div>
      </div>
      {loading && (
        <div className={styles.modal__loader}>
          <MoonLoader loading={loading} size={75} />
        </div>
      )}
    </>
  );
}
