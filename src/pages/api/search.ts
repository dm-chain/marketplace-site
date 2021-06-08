import dbConnect from 'src/db/db-connect';
import NftItem from 'src/models/NftItem';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();

    const items = await NftItem.find({ name: { $regex: `${req.query.q}`, $options: 'i' } }).limit(5);

    if (items) {
      res.status(200).json(items);
    } else {
      res.status(404);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
