import React from 'react';
import { GetServerSideProps  } from 'next';
import { getSession } from 'next-auth/client';
import { siteUrl } from 'src/config/auth';
import Layout from 'src/components/layout';
import MainScreenUser from 'src/components/main-screen/main-screen-user';
import UserCollections from 'src/components/user-collections/user-collections';
import { UserProvider } from 'src/components/user-provider/user-provider';
import CustomHead from 'src/components/head/head';
import { getFilteredItems } from 'src/utils/request';

type UserPagePropTypes = {
  user: TUser;
  session: TUserSession;
  onSaleItems: TFilterResponse
  ownerItems: TFilterResponse,
  authorItems: TFilterResponse,
}

export default function UserPage({ user, session, onSaleItems, ownerItems, authorItems }: UserPagePropTypes) {
  const isAuthorizedUser = session && session.profile && user.id === session.profile.id;

  return <>
    <CustomHead
      title={`${user.name}'s gallery | GrandBazar.io`}
      description={user.bio}/>
    <UserProvider isAuthorized={isAuthorizedUser} user={session?.profile}>
      <Layout headerBg={'light'}>
        <MainScreenUser profile={user}/>
        <UserCollections
          user={user}
          onSaleItems={onSaleItems}
          authorItems={authorItems}
          ownerItems={ownerItems}/>
      </Layout>
    </UserProvider>
  </>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = context.query;
  const res = await fetch(`${siteUrl}/api/users?slug=${userId}`);

  if (res.status === 200) {
    const user = await res.json();

    let onSaleItems = await getFilteredItems({
      offer: true,
      auction: true,
      owner: user.id,
      limit: 12
    });

    let ownerItems = await getFilteredItems({
      owner: user.id,
      limit: 12
    });

    let authorItems = await getFilteredItems({
      author: user.id,
      limit: 12
    });

    return {
      props: {
        onSaleItems,
        ownerItems,
        authorItems,
        user,
        session: await getSession(context)
      },
    };
  } else {
    const errorCode = res.status;

    if (errorCode) {
      context.res.writeHead(302, { Location: '/' });
      context.res.end();
    }

    return {
      props: {
        errorCode
      }
    };
  }
};
