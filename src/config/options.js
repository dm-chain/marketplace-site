const offerTypes = [
  {
    value: 'fixed',
    label: 'Fixed Price'
  },
  {
    value: 'auction',
    label: 'Auction '
  }
];

const expirationDateOptions = [
  {
    label: '2 Days',
    value: '172800000'
  },
  {
    label: '1 Week',
    value: '604800000'
  },
];

const itemFields = {
  image: {
    required: true,
    defaultValue: null
  },
  name: {
    required: true,
    defaultValue: ''
  },
  description: {
    required: false,
    defaultValue: ''
  }
};

const offerFields = {
  auction: {
    startPrice: {
      required: true,
      defaultValue: ''
    },
    duration: {
      required: true,
      defaultValue: expirationDateOptions[0].value
    },
  },
  fixed: {
    price: {
      required: true,
      defaultValue: ''
    }
  }
};

const allOfferFields = {
  isOffer: {
    required: false,
    defaultValue: false
  },
  type: {
    required: false,
    defaultValue: offerTypes[0].value
  },
  ...offerFields.auction,
  ...offerFields.fixed
};

export { offerTypes, expirationDateOptions, itemFields, offerFields, allOfferFields };
