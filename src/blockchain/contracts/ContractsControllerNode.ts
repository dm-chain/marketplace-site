import { Account } from '@tonclient/appkit';
import { TonClient, signerKeys } from '@tonclient/core';
import { libNode } from '@tonclient/lib-node';
import { toNano, utf8ToHex, add0x } from 'contracts/sdk/utils/utils';

import rootKeys from 'contracts/RTW.tondev.keys.json';
import { RootTokenWalletContract } from 'contracts/contracts/RootTokenWalletContract.js';
import { TonTokenWalletContract } from 'contracts/contracts/TonTokenWalletContract.js';
import { TON_SERVER_ADDRESS, TON_WORKCHAIN, ROOT_TOKEN_WALLET_ADDRESS } from 'src/config/ton';
import { AuctionContract } from 'contracts/market-contracts/AuctionContract';

export default class ContractsController {
  readonly client: TonClient;
  readonly rootWallet: Account;

  constructor() {
    TonClient.useBinaryLibrary(libNode);

    const client = (this.client = new TonClient({
      network: {
        endpoints: [TON_SERVER_ADDRESS],
      },
    }));

    this.rootWallet = new Account(RootTokenWalletContract, {
      signer: signerKeys(rootKeys),
      client,
      address: ROOT_TOKEN_WALLET_ADDRESS,
    });
  }

  clientClose() {
    this.client.close();
  }

  async deployWallet(walletPublicKey: string) {
    const pubKey = add0x(walletPublicKey);
    const client = this.client;

    const walletAddress = (
      await this.rootWallet.runLocal('getWalletAddress', {
        _workchainId: TON_WORKCHAIN,
        _pubkey: pubKey,
      })
    )?.decoded?.output.walletAddress;

    // @ts-ignore
    const walletAcc = new Account(TonTokenWalletContract, {
      client,
      address: walletAddress,
    });

    let info = await walletAcc.getAccount();

    if (info.acc_type === 1) {
      console.log(`Account with address ${walletAddress} is already deployed`);
    } else {
      // TODO: send less or more than 1 TON?
      await this.rootWallet.run('deployEmptyWallet', {
        _workchainId: TON_WORKCHAIN,
        _pubkey: pubKey,
        _grams: toNano(1),
      });
    }

    return walletAddress;
  }

  async mintToken({ name, authorName, url }: { name: string; authorName: string; url: string }) {
    const result = await this.rootWallet.run('mint', {
      _name: utf8ToHex(name),
      _author: utf8ToHex(authorName),
      _url: utf8ToHex(url),
    });

    return result.decoded?.output.mintedId;
  }

  async grantToken({ tokenId, walletAddress }: { tokenId: number; walletAddress: string }) {
    await this.rootWallet.run('grant', {
      _dest: walletAddress,
      _tokenId: tokenId,
      // TODO: user fee
      _grams: toNano(0.1),
    });
  }

  async getAuctionContract(auctionContractAddress: string) {
    // @ts-ignore
    const auctionContractAccount = new Account(AuctionContract, {
      client: this.client,
      address: auctionContractAddress
    });

    return await auctionContractAccount.getAccount();
  }
}
