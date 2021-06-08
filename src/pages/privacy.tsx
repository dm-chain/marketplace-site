import React from 'react';

import Layout from 'src/components/layout';
import CustomHead from 'src/components/head/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import TextContent from 'src/components/text-content/text-content';
import { privacy } from 'src/resources/content/legal';

export default function PrivacyPage() {
  return (
    <Layout headerBg={'light'}>
      <CustomHead title="Report | GrandBazar.io" description="" />
      <TextContent content={privacy} />
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
