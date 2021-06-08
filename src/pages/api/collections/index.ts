import dbConnect from 'src/db/db-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import Collection from 'src/models/Collection';
import { toObjId } from 'src/utils/common';
import Profile from '../../../models/Profile';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  let {
    query: { author, slug, limit },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        let collection;

        if (author && typeof author === 'string') {
          collection = await Collection.find({ author: toObjId(author) });
        } else if (slug) {
          collection = await Collection.findOne({ slug }).populate('author');
        } else if (limit) {
          collection = await Collection.find().populate('author').limit(Number(limit));
        }

        if (collection) {
          res.status(200).json(collection);
        } else {
          res.status(404).json('Collection not found');
        }
        
      } catch (error) {
        res.status(400).json(error);
      }

      break;

    case 'POST':
      try {
        let fields = req.body;
        let collection = await Collection.findOne({ slug: fields.slug });

        if (collection) {
          res.status(409).json(collection);
        } else {
          collection = new Collection(fields);

          res.status(201).json(await collection.save());
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;

    case 'PUT':
      try {
        const collection = await Collection.findOneAndUpdate({ _id: toObjId(req.body._id) }, req.body);

        collection ? res.status(200).json(collection) : res.status(404).json('User not found');
      } catch (error) {
        res.status(400).json(error);
      }

      break;
    default:
      res.status(405).json('Method Not Allowed');
      break;
  }
};
