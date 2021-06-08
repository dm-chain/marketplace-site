import React from 'react';
import Layout from 'src/components/layout';
import MainScreenInner from 'src/components/main-screen/main-screen-inner';
import CustomHead from 'src/components/head/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { UserProvider } from 'src/components/user-provider/user-provider';
import AccountTabs from 'src/components/account/account-tabs';

type UserPagePropTypes = {
  user: TUser;
  session: TUserSession;
}

export default function AccountPage({ user }: UserPagePropTypes) {
  return <>
    <CustomHead title="Account settings | GrandBazar.io" description="" />
    <UserProvider user={user}>
      <Layout headerBg={'light'}>
        <MainScreenInner
          containerSize={'sm'}
          title={'Account settings'}
          description={'You can set preferred display name, ' +
        'create your branded profile URL and manage other personal settings'}
          paddings={'base'}/>
        <AccountTabs/>
      </Layout>
    </UserProvider>
  </>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = session ? session.profile : null;

  if (!user) {
    context.res.writeHead(302, { Location: '/' });
    context.res.end();
  }

  return {
    props: {
      session,
      user
    }
  };
};
