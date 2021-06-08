import dbConnect from 'src/db/db-connect';
import NftItem from 'src/models/NftItem';
import Wallet from 'src/models/Wallet';
import ContractsController from 'src/blockchain/contracts/ContractsControllerNode';

import type { NextApiRequest, NextApiResponse } from 'next';
import { toObjId } from 'src/utils/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { id, collectionId, auction, limit } = req.query;
        let nft;

        if (id) {
          nft = await NftItem.findOne({ id }).populate('collectionId');
        } else if (collectionId) {
          nft = await NftItem.find({ collectionId }).sort({ dateCreated: -1 });
        } else if (auction && limit) {
          nft = await NftItem
            .find({ $and: [ { auction: { $exists: true } }, { auction: { $ne : null } } ] })
            .populate('collectionId')
            .sort({ id: -1 })
            .limit(Number(limit));
        } else {
          nft = await NftItem.find().sort({ id: -1 });
        }

        if (nft) {
          res.status(200).json(nft);
        } else {
          res.status(404).json('Item not found');
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;
    case 'POST':
      try {
        const { name, author, authorName, url, description, type, publicKey, collectionId } = req.body;

        if (name && author && url) {
          let wallet = await Wallet.findOne({ publicKey });

          if (wallet) {
            const contracts = new ContractsController();
            const walletAddress = wallet.address;
            const tokenId = await contracts.mintToken({ name, authorName, url });

            await contracts.grantToken({ tokenId, walletAddress });

            const nft = new NftItem({
              id: tokenId,
              owner: author,
              author,
              authorName,
              name,
              url,
              type,
              description,
              wallet: wallet._id,
              dateCreated: new Date(),
              collectionId: typeof collectionId === 'string' ? toObjId(collectionId) : null
            });

            contracts.clientClose();
            res.status(201).json(await nft.save());
          } else {
            res.status(400).json('No such wallet');
          }
        } else {
          res.status(400).json('Wrong body params');
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;

    case 'PUT':
      try {
        const { id, cancel, offer, owner, wallet, like, auction, type } = req.body;
        let nft;

        if (type === 'auction_closed') {
          nft = await NftItem.findOneAndUpdate(
            { id },
            { $unset: { auction: '' } },
            { new: true, runValidators: true });
        } else if (cancel || offer || auction) {
          // update on sell|cancel sell
          nft = await NftItem.findOneAndUpdate({ id }, req.body, { new: true, runValidators: true });
        } else if (owner && wallet) {
          // update on buy
          nft = await NftItem.findOneAndUpdate(
            { id },
            { $unset: { offer: '', auction: '' }, owner, wallet }
          );
        } else if (like) {
          // update on like
          let oldNft = await NftItem.findOne({ id });

          if (oldNft) {
            if (oldNft.likes.includes(like)) {
              nft = await NftItem.findOneAndUpdate(
                { id },
                { $pull: { likes: like } },
                { new: true, runValidators: true }
              );
            } else {
              nft = await NftItem.findOneAndUpdate(
                { id },
                { $push: { likes: like } },
                { new: true, runValidators: true }
              );
            }
          }
        }

        nft ? res.status(200).json(nft) : res.status(404).json('Item not found');
      } catch (error) {
        res.status(400).json(error);
      }

      break;
    default:
      res.status(405).json('Method Not Allowed');
      break;
  }
};
