import { siteUrl } from 'src/config/auth';
import ContractsControllerWeb from 'src/blockchain/contracts/ContractsControllerWeb';
import ExtratonClient from 'src/blockchain/extraton/ExtratonClient';
import { calculatePrice, checkWallet } from 'src/utils/common';

const requestApiJson = async (source: string, method: THttpMetod, body?: object): Promise<Response> => {
  return await fetch(siteUrl + source, {
    method: method,
    body: body ? JSON.stringify(body) : '',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const requestApiMultipart = async (source: string, method: THttpMetod, formData: FormData): Promise<Response> => {
  return await fetch(siteUrl + source, {
    method: method,
    body: formData,
  });
};

const putOnSale = async (
  client: ExtratonClient | null,
  item: INftItemExtended,
  price: string
): Promise<TCustomResponse> => {
  const controller = client ? new ContractsControllerWeb(client) : null;
  const key = await client?.getPublicKey();
  const address = await client?.getAddress();
  const wallet = key ? await getWallet(key) : null;
  let error;

  try {
    if (price && controller && key && address && wallet && checkWallet(wallet, item)) {
      const offerContractAddress = await controller.sellToken(key, wallet.address, parseFloat(price), item.id, address);

      if (offerContractAddress.contractAddress) {
        const offer: TOffer = {
          contractAddress: offerContractAddress.contractAddress,
          owner: item.owner,
          item: item.id,
          price: Number(price),
          totalPrice: Number(calculatePrice(Number(price))),
          dateCreated: new Date(),
          status: 'opened',
        };

        const resOffer = await requestApiJson('/api/offers', 'POST', offer);

        if (resOffer.status === 201) {
          const offer = await resOffer.json();

          const resUpdateItem = await requestApiJson('/api/items', 'PUT', {
            id: item.id,
            offer: offer._id,
          });

          if (resUpdateItem.status === 200) {
            return { offer };
          }
        }
      }
    }
  } catch (err) {
    error = err.text ? err.text : '';
  }

  return { error: error ?? 'Failed to put an item on sale. Please reload the page and try again.' };
};

const getOffer = async (offerId: string): Promise<TOffer | null> => {
  const resOffer = await fetch(`/api/offers?id=${offerId}`);

  if (resOffer.status === 200) {
    return await resOffer.json();
  } else {
    return null;
  }
};

const getAuction = async (auctionId: string): Promise<TAuction | null> => {
  const resAuction = await fetch(`/api/auctions?id=${auctionId}`);

  if (resAuction.status === 200) {
    return await resAuction.json();
  } else {
    return null;
  }
};

const getOfferByItemId = async (itemId: string): Promise<TOffer | null> => {
  const resOffer = await fetch(`/api/offers?itemId=${itemId}`);

  if (resOffer.status === 200) {
    return await resOffer.json();
  } else {
    return null;
  }
};

const getWallet = async (publicKey: string): Promise<TWallet | null> => {
  const resWallet = await fetch(`/api/wallets?publicKey=${publicKey}`);

  if (resWallet.status === 200) {
    return await resWallet.json();
  } else {
    return null;
  }
};

const getUser = async (userId: string): Promise<TUser | null> => {
  const resUser = await fetch(`${siteUrl}/api/users?userId=${userId}`);

  if (resUser.status === 200) {
    return await resUser.json();
  } else {
    return null;
  }
};

const getAllOffers = async (itemId: string): Promise<TOfferExtended[] | null> => {
  const resOffers = await fetch(`${siteUrl}/api/offers?itemId=${itemId}&status=closed&all=1`);
  let offersExtended: TOfferExtended[] = [];

  if (resOffers.status === 200) {
    const offers: TOffer[] = await resOffers.json();

    for (let offer of offers) {
      const owner = await getUser(offer.owner);
      offersExtended.push({ ...offer, ownerProfile: owner });
    }

    return offersExtended;
  } else {
    return null;
  }
};

const getFilteredItems = async (filterParams: FilterParams): Promise<TFilterResponse | null> => {
  const resFilter = await requestApiJson('/api/filter', 'POST', filterParams);

  if (resFilter.status === 200) {
    return await resFilter.json();
  } else {
    return null;
  }
};

const getNftItemExtended = async (item: INftItem): Promise<INftItemExtended> => {
  const resOwner = await fetch(`${siteUrl}/api/users?userId=${item.owner}`);
  let owner, offer, author, auction;

  if (resOwner.status === 200) {
    owner = await resOwner.json();
  }

  if (item.offer) {
    const resOffer = await fetch(`${siteUrl}/api/offers?id=${item.offer}`);

    if (resOffer.status === 200) {
      offer = await resOffer.json();
    }
  }

  if (item.auction) {
    const resAuction = await fetch(`${siteUrl}/api/auctions?id=${item.auction}`);

    if (resAuction.status === 200) {
      auction = await resAuction.json();
    }
  }

  if (item.author) {
    const resAuthor = await fetch(`${siteUrl}/api/users?userId=${item.author}`);

    if (resAuthor.status === 200) {
      author = await resAuthor.json();
    }
  }

  return {
    ...item,
    ownerProfile: owner ?? null,
    offerDetails: offer ?? null,
    authorProfile: author ?? null,
    auctionDetails: auction ?? null
  };
};

const getExtendedItems = async (items: INftItem[] | []): Promise<INftItemExtended[]> => {
  let tmpItems: INftItemExtended[] = [];

  for (let nft of items) {
    const nftItem = await getNftItemExtended(nft);
    tmpItems.push(nftItem);
  }

  return tmpItems;
};

const getOption = async (name: string): Promise<TOption | null> => {
  const resRate = await fetch(`${siteUrl}/api/options?name=${name}`);

  if (resRate.status === 200) {
    return await resRate.json();
  }

  return null;
};

export {
  requestApiJson,
  requestApiMultipart,
  putOnSale,
  getOffer,
  getOfferByItemId,
  getWallet,
  getNftItemExtended,
  getFilteredItems,
  getExtendedItems,
  getUser,
  getAllOffers,
  getAuction,
  getOption
};
