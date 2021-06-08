import dbConnect from 'src/db/db-connect';
import NftItem from 'src/models/NftItem';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getExtendedItems } from 'src/utils/request';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { offer, auction, type, author, owner, sort, limit, offset = 0 } = req.body;

        let nfts;
        let filters = [];
        // if offer doesn't exist: .find({ $or: [ { offer: { $exists: false } },  { offer: { $eq : null } } ] })

        type && filters.push({ type });
        author && filters.push({ author });
        owner && filters.push({ owner });

        if (offer && auction) {
          filters.push({ $or: [{ offer: { $ne: null } }, { auction: { $ne: null } }] });
        } else {
          offer && filters.push({ offer: { $ne: null } });
          auction && filters.push({ auction: { $ne: null } });
        }

        let args = filters.length > 1 ? { $and: filters } : filters.length ? filters[0] : {};

        nfts = await NftItem.find(args).sort({ id: -1 });

        let filterItems = await getExtendedItems(nfts.map(nft => nft.toObject()));
        let sortedItems;

        if (filterItems && sort) {
          if (sort === 'decrease-price') {
            sortedItems = filterItems.length
              ? filterItems.sort((a, b) => {
                const itemPrice = a?.offerDetails?.price ?? a?.auctionDetails?.currentBid ??  a?.auctionDetails?.startPrice;
                const nextItemPrice = b?.offerDetails?.price ?? b?.auctionDetails?.currentBid ??  b?.auctionDetails?.startPrice;

                return Number(nextItemPrice) - Number(itemPrice);
              })
              : [];
          } else if (sort === 'increase-price') {
            sortedItems = filterItems.length
              ? filterItems.sort((a, b) => {
                const itemPrice = a?.offerDetails?.price ?? a?.auctionDetails?.currentBid ??  a?.auctionDetails?.startPrice;
                const nextItemPrice = b?.offerDetails?.price ?? b?.auctionDetails?.currentBid ??  b?.auctionDetails?.startPrice;

                return Number(itemPrice) - Number(nextItemPrice);
              })
              : [];
          }
        }

        let items = sortedItems ?? filterItems;

        if (items) {
          res.status(200).json({
            items: items.length ? items.slice(Number(offset), Number(limit) + Number(offset)) : [],
            count: items.length ?? 0,
          });
        } else {
          res.status(404).json('Items not found');
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;
    default:
      res.status(405).json('Method Not Allowed');
      break;
  }
};
