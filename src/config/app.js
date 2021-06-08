const ENV_DEV = process.env.NODE_ENV !== 'production';

const APP_NAME = 'GrandBazar.io';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '';

const UPLOAD_DIR_NFT = process.env.UPLOAD_DIR_NFT || '';

export { ENV_DEV, APP_NAME, UPLOAD_DIR, UPLOAD_DIR_NFT };
