import React from 'react';
import styles from './scss/footer-form.module.scss';
import Block from '../block/block';
import Form from '../forms/form/form';

export default function FooterForm() {
  const fields: Field[] = [
    {
      id: 'input-0',
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      required: true
    },
  ];

  return <div className="block block--brand">
    <Block bg={'brand'}>
      <div className={styles.formBlock}>
        <h2 className={styles.formBlock__title}>
          Never miss a drop
        </h2>
        <div className={styles.formBlock__description}>
          Subscribe to our ultra-exclusive drop list and be the first to know about upcoming Nifty drops.
        </div>
        <div>
          <Form
            type='tiny'
            title={''}
            fields={fields}/>
        </div>
      </div>
    </Block>
  </div>;
}
