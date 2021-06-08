import React, { useContext } from 'react';

import Container from 'src/components/container/container';

import styles from 'src/components/text-content/scss/text-content.module.scss';
import GlobalContext from 'src/components/global-provider';

type TextContentProps = {
  content: string;
}

export default function TextContent({ content }: TextContentProps) {
  const { topline } = useContext(GlobalContext);

  return <Container mod={'sm'}>
    <div className={`${styles.content} ${topline ? styles['content--topline'] : ''}`} dangerouslySetInnerHTML={{ __html: content }}>
    </div>
  </Container>;
}
