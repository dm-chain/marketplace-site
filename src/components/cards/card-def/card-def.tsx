import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { requestApiJson } from 'src/utils/request';

import Button from 'src/components/button/button';
import ButtonModal from 'src/components/button/button-modal';
import ConnectWallet from 'src/components/modal/content/connect-wallet';
import Person from 'src/components/person/person';

import audioWave from 'src/resources/img/wave.png';
import Play from 'src/resources/img/play.svg';
import LikeIcon from 'src/resources/img/like.svg';
import LikeEmptyIcon from 'src/resources/img/like-empty.svg';

import styles from 'src/components/cards/scss/card.module.scss';
import cardsStyles from 'src/components/cards/cards-row/scss/cards-row.module.scss';
import personStyles from 'src/components/person/scss/person.module.scss';
import Timer from 'src/components/timer/timer';
import { calculateNextBid, toUSD } from 'src/utils/common';
import GlobalContext from 'src/components/global-provider';

export default function CardDef({ item }: MarketplaceCard) {
  const [session] = useSession();
  // @ts-ignore
  const profile: TUser = session?.profile;
  const { rate } = useContext(GlobalContext);
  let [tmpLikes, setTmpLikes] = useState(item?.likes ?? []);
  let [likes, setLikes] = useState(item?.likes?.length ?? 0);
  let [likesActive, setLikesActive] = useState(profile && item?.likes?.includes(profile.id));

  useEffect(() => {
    setLikesActive(tmpLikes.includes(profile?.id));
    setLikes(tmpLikes.length);
  }, [tmpLikes]);

  const submitLike = async () => {
    const res = await requestApiJson('/api/items', 'PUT', { id: item.id, like: profile.id });

    if (res.status === 200) {
      const nft: INftItemExtended = await res.json();
      setTmpLikes(nft.likes ?? []);
    }
  };

  const modalContentLike = <ConnectWallet type={'like'}/>;

  const minimumBid = item?.auctionDetails?.currentBid ? calculateNextBid(item.auctionDetails.currentBid) : item?.auctionDetails?.startPrice;

  return <div className={`${styles.card} ${styles['card--def']} ${cardsStyles.card} ${!item.auctionDetails ? styles['card--link'] : ''}`}>
    <a className={`${styles.card__link}`} href={'/item/' + item.id}></a>
    <div className={styles.card__header}>
      {item.owner && <Person person={item.ownerProfile}/>}
      {/*
           <div className={personStyles.person}>
            <div className={personStyles.person__imgs}>
            <div className={personStyles.person__imgsItem}>
              <img src={props.author.image}/>
            </div>
            <div className={personStyles.person__imgsItem}>
              <img src={props.author.image}/>
            </div>
            <div className={personStyles.person__imgsItem}>
              <img src={props.author.image}/>
            </div>
          </div>
          <Link href={'/user/username/'}>
            <div className={`${personStyles.person__name} ${personStyles['person__name--link']} `}>{props.author.name}</div>
          </Link>
         </div>
      */}

    </div>
    <div className={styles.card__content}>
      {(item.type === 'image' || item.type === 'gif') && <img src={item.url} alt=""/>}
      {item.type === 'video' && <video controls>
        <source src={item.url}/>
      </video>}
      {item.type === 'audio' && <>
        <div className={styles['card__content-wave']}>
          <img src={audioWave} alt=""/>
        </div>
        <div className={styles['card__content-btn']}>
          <Button size={'circle-lg'} style={'full'} icon={<Play/>}/>
        </div>
      </>}
      {item.auctionDetails && <div className={styles['card__timer']}>
        <Timer size={'sm'} endTime={item.auctionDetails.endTime}/>
      </div> }
    </div>
    <div className={styles.card__footer}>
      <div className={styles.card__title}>{item.name ? item.name : '...'}</div>
      <div className={styles['card__footer-row']}>
        <div className={styles['card__footer-col']}>
          {item.auctionDetails && <>
            <div className={styles.card__description}>
              MINIMUM BID
            </div>
            <div className={styles.card__price}>
              {minimumBid}&nbsp;TON
              {rate && <span className={`${styles.card__price} ${styles['card__price--light']}`}>{toUSD(rate, Number(minimumBid))}</span>}
            </div>
          </>}
          {item.offerDetails && <>
            {item.offerDetails.price
              ? <>
                <div className={styles.card__description}>
                  CURRENT PRICE
                </div>
                <div className={styles.card__price}>
                  {item.offerDetails.price}&nbsp;TON
                  {rate && <span className={`${styles.card__price} ${styles['card__price--light']}`}>{toUSD(rate, item.offerDetails.price)}</span>}
                </div>
              </>
              : <div className={styles.card__description}> NOT FOR SALE </div>}
          </>}
        </div>
        <div className={styles['card__footer-col']}>
          {profile && <Button
            size={'xs'}
            style={'like'}
            icon={likesActive ? <LikeIcon/> : <LikeEmptyIcon/>}
            iconLocation={'left'}
            disabled={!profile}
            onClick={() => submitLike()}
            className={`${styles['card__btn-like']}`}>
            {likes}
          </Button>}

          {!profile && <ButtonModal
            size={'xs'}
            style={'like'}
            icon={likesActive ? <LikeIcon/> : <LikeEmptyIcon/>}
            iconLocation={'left'}
            className={`${styles['card__btn-like']}`}
            modalContent={modalContentLike}>{likes}
          </ButtonModal>}
        </div>
      </div>
    </div>
  </div>;
}
