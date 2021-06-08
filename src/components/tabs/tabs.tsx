import React, { ReactNode, useState } from 'react';
import styles from 'src/components/tabs/scss/tabs.module.scss';

type Tab = {
  title: string;
  content: ReactNode;
}

type TabsProps = {
  tabs: Tab[],
  modifier?: 'wide';
}

export default function Tabs({ tabs, modifier }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return <div className={styles.tabs}>
    <div className={styles.tabs__controls}>
      {tabs.map((tab, id) =>
        <button
          key={id}
          className={`${styles.tabs__control} ${activeTab === id ? styles['tabs__control--active'] : ''}`}
          data-tab-id={id}
          onClick={() => setActiveTab(id)}>
          {tab.title}
        </button>)}
    </div>
    <div className={`${styles.tabs__body} ${modifier ? styles[`tabs__body--${modifier}`] : ''}`}>
      {tabs.map((tab, id) =>
        <div
          key={id}
          className={`${styles.tabs__pane} ${modifier ? styles[`tabs__pane--${modifier}`] : ''} ${activeTab === id ? styles['tabs__pane--active'] : ''}`}>
          {tab.content}
        </div>)}
    </div>
  </div>;
}
