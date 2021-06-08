import React from 'react';
import Block from '../block/block';
import CardDef from '../cards/card-def/card-def';
import BlockHead from '../block/block-head';
import Slider from '../slider/slider';

type AuctionProps = {
  auctions: INftItemExtended[];
}

export default function Auction({ auctions }: AuctionProps) {
  const cards = auctions.map((item: INftItemExtended, key: number) => <CardDef key={key} item={item}/>);

  return <Block bg={'brand'}>
    <BlockHead title={'Live Auctions'}/>
    <Slider items={cards} background={'brand'}/>
  </Block>;
}
