import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import MainScreenToken from 'src/components/main-screen/main-screen-token';
import Layout from 'src/components/layout';
import BlockDivided from 'src/components/block/block-divided';
import TokenInfo from 'src/components/token-info/token-info';
import TokenTabs from 'src/components/tabs/token-tabs';
import LightboxImage from 'src/components/lightbox-image/lightbox-image';
import CustomHead from 'src/components/head/head';
import Details from 'src/components/details/details';
import { siteUrl } from 'src/config/auth';

import Video from 'src/components/video/video';
import { getNftItemExtended, getAllOffers, getAuction, requestApiJson, getWallet } from 'src/utils/request';
import { calculatePrice } from '../../utils/common';

type TokenPageProps = {
  item: INftItemExtended;
  session: TUserSession;
  offers: TOfferExtended[];
}

export default function TokenPage({ item, session, offers }: TokenPageProps) {
  const profile: TUser = session?.profile;
  const [offerState, setOfferState] = useState<TOffer| null>(item.offerDetails ?? null);
  const [auctionState, setAuctionState] = useState<TAuction | null>(item.auctionDetails ?? null);
  const [ownerProfile, setOwnerProfile] = useState<TUser>(item.ownerProfile);
  const [currentBid, setCurrentBid] = useState<TBid | null>(null);
  const [bids, setBids] = useState<Array<TBid> | []>([]);

  useEffect(() => {
    (async () => {
      if (auctionState && auctionState.bids?.length) {
        const lastBidId =  auctionState.bids[auctionState.bids.length - 1];
        const resLastBid= await fetch(`${siteUrl}/api/bids?id=${lastBidId}`);

        if (resLastBid.status === 200) {
          const lastBid = await resLastBid.json();
          setCurrentBid(lastBid);
        }
      }
    })();
  }, [auctionState]);

  useEffect(() => {
    (async () => {
      const tmpBids = [];
      if (auctionState && auctionState.bids?.length) {
        for (let bid of auctionState.bids) {
          const resBid= await fetch(`${siteUrl}/api/bids?id=${bid}`);

          if (resBid.status === 200) {
            tmpBids.push(await resBid.json());
          }
        }
      }

      setBids(tmpBids);
    })();
  }, [auctionState]);

  const finishAuction = async () => {
    const auction = auctionState && auctionState._id ? await getAuction(auctionState._id) : null;

    if (auction && +new Date(auction.endTime) <= Date.now()) {

      const lastBidId = auction.bids?.length ? auction.bids[auction.bids.length - 1] : null;

      if (lastBidId) {
        const resLastBid= await fetch(`${siteUrl}/api/bids?id=${lastBidId}`);

        if (resLastBid.status === 200) {
          const lastBid = await resLastBid.json();
          const newOwner = lastBid?.sender;
          const wallet = await getWallet(lastBid.senderPubKey);

          if (newOwner && wallet) {
            const resItemUpd = await requestApiJson('/api/items', 'PUT', { id: item.id, owner: newOwner.id, wallet: wallet._id });

            if (resItemUpd.status === 200) {
              const offer: TOffer = {
                contractAddress: auction.contractAddress,
                owner: item.owner,
                item: item.id,
                price: Number(lastBid.value),
                totalPrice: Number(calculatePrice(Number(lastBid.value))),
                dateCreated: new Date(),
                dateClosed: new Date(),
                status: 'closed',
              };

              const resOffer = await requestApiJson('/api/offers', 'POST', offer);

              if (resOffer.status === 201) {
                setOwnerProfile(newOwner);
                setAuctionState(null);
              }
            }
          }
        }
      } else {
        setAuctionState(null);
        const resItemUpd = await requestApiJson('/api/items', 'PUT', { id: item.id, type: 'auction_closed' });
      }
    }
  };

  const generateItemDetails = (): DetailsItem[] => {
    const fields: {[key: string]: string} = {
      collectionId: 'collection',
      owner: 'owner',
      author: 'creator'
    };
   
    return Object.keys(fields).reduce((details: DetailsItem[], key: string): DetailsItem[]  => {
      if (item[key]) {
        let detailsProfile;

        switch (key) {
          case 'author':
            detailsProfile = item.authorProfile;
            break;
          case 'owner':
            detailsProfile = ownerProfile;
            break;
          default:
            detailsProfile = typeof item?.collectionId !== 'string' ? item?.collectionId : null;
        }

        const detailsItem: DetailsItem = {
          type: 'details',
          title: fields[key],
          person: {
            type: fields[key],
            profile: detailsProfile
          }
        };

        if (!details) {
          details = [];
        }

        details.push(detailsItem);
      }

      return details;
    }, []);
  };

  const description = <TokenInfo
    bids={bids}
    finishAuction={finishAuction}
    item={item}
    offerState={offerState}
    profile={profile}
    auctionState={auctionState}
    setAuctionState={setAuctionState}
    setOfferState={setOfferState}
    setOwnerProfile={setOwnerProfile}/>;

  const tabsComponent = offers && offers.length || auctionState
    ? <TokenTabs
      offers={offers}
      bids={bids}
      item={item}
      details={generateItemDetails()}
      auctionState={auctionState}
    />
    : <Details items={generateItemDetails()}/>;

  return (<>
    <CustomHead title={`${item.name} | GrandBazar.io`} description={item.description} />
    <Layout headerBg={'light'}>
      <MainScreenToken
        item={item}
        profile={profile}
        auctionState={auctionState}
        setAuctionState={setAuctionState}
        offerState={offerState}
        setOfferState={setOfferState}>
        {item.type === 'video'
          ? <Video src={item.url}/>
          : <LightboxImage src={item.url}/>}
      </MainScreenToken>
      <BlockDivided
        bg={'light'}
        contentLeft={description}
        contentRight={tabsComponent}/>
    </Layout>
  </>);
}
// @ts-ignore
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { itemId } = context.query;
  const res = await fetch(`${siteUrl}/api/items?id=${itemId}`);

  if (res.status === 200) {
    const simpleItem: INftItem = await res.json();
    const item: INftItemExtended = await getNftItemExtended(simpleItem);

    return {
      props: {
        offers: await getAllOffers(item.id),
        item,
        session: await getSession(context)
      },
    };

  } else {
    const errorCode = res.status;

    if (errorCode) {
      context.res.writeHead(302, { Location: '/' });
      context.res.end();
    }

    return {
      props: {
        errorCode
      }
    };
  }
};
