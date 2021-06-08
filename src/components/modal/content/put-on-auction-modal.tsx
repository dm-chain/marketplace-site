import React, { useContext, useEffect, useState } from 'react';

import MoonLoader from 'react-spinners/MoonLoader';
import Button from 'src/components/button/button';
import FormControl from 'src/components/forms/form-control/form-control';
import Select from 'src/components/select/select';
import BidInfo from 'src/components/bid-info/bid-info';
import { SERVICE_FEE } from 'src/config/offer';
import ModalContext from 'src/components/modal/modal-provider';

import { calculatePrice, checkWallet, formatPrice, notify, toUSD, validNumberField } from 'src/utils/common';
import { getOfferByItemId, getWallet, requestApiJson } from 'src/utils/request';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import { createLabels } from 'src/resources/content/create';
import styles from 'src/components/modal/scss/modal.module.scss';
import { ConnectedStatus } from 'src/types/connect';

import { offerFields, expirationDateOptions } from 'src/config/options';
import ContractsControllerWeb from 'src/blockchain/contracts/ContractsControllerWeb';
import GlobalContext from 'src/components/global-provider';

type AuctionModalProps = {
  item: INftItemExtended;
  setOfferState: React.Dispatch<React.SetStateAction<TOffer | null>>;
  profile: TUser;
  auctionState: TAuction | null;
  setAuctionState: React.Dispatch<React.SetStateAction<TAuction | null>>;
};

export default function PutOnAuctionModal({ item, profile, auctionState, setAuctionState }: AuctionModalProps) {
  const { rate } = useContext(GlobalContext);
  const { setIsShowModal } = useContext(ModalContext);
  const [loading, setLoading] = useState(false);
  const { client, connectedStatus } = useContext(ExtratonContext);

  const initialAuctionState = Object.keys(offerFields['auction']).reduce((acc, key) => {
    return { ...acc, [key]: offerFields['auction'][key].defaultValue };
  }, {});

  const initialErrors = Object.keys(offerFields['auction']).reduce((acc, key) => {
    return { ...acc, [key]: '' };
  }, {});

  const [formState, setFormState] = useState(initialAuctionState);
  const [errors, setErrors] = useState(initialErrors);

  const validForm = () => {
    let emptyOfferFields = Object.keys(formState).filter(
      key =>
        offerFields['auction'][key] &&
        offerFields['auction'][key].required &&
        (formState[key] === null || formState[key] === '')
    );

    emptyOfferFields.forEach(key => setErrors(errors => ({ ...errors, [key]: 'required' })));

    return !emptyOfferFields.length;
  };

  const setField = (name: string, value: string) => {
    setErrors(errors => ({ ...errors, [name]: '' }));
    setFormState({ ...formState, [name]: value });
  };

  const validAndUpdateField = (name: string, value: string) => validNumberField(value) && setField(name, value);

  async function submitAuction() {
    if (validForm()) {
      if (connectedStatus === ConnectedStatus.Connected && profile.id && client && item) {
        setLoading(true);
        const controller = client ? new ContractsControllerWeb(client) : null;
        const key = await client?.getPublicKey();
        const address = await client?.getAddress();
        const wallet = key ? await getWallet(key) : null;

        if (formState['startPrice'] && controller && key && address && wallet && checkWallet(wallet, item)) {
          try {
            const auctionContractAddress = await controller.putOnAuction(
              key,
              wallet.address,
              parseFloat(formState['startPrice']),
              item.id,
              address,
              Math.ceil(parseFloat(formState['duration']) / 1000)
            );

            if (auctionContractAddress) {
              // @ts-ignore
              await controller.addSellContractSubscriber(value => {
                if (value && value.auctionAddress && value.auctionAddress === auctionContractAddress.contractAddress) {
                  const auctionFields = {
                    owner: profile._id,
                    item: item._id,
                    startPrice: formState['startPrice'],
                    contractAddress: auctionContractAddress.contractAddress,
                    startTime: new Date(),
                    duration: parseFloat(formState['duration']),
                    endTime: new Date(Date.now() + parseFloat(formState['duration'])),
                  };

                  (async () => {
                    const reqAuction = await requestApiJson('/api/auctions', 'POST', auctionFields);

                    if (reqAuction.status === 201) {
                      const auction = await reqAuction.json();

                      const resUpdateItem = await requestApiJson('/api/items', 'PUT', {
                        id: item.id,
                        auction: auction._id,
                      });

                      if (resUpdateItem.status === 200) {
                        setIsShowModal(false);
                        setLoading(false);
                        setAuctionState(auction ?? []);
                      }
                    }
                  })();
                }
              });
            }
          } catch (err) {
            notify('Failed to put an item on auction. Please reload the page and try again.');
            setIsShowModal(false);
            setLoading(false);
          }
        } else {
          notify('Failed to put an item on auction. Please reload the page and try again.');
          setIsShowModal(false);
          setLoading(false);
        }
      }
    }
  }

  const totalPrice = formState['startPrice'] ? calculatePrice(Number(formState['startPrice'])) : null;

  return (
    <>
      <div className={styles.modal__header}>
        <div className={styles.modal__title}>Start auction</div>
      </div>
      <div className={styles.modal__main}>
        <div className={styles['modal__main-content']}>
          You are about to set your item <b>{item.name}</b> up an auction.
        </div>
        <div className={`${styles.modal__field} ${styles['modal__field--sm']}`}>
          <FormControl
            id={'startPrice'}
            name={'startPrice'}
            type={'text'}
            label={'Minimum Bid'}
            placeholder={createLabels.bid}
            value={formState['startPrice']}
            onChange={e => validAndUpdateField(e.target.name, e.target.value)}
            description={createLabels.bidDisclaimer}
            error={errors['startPrice']}
            suffix={'TON Crystals'}
          />
        </div>
        <div className={`${styles.modal__field} ${styles['modal__field--sm']}`}>
          <Select
            label={'Expiration Date'}
            id={'faq-options'}
            options={expirationDateOptions}
            size={'md'}
            onChange={(option: string) => setField('duration', option)}
            description={createLabels.auctionDisclaimer}
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
                : '...',
            },
          ]}
        />
        <Button size={'md'} style={'full'} className={styles.modal__btn} onClick={() => submitAuction()}>
          Start
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
