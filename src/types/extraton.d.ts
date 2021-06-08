type TExtratonNetwork = {
  explorer: 'net.ton.live' | 'ton.live';
  id: number;
  server: 'net.ton.dev' | 'main.ton.dev';
};

interface IExtratonClient {
  readonly isAvailable: boolean;
  // ExtensionProvider
  readonly provider: any;
  // window.freeton
  readonly entry: any;

  requestNetwork(): Promise<TExtratonNetwork | undefined>;
  isProperNetwork(): Promise<boolean>;
  getAddress(): Promise<string | undefined>;
}
