import React, { useContext, useEffect, useState } from 'react';
import CreateForm from 'src/components/create/create-form';
import Preview from 'src/components/create/preview';
import BlockDivided from 'src/components/block/block-divided';
import MoonLoader from 'react-spinners/MoonLoader';
import { siteUrl } from 'src/config/auth';
import { getWallet, putOnSale, requestApiJson } from 'src/utils/request';

import styles from 'src/components/create/scss/create.module.scss';
import { getFileType, notify } from 'src/utils/common';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';
import GlobalContext from 'src/components/global-provider';
import { ConnectedStatus } from 'src/types/connect';
import { itemFields, offerFields, allOfferFields } from 'src/config/options';
import ContractsControllerWeb from '../../blockchain/contracts/ContractsControllerWeb';

type CreateProps = {
  profile: TUser;
  collections: ICollectionItem[];
}

export default function Create({ profile, collections }: CreateProps) {
  const [loading, setLoading] = useState(false);
  const { client, connectedStatus } = useContext(ExtratonContext);
  const { topline } = useContext(GlobalContext);

  const initialItemFields = Object.keys(itemFields).reduce((acc, key) => {
    return { ...acc, [key]: itemFields[key].defaultValue };
  }, {});

  const initialItemErrors = Object.keys(itemFields).reduce((acc, key) => {
    return { ...acc, [key]: '' };
  }, {});

  const initialOffer = Object.keys(allOfferFields).reduce((acc, key) => {
    return { ...acc, [key]: allOfferFields[key].defaultValue };
  }, {});

  const initialOfferErrors = Object.keys(allOfferFields).reduce((acc, key) => {
    return { ...acc, [key]: '' };
  }, {});

  const [itemState, setItemState] = useState(initialItemFields);
  const [itemErrors, seItemErrors] = useState(initialItemErrors);
  const [offerState, setOfferState] = useState(initialOffer);
  const [offerErrors, setOfferErrors] = useState(initialOfferErrors);
  const [collectionId, setCollectionId] = useState<string | null>(collections.length ? collections[0]._id : null);

  const [file, setFile] = useState<TFile>({
    src: '',
    data: null
  });

  const setField = (name: string, value: string | File | null) => {
    seItemErrors(itemErrors => ({ ...itemErrors, [name]: '' }));
    setItemState({ ...itemState, [name]: value });
  };

  const setOfferField = (name: string, value: string | boolean) => {
    name === 'isOffer'
      ? setOfferErrors(initialOfferErrors)
      : setOfferErrors(offerErrors => ({ ...offerErrors, [name]: '' }));
    setOfferState({ ...offerState, [name]: value });
  };

  const validForm = () => {
    let emptyItemFields = Object.keys(itemState)
      .filter((key) => (itemFields[key].required && (itemState[key] === null || itemState[key] === '')));

    let emptyOfferFields = Object.keys(offerState)
      .filter((key) => (offerState['isOffer'] && offerFields[offerState['type']][key] && offerFields[offerState['type']][key].required && (offerState[key] === null || offerState[key] === '')));

    emptyItemFields.forEach((key) => seItemErrors(itemErrors => ({ ...itemErrors, [key]: 'required' })));
    emptyOfferFields.forEach((key) => setOfferErrors(offerErrors => ({ ...offerErrors, [key]: 'required' })));

    return !(emptyItemFields.length || emptyOfferFields.length);
  };

  const createToken = () => {
    if (validForm()) {
      (async () => {
        if (client && connectedStatus === ConnectedStatus.Connected) {
          const formData = new FormData();
          // @ts-ignore
          formData.append('file', itemState.image);
          setLoading(true);

          const res = await fetch(`${siteUrl}/api/upload/?id=${profile.id}&type=nft`,{
            method: 'POST',
            body: formData
          });

          if (res.status === 201) {
            const data = await res.json();
            const url = data.image;
            // @ts-ignore
            const { name, description } = itemState;

            const token: TNftPrototype = {
              author: profile.id,
              authorName: profile.name,
              owner: profile.id,
              name,
              description,
              url,
              type: getFileType(url),
              collectionId: collectionId
            };

            const publicKey = await client.getPublicKey();
            const resNft = await requestApiJson('/api/items', 'POST', { ...token, publicKey });

            if (resNft.status === 201) {
              const nftItem = await resNft.json();

              if (!offerState['isOffer']) {
                location.href = siteUrl + '/item/' + nftItem.id;
              } else {
                const wallet = publicKey ? await getWallet(publicKey) : null;

                if (wallet && nftItem.owner) {
                  if (offerState['type'] === 'fixed' && offerState['price']) {
                    const offer = await putOnSale(client, nftItem, offerState['price']);

                    if (offer) {
                      setLoading(false);
                      location.href = siteUrl + '/item/' + nftItem.id;
                      return;
                    } else {
                      notify('Failed to put an item for sale.');
                    }
                  }

                  const controller = client ? new ContractsControllerWeb(client) : null;
                  if (offerState['type'] === 'auction' && offerState['startPrice'] && offerState['duration'] && publicKey && controller) {
                    const auctionContractAddress = await controller.putOnAuction(publicKey, wallet.address, parseFloat(offerState['startPrice']), nftItem.id, wallet.address, Math.ceil(parseFloat(offerState['duration']) / 1000));

                    if (auctionContractAddress) {
                      // @ts-ignore
                      await controller.addSellContractSubscriber((value) => {
                        if (value && value.auctionAddress && value.auctionAddress === auctionContractAddress.contractAddress) {
                          const auctionFields = {
                            owner: profile._id,
                            item: nftItem._id,
                            startPrice: offerState['startPrice'],
                            contractAddress: auctionContractAddress.contractAddress,
                            startTime: new Date(),
                            duration: parseFloat(offerState['duration']),
                            endTime: new Date(Date.now() + parseFloat(offerState['duration'])),
                          };

                          (async () => {
                            const reqAuction = await requestApiJson('/api/auctions', 'POST', auctionFields);

                            if (reqAuction.status === 201) {
                              const auction = await reqAuction.json();

                              const resUpdateItem = await requestApiJson('/api/items', 'PUT', {
                                id: nftItem.id,
                                auction: auction._id,
                              });

                              if (resUpdateItem.status === 200) {
                                setLoading(false);
                                location.href = siteUrl + '/item/' + nftItem.id;
                                return;
                              } else {
                                notify('Failed to put an item for sale.');
                              }
                            }
                          })();
                        }
                      });
                    }
                  }
                }
              }
            } else {
              setLoading(false);
              notify('Error');
            }
          } else {
            setLoading(false);
            notify('Error');
          }
        } else {
          setLoading(false);
          notify('Wallet is not connected.');
        }
      })();
    }
  };

  useEffect(() => {
    setField('image', file.data);
  }, [file]);


  return <>
    <BlockDivided
      modifier={topline ? 'topline' : 'first'}
      bg={'light'}
      contentLeft={
        <CreateForm
          profile={profile}
          collections={collections}
          file={file}
          setFile={setFile}
          itemState={itemState}
          offerState={offerState}
          setOfferField={setOfferField}
          itemErrors={itemErrors}
          offerErrors={offerErrors}
          setField={setField}
          createToken={createToken}
          collectionId={collectionId}
          setCollectionId={setCollectionId}
        />
      }
      contentRight={
        <Preview
          offerState={offerState}
          file={file}
          itemState={itemState}/>
      }/>
    {loading && <div className={styles.create__loader}>
      <MoonLoader loading={loading} size={150} />
    </div>}
  </>;
}
