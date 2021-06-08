import React, { useEffect, useState } from 'react';
import ButtonLink from 'src/components/button/button-link';

import styles from 'src/components/share/scss/share.module.scss';
import TgIcon from 'src/resources/img/tg.svg';
import FbIcon from 'src/resources/img/fb.svg';
import TwIcon from 'src/resources/img/tw-dark.svg';
import MailIcon from 'src/resources/img/mail.svg';
import { siteUrl } from 'src/config/auth';
//import LinkIcon from 'src/resources/img/link.svg';

type TShareProps = {
  size: 'sm' | 'md';
}

export default function Share({ size }: TShareProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title);
  }, [url, title]);

  return <div className={`${styles.share} ${styles[`share--${size}`]}`}>
    <div className={`${styles.share__item} ${styles[`share__item--${size}`]}`}>
      <ButtonLink 
        link={`https://www.facebook.com/sharer.php?src=sp&u=${url}`} 
        size={`circle-${size}`} 
        style={'empty'} 
        icon={<FbIcon/>}
        target={'_blank'} />
    </div>
    <div className={`${styles.share__item} ${styles[`share__item--${size}`]}`}>
      <ButtonLink 
        link={`https://telegram.me/share/url?url=${url}&text=${title}`} 
        size={`circle-${size}`} 
        style={'empty'} 
        icon={<TgIcon/>}
        target={'_blank'} />
    </div>
    <div className={`${styles.share__item} ${styles[`share__item--${size}`]}`}>
      <ButtonLink 
        link={`https://twitter.com/intent/tweet?url=${url}&text=${title}`} 
        size={`circle-${size}`} 
        style={'empty'} 
        icon={<TwIcon/>}
        target={'_blank'} />
    </div>
    <div className={`${styles.share__item} ${styles[`share__item--${size}`]}`}>
      <ButtonLink 
        link={`mailto:?subject=I wanted you to see this NFT collectibles&amp;body=Check out this page ${url}.`} 
        size={`circle-${size}`} 
        style={'empty'} 
        icon={<MailIcon/>}
        target={'_blank'} />
    </div>
    {/*<div className={`${styles.share__item} ${styles[`share__item--${size}`]}`}>
      <ButtonLink link={'#'} size={`circle-${size}`} style={'empty'} icon={<LinkIcon/>}/>
    </div>*/}
  </div>;
}
