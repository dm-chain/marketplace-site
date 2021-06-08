import React, { useState } from 'react';
import styles from 'src/components/account/scss/settings.module.scss';

import FormControl from 'src/components/forms/form-control/form-control';
import Toggler from 'src/components/forms/toggler/toggler';

export default function Notifications() {
  const inputs = [
    {
      title: 'Item Sold',
      id: 'Item_Sold',
      description: 'When someone purchased one of your items',
      checked: true
    },
    {
      title: 'Bid Activity',
      id: 'Bid_Activity',
      description: 'When someone bids on one of your items',
      checked: true
    },
    {
      title: 'Price Change',
      id: 'Price_Change',
      description: 'When an item you made an offer on changes in price',
      checked: true
    },
    {
      title: 'Auction Expiration',
      id: 'Auction_Expiration',
      description: 'When a Dutch or English auction you created ends',
      checked: true
    },
    {
      title: 'Outbid',
      id: 'Outbid',
      description: 'When an offer you placed is exceeded by another user',
      checked: true
    },
    {
      title: 'Referral Successful',
      id: 'Referral_Successful',
      description: 'When an item you referred is purchased',
      checked: false
    },
    {
      title: 'Owned Asset Updates',
      id: 'Owned_Asset_Updates',
      description: 'When a significant update occurs for one of the items you have purchased on GrandBazar',
      checked: false
    },
    {
      title: 'Successful Purchase',
      id: 'Successful_Purchase',
      description: 'When you successfully buy an item',
      checked: false
    },
    {
      title: 'GrandBazar Newsletter',
      id: 'OpenSea_Newsletter',
      description: 'Occasional updates from the GrandBazar team',
      checked: false
    }
  ];

  return  <div className={styles.settings}>
    <div className={styles.settings__title}>Notification Settings</div>
    <div className={styles.settings__description}>Select which notifications you would like to receive for 0x52cb...8b05</div>
    <div className={styles.settings__block}>
      <div className={styles.settings__item}>
        <div className={styles['settings__bid-input']}>
          <FormControl
            id={'minimum_bid'}
            name={'minimum_bid'}
            type={'text'}
            label={'Minimum Bid Threshold'}
            defaultValue={'0.05'}
            suffix={'TON Crystals'}/>
          <div className={styles['settings__bid-info']}>~$10.35</div>
        </div>
        <div className={styles['settings__bid-info']}>Receive notifications only when you receive offers with a value greater than or equal to this amount of ETH.</div>
      </div>
      {inputs.map((input, key) => <div key={key} className={styles.settings__item}>
        <Toggler
          name={input.id}
          id={input.id}
          title={input.title}
          description={input.description}
          checked={input.checked}/>
      </div>)}
    </div>
  </div>;
}
