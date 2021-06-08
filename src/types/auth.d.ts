type TProvider = {
  callbackUrl?: string;
  id: string;
  name: string;
  signinUrl: string;
  type: 'oauth';
};

type TGithubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};
