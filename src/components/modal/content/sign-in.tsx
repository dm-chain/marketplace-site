import React from 'react';
import { signIn } from 'next-auth/client';
import { endpoints, providers } from 'src/config/auth';

import styles from 'src/components/modal/scss/modal.module.scss';
import ButtonSignIn from 'src/components/button/button-sign-in';
import GoogleIcon from 'src/resources/img/google.svg';
import GitHubIcon from 'src/resources/img/github.svg';

const autProviders = Object.keys(providers).reduce<TProvider[]>((providers, providerName: string) => {
  const providerNameLC = providerName.toLowerCase();

  providers.push({
    callbackUrl: endpoints.callback,
    id: providerNameLC,
    name: providerName,
    signinUrl: endpoints.signin + providerNameLC,
    type: 'oauth'
  });

  return providers;
}, []);

export default function SignIn() {
  const icons = {
    Google: <GoogleIcon/>,
    GitHub: <GitHubIcon/>,
  };

  return <>
    <div className={styles.modal__header}>
      <div className={styles.modal__title}>Sign In</div>
    </div>
    <div className={styles.modal__main}>
      {/*<div className={styles['modal__main-content']}></div>*/}
      {
        autProviders.map((provider: TProvider, key) => 
          <ButtonSignIn
            key={key}
            onClick={() => signIn(provider.id)}
            size={'wide'}
            style={'empty'}
            className={styles.modal__btn}
            icon={icons[provider.name]}>Sign in with {provider.name}</ButtonSignIn>
        )
      }
    </div>
  </>;
}
