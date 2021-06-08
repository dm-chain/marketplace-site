import React, { ReactNode, useState } from 'react';

const ModalContext = React.createContext<TContextModal>({
  isShowModal: false,
  setIsShowModal: () => null,
  processingModal: false,
  setProcessingModal: () => null,
  scrollbarWidth: 0,
  setScrollbarWidth: () => null,
  modalContent: <></>,
  setModalContent: () => null,
  isShowMobileMenu: false,
  setIsShowMobileMenu: () => null
});

type ModalProviderProps = {
  children: ReactNode
};

export function ModalProvider({ children }: ModalProviderProps) {
  const [processingModal, setProcessingModal] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(<></>);
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);
  const [isShowMobileMenu, setIsShowMobileMenu] = useState<boolean>(false);

  return (
    <ModalContext.Provider
      value={{ isShowModal, setIsShowModal, processingModal, setProcessingModal, scrollbarWidth, setScrollbarWidth, modalContent, setModalContent, isShowMobileMenu, setIsShowMobileMenu }}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
