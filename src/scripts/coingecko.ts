import fetch from 'node-fetch';
import dbConnect from 'src/db/db-connect';
import Option from 'src/models/Option';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd(), true);

const MONGODB_URI = process.env.MONGODB_URI || '';

let url = new URL('https://api.coingecko.com/api/v3/coins/ton-crystal'),
  params = {
    localization: false,
    tickers: false,
    developer_data: false,
    community_data: false,
    sparkline: false,
  };

Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

(async () => {
  await dbConnect(MONGODB_URI);
  const resRate = await fetch(url);

  if (resRate.status === 200) {
    const data = await resRate.json();
    const rate = data?.market_data?.current_price.usd;

    let option = await Option.findOneAndUpdate({ name: 'rate_usd' }, { value: rate }, {
      new: true,
      runValidators: true,
    });

    if (!option) {
      let newOption = new Option({
        name: 'rate_usd',
        value: rate
      });

      option = await newOption.save();
    }

    console.log(option);
    process.exit();
  }
})();
