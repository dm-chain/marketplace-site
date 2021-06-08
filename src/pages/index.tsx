import React from 'react';

import MainScreen from 'src/components/main-screen/main-screen';
import Layout from 'src/components/layout';
import Top from 'src/components/top/top';
import Collections from 'src/components/collections/collections';
import Marketplace from 'src/components/marketplace/marketplace';
import FooterForm from 'src/components/footer-form/footer-form';
import CustomHead from 'src/components/head/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { siteUrl } from 'src/config/auth';
import Auction from '../components/auction/auction';
import { getExtendedItems } from '../utils/request';

type MainPageProps = {
  collections: ICollectionItemExtended[];
  session: TUserSession;
  auctions: INftItemExtended[];
};

export default function MainPage({ collections, session, auctions }: MainPageProps) {
  return (
    <>
      <CustomHead title="The first NFT marketplace on Free TON | GrandBazar.io" description="" />
      <Layout isMainPage headerBg={'brand'}>
        <MainScreen />
        {collections?.length ? <Collections collections={collections} /> : ''}
        {auctions?.length ? <Auction auctions={auctions} /> : ''}
        <Marketplace title={'New on the Marketplace'} offer={true} />
        <Top />
        <FooterForm />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const resCollections = await fetch(`${siteUrl}/api/collections?limit=8`);
  const collections = resCollections.status === 200 ? await resCollections.json() : null;
  const resAuctions = await fetch(`${siteUrl}/api/items?auction=true&limit=8`);
  let auctions: INftItemExtended[] = [];

  if (resAuctions.status === 200) {
    const simpleAuctions = await resAuctions.json();
    auctions = await getExtendedItems(simpleAuctions);
  }

  return {
    props: {
      auctions,
      collections,
      session: await getSession(context),
    },
  };
};
