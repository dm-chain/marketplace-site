import React from 'react';

import styles from 'src/components/divided-page/scss/divided-page.module.scss';
import LightboxImage from '../lightbox-image/lightbox-image';

type FaqContentProps = {
  title: string;
  content: string | {text: string, image?: string}[];
}

export default function TabContent({ title, content }: FaqContentProps) {
  return  <div className={styles.content}>
    {/*<div className={styles.content__date}>*/}
    {/*  2 months ago — Updated*/}
    {/*</div>*/}
    <h2>{title}</h2>
    {
      typeof content === 'string' 
        ? <div
          className={styles['page-divided__content']}
          dangerouslySetInnerHTML={{ __html: content }}></div>
        : <div className={styles['page-divided__content']}>
          {
            content.map((item: {text: string, image?: string}) => <>
              <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
              {item.image ? <LightboxImage src={item.image} /> : ''}
            </>)
          }
        </div>  
    }
  </div>;
}
