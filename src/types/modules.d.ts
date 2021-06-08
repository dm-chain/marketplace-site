declare module 'freeton';

declare module 'js-cookie';

declare module 'formidable' {
  export class IncomingForm {
    keepExtensions: Boolean;
    parse(req, Function): void;
  }
}

declare module 'node-fetch';

declare module '*.scss';

declare module '*.png';

declare module '*.jpg';

declare module 'react-select';

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.svg?inline' {
  const content: any;
  export default content;
}
