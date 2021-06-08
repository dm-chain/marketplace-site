import React, { useEffect, useState } from 'react';
import CardTop from 'src/components/cards/card-top/card-top';
import Block from 'src/components/block/block';
import CardsRow from 'src/components/cards/cards-row/cards-row';
import { siteUrl } from 'src/config/auth';

export default function Top() {
  const [top, setTop] = useState({
    buyers: [],
    sellers: [],
    collectors: [],
    collections: [],
  });

  const cardsContent: TCardTop[] = [
    {
      title: 'Top\n buyers',
      subtitle: 'Recently bought',
      items: top.buyers,
    },
    {
      title: 'Top\n Sellers',
      subtitle: 'RECENT SALES',
      items: top.sellers,
    },
    {
      title: 'Largest Collections',
      subtitle: 'items OWNED',
      items: top.collections,
      type: 'collection',
    },
    {
      title: 'Top Collectors',
      subtitle: 'items OWNED',
      items: top.collectors,
    },
  ];

  const requestTop = async (type: string) => {
    const res = await fetch(`${siteUrl}/api/top?type=${type}`);

    if (res.status === 200) {
      const items = await res.json();
      setTop(top => ({ ...top, [type]: items }));
    }
  };

  useEffect(() => {
    (async () => {
      for (let key of Object.keys(top)) {
        await requestTop(key);
      }
    })();
  }, []);

  const cards = cardsContent.map((item, key: number) => <CardTop key={key} card={item} />);

  return (
    <Block bg={'light'}>
      <CardsRow sm={2} xl={4} cards={cards} isLoadMore={false} />
    </Block>
  );
}
