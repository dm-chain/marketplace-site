import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from 'src/components/header/search/scss/search.module.scss';
import dropdown from 'src/components/dropdown/scss/dropdown.module.scss';
import { siteUrl } from 'src/config/auth';

export default function Search() {
  const searchRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(false);
  const [results, setResults] = useState([]);

  const findResults = useCallback((event) => {
    const query = event.target.value;
    setQuery(query);

    if (query.length) {
      fetch(`${siteUrl}/api/search?q=${query}`)
        .then(res => res.json())
        .then(res => {
          setResults(res);
          setActive(res.length > 0);
        });
    } else {
      setResults([]);
      setActive(false);
    }
  }, []);

  useEffect(() => {
    let closeSearchByOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener('mousedown', closeSearchByOutsideClick);

    return () => {
      document.removeEventListener('mousedown', closeSearchByOutsideClick);
    };

  }, [searchRef]);

  return <>
    <div ref={searchRef} id="search">
      <form className={styles.search}>
        <label htmlFor="searchItems" className={styles.search__label}>Search</label>
        <input 
          id="searchItems" 
          type="text" 
          className={styles.search__input} 
          placeholder="Search items"
          onChange={findResults}
          onFocus={() => setActive(results.length > 0)}
          autoComplete="off"
          value={query}
        />
      </form>
      {
        active && <div className={`${dropdown.dropdown}`}>
          <div className={`${styles.search__menu} ${styles.search__menu} ${active ? styles.show : ''}`}>
            <div className={dropdown.dropdown__main}>
              <div className={dropdown.dropdown__list}>
                {
                  results.length > 0 && results.map((item: INftItem, key) => 
                    <a
                      key={key} 
                      href={`${siteUrl}/item/${item.id}`} 
                      className={dropdown['dropdown__list-item']}>{item.name}
                    </a>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  </>;
}
