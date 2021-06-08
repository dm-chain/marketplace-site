const MAX_FILE_SIZE = 20971520;

const MAX_FILE_SIZE_MB = 20;

const FILE_EXTENSIONS = {
  image: ['jpg', 'jpeg', 'png', 'webp'],
  gif: ['gif'],
  video: ['mp4'],
};

const FILTER_FILE_TYPES = [
  {
    type: 'all',
    name: 'All'
  },
  {
    type: 'gif',
    name: 'Gif'
  },
  {
    type: 'image',
    name: 'Images'
  },
  {
    type: 'video',
    name: 'Video'
  }
];

const FILE_SIZE_ERROR = 'Maximum file size exceeded!';

const FILE_EXTENSION_ERROR = 'Invalid file extension!';

export { MAX_FILE_SIZE, MAX_FILE_SIZE_MB, FILE_SIZE_ERROR, FILE_EXTENSIONS, FILE_EXTENSION_ERROR, FILTER_FILE_TYPES };
