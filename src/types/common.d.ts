type Field = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'textarea';
  placeholder: string;
  label?: string;
  description?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
};

type FormState = {
  values: object;
  errors: object;
  success: boolean;
};

type Person = {
  image: string;
  name?: string;
  rating?: number;
};

type TCardTop = {
  title: string;
  subtitle: string;
  items: Array<Person>;
  type?: 'collection' | 'user';
};

type MarketplaceCard = {
  item: INftItemExtended;
  finishAuction?: Function;
};

type SelectOption = {
  value: string;
  label: string;
};

type RadioCollectionItem = {
  id?: string;
  label: string;
  preview: string;
};

type DetailsItem = {
  type: 'history' | 'details';
  title?: string;
  person?: {
    type: string;
    profile?: TUser | ICollectionItem | null;
  } | null,
  price?: number | string;
  priceUsd?: number;
  date?: Date | string;
  disabled?: boolean;
  text?: string;
};

type TContextModal = {
  isShowModal: boolean;
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  processingModal: boolean;
  setProcessingModal: React.Dispatch<React.SetStateAction<boolean>>;
  scrollbarWidth: number;
  setScrollbarWidth: React.Dispatch<React.SetStateAction<number>>;
  modalContent: React.ReactNode;
  setModalContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  isShowMobileMenu: boolean;
  setIsShowMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

type TContextUser = {
  isAuthorizedUser: boolean;
  setIsAuthorizedUser: React.Dispatch<SetStateAction<boolean>>;
  avatar: string;
  setAvatar: React.Dispatch<SetStateAction<string>>;
  cover: string;
  setCover: React.Dispatch<SetStateAction<string>>;
  slug: string;
  setSlug: React.Dispatch<SetStateAction<string>>;
};

type TContextGlobal = {
  rate: number | null;
  topline: boolean;
  windowSize: number;
  setTopline: React.Dispatch<SetStateAction<boolean>>;
  showTopLoader: boolean;
  setShowTopLoader: React.Dispatch<SetStateAction<boolean>>;
};

type TLink = {
  title: string;
  link: string;
};

type FileInputProps = {
  type: string;
  file: TFile | string;
  fileInput: React.RefObject<HTMLInputElement>;
  deleteFile: React.MouseEventHandler<HTMLButtonElement>;
  clickFileInput: React.MouseEventHandler<HTMLButtonElement>;
  changeFileInput: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
  className?: string;
  required?: boolean;
  defaultFile?: string;
  error?: string;
};

type TFile = {
  src: string;
  data: File | null;
};

type THttpMetod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS ';

type TTagItem = {
  name: string;
  type: string;
}

type TFilterResponse = {
  items: INftItemExtended[],
  count: number;
}

type FilterParams = {
  type?: string | null;
  offer?: boolean;
  auction?: boolean;
  sort?: string | null;
  author?: string | null;
  owner?: string | null;
  limit?: number | null;
  offset?: number;
}

type TCustomResponse = {
  offer?: TOffer;
  error?: string;
}

type TOption = {
  name: string;
  value: string;
}
