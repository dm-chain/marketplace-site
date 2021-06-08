import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Layout from 'src/components/layout';
import MainScreenInner from 'src/components/main-screen/main-screen-inner';
import Block from 'src/components/block/block';
import CustomHead from 'src/components/head/head';
import FilterCards from 'src/components/filter/filter-cards';
import { getFilteredItems } from '../utils/request';

type ExploreProps = {
  items: INftItemExtended[];
  totalItems: number;
}

export default function Explore({ items, totalItems }: ExploreProps) {
  return (
    <Layout headerBg={'light'}>
      <CustomHead title="Marketplace | GrandBazar.io" description="" />
      <MainScreenInner title={'Explore Items'} paddings={'sm'}/>
      <Block
        bg={'light'}
        className={'block--pt-0'}
        containerMod={'flex'}>
        <FilterCards
          id={'explore'}
          items={items}
          totalItems={totalItems}
          loadMoreItems={12}/>
      </Block>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const resNfts = await getFilteredItems({ limit: 12 });
  let totalItems, items;

  if (resNfts) {
    items = resNfts.items;
    totalItems = resNfts.count;
  }

  return {
    props: {
      items,
      totalItems,
      session: await getSession(context)
    }
  };
};
