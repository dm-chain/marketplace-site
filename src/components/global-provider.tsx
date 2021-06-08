import React, { ReactNode, useEffect, useState } from 'react';
import { getOption } from '../utils/request';

const GlobalContext = React.createContext<TContextGlobal>({
  topline: true,
  setTopline: () => null,
  windowSize: 0,
  showTopLoader: false,
  setShowTopLoader: () => null,
  rate: null,
});

type GlobalProviderProps = {
  children: ReactNode
};

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [topline, setTopline] = useState(false);
  const [windowSize, setWindowSize] = useState(0);
  const [showTopLoader, setShowTopLoader] = useState(false);
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();

    (async () => {
      const rate = await getOption('rate_usd');
      setRate(Number(rate?.value));
    })();

    const sessionTopline = sessionStorage.getItem('topline');

    if (!sessionTopline) {
      setTopline(true);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <GlobalContext.Provider
      value={{ rate, topline, setTopline, windowSize, showTopLoader, setShowTopLoader }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContext;
