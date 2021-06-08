import dbConnect from 'src/db/db-connect';
import Option from 'src/models/Option';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  let {
    query: { name },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        let option = name ? await Option.findOne({ name }) : null;

        if (option) {
          res.status(200).json(option);
        } else {
          res.status(404).json('Option not found');
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
