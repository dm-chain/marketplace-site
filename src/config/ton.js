const TON_SERVER_ADDRESS = process.env.TON_SERVER_ADDRESS ?? '//net.ton.dev';
const TON_NETWORK = TON_SERVER_ADDRESS.replace(/\/\//i, '');
const TON_WORKCHAIN = process.env.TON_WORKCHAIN || 0;
const SELL_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SELL_CONTRACT_ADDRESS || '';
const ROOT_TOKEN_WALLET_ADDRESS = process.env.NEXT_PUBLIC_ROOT_TOKEN_WALLET_ADDRESS || '';
const SELL_CONTRACT_DEPLOYMENT_FEE = +process.env.NEXT_PUBLIC_SELL_CONTRACT_DEPLOYMENT_FEE || 0.5;

export {
  TON_SERVER_ADDRESS,
  TON_NETWORK,
  TON_WORKCHAIN,
  ROOT_TOKEN_WALLET_ADDRESS,
  SELL_CONTRACT_ADDRESS,
  SELL_CONTRACT_DEPLOYMENT_FEE,
};
