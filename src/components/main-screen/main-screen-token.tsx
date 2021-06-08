import React, { useContext, useEffect, useState } from 'react';

import Tag from 'src/components/filter/tag';
import Button from 'src/components/button/button';
import ConnectWallet from 'src/components/modal/content/connect-wallet';
import ButtonModal from 'src/components/button/button-modal';
import DropdownShare from 'src/components/dropdown/dropdown-share';
import Dropdown from 'src/components/dropdown/dropdown';
import ModalToggler from 'src/components/modal/modal-toggler';
import PutOnSale from 'src/components/modal/content/put-on-sale';
import CancelSale from 'src/components/modal/content/cancel-sale';
import PutOnAuctionModal from 'src/components/modal/content/put-on-auction-modal';

import styles from 'src/components/main-screen/scss/main-screen.module.scss';
import dropdownStyles from 'src/components/dropdown/scss/dropdown.module.scss';

import OverflowIcon from 'src/resources/img/overflow.svg';
import LikeIcon from 'src/resources/img/like.svg';
import LikeEmptyIcon from 'src/resources/img/like-empty.svg';
import { requestApiJson } from 'src/utils/request';
import GlobalContext from 'src/components/global-provider';
import { ConnectedStatus } from 'src/types/connect';
import { ExtratonContext } from 'src/components/extraton/extraton-provider';

type MainScreenTokenProps = {
  bg?: 'light' | 'brand';
  children: React.ReactNode;
  item: INftItemExtended;
  profile: TUser;
  auctionState: TAuction | null;
  setAuctionState: React.Dispatch<React.SetStateAction<TAuction | null>>;
  offerState: TOffer | null;
  setOfferState: React.Dispatch<React.SetStateAction<TOffer | null>>;
};

export default function MainScreenToken(props: MainScreenTokenProps) {
  const { topline } = useContext(GlobalContext);
  const { connectedStatus } = useContext(ExtratonContext);
  let [tmpLikes, setTmpLikes] = useState(props.item?.likes ?? []);
  let [likes, setLikes] = useState(props.item?.likes?.length ?? 0);
  let [likesActive, setLikesActive] = useState(props.profile && props.item?.likes?.includes(props.profile.id));

  const modalContentLike = <ConnectWallet type={'like'} />;
  const dropdownToggler = <Button size={'sm'} style={'empty'} icon={<OverflowIcon />} />;

  const btnLike = (
    <Button
      size={'sm'}
      style={'empty'}
      className={`${styles.main__like} ${likesActive ? styles['main__like--active'] : ''}`}
      icon={likesActive ? <LikeIcon /> : <LikeEmptyIcon />}
      disabled={!props.profile}
      onClick={() => submitLike()}
      iconLocation={'left'}
    >
      {likes}
    </Button>
  );

  const btnLikeModal = (
    <ButtonModal
      size={'sm'}
      style={'empty'}
      icon={likesActive ? <LikeIcon /> : <LikeEmptyIcon />}
      iconLocation={'left'}
      className={`${styles.main__like}`}
      modalContent={modalContentLike}
    >
      {likes}
    </ButtonModal>
  );

  const modalPutOnSale = <PutOnSale item={props.item} setOfferState={props.setOfferState} profile={props.profile} />;

  const modalAuction = (
    <PutOnAuctionModal
      auctionState={props.auctionState}
      setAuctionState={props.setAuctionState}
      item={props.item}
      setOfferState={props.setOfferState}
      profile={props.profile}
    />
  );

  const modalCancelSale = (
    <CancelSale item={props.item} setOfferState={props.setOfferState} offerState={props.offerState} />
  );

  useEffect(() => {
    setLikesActive(tmpLikes.includes(props.profile?.id));
    setLikes(tmpLikes.length);
  }, [tmpLikes]);

  const submitLike = async () => {
    const res = await requestApiJson('/api/items', 'PUT', { id: props.item.id, like: props?.profile.id });

    if (res.status === 200) {
      const nft: INftItemExtended = await res.json();
      setTmpLikes(nft.likes ?? []);
    }
  };

  const tag: TTagItem = {
    name: props.item.type,
    type: props.item.type,
  };

  return (
    <div
      className={`${styles.main} ${styles[`main--${props.bg ?? 'light'}`]} ${styles['main--token']} ${
        topline ? styles['main--topline'] : ''
      }`}
    >
      <div className={`${styles.main__wrap} ${styles['main__wrap--token']}`}>
        <div className={`${styles.main__aside} ${styles['main__aside--left']}`}>
          <div className={styles['main__aside-top']}>
            <Tag tag={tag} id={''} row={false} disabled />
          </div>
          <div className={`${styles['main__aside-bottom']} ${styles['main__aside-bottom--md-hide']}`}>
            {props.profile && connectedStatus === ConnectedStatus.Connected ? btnLike : btnLikeModal}
          </div>
        </div>
        <div className={`${styles.main__content} ${styles['main__content--token']}`}>{props.children}</div>
        <div className={`${styles.main__aside} ${styles['main__aside--right']}`}>
          <div className={styles['main__aside-top']}>
            {props.profile?.id && props.item.owner === props.profile?.id && !props.auctionState && (
              <Dropdown align={'right'} type={'account'} toggler={dropdownToggler} className={styles.auth__dropdown}>
                <>
                  <div className={dropdownStyles.dropdown__main}>
                    <div className={dropdownStyles.dropdown__list}>
                      {!props.offerState && !props.auctionState && (
                        <>
                          <ModalToggler
                            className={dropdownStyles['dropdown__list-item']}
                            modalContent={
                              connectedStatus === ConnectedStatus.Connected ? (
                                modalPutOnSale
                              ) : (
                                <ConnectWallet type={'notice'} />
                              )
                            }
                          >
                            Put on sale
                          </ModalToggler>
                          <ModalToggler
                            className={dropdownStyles['dropdown__list-item']}
                            modalContent={
                              connectedStatus === ConnectedStatus.Connected ? (
                                modalAuction
                              ) : (
                                <ConnectWallet type={'notice'} />
                              )
                            }
                          >
                            Start auction
                          </ModalToggler>
                        </>
                      )}
                      {props.offerState && !props.auctionState && (
                        <ModalToggler
                          className={dropdownStyles['dropdown__list-item']}
                          modalContent={
                            connectedStatus === ConnectedStatus.Connected ? (
                              modalCancelSale
                            ) : (
                              <ConnectWallet type={'notice'} />
                            )
                          }
                        >
                          Cancel Sale
                        </ModalToggler>
                      )}
                    </div>
                  </div>
                </>
              </Dropdown>
            )}
          </div>
          <div className={styles['main__aside-bottom']}>
            <div className={`${styles['main__aside-bottom-item']} ${styles['main__aside-bottom-item--md-show']}`}>
              {props.profile && connectedStatus === ConnectedStatus.Connected ? btnLike : btnLikeModal}
            </div>
            <div className={styles['main__aside-bottom-item']}>
              <DropdownShare align={'right'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
