import React from 'react';

import Layout from 'src/components/layout';
import CustomHead from 'src/components/head/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { changelog } from 'src/resources/content/changelog';
import DividedPage from 'src/components/divided-page/divided-page';

export default function FaqPage() {
  return (
    <Layout headerBg={'light'}>
      <CustomHead title="Changelog | GrandBazar.io" description="" />
      <DividedPage content={changelog} type={'changelog'} pageTitle={'Changelog'}/>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await getSession(context)
    }
  };
};
