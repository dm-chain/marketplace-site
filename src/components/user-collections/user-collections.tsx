import React from 'react';
import Tabs from 'src/components/tabs/tabs';
import Block from 'src/components/block/block';
import FilterCards from '../filter/filter-cards';

type UserCollectionsProps = {
  user: TUser;
  onSaleItems: TFilterResponse,
  ownerItems: TFilterResponse,
  authorItems: TFilterResponse,
}

export default function UserCollections({ user, onSaleItems, ownerItems, authorItems }: UserCollectionsProps) {
  const tabs = [
    {
      title: 'On Sale',
      content: <FilterCards
        id={'sale'}
        items={onSaleItems.items}
        userId={user.id}
        userCategory={'sale'}
        totalItems={onSaleItems.count}
        loadMoreItems={12}
        user={user}/>
    },
    {
      title: 'Collectibles',
      content: <FilterCards
        id={'2'}
        userId={user.id}
        userCategory={'owner'}
        items={ownerItems.items}
        totalItems={ownerItems.count}
        loadMoreItems={12}
        user={user}/>
    },
    {
      title: 'Created',
      content: <FilterCards
        id={'3'}
        userId={user.id}
        userCategory={'author'}
        items={authorItems.items}
        totalItems={authorItems.count}
        loadMoreItems={12}
        user={user}/>
    }
  ];
  
  return <Block bg={'light'} className={'block--pt-0'} modifier={'tabs'}>
    <Tabs tabs={tabs} modifier={'wide'}/>
  </Block>;
}
