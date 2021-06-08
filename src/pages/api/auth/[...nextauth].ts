import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import Providers, { AppProviders } from 'next-auth/providers';
import { providers, siteUrl } from 'src/config/auth';
import { MONGODB_URI } from 'src/config/db';
import { sendEmail } from 'src/utils/common';
// import { ENV_DEV } from 'src/config/app';

import type { NextApiRequest, NextApiResponse } from 'next';

import { createHash } from 'src/utils/common';
import { requestApiJson } from 'src/utils/request';

const options: NextAuthOptions = {
  providers: Object.keys(providers).reduce<AppProviders>((appProviders: AppProviders, providerName: string) => {
    appProviders.push(Providers[providerName](providers[providerName]));

    return appProviders;
  }, []),

  // debug: ENV_DEV,

  callbacks: {
    signIn: async (user: User, account) => {
      if (user.id) {
        if (account && account.provider === 'github') {
          // https://developer.github.com/v3/users/emails/#list-email-addresses-for-the-authenticated-user
          const githubRes = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `token ${account.accessToken}`,
            },
          });

          const emails = await githubRes.json();

          if (emails && emails.length !== 0) {
            // Get primary email - the user may have several emails, but only one of them will be primary
            const githubEmail = emails.filter((email: TGithubEmail) => email.primary);

            if (githubEmail.length) {
              user.email = githubEmail[0].email;
            }
          }
        }

        const res = await requestApiJson('/api/users', 'POST', user);

        if (res.status === 201) {
          const newUser = await res.json();
          const resSend = await sendEmail({
            subject: 'New registration',
            name: newUser.name,
            email: newUser.email });
        } else if (res.status !== 409) {
          // if user was not created
          return Promise.resolve(false);
        }
      }

      return Promise.resolve(true);
    },

    jwt: async (token, user) => {
      user && (token.user = user);

      return Promise.resolve(token);
    },

    session: async (session: Session, user: User) => {
      if (user.email) {
        const hash = createHash(user.email);
        const res = await fetch(`${siteUrl}/api/users/?userId=${hash}`);

        if (res.status === 200) {
          const data = await res.json();

          if (data._id) {
            session.profile = data;
          }
        } else {
          session.profile = {};
        }
      }

      session.user = user;

      return Promise.resolve(session);
    },
  },

  database: MONGODB_URI,
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
