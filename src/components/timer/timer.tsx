import React, { useEffect, useState } from 'react';
import styles from 'src/components/timer/scss/timer.module.scss';
import Tooltip from 'src/components/tooltip/tooltip';
import { createLabels } from 'src/resources/content/create';

type TimerProps = {
  size?: 'sm';
  endTime: string;
  finishAuction?: Function;
}

type TimerObj = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Timer({ size, endTime, finishAuction }: TimerProps) {
  const expDate = new Date(endTime);

  const calculateTimeLeft = (): TimerObj | null => {
    let difference = +expDate - +new Date();
    let timeLeft = null;

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      finishAuction && finishAuction();
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimerObj | null>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return <>
    {timeLeft &&<div className={`${styles.timer} ${styles[`timer--${size}`]}`}>
      {size !== 'sm' && <div className={styles.timer__title}>
      Auction ends in
        <Tooltip content={createLabels.auctionDisclaimer}/>
      </div>}
      <div className={styles.timer__row}>
        <div className={`${styles.timer__col} ${styles[`timer__col--${size}`]}`}>
          <div className={styles.timer__value}>{timeLeft.days}</div>
          <div className={styles.timer__title}>Days</div>
        </div>
        <div className={`${styles.timer__col} ${styles[`timer__col--${size}`]}`}>
          <div className={styles.timer__value}>{timeLeft.hours}</div>
          <div className={styles.timer__title}>Hours</div>
        </div>
        <div className={`${styles.timer__col} ${styles[`timer__col--${size}`]}`}>
          <div className={styles.timer__value}>{timeLeft.minutes}</div>
          <div className={styles.timer__title}>Minutes</div>
        </div>
        <div className={`${styles.timer__col} ${styles[`timer__col--${size}`]}`}>
          <div className={styles.timer__value}>{timeLeft.seconds}</div>
          <div className={styles.timer__title}>Seconds</div>
        </div>
      </div>
    </div>}
  </>;
}
