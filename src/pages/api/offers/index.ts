import dbConnect from 'src/db/db-connect';

import type { NextApiRequest, NextApiResponse } from 'next';
import DirectOffer from 'src/models/DirectOffer';
import { toObjId } from 'src/utils/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { id, itemId, all, status } = req.query;

        let offer;
        if (id && typeof id === 'string') {
          offer = await DirectOffer.findOne({ _id: toObjId(id) });
        } else if (itemId && all && status) {
          offer = await DirectOffer.find({ item: itemId, status });
        } else if (itemId) {
          offer = await DirectOffer.findOne({ item: itemId, status: 'opened' });
        }

        if (offer) {
          res.status(200).json(offer);
        } else {
          res.status(404).json('Item not found');
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;
    case 'POST':
      try {
        const offer = req.body;

        if (offer && offer.contractAddress && offer.item && offer.owner && offer.price) {
          const directOffer = new DirectOffer(offer);
          res.status(201).json(await directOffer.save());
        } else {
          res.status(400).json('Wrong body params');
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;

    case 'PUT':
      try {
        const { id, status } = req.body;
        if (id && status) {
          const offer = await DirectOffer.findOneAndUpdate(
            { _id: toObjId(id) },
            { status, dateClosed: new Date() },
            {
              new: true,
              runValidators: true,
            }
          );

          offer ? res.status(200).json(offer) : res.status(404).json('Offer not found');
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
