import React from 'react';
import styles from 'src/components/filter/scss/tags.module.scss';

type TagProps= {
  tag: TTagItem;
  id: string | number;
  row: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  filterId?: string;
}

export default function Tag(props: TagProps) {
  return <div className={`${styles.tags__tag} ${props.row ? styles['tags__tag--row'] : ''}`} key={props.id}>
    <input className={styles.tags__input}
      type="radio"
      name={props.filterId}
      id={'tag-' + props.filterId + '-' + props.id}
      value={props.tag.type}
      defaultChecked={!props.id}
      disabled={props.disabled ?? false}
      onChange={props.onChange}/>
    <label className={`${styles.tags__item} ${styles['tags__item--light']} ${props.disabled ? 'tags__item--disabled' : ''}`}
      htmlFor={'tag-' + props.filterId + '-' + props.id}>
      {props.tag.name}
    </label>
  </div>;
}
