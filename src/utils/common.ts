import crypto from 'crypto';
import mongoose from 'mongoose';
import { toast } from 'react-toastify';
import { SERVICE_FEE } from 'src/config/offer';
import { FILE_EXTENSIONS } from 'src/config/files';
import { siteUrl } from 'src/config/auth';
import { getOption } from 'src/utils/request';
import config from 'src/config';

const stripAddress = (address: string) => address.substring(0, 4) + ' .... ' + address.substr(address.length - 4);

const createHash = (str: string) => crypto.createHash('sha256').update(str).digest('hex').substring(0, 20);

const notify = (message: string) => {
  toast(message, {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 5000,
    pauseOnFocusLoss: false,
  });
};

const generateStaticUrl = (id: string, fileName: string): string => `${siteUrl}/static/${id}/${fileName}`;

const formatPrice = (price: number) => price.toLocaleString('ru-RU').replace(',', '.');

const validNumberField = (value: string): boolean => {
  const regExp = new RegExp(/^[0-9]{0,20}\.?[0-9]{0,5}?$/g);
  return regExp.test(value) || !value;
};

const calculateNextBid = (price: number) => (price * 1.1).toFixed(2);
const calculatePrice = (price: number) => (price - price * (SERVICE_FEE / 100)).toFixed(2);
const calculatePricePlusFee = (price: number) => price + price * (SERVICE_FEE / 100);

const toUSD = (rate: number, price: number): string => {
  return `~$${(rate * price).toFixed(2)}`;
};

const getFileType = (str: string): string => {
  const type = str.includes('.') ? str.split('.') : str.split('/');
  const ext = type[type.length - 1].toLowerCase();

  return Object.entries(FILE_EXTENSIONS).reduce(
    (tokenType, [type, extensions]) => (extensions.includes(ext) ? type : tokenType),
    ''
  );
};

const formatDate = (date: Date) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  } as const;

  return new Date(date).toLocaleDateString('en-US', options);
};

const sendEmail = async (fields: { [key: string]: string }) => {
  const defaultFields = {
    to: config.form.to,
    subject: config.form.subject,
  };

  Object.keys(fields).map(name => (defaultFields[name] = fields[name]));

  const res = await fetch(config.form.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams(defaultFields).toString(),
  });

  return res;
};

const toObjId = (id: string) => mongoose.Types.ObjectId(id);

const checkWallet = (wallet: TWallet, item: INftItemExtended) => wallet._id && wallet._id === item.wallet;

export {
  generateStaticUrl,
  stripAddress,
  createHash,
  notify,
  formatPrice,
  validNumberField,
  calculatePrice,
  getFileType,
  toObjId,
  calculatePricePlusFee,
  formatDate,
  sendEmail,
  checkWallet,
  calculateNextBid,
  toUSD
};
