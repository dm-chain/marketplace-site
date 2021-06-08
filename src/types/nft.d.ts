type TNftPrototype = {
  author: string;
  authorName: string;
  owner: string;
  file?: File | null;
  url: string;
  name: string;
  description: string;
  type: string;
  offer?: string;
  auction?: string;
  collectionId?: string | null;
};

type TCollectionPrototype = {
  slug: string;
  name: string;
  description: string;
  file: File | null;
};

interface ICollectionItem extends Omit<TColletionPrototype, 'file'> {
  slug: string;
  name: string;
  description: string;
  image: string;
  author: string;
}


interface ICollectionItemExtended extends ICollectionItem {
  author: TUser;
}

interface INftItem extends Omit<TNftPrototype, 'file'> {
  _id: string;
  type: string;
  id: string;
  wallet: string;
  dateCreated?: Date;
  dateModified?: Date;
  collectionId?: string | null;
  likes?: string[];
  auction?: string;
}

interface INftItemExtended extends INftItem {
  ownerProfile: TUser;
  authorProfile: TUser;
  offerDetails?: TOffer;
  collectionId?: ICollectionItem | string | null;
  auctionDetails?: TAuction;
}

type TOffer = {
  _id?: string;
  contractAddress: string;
  owner: string;
  item: string;
  price: number;
  totalPrice: number;
  dateCreated: Date;
  dateClosed?: Date;
  status: string;
};

type TBid = {
  sender: TUser,
  item: string,
  value: string,
  senderPubKey: string,
  dateCreated: Date
}

type TAuction = {
  _id?: string;
  contractAddress: string;
  owner: string;
  item: string;
  startPrice: number;
  startTime: string;
  endTime: string;
  duration: string;
  currentBid?: number;
  bids?: Array<TBid>
};

type TOfferExtended = TOffer & {
  ownerProfile: TUser | null;
}

type TWallet = {
  _id?: string;
  address: string;
  extratonAddress: string;
  profileId: string;
  publicKey: string;
};
