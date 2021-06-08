import dbConnect from 'src/db/db-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import Profile from 'src/models/Profile';
import { generateFromString } from 'generate-avatar';
import { UPLOAD_DIR } from 'src/config/app';
import fs from 'fs';
import { createHash, generateStaticUrl } from 'src/utils/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  let {
    query: { userId, slug },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const user = slug ? await Profile.findOne({ slug: slug }) : await Profile.findOne({ id: userId });

        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json('User not found');
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;

    case 'PUT':
      try {
        if (!req.query.wallet) {
          const user = await Profile.findOne({ id: req.body.id });
          const userBySlug = await Profile.findOne({ slug: req.body.slug });
          const isSlugNotAvailable = userBySlug && userBySlug.id !== user.id;

          if (isSlugNotAvailable) {
            return res.status(400).json({ errors: { slug: 'Exist' } });
          } else {
            const user = await Profile.findOneAndUpdate({ id: req.body.id }, req.body);

            user ? res.status(200).json(user) : res.status(404).json('User not found');
          }
        } else {
          const user = await Profile.findOneAndUpdate({ slug: req.body.slug }, req.body, {
            new: true,
            runValidators: true,
          });

          user ? res.status(200).json(user) : res.status(404).json('User not found');
        }
      } catch (error) {
        res.status(400).json(error);
      }

      break;

    case 'POST':
      try {
        let user = req.body;
        let profile = await Profile.findOne({ email: user.email });

        if (profile) {
          res.status(409).json(profile);
        } else {
          const hash = createHash(user.email);
          const avatar = generateFromString(hash);
          const uploadPath = UPLOAD_DIR + hash;
          const filePath = `${uploadPath}/avatar.svg`;

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          fs.writeFileSync(filePath, avatar);

          const imageUrl = generateStaticUrl(hash, 'avatar.svg');

          profile = new Profile({
            name: user.name,
            id: hash,
            slug: hash,
            image: user.image,
            email: user.email,
            defaultImage: imageUrl,
          });

          res.status(201).json(await profile.save());
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
