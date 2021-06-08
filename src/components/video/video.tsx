import React from 'react';
import styles from 'src/components/video/scss/video.module.scss';

type VideoProps = {
    src: string
}

export default function Video({ src }: VideoProps) {
  return <div className={styles.video}>
    <video controls>
      <source src={src}/>
    </video>

    {/*
      // custom controls
      <div className={styles.video__controls}>
      <div className={styles.video__proggress}>
        <div className={styles['video__time-start']}>0:00</div>
        <div className={styles['video__progress-bar']}>
          <input
            className={styles['video__progress-bar-input']}
            type={'range'}/>
        </div>
        <div className={styles['video__time-end']}>5:45</div>
      </div>
      <button
        type={'button'}
        className={styles.video__btn}>

      </button>
      <button
        type={'button'}
        className={styles.video__btn}>

      </button>
    </div>
    */}
  </div>;
}
