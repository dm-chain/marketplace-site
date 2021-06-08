import React, { useState, useContext, useRef, useEffect } from 'react';
import styles from 'src/components/modal/scss/modal.module.scss';
import ModalContext from 'src/components/modal/modal-provider';
import Close from 'src/resources/img/close.svg';
import { isMobileDevice } from 'src/resources/ts/_functions';
// @ts-ignore
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

/*
to open:
const { setIsShowModal, setModalContent } = useContext(ModalContext);
setModalContent(<ContentComponent/>);
setIsShowModal(true);
(ModalToggler or ButtonModal)

to close:
const { setIsShowModal } = useContext(ModalContext);
setIsShowModal(false)
*/

export default function Modal() {
  const [closingModal, setClosingModal] = useState(false);
  const { isShowMobileMenu, setIsShowMobileMenu, isShowModal, setIsShowModal, modalContent, setProcessingModal, setScrollbarWidth } = useContext(ModalContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    let openModal = () => {
      if (isShowMobileMenu) {
        setIsShowMobileMenu(false);
      }

      let body = document.body;

      if (!isMobileDevice()) {
        let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        body.style.paddingRight = scrollbarWidth + 'px';
        body.classList.add('modal-open');
        setProcessingModal(true);
        setScrollbarWidth(scrollbarWidth);
      }

      if (isMobileDevice()) {
        disableBodyScroll(modalRef.current);
      }

      setTimeout(() => {
        setIsOpenModal(isShowModal);
      }, 200);
    };

    let closeModal = () => {
      setIsOpenModal(false);
      setProcessingModal(true);
      setClosingModal(!closingModal);

      let body = document.body;

      if (isMobileDevice()) {
        enableBodyScroll(modalRef.current);
      }

      setTimeout(() => {
        setClosingModal(closingModal);
        setProcessingModal(false);
        body.classList.remove('modal-open');
        body.style.paddingRight = '';
      }, 200);
    };

    isShowModal ? openModal() : closeModal();
  }, [isShowModal]);

  let closeModalByClick = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current || e.target === closeBtnRef.current) {
      setIsShowModal(false);
    }
  };
  
  return (
    <div
      className={`${styles.modal} ${isOpenModal ? styles.show : ''} ${closingModal ? `${styles.show} ${styles.out}` : ''}`}
      ref={modalRef}>
      {
        isOpenModal && <div
          className={styles.modal__overlay}
          ref={overlayRef}
          onClick={closeModalByClick}>
          <div className={styles.modal__popup}>
            <div className={styles.modal__content}>
              <button
                ref={closeBtnRef}
                className={styles.modal__close}
                onClick={closeModalByClick}><Close/></button>
              {modalContent}
            </div>
          </div>
        </div>
      }
    </div>
  );
}
