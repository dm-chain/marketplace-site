import React from 'react';

import Block from 'src/components/block/block';
import CardCollections from 'src/components/cards/card-collections/card-collections';
import BlockHead from 'src/components/block/block-head';
import Slider from 'src/components/slider/slider';

type CollectionsProps = {
  collections: ICollectionItemExtended[];
};

export default function Collections({ collections }: CollectionsProps) {
  const carouselItems = collections
    ? collections.map((item: any, key: any) => <CardCollections key={key} item={item} />)
    : [];

  return (
    <Block bg={'light'} slider={true}>
      <BlockHead title={'Featured collections'} />
      <Slider items={carouselItems} />
    </Block>
  );
}
