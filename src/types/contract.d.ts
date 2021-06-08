type TContractOutput = {
  name: string;
  type: string;
};

type TContractFunc = {
  name: string;
  inputs: array;
  outputs: Array<TContractOutput>;
};

type TAbi = {
  'ABI version': number;
  header: Array<string>;
  data: Array;
  events: Array;
  functions: Array<TContractFunc>;
};

type TContractImport = {
  abi: TAbi;
  tvc?: string;
};
