import freeton from 'src/blockchain/extraton/freeton/src';
import { TON_NETWORK } from 'src/config/ton';

declare global {
  interface Window {
    freeton: any;
  }
}

export default class ExtratonClient implements IExtratonClient {
  readonly isAvailable: boolean = false;
  readonly provider;
  readonly entry;

  constructor(window?: Window) {
    if (window) {
      this.isAvailable = window.freeton !== undefined;

      if (this.isAvailable) {
        this.entry = window.freeton;
        this.provider = new freeton.providers.ExtensionProvider(this.entry);
      }
    }
  }

  async requestNetwork(): Promise<TExtratonNetwork | undefined> {
    try {
      if (this.isAvailable && this.provider) {
        return await this.provider.getNetwork();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async isProperNetwork(): Promise<boolean> {
    const network = await this.requestNetwork();

    return network ? network.server === TON_NETWORK : false;
  }

  async getAddress(): Promise<string | undefined> {
    try {
      if (this.isAvailable) {
        return await this.entry.request('getAddress');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getSigner(): Promise<unknown> {
    try {
      if (this.isAvailable && this.provider) {
        return await this.provider.getSigner();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getPublicKey(): Promise<string | undefined> {
    try {
      if (this.isAvailable) {
        return await this.entry.request('getPublicKey');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getWallet(): Promise<any> {
    try {
      if (this.isAvailable && this.provider) {
        const signer = await this.provider.getSigner();

        return signer.getWallet();
      }
    } catch (e) {
      console.error(e);
    }
  }
  //
  // async contract() {
  //   try {
  //     if (this.isAvailable && this.entry) {
  //       return new this.entry.Contract
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  async addEventListener(callback: unknown) {
    try {
      if (this.isAvailable) {
        await this.entry.request('subscribeToEvents');
        this.entry.eventListener = callback;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
