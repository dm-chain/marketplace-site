import dbConnect from 'src/db/db-connect';

import type { NextApiRequest, NextApiResponse } from 'next';
import Bid from 'src/models/Bid';
import Auction from '../../../models/Auction';
import { toObjId } from '../../../utils/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      const { id } = req.query;
      let auction;

      if (id && typeof id === 'string') {
        auction = await Bid.findOne({ _id: toObjId(id) }).populate('sender');
      }

      if (auction) {
        res.status(200).json(auction);
      } else {
        res.status(404).json('Item not found');
      }

      break;
    case 'POST':
      try {
        let bid = req.body;

        if (bid && bid.item && bid.sender && bid.value) {
          bid = new Bid(bid);

          res.status(201).json(await bid.save());
        } else {
          res.status(400).json('Wrong body params');
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
