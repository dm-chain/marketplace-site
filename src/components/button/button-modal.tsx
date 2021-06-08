import React, { ReactNode, useContext } from 'react';
import { isMobileDevice } from 'src/resources/ts/_functions';
import ModalContext from 'src/components/modal/modal-provider';
import Button, { ButtonProps } from 'src/components/button/button';

type ButtonModalProps = ButtonProps & {
  modalContent: ReactNode;
}

export default function ButtonModal(props : ButtonModalProps) {
  const { setIsShowModal, setModalContent } = useContext(ModalContext);

  let openModal = (isShowModal: boolean) => {
    setIsShowModal(isShowModal);
    setModalContent(props.modalContent);
  };

  return (
    <Button
      size={props.size}
      style={props.style}
      className={props.className}
      type={props.type}
      transform={props.transform}
      group={props.group}
      disabled={props.disabled}
      role={props.role}
      direction={props.direction}
      aria={props.aria}
      icon={props.icon}
      iconLocation={props.iconLocation}
      onClick={(e) => {props.onClick && props.onClick(e); openModal(true);}}>
      {props.children}
    </Button>
  );
}
