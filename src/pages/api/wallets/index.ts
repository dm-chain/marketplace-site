import dbConnect from 'src/db/db-connect';
import Wallet from 'src/models/Wallet';
import ContractsController from 'src/blockchain/contracts/ContractsControllerNode';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { profileId, publicKey } = req.query;
        let args = publicKey ? { publicKey } : { profileId };
        const wallet = await Wallet.findOne(args);

        if (wallet) {
          res.status(200).json(wallet);
        } else {
          res.status(404).json('Wallet not found');
        }

      } catch (error) {
        res.status(400).json(error);
      }

      break;
    case 'POST':
      try {
        const profileId = req.body.profileId;
        const { walletAddress, walletPublicKey } = req.body.extraton;

        if (walletPublicKey) {
          let wallet = await Wallet.findOne({ publicKey: walletPublicKey });

          if (wallet) {
            res.status(200).json(wallet);
          } else {
            const contracts = new ContractsController();
            const tonTokenWalletAddress = await contracts.deployWallet(walletPublicKey);

            if (tonTokenWalletAddress) {
              wallet = new Wallet({
                address: tonTokenWalletAddress,
                publicKey: walletPublicKey,
                extratonAddress: walletAddress,
                profileId: profileId,
              });

              contracts.clientClose();
              res.status(201).json(await wallet.save());
            } else {
              res.status(400).json('error');
            }
          }
        } else {
          res.status(400).json('Public key not provided');
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
