import React from 'react';
import styles from 'src/components/filter/scss/filter.module.scss';
import Tag from 'src/components/filter/tag';

type FilterTagsProps = {
  tags: Array<TTagItem>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  id: string;
}

export default function FilterTags({ id, tags, onChange }: FilterTagsProps) {

  return <div className={styles.tags}>
    {tags.map((tag, key) =>
      <Tag
        key={key}
        tag={tag}
        id={key}
        filterId={id}
        row={true}
        onChange={onChange ? onChange : () => ''}/>)}
  </div>;
}
