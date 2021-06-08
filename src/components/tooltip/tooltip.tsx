import React from 'react';
import styles from 'src/components/tooltip/scss/tooltip.module.scss';
import TooltipIcon from 'src/resources/img/tooltip.svg';

type TooltipProps = {
    content: string;
}

export default function Tooltip(props: TooltipProps) {
  return  <button type="button" className={`${styles.tooltip__btn} ${styles.open}`}>
    <TooltipIcon/>
    <div className={`${styles.tooltip} ${styles['tooltip--right-md']}`}>{props.content}</div>
  </button>;
}
