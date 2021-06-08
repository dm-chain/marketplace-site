import React, { useContext, useState } from 'react';
import TabContent from 'src/components/divided-page/tab-content';
import Select from 'src/components/select/select';
import DropdownShare from 'src/components/dropdown/dropdown-share';
//import ButtonModal from 'src/components/button/button-modal';
//import Button from 'src/components/button/button';

import styles from 'src/components/divided-page/scss/divided-page.module.scss';
//import OverflowIcon from 'src/resources/img/overflow.svg';
import GlobalContext from 'src/components/global-provider';

type TContentTabs = {
  title: string;
  content: string | {text: string, image?: string}[];
}

type DividedBlockProps = {
  content: Array<TContentTabs>;
  type: 'changelog' | 'faq';
  pageTitle: string;
}

export default function DividedPage({ content, type, pageTitle }: DividedBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { topline } = useContext(GlobalContext);

  const options = content.map((item, key) => {
    return {
      label: item.title,
      value: 'page-option-' + key
    };
  });

  const changeActiveTab = (value: string) => {
    let currentIndex = options.findIndex((item) => item.value === value);
    setActiveTab(currentIndex);
  };

  return <div className={`${styles['page-divided']}  ${topline ? styles['page-divided--topline'] : ''}`}>
    <aside className={styles['page-divided__aside']}>
      <div className={styles['page-divided__aside-wrap']}>
        {pageTitle && <h1 className={styles['page-divided__title']}>
          {pageTitle}
        </h1>}
        <div className={styles['page-divided__select']}>
          <Select
            id={'page-options'}
            options={options}
            onChange={changeActiveTab}/>
        </div>
        <div className={styles['tabs-controls']}>
          {content.map((item, key) =>
            <div
              key={key}
              className={`${styles['tabs-controls__item']} ${key === activeTab ? styles['tabs-controls__item--active'] : ''}`}
              onClick={() => setActiveTab(key)}>
              {item.title}
            </div>)}
        </div>
      </div>
    </aside>
    <div className={styles['page-divided__block']}>
      <div className={styles['tabs-content']}>
        {content.map((item, key) =>
          <div
            key={key}
            className={`${styles['tabs-content__item']} ${key === activeTab ? styles['tabs-content__item--active'] : ''}`}>
            <TabContent
              title={type !== 'changelog' ? item.title : ''}
              content={item.content} />
          </div>)}
      </div>
      {type !== 'changelog' && <div className={styles['page-divided__buttons']}>
        {/*<Button*/}
        {/*  size={'sm'}*/}
        {/*  style={'empty'}*/}
        {/*  className={styles['page-divided__button']}*/}
        {/*  icon={<OverflowIcon/>}/>*/}
        <DropdownShare align={'left'} className={styles['page-divided__button']}/>
      </div>}
      {/*<div className={styles['page-divided__footer']}>*/}
      {/*  <h2 className={styles['page-divided__title-h2']}>Have more questions?</h2>*/}
      {/*  <ButtonModal*/}
      {/*    size={'md'}*/}
      {/*    style={'empty'}*/}
      {/*    modalContent={<>nothing yet</>}>*/}
      {/*    Submit a request*/}
      {/*  </ButtonModal>*/}
      {/*</div>*/}
    </div>
  </div>;
}
