import React from 'react';
import Layout from 'src/components/layout';
import DividedPage from 'src/components/divided-page/divided-page';
import CustomHead from 'src/components/head/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { faqContent } from 'src/resources/content/faq';

export default function FaqPage() {
  return (
    <Layout headerBg={'light'}>
      <CustomHead title="FAQ | GrandBazar.io" description="" />
      <DividedPage content={faqContent} type={'faq'} pageTitle={'Help Center'}/>
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
