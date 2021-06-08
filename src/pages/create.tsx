import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Layout from 'src/components/layout';
import CustomHead from 'src/components/head/head';
import Create from 'src/components/create/create';
import { siteUrl } from 'src/config/auth';

type CreateProps = {
  profile: TUser;
  collections: ICollectionItem[];
}

export default function CreatePage({ profile, collections }: CreateProps) {
  return (
    <Layout headerBg={'light'}>
      <CustomHead title="Create your NFT | GrandBazar.io" description="" />
      <Create profile={profile} collections={collections}/>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session =  await getSession(context);
  // @ts-ignore
  const profile: TUser = session?.profile;
  let collections: ICollectionItem[] = [];

  if (profile) {
    const resCollections = await fetch(`${siteUrl}/api/collections?author=${profile._id}`);

    if (resCollections.status === 200) {
      collections = await resCollections.json();
    }
  }

  return {
    props: {
      profile: profile ?? null,
      collections: collections,
      session: await getSession(context)
    }
  };
};
