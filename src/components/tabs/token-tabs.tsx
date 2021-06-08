import React from 'react';
import Tabs from 'src/components/tabs/tabs';
import Details from 'src/components/details/details';
import Bids from 'src/components/bids/bids';
import { formatDate } from 'src/utils/common';

type TokenTabsProps = {
  offers: TOfferExtended[];
  item: INftItemExtended;
  details: DetailsItem[];
  bids: TBid[];
  auctionState: TAuction | null;
}

export default function TokenTabs({ details, offers, item, bids, auctionState }: TokenTabsProps) {
  const generateHistoryItem = (date: Date | undefined, person: TUser | null, text: string): DetailsItem  => {
    return {
      type: 'history',
      date: date ? formatDate(date) : '',
      person: {
        type: 'owner',
        profile: person
      },
      text
    };
  };

  const generateHistory = (): DetailsItem[] => {
    let history: DetailsItem[] = [];
    history.push(generateHistoryItem(item.dateCreated, item.authorProfile, 'Created'));

    offers.forEach((offer, key) => {
      if (key >= 1) {
        let datePurchase = offers[key - 1].dateClosed;
        let price = offers[key - 1].price;

        history.unshift(generateHistoryItem(datePurchase, offer.ownerProfile, `Purchased for ${price} TON`));
      }

      if (key === offers.length - 1) {
        history.unshift(generateHistoryItem(offer.dateClosed, item.ownerProfile, `Purchased for ${offer.price} TON`));
      }
    });

    return history;
  };

  const generateBids = (): DetailsItem[] => {
    let bidItems: DetailsItem[] = [];

    bids.forEach((bid) => {
      bidItems.unshift({
        type: 'history',
        date: formatDate(bid.dateCreated),
        person: {
          type: 'owner',
          profile: bid.sender
        },
        price: bid.value
      });
    });

    return bidItems;
  };
  
  const tabs = [
    {
      title: 'Details',
      content: <Details items={details}/>
    }
  ];

  if (auctionState) {
    tabs.push({
      title: 'Bids',
      content: <Bids items={generateBids()}/>
    });
  }

  const history = generateHistory();

  if (history.length > 1) {
    tabs.push({
      title: 'History',
      content: <Details items={generateHistory()}/>
    });
  }

  return <Tabs tabs={tabs}/>;
}
