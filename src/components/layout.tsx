import React, { ReactNode } from 'react';

import Header from 'src/components//header/header';
import Footer from 'src/components//footer/footer';
import { ModalProvider } from 'src/components/modal/modal-provider';
import Modal from 'src/components/modal/modal';
import { ExtratonProvider } from './extraton/extraton-provider';
import { ToastContainer } from 'react-toastify';
import { GlobalProvider } from './global-provider';

type LayoutPropTypes = {
  children: ReactNode;
  isMainPage?: boolean;
  headerBg: 'brand' | 'light';
}

export default function Layout({ children, isMainPage, headerBg }: LayoutPropTypes): JSX.Element  {
  return <GlobalProvider>
    <ExtratonProvider>
      <ModalProvider>
        <Header isMainPage={isMainPage ?? false} bg={headerBg} />
        {children}
        <Footer/>
        <Modal/>
        <ToastContainer
          position="bottom-right"
          autoClose={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
      </ModalProvider>
    </ExtratonProvider>
  </GlobalProvider>;
}
