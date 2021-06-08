import React from 'react';
import Link from 'next/link';

import styles from 'src/components/header/menu/scss/menu.module.scss';
import Plus from 'src/resources/img/plus.svg';

export const menuItems = [
  {
    id: 1,
    link: '/create',
    title: 'Create',
    icon: <Plus/>
  },
  {
    id: 2,
    link: '/explore',
    title: 'Explore'
  },
  {
    id: 3,
    link: '/faq',
    title: 'Faq',
  },
];

export default function Menu() {
  return (
    <>
      <ul className={styles.menu}>
        {menuItems.map(item => <li className={styles.menu__item} key={item.id}>
          <Link href={item.link}>
            <div className={`${styles.menu__link} ${item.icon ? styles['menu__link--icon'] : ''}`}>
              {item.title}
              {item.icon ? <span className={styles.menu__icon}>{item.icon}</span> : ''}
            </div>
          </Link>
        </li>)}
      </ul>
    </>
  );
}
