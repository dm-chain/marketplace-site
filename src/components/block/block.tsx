import React, { ReactNode } from 'react';
import styles from 'src/components/block/scss/block.module.scss';
import Container from 'src/components/container/container';

type BlockPropTypes = {
  children: ReactNode;
  bg: string;
  borders?: boolean;
  slider?: boolean;
  className?: string;
  containerMod?: 'sm' | 'flex';
  modifier?: 'tabs' | 'border-bottom';
}

export default function Block(props: BlockPropTypes) {
  return (
    <section className={`${styles.block} ${styles['block--' + props.bg]} ${props.borders ? styles['block--bordered'] : ''} ${props.className ? styles[props.className] : ''}  ${props.modifier ? styles[`block--${props.modifier}`] : ''}`}>
      <Container
        mobWide={props.slider}
        mod={props.containerMod}>
        {props.children}
      </Container>
    </section>
  );
}
