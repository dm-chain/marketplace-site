import React from 'react';
import Layout from 'src/components/layout';
import MainScreenCollection from 'src/components/main-screen/main-screen-collection';
import Block from 'src/components/block/block';
import Tabs from 'src/components/tabs/tabs';
import CardsRow from 'src/components/cards/cards-row/cards-row';
import CardDef from 'src/components/cards/card-def/card-def';
import CustomHead from 'src/components/head/head';
import { GetServerSideProps } from 'next';
import { siteUrl } from 'src/config/auth';
import { getExtendedItems } from 'src/utils/request';
import { getSession } from 'next-auth/client';
import NoItems from 'src/components/filter/no-items';

type CollectionPageProps = {
  items: INftItemExtended[];
  collection: ICollectionItemExtended;
  session: TUserSession;
}

export default function CollectionPage({ items, collection, session }: CollectionPageProps) {
  const profile: TUser = session?.profile;
  const onSaleCards = items.filter(item => item.offer).map((item, key) => <CardDef key={key} item={item}/>);
  const allCards = items.map((item, key) => <CardDef key={key} item={item}/>);

  const tabs = [
    {
      title: 'On Sale',
      content: onSaleCards.length
        ? <CardsRow
          sm={2}
          lg={3}
          xxl={4}
          isLoadMore={false}
          cards={onSaleCards}/>
        : <NoItems/>
    },
    {
      title: 'Collectibles',
      content: allCards.length
        ? <CardsRow
          sm={2}
          lg={3}
          xxl={4}
          isLoadMore={false}
          cards={allCards}/>
        : <NoItems/>
    }
  ];
  
  return <>
    <CustomHead title={`${collection.name} | GrandBazar.io`} description={collection.description} />
    <Layout headerBg={'light'}>
      <MainScreenCollection collection={collection} profile={profile}/>
      <Block bg={'light'} className={'block--pt-0'} modifier={'tabs'}>
        <Tabs tabs={tabs} modifier={'wide'}/>
      </Block>;
    </Layout>
  </>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { collectionId } = context.query;
  const res = await fetch(`${siteUrl}/api/collections?slug=${collectionId}`);

  if (res.status === 200) {
    const collection = await res.json();
    
    let resItems = await fetch(`${siteUrl}/api/items?collectionId=${collection._id}`);
    let items: INftItemExtended[] = [];

    if (resItems.status === 200) {
      let simpleItems = await resItems.json();
      items = await getExtendedItems(simpleItems);
    }

    return {
      props: {
        items,
        collection,
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
