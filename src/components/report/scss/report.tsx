import React, { useContext } from 'react';

import Container from 'src/components/container/container';

import styles from 'src/components/report/scss/report.module.scss';
import GlobalContext from 'src/components/global-provider';

export default function Report() {
  const { topline } = useContext(GlobalContext);
  
  return <Container mod={'sm'}>
    <div className={`${styles.report} ${topline ? styles['report--topline'] : ''}`}>
      <iframe className={`clickup-embed clickup-dynamic-height ${styles.report__iframe}`} src="https://forms.clickup.com/f/2buuq-12076/EVES4PD2MWTKJINHJQ"></iframe><script async src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js"></script>
    </div>
  </Container>;
}
