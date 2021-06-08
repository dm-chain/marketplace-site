import React from 'react';
import Head from 'next/head';
import { APP_NAME } from 'src/config/app';

type THeadProps = {
  title?: string;
  description?: string;
}

export default function CustomHead({ title = APP_NAME, description = '' }: THeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#FFFFFF" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      {/* Metrika */}
      <script dangerouslySetInnerHTML={{ __html: '!function(e,t,a,n,c,m,r){e.ym=e.ym||function(){(e.ym.a=e.ym.a||[]).push(arguments)},e.ym.l=1*new Date,m=t.createElement(a),r=t.getElementsByTagName(a)[0],m.async=1,m.src="https://mc.yandex.ru/metrika/tag.js",r.parentNode.insertBefore(m,r)}(window,document,"script"),ym(79447927,"init",{clickmap:!0,trackLinks:!0,accurateTrackBounce:!0,webvisor:!0});' }} />
      {/* GA */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-LT69CN5MQF"></script>
      <script dangerouslySetInnerHTML={{ __html: 'function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-LT69CN5MQF");' }}/>
    </Head>
  );
}
