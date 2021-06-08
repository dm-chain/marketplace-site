import React from 'react';

import Layout from 'src/components/layout';
import CustomHead from 'src/components/head/head';
import Report from 'src/components/report/scss/report';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

export default function ReportPage() {
  return (
    <Layout headerBg={'light'}>
      <CustomHead title="Report | GrandBazar.io" description="" />
      <Report />
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
