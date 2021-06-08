import fs from 'fs';
import path from 'path';

const pubkeyRegex = /^[0-9a-fA-F]{64}$/;
const addressRegex = /^-?[0-9a-fA-F]+:[0-9a-fA-F]{64}$/;
const onlyZero = /^0+$/;

const loadContract = (relativePath: string): TContractImport => {
  function load(suffix: string) {
    return fs.readFileSync(path.resolve(__dirname, '../contracts', `${relativePath}${suffix}`));
  }

  return {
    abi: JSON.parse(load('.abi.json').toString()),
    tvc: load('.tvc').toString('base64'),
  };
};

// :: String -> String
const strip0x = (str: string) => str.replace(/^0x/, '');
const add0x = (str: string) => (str === '' ? '' : `0x${strip0x(str)}`);
const stripWorkchain = (str: string) => str.replace(/^[^:]*:/, '');

// :: * -> Bool
const isValidPublicKey = (x: any) =>
  typeof x === 'string' && pubkeyRegex.test(strip0x(x)) && !onlyZero.test(strip0x(x));
const isValidAddress = (x: any) => typeof x === 'string' && addressRegex.test(x) && !onlyZero.test(stripWorkchain(x));

// :: String|Number, String|Number -> Bool
const isNear = (x: string | number, y: string | number) =>
  Math.abs(parseInt(y.toString()) - parseInt(x.toString())) < 200000000; // 2e8

// :: String -> String
const convert = (from: any, to: any) => (data: any) => Buffer.from(data, from).toString(to);
const base64ToUtf8 = convert('base64', 'utf8');
const hexToUtf8 = (hex: string | number) => convert('hex', 'utf8')(strip0x(hex.toString()));
const hexToBase64 = (hex: string | number) => convert('hex', 'base64')(strip0x(hex.toString()));
const utf8ToHex = convert('utf8', 'hex');

const toNano = (n: number) => n * 1000000000; // 1e9
const fromNano = (n: number) => n / 1000000000;

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

export {
  loadContract,
  add0x,
  base64ToUtf8,
  fromNano,
  toNano,
  hexToBase64,
  hexToUtf8,
  isNear,
  isValidAddress,
  isValidPublicKey,
  sleep,
  strip0x,
  utf8ToHex,
};
