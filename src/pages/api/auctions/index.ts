import dbConnect from 'src/db/db-connect';

import type { NextApiRequest, NextApiResponse } from 'next';
import Auction from 'src/models/Auction';
import { toObjId } from 'src/utils/common';
import ContractsController from 'src/blockchain/contracts/ContractsControllerNode';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      const { id } = req.query;
      let auction;

      if (id && typeof id === 'string') {
        auction = await Auction.findOne({ _id: toObjId(id) });
      }

      if (auction) {
        res.status(200).json(auction);
      } else {
        res.status(404).json('Item not found');
      }

      break;
    case 'POST':
      try {
        let auction = req.body;

        // && offer.contractAddress
        if (auction && auction.item && auction.owner && auction.startPrice && auction.endTime && auction.contractAddress) {

          // TODO: get endTime
          const contracts = new ContractsController();
          const auctionContract = await contracts.getAuctionContract(auction.contractAddress);

          auction = new Auction(auction);
          res.status(201).json(await auction.save());
        } else {
          res.status(400).json('Wrong body params');
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;

    case 'PUT':
      try {
        const { id, bid, currentBid } = req.body;
        if (id && bid && currentBid) {
          const auction = await Auction.findOneAndUpdate(
            { _id: toObjId(id) },
            { $push: { bids: bid }, currentBid },
            {
              new: true,
              runValidators: true,
            }
          );

          auction ? res.status(200).json(auction) : res.status(404).json('Auction not found');
        } else {
          res.status(404).json('Wrong body params');
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
