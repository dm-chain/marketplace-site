import React from 'react';

import Logo from 'src/resources/img/logo.svg';
import Container from 'src/components/container/container';
import { menuItems } from 'src/resources/content/footer';

import styles from 'src/components/footer/scss/footer.module.scss';

export default function Footer() {
  return (<div className={styles.footer}>
    <Container>
      <div className={styles.footer__row}>
        <div className={styles.footer__col}>
          <div className={styles.footer__logo}>
            <Logo/>
          </div>
          <span>
            © 2021 Grandbazar
          </span>
        </div>
        <div className={styles.footer__menu}>
          {menuItems.map(item => <div key={item.id} className={styles.footer__menuItem}>
            <div className={styles.footer__menuTitle}>
              {item.title}
            </div>
            {item.items && <div className={styles.footer__menuItems}>
              {item.items.map((item: any) => <div key={'key' + item.id} className={styles.footer__menuLink}>
                <a href={item.link} target={item.external && '_blank'}>{item.title}</a>
              </div>)}
            </div>}
          </div>
          )}
        </div>
      </div>
    </Container>
  </div>);
}
