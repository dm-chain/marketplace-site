import React, { useContext, useEffect, useState } from 'react';
import CardsRow from 'src/components/cards/cards-row/cards-row';
import CardDef from 'src/components/cards/card-def/card-def';
import NoItems from 'src/components/filter/no-items';
import Toggler from 'src/components/forms/toggler/toggler';
import FilterTags from './filter-tags';
import Select from 'src/components/select/select';
import MoonLoader from 'react-spinners/MoonLoader';
import styles from 'src/components/filter/scss/filter.module.scss';
import { FILTER_FILE_TYPES } from '../../config/files';
import { getExtendedItems, getFilteredItems } from '../../utils/request';
import GlobalContext from '../global-provider';

type FilterCardsProps = {
  items: INftItemExtended[];
  id: string;
  totalItems: number;
  loadMoreItems: number;
  user?: TUser;
  userId?: string;
  userCategory?: string;
}

export default function FilterCards(props: FilterCardsProps) {

  const offerFields = [
    {
      id: 'buy_now',
      name: 'Buy Now',
      checked: false,
      show: true
    },
    {
      id: 'has_offer',
      name: 'Has Offer',
      checked: false,
      show: false
    },
    {
      id: 'on_auction',
      name: 'On Auction',
      checked: false,
      show: true
    }
  ];

  const selectOptions: SelectOption[] = [
    {
      value: 'default',
      label: 'Recently Added'
    },
    {
      value: 'increase-price',
      label: 'Price: Low to High'
    },
    {
      value: 'decrease-price',
      label: 'Price: High to Low'
    }
  ];

  const  { showTopLoader, setShowTopLoader } = useContext(GlobalContext);
  // filter
  const [filteredItems, setFilteredItems] = useState(props.items ?? []);
  const initialOfferState = offerFields.reduce((fields, field) => field.show ? { ...fields, [field.id]: field.checked } : fields, {});
  const [offerState, setOfferState] = useState(initialOfferState);
  const [categoryName, setCategoryName] = useState(FILTER_FILE_TYPES[0].type);
  const [sortBy, setSortBy] = useState(selectOptions[0].value);
  // load more
  const [totalItems, setTotalItems] = useState(props.totalItems);
  const [showItemsCount, setShowItemsCount] = useState(props.items?.length ?? 0);
  const [loadItemsCount, setLoadItemsCount] = useState(props.loadMoreItems);
  const isLoadMore: boolean = Boolean(filteredItems.length && props.loadMoreItems && (showItemsCount < totalItems));

  const updateCards = async (limit: number = 0, offset: number = 0) => {
    setShowTopLoader(true);

    const isOffer = sortBy !== 'default' || props.userCategory === 'sale' && !offerState['on_auction'];
    const isAuction = sortBy !== 'default' || props.userCategory === 'sale' && !offerState['buy_now'];

    const filterParams: FilterParams = {
      type: categoryName !== FILTER_FILE_TYPES[0].type ? categoryName : null,
      offer: isOffer ? true : offerState['buy_now'],
      auction: isAuction ? true : offerState['on_auction'],
      sort: sortBy !== 'default' ? sortBy : null,
      author: props.userId && props.userCategory === 'author' ? props.userId : null,
      owner: props.userId && (props.userCategory === 'owner' || props.userCategory === 'sale') ? props.userId : null,
      limit,
      offset
    };

    let res = await getFilteredItems(filterParams);

    if (res && res.items) {
      let resItems: INftItemExtended[] = offset ? [...filteredItems, ...res.items] : res.items;

      setShowItemsCount(resItems.length);
      setTotalItems(res.count);

      Object.keys(offerState).length && setFilteredItems(resItems);
    }

    setShowTopLoader(false);
  };

  const loadMore = () => {
    (async () => {
      await updateCards(loadItemsCount, showItemsCount);
    })();
  };

  useEffect(() => {
    if (categoryName !== FILTER_FILE_TYPES[0].type || sortBy !== 'default' || offerState !== initialOfferState) {
      (async () => {
        await updateCards(props.items?.length);
      })();
    }
  }, [categoryName, sortBy, offerState]);

  const cards = filteredItems.map((item, key) =>
    <CardDef
      key={key}
      item={item}
    />);

  return <>
    {props.items && props.items.length
      ? <div className={styles.filter}>
        <div className={styles.filter__row}>
          {FILTER_FILE_TYPES.length && <div className={styles.filter__item}>
            <div className={styles['filter__item-title']}>Category</div>
            <FilterTags
              id={props.id}
              tags={FILTER_FILE_TYPES}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.defaultValue.toLowerCase())}/>
          </div>}
          <div className={styles.filter__item}>
            <div className={styles['filter__item-title']}>Status</div>
            <div className={styles.filter__status}>
              {offerFields.map((field, key) => field.show && <>
                <Toggler
                  key={key}
                  id={field.id + props.id}
                  name={field.id}
                  title={field.name}
                  checked={field.checked}
                  onChange={(e) => setOfferState({ ...offerState, [e.target.name]: e.target.checked })}
                  className={styles['filter__status-item']}/>
              </>)}
            </div>
          </div>

          <div className={`${styles.filter__item} ${styles['filter__item--select']}`}>
            <div className={styles['filter__item-title']}>sort by</div>
            <Select id="sortby"
              label=""
              options={selectOptions}
              className={styles['filter__item-select']}
              onChange={(option: string) => setSortBy(option)}
            />
          </div>
        </div>
      </div>
      : ''}
    <div className={styles.filter__wrapper}>
      {filteredItems.length
        ? <CardsRow
          sm={2}
          lg={3}
          xxl={4}
          isLoadMore={isLoadMore}
          loadMore={loadMore}
          cards={cards}/>
        : <NoItems isExplorePage={props.id === 'explore'} modifier={'mb-0'}/>}
      {showTopLoader && <div className={styles.filter__loader}></div>}
    </div>
  </>;
}
