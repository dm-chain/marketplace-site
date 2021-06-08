import dbConnect from 'src/db/db-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import NftItem from 'src/models/NftItem';
import Profile from 'src/models/Profile';
import DirectOffer from 'src/models/DirectOffer';
import Collection from 'src/models/Collection';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { type } = req.query;
        let users,
          result,
          top = [];

        switch (type) {
          case 'buyers':
            users = await Profile.find();
            top = [];

            if (users && users.length) {
              for (let user of users) {
                const items = await NftItem.find({ $and: [{ owner: user.id }, { author: { $ne: user.id } }] });

                if (items && items.length) {
                  top.push({
                    profile: user,
                    items: items.length,
                  });
                }
              }
            }
            break;
          case 'sellers':
            users = await Profile.find();
            top = [];

            if (users && users.length) {
              for (let user of users) {
                const offers = await DirectOffer.find({ $and: [{ owner: user.id }, { status: 'closed' }] });

                if (offers && offers.length) {
                  top.push({
                    profile: user,
                    items: offers.length,
                  });
                }
              }
            }
            break;
          case 'collectors':
            users = await Profile.find();
            top = [];

            if (users && users.length) {
              for (let user of users) {
                const items = await NftItem.find({ owner: user.id });

                if (items && items.length) {
                  top.push({
                    profile: user,
                    items: items.length,
                  });
                }
              }
            }
            break;
          case 'collections':
            users = await Collection.find();
            top = [];

            if (users && users.length) {
              for (let user of users) {
                const items = await NftItem.find({ collectionId: user.id });

                if (items && items.length) {
                  top.push({
                    profile: user,
                    items: items.length,
                  });
                }
              }
            }
            break;
        }

        result = top.length ? top.sort((a, b) => b.items - a.items).slice(0, 4) : [];
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(err);
      }
      break;
    default:
      res.status(405).json('Method Not Allowed');
      break;
  }
};
