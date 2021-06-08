import dbConnect from 'src/db/db-connect';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UPLOAD_DIR, UPLOAD_DIR_NFT } from 'src/config/app';
import { siteUrl } from 'src/config/auth';
import { createHash } from 'src/utils/common';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const {
    query: { id, type },
    method,
  } = req;
  const form = new formidable.IncomingForm();

  switch (method) {
    case 'POST':
      if (!id || !type || typeof id !== 'string' || typeof type !== 'string') {
        res.status(400).json('Image parameters error');
      } else {
        const uploadPath = type === 'nft' ? UPLOAD_DIR_NFT : UPLOAD_DIR + id + '/';

        try {
          form.keepExtensions = true;

          // @ts-ignore
          form.on('fileBegin', (name, file) => {
            const fileName = (type !== 'nft' ? type + '_' : '') + createHash(id + Date.now()) + path.extname(file.name);
            const filePath = uploadPath + fileName;

            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }

            file.name = fileName;
            file.path = filePath;
          });

          // @ts-ignore
          form.parse(req, (err, fields, files) => {
            if (files.file && files.file.path) {
              const imagePath =
                type === 'nft'
                  ? files.file.path.replace(`${uploadPath}`, `${siteUrl}/nft/`)
                  : `${siteUrl}/static/${id}/${files.file.name}`;

              res.status(201).json({ image: imagePath });
            } else {
              res.status(400).json('Error on crating file');
            }
          });
        } catch (err) {
          res.status(400).json(err);
        }
      }

      break;
    case 'DELETE':
      try {
        // @ts-ignore
        form.parse(req, (err, fields) => {
          const { src } = fields;

          if (src && typeof src === 'string') {
            const imagePath = src.replace(`${siteUrl}/static/`, UPLOAD_DIR);

            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }

            res.status(200).json('Image succesfully deleted');
          } else {
            res.status(404).json('Error on image delete');
          }
        });
      } catch (error) {
        res.status(404).json(error);
      }
      break;
    default:
      res.status(405).json('Method Not Allowed');
      break;
  }
};
