import React from 'react';
import App, { AppContext, AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

import 'src/resources/styles/style.scss';
import { Session } from 'next-auth';

function BazarApp({ Component, pageProps }: AppProps, session: Session) {
  return (
    <Provider session={pageProps.session} options={pageProps.options}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default BazarApp;

BazarApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  // session is null if remove context
  // const session = await getSession(context);
  // console.log(session);

  return {
    ...appProps,
    // session
  };
};
