import React, { useEffect, useRef, useState } from 'react';
import styles from 'src/components/dropdown/scss/dropdown.module.scss';

type TDropdownProps = {
  type: 'account' | 'notification' | 'share';
  children: React.ReactNode;
  toggler: React.ReactNode;
  className?: string;
  align: 'left' | 'right';
}

export default function Dropdown(props: TDropdownProps) {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let closeDropdownByOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsShowDropdown(false);
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', closeDropdownByOutsideClick);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', closeDropdownByOutsideClick);
    };

  }, [dropdownRef]);
  
  return <div className={`${props.className ?? ''} ${styles.dropdown}`} ref={dropdownRef} id={'dropdown'}>
    <div
      className={`${styles.dropdown__toggler}`}
      onClick={() => setIsShowDropdown(!isShowDropdown)}>
      {props.toggler}
    </div>
    <div className={`${styles.dropdown__menu} ${styles[`dropdown__menu--${props.type}`]} ${styles[`dropdown__menu--${props.align}`]} ${isShowDropdown ? styles.show : ''}`}>
      {props.children}
    </div>
  </div>;
}
