import React, { ReactNode, useContext } from 'react';
import ModalContext from 'src/components/modal/modal-provider';
import styles from 'src/components/modal/scss/modal.module.scss';

type ModalTogglerProps = {
  children: React.ReactNode;
  modalContent: ReactNode;
  className: string;
}

export default function ModalToggler({ children, modalContent, className }: ModalTogglerProps) {
  const { setIsShowModal, setModalContent } = useContext(ModalContext);

  let openModal = (isShowModal: boolean) => {
    setModalContent(modalContent);
    setIsShowModal(isShowModal);
  };

  return (
    <div className={`${className} ${styles['modal-toggler']}`} onClick={() => openModal(true)}>
      {children}
    </div>
  );
}
