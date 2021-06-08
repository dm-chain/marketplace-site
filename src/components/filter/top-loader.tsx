import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from 'src/components/global-provider';
import styles from 'src/components/filter/scss/loader.module.scss';

export default function TopLoader() {
  const { showTopLoader } = useContext(GlobalContext);
  const [show, setShow] = useState(false);
  const [progress, setProgress] = React.useState(0);

  const requestRef = React.useRef<number | undefined>();
  const previousTimeRef = React.useRef<number | undefined>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      setProgress(prevCount => (prevCount + deltaTime * 0.01) % 100);
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (showTopLoader) {
      setProgress(0);
      setShow(true);

      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(animate);
      }
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        setProgress(100);
        requestRef.current = undefined;
      }
    }

    //@ts-ignore
    return () => cancelAnimationFrame(requestRef.current);
  }, [showTopLoader]);

  useEffect(() => {
    progress === 100 && setTimeout(() => setShow(false), 400);
  }, [progress]);

  useEffect(() => {
    !show && setProgress(0);
  }, [show]);

  return <>
    {<div className={`${styles.loader} ${show ? styles.show : ''}`}>
      <div className={styles.loader__progress} style={{ width: progress + '%' }}></div>
    </div>}
  </>;
}
