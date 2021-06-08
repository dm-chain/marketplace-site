import React, { useContext, useState } from 'react';

import Button from 'src/components/button/button';
import Toggler from 'src/components/forms/toggler/toggler';
import FormControl from 'src/components/forms/form-control/form-control';
import RadioGroup from 'src/components/forms/radio/radio-group';
import Select from 'src/components/select/select';
import Preview from 'src/components/create/preview';
import FileInput from 'src/components/file-input/file-input';
import RadioCollection from 'src/components/create/radio-collection';

import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import { SERVICE_FEE } from 'src/config/offer';
import styles from 'src/components/create/scss/create.module.scss';
import { formatPrice, validNumberField, calculatePrice, toUSD } from 'src/utils/common';
import { createLabels } from 'src/resources/content/create';
import { offerTypes, expirationDateOptions } from 'src/config/options';
import GlobalContext from 'src/components/global-provider';

type CreateFormProps = {
  itemState: object;
  itemErrors: object;
  file: TFile;
  setFile: React.Dispatch<React.SetStateAction<TFile>>;
  setField: Function;
  createToken: Function;
  offerState: object;
  setOfferField: Function;
  offerErrors: object;
  profile: TUser;
  collections: ICollectionItem[];
  collectionId: string | null;
  setCollectionId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function CreateForm(props: CreateFormProps) {
  const { connectedStatus } = useContext(ExtratonContext);
  const { rate } = useContext(GlobalContext);
  const validAndUpdateField = (name: string, value: string) => validNumberField(value) && props.setOfferField(name, value);
  const totalPrice = props.offerState['price'] ? calculatePrice(Number(props.offerState['price'])) : null;

  return <div className={styles.create}>
    <h1 className={styles.create__title}>{createLabels.title}</h1>
    {connectedStatus !== 'Connected' && <p>{createLabels.disclaimer}</p>}
    <div className={styles.create__item}>
      <FileInput
        label={'Upload file'}
        type={'token'}
        file={props.file}
        setFile={props.setFile}
        error={props.itemErrors['image']}
      />
    </div>
    <div className={styles.create__item}>
      <Toggler
        name={'Put_on_marketplace'}
        id={'Put_on_marketplace'}
        title={createLabels.put}
        checked={props.offerState['isOffer']}
        onChange={(e) => props.setOfferField('isOffer', e.target.checked)}
      />
    </div>
    <div className={styles.create__item}>
      <RadioGroup
        name={'period'}
        id={'period'}
        items={offerTypes}
        onChange={(e) => props.setOfferField('type', e.target.value === 'on' ? e.target.id : '')}
        description={'Set a period of time for which buyers can place bids'}
        disabled={!props.offerState['isOffer']}
      />
    </div>
    {props.offerState['type'] === 'fixed'
      ? <div className={styles.create__item}>
        <FormControl
          id={'price'}
          name={'price'}
          type={'text'}
          label={'Price '}
          error={props.offerErrors['price']}
          value={props.offerState['price']}
          placeholder={'Enter price for one piece'}
          onChange={(e) => validAndUpdateField(e.target.name, e.target.value)}
          description={totalPrice && <>
            <div>{createLabels.fee} <b>{SERVICE_FEE}%</b></div>
            <div>{createLabels.recieve} <b>{formatPrice(Number(totalPrice))} TON</b> {rate && toUSD(rate, Number(totalPrice))} </div>
          </>
          }
          suffix={'TON Crystals'}
          disabled={!props.offerState['isOffer']}/>
      </div>
      : <>
        <div className={styles.create__item}>
          <FormControl
            id={'startPrice'}
            name={'startPrice'}
            type={'text'}
            label={'Minimum Bid'}
            placeholder={createLabels.bid}
            error={props.offerErrors['startPrice']}
            value={props.offerState['startPrice']}
            onChange={(e) => validAndUpdateField(e.target.name, e.target.value)}
            description={createLabels.bidDisclaimer}
            suffix={'TON Crystals'}
            disabled={!props.offerState['isOffer']}/>
        </div>
        <div className={styles.create__item}>
          <Select
            label={'Expiration Date'}
            id={'faq-options'}
            options={expirationDateOptions}
            size={'md'}
            onChange={(option: string) => props.setOfferField('duration', option)}
            description={createLabels.auctionDisclaimer}
            disabled={!props.offerState['isOffer']}/>
        </div>
      </>
    }
    <div className={styles.create__item}>
      <div className={styles.create__label}>
        Choose collection
      </div>
      <RadioCollection
        profile={props.profile}
        collections={props.collections}
        setCollectionId={props.setCollectionId}
        collectionId={props.collectionId}/>
    </div>
    <div className={styles.create__item}>
      <FormControl
        id={'title'}
        name={'name'}
        type={'text'}
        label={'Title'}
        onChange={(e) => props.setField(e.target.name, e.target.value)}
        placeholder={createLabels.exampleTitle}
        defaultValue={props.itemState['name']}
        error={props.itemErrors['name']}
        required={true}/>
    </div>
    <div className={styles.create__item}>
      <FormControl
        id={'description'}
        name={'description'}
        type={'textarea'}
        label={'Description'}
        defaultValue={props.itemState['description']}
        error={props.itemErrors['description']}
        onChange={(e) => props.setField(e.target.name, e.target.value)}
        placeholder={createLabels.exampleDesc}
        description={createLabels.descDisclaimer}
        required={false}
      />
    </div>
    <div className={`${styles.create__item} ${styles['create__item--preview']}`}>
      <Preview
        offerState={props.offerState}
        file={props.file}
        itemState={props.itemState}/>
    </div>
    <div className={styles.create__item}>
      <Button
        size={'wide'}
        style={'full'}
        disabled={connectedStatus !== 'Connected'}
        onClick={() => props.createToken()}
      >Create Item</Button>
    </div>
    <p className={styles.create__disclaimer}>
      {connectedStatus !== 'Connected' ? createLabels.disclaimer : props.offerState['isOffer'] && createLabels.newtworkFee}
    </p>
  </div>;
}
