import React, { useEffect, useState } from 'react';
import styles from 'src/components/create/scss/radio-collection.module.scss';
import CloseIcon from 'src/resources/img/close-sm.svg';
import CreateCollection from '../modal/content/create-collection';
import ModalToggler from '../modal/modal-toggler';

type RadioCollectionProps = {
  profile: TUser;
  collections: ICollectionItem[];
  collectionId: string | null;
  setCollectionId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function RadioCollection({ profile, collections, collectionId, setCollectionId }: RadioCollectionProps) {
  const [newCollection, setNewCollection] = useState<ICollectionItem|null>(null);
  const [items, setItems] = useState<ICollectionItem[]>(collections ?? []);

  useEffect(() => {
    if (newCollection && newCollection.name) {
      setItems([...items, newCollection]);
      setNewCollection(null);
    }
  }, [newCollection]);

  const modalContent =  <CreateCollection
    setNewCollection={setNewCollection}
    profile={profile}/>;

  return <div className={styles['radio-collection']}>
    {items && items.map((item, key) =>
      <div
        key={key}
        className={styles['radio-collection__item']}>
        <input
          className={styles['radio-collection__input']}
          type="checkbox"
          name={'collection'}
          id={item._id}
          onChange={(e) => setCollectionId(e.target.checked ? e.target.id : null)}
          checked={item._id === collectionId}
        />
        <label
          htmlFor={item._id}
          className={styles['radio-collection__label']}>
          <div className={styles['radio-collection__label-img']}>
            <img
              src={item.image}
              alt={item.name}
            />
          </div>
          <span className={styles['radio-collection__label-text']}>
            {item.name}
          </span>
        </label>
      </div>)}
    <div className={styles['radio-collection__item']}>
      <ModalToggler
        modalContent={modalContent}
        className={`${styles['radio-collection__item-wrapper']} ${!profile ? styles['radio-collection__item-wrapper--disabled'] : ''}`}>
        <button
          className={`${styles['radio-collection__label']} ${styles['radio-collection__label--btn']} ${!profile ? styles['radio-collection__label--disabled'] : ''}`}
        >
          <div className={`${styles['radio-collection__add-btn']} ${!profile ? styles['radio-collection__add-btn--disabled'] : ''}`}>
            <CloseIcon/>
          </div>
          <span className={styles['radio-collection__label-text']}>Create New Collection</span>
        </button>
      </ModalToggler>
    </div>
  </div>;
}
