import { TonClient, MessageBodyType, abiContract, signerNone } from '@tonclient/core';
import { Account } from '@tonclient/appkit';
import { libWeb } from '@tonclient/lib-web';
import { toNano, add0x } from 'contracts/sdk/utils/utils';
import freeton from 'src/blockchain/extraton/freeton/src';

import { SellContractDeployerContract } from 'contracts/market-contracts/SellContractDeployerContract';
import { SellContractContract } from 'contracts/market-contracts/SellContractContract';
import { AuctionContract } from 'contracts/market-contracts/AuctionContract';
import { TON_SERVER_ADDRESS, SELL_CONTRACT_ADDRESS, SELL_CONTRACT_DEPLOYMENT_FEE } from 'src/config/ton';

import ExtratonClient from '../extraton/ExtratonClient';

export default class ContractsControllerWeb {
  readonly client: TonClient;
  readonly extratonClient: ExtratonClient;

  constructor(extratonClient: ExtratonClient) {
    TonClient.useBinaryLibrary(libWeb);
    this.extratonClient = extratonClient;

    this.client = new TonClient({
      network: {
        endpoints: [TON_SERVER_ADDRESS],
      },
    });
  }

  async sellToken(pubKey: string, sellerAddress: string, price: number, tokenId: string, moneyReceiverWallet: string) {
    const seedPhrase = (
      await this.client.crypto.mnemonic_from_random({
        dictionary: 1,
        word_count: 12,
      })
    ).phrase;

    const hash = (
      await this.client.crypto.sha256({
        data: btoa(seedPhrase),
      })
    ).hash;

    const deploySellContractInput = {
      _pubkey: add0x(pubKey),
      _sellerAddress: sellerAddress,
      _price: toNano(price),
      _tokenId: tokenId,
      _hash: hash
    };
    // console.log(deploySellContractInput);

    const payload = (
      await this.client.abi.encode_message_body({
        // TODO: abi error
        // @ts-ignore
        abi: abiContract(SellContractDeployerContract.abi),
        call_set: {
          function_name: 'deploySellContract',
          input: {
            ...deploySellContractInput,
            _moneyReceiver: moneyReceiverWallet,
          },
        },
        is_internal: true,
        // TODO: sign payload with user keys?
        signer: signerNone(),
      })
    ).body;

    const wallet = await this.extratonClient.getWallet();
    const contract = new freeton.Contract(
      this.extratonClient.provider,
      SellContractDeployerContract.abi,
      SELL_CONTRACT_ADDRESS
    );

    // TODO: TS error on abi methods
    // Future address of deployed offer contract
    // @ts-ignore
    const offerContractAddress = await contract.methods.getSellContractAddress.run(deploySellContractInput);

    // TODO: TS type
    await wallet.transfer(SELL_CONTRACT_ADDRESS, toNano(SELL_CONTRACT_DEPLOYMENT_FEE), true, payload);
    // console.log('Sell contract was deployed');

    return offerContractAddress;
  }

  async cancelSell(offerContractAddress: string) {
    //console.log(offerContractAddress);
    const contract = new freeton.Contract(
      await this.extratonClient.getSigner(),
      SellContractContract.abi,
      offerContractAddress
    );

    // @ts-ignore
    return await contract.methods.cancelOrder.call();
  }

  // TODO: offer model
  async buyToken(walletAddress: string, price: number, offerContractAddress: string) {
    const signer = await this.extratonClient.getSigner();

    const proceedDealPayload = (
      await this.client.abi.encode_message_body({
        // @ts-ignore
        abi: abiContract(SellContractContract.abi),
        call_set: {
          function_name: 'proceedDeal',
          input: {
            // Buyer's TIP3 wallet address
            _destWallet: walletAddress,
            // Buyer's TIP3 wallet pukey (equals to extraton pubkey)
            _pubkey: add0x(await this.extratonClient.getPublicKey()),
          },
        },
        is_internal: true,
        signer: signerNone(),
      })
    ).body;

    const wallet = await this.extratonClient.getWallet();

    // TODO: get price + fee from sell contract
    //const priceWithFee = 0;
    // TODO: TS type
    const buyTransaction = await wallet.transfer(offerContractAddress, Math.ceil(toNano(price)), true, proceedDealPayload);

    return buyTransaction;
  }

  /**
   *
   * @param pubKey - Seller's TIP3 wallet publc key
   * @param sellerAddress - Sellers's TIP3 wallet address
   * @param price - Auction start price
   * @param tokenId - Id of the token to sell
   * @param moneyReceiverWallet - Extraton seller's address
   * @param duration - Duration of the auction in seconds
   */
  async putOnAuction(pubKey: string, sellerAddress: string, price: number, tokenId: string, moneyReceiverWallet: string, duration: number) {
    const seedPhrase = (
      await this.client.crypto.mnemonic_from_random({
        dictionary: 1,
        word_count: 12,
      })
    ).phrase;

    const hash = (
      await this.client.crypto.sha256({
        data: btoa(seedPhrase),
      })
    ).hash;

    const deployAuctionInput = {
      _pubkey: add0x(pubKey),
      _sellerAddress: sellerAddress,
      _startPrice: toNano(price),
      _tokenId: tokenId,
      _hash: hash,
    };

    const deployAuctionPayload = (
      await this.client.abi.encode_message_body({
        // TODO: abi error
        // @ts-ignore
        abi: abiContract(SellContractDeployerContract.abi),
        call_set: {
          function_name: 'deployAuction',
          input: {
            ...deployAuctionInput,
            _moneyReceiver: moneyReceiverWallet,
            // Auction duration in seconds
            _auctionDuration: duration,
          },
        },
        is_internal: true,
        signer: signerNone(),
      })
    ).body;

    // TODO: create helper function for this
    const wallet = await this.extratonClient.getWallet();
    const contract = new freeton.Contract(
      this.extratonClient.provider,
      SellContractDeployerContract.abi,
      SELL_CONTRACT_ADDRESS
    );

    // TODO: TS error on abi methods
    // Future address of deployed offer contract
    // @ts-ignore
    const offerContractAddress = await contract.methods.getAuctionAddress.run(deployAuctionInput);

    await wallet.transfer(SELL_CONTRACT_ADDRESS, toNano(SELL_CONTRACT_DEPLOYMENT_FEE), true, deployAuctionPayload);

    return offerContractAddress;
  }

  async addSellContractSubscriber(callback: Function) {
    // @ts-ignore
    const sellContractAccount = new Account(SellContractDeployerContract, {
      client: this.client,
      address: SELL_CONTRACT_ADDRESS
    });

    await sellContractAccount.subscribeMessages('boc', async (msg) => {
      try {
        const decoded = await sellContractAccount.decodeMessage(msg.boc);

        if (decoded.body_type === MessageBodyType.Event) {
          // Event generated by the contract
          callback(decoded.value);
        }
      } catch (err) {
        // console.error(err);
      }
    });
  }

  async addAuctionContractSubscriber(auctionContractAddress: string, callback: Function) {
    // @ts-ignore
    const auctionContractAccount = new Account(AuctionContract, {
      client: this.client,
      address: auctionContractAddress
    });

    await auctionContractAccount.subscribeMessages('boc', async (msg) => {
      try {
        const decoded = await auctionContractAccount.decodeMessage(msg.boc);

        if (decoded.body_type === MessageBodyType.Event) {
          // Event generated by the contract
          callback(decoded.value);
        }
      } catch (err) {
        // console.error(err);
      }
    });
  }

  /**
   *
   * @param walletAddress - TIP3 address of bidder
   * @param bid - Bid amount. Should be current bid + 10% (we can take current and next bids from auction contract)
   * @param offerContractAddress - Auction contract address
   */
  async placeBid(walletAddress: string, bid: number, offerContractAddress: string) {
    const auctionContract = new freeton.Contract(
      await this.extratonClient.provider,
      AuctionContract.abi,
      offerContractAddress
    );

    // TODO: TS error on abi methods
    // @ts-ignore
    const currentBid = auctionContract.methods.maxBidValue.run();
    // @ts-ignore
    const nextBid = auctionContract.methods.nextBidValue.run();

    const payload = (
      await this.client.abi.encode_message_body({
        // TODO: abi error
        // @ts-ignore
        abi: abiContract(AuctionContract.abi),
        call_set: {
          function_name: 'placeBid',
          input: {
            _tokenWalletAddress: walletAddress,
            _tokenWalletPubkey: add0x(await this.extratonClient.getPublicKey()),
          },
        },
        is_internal: true,
        signer: signerNone(),
      })
    ).body;

    const wallet = await this.extratonClient.getWallet();

    const bidTransaction = await wallet.transfer(offerContractAddress, Math.ceil(toNano(bid)), true, payload);

    return bidTransaction;
  }

  clientClose() {
    this.client.close();
  }
}
