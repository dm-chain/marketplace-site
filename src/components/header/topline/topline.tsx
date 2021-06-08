import React, { useContext } from 'react';
import styles from 'src/components/header/topline/topline.module.scss';
import CloseIcon from 'src/resources/img/close-sm.svg';
import GlobalContext from 'src/components/global-provider';

type TopLineProps = {
  scrolled: boolean;
  windowSize: number;
}

export default function TopLine({ scrolled, windowSize }: TopLineProps) {
  const { setTopline } = useContext(GlobalContext);

  const removeTopline = () => {
    setTopline(false);
    sessionStorage.setItem('topline', 'closed');
  };

  return <div className={`${styles.topline} ${scrolled ? styles['hide'] : ''}`}>
    <div className={styles.topline__info}>
      The site is currently running on a testnet.&nbsp;
      {windowSize > 992 && <>Make sure your Extraton extension is switched to <a href={'http://net.ton.dev'} target={'_blank'} rel="noreferrer">net.ton.dev</a> and you have some rubies in your wallet.</> }
    </div>
    <div className={styles.topline__close}>
      <button className="btn btn--circle btn--circle-sm btn--light"
        onClick={removeTopline}>
        <CloseIcon/>
      </button>
    </div>
  </div>;
}
