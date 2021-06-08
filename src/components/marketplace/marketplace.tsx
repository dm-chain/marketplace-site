import React, { useContext, useEffect, useState } from 'react';
import Block from 'src/components/block/block';
import CardsRow from 'src/components/cards/cards-row/cards-row';
import CardDef from 'src/components/cards/card-def/card-def';
import BlockHead from 'src/components/block/block-head';
import Filter from 'src/components/filter/filter-tags';
import Button from 'src/components/button/button';
import ButtonLink from 'src/components/button/button-link';
import BlockFooter from 'src/components/block/block-footer';
import NoItems from 'src/components/filter/no-items';
import Arrow from 'src/resources/img/arrow-r.svg';
import GlobalContext from 'src/components/global-provider';
import { FILTER_FILE_TYPES } from 'src/config/files';
import MoonLoader from 'react-spinners/MoonLoader';
import { getFilteredItems } from 'src/utils/request';
import styles from 'src/components/filter/scss/filter.module.scss';

type MarketplaceProps = {
  title: string;
  offer: boolean;
}

export default function Marketplace({ title, offer }: MarketplaceProps) {
  let [loading, setLoading] = useState(false);
  
  const { windowSize } = useContext(GlobalContext);
  const [categoryType, setCategoryType] = useState(FILTER_FILE_TYPES[0].type);
  const [showItems, setShowItems] = useState<INftItemExtended[] | []>([]);
  const filter = <Filter
    id={offer ? 'offer' : 'all'}
    tags={FILTER_FILE_TYPES}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryType(e.target.defaultValue.toLowerCase())}/>;

  const cards = showItems.map((item: INftItemExtended, key: number) => <CardDef key={key} item={item}/>);
  const assembleItems = async (options: {type: string | null, offer: boolean, limit: number}) => {
    setLoading(true);
    const res = await getFilteredItems(options);
    setShowItems(res ? res.items : []);
    setLoading(false);
  };

  useEffect(() => {  
    assembleItems({ 
      type: categoryType !== FILTER_FILE_TYPES[0].type ? categoryType : null, 
      offer: offer, 
      limit: 8 
    });
  }, [categoryType]);

  useEffect(() => {
    if (windowSize) {
      if (windowSize < 1680) {
        setShowItems(showItems.slice(0, 6));
      } else {
        setShowItems(showItems);
      }
    }
  }, [windowSize]);

  return <Block bg={'light'} modifier={'border-bottom'}>
    <BlockHead
      title={title}
      left={filter}
      right={
        <ButtonLink
          size={'sm'}
          style={'empty'}
          icon={<Arrow/>}
          link={'/explore'}
          transform={'right'}>
        View All
        </ButtonLink>
      }/>
    <div className={styles.filter__wrapper}>
      {
        windowSize && <>
          {
            cards.length 
              ? <CardsRow
                sm={2}
                lg={3}
                xxl={4}
                isLoadMore={false}
                cards={cards}/>
              : <NoItems/>
          }
        </>
      }
      {
        loading && <div className={styles.filter__loader}>
          <MoonLoader loading={loading} size={75} />
        </div>
      }
    </div>
    <BlockFooter>
      <Button size={'sm'} style={'empty'} icon={<Arrow/>}>View All</Button>
    </BlockFooter>
  </Block>;
}
