import React from 'react';
import GeneralSettings from 'src/components/account/general-settings';
import Wallet from 'src/components/account/wallet';
import Notifications from 'src/components/account/notifications';
import Block from 'src/components/block/block';
import Tabs from 'src/components/tabs/tabs';

export default function AccountTabs() {
  const tabs = [
    {
      title: 'General',
      content: <GeneralSettings/>
    },
    {
      title: 'Wallet',
      content: <Wallet/>
    },
    /*{
      title: 'Notification',
      content: <Notifications/>
    }*/
  ];

  return <Block
    bg={'light'}
    className={'block--pt-0'}
    modifier={'tabs'}
    containerMod={'sm'}>
    <Tabs
      tabs={tabs}
      modifier={'wide'}/>
  </Block>;

}
