type TUser = {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  image: string;
  defaultImage: string;
  cover?: string;
  bio?: string;
  email?: string;
  items?: {
    onsale: TNftItem[];
    author: TNftItem[];
    owner: TNftItem[];
  };
  extraton?: {
    walletAddress: string;
    walletPublicKey: string;
  };
};

type TUserSession = {
  accessToken: string;
  expire: string;
  user: TUser;
  profile: TUser;
};

type TProfileSettings = {
  name: string;
  slug: string;
  bio: string;
  email: string;
};
