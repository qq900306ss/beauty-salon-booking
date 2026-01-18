// S3 Assets Configuration
// 所有靜態資源的 CDN/S3 URL

const S3_BUCKET = 'https://linda-salon-assets.s3.ap-northeast-1.amazonaws.com';

export const ASSETS = {
  icons: {
    icon72: `${S3_BUCKET}/icons/icon-72x72.png`,
    icon96: `${S3_BUCKET}/icons/icon-96x96.png`,
    icon128: `${S3_BUCKET}/icons/icon-128x128.png`,
    icon144: `${S3_BUCKET}/icons/icon-144x144.png`,
    icon152: `${S3_BUCKET}/icons/icon-152x152.png`,
    icon192: `${S3_BUCKET}/icons/icon-192x192.png`,
    icon384: `${S3_BUCKET}/icons/icon-384x384.png`,
    icon512: `${S3_BUCKET}/icons/icon-512x512.png`,
  },
  screenshots: {
    home: `${S3_BUCKET}/screenshots/home.png`,
  }
};

// 用於 manifest.json 的圖標陣列
export const PWA_ICONS = [
  {
    src: ASSETS.icons.icon72,
    sizes: '72x72',
    type: 'image/png',
    purpose: 'any maskable'
  },
  {
    src: ASSETS.icons.icon96,
    sizes: '96x96',
    type: 'image/png',
    purpose: 'any maskable'
  },
  {
    src: ASSETS.icons.icon128,
    sizes: '128x128',
    type: 'image/png',
    purpose: 'any maskable'
  },
  {
    src: ASSETS.icons.icon144,
    sizes: '144x144',
    type: 'image/png',
    purpose: 'any maskable'
  },
  {
    src: ASSETS.icons.icon152,
    sizes: '152x152',
    type: 'image/png',
    purpose: 'any maskable'
  },
  {
    src: ASSETS.icons.icon192,
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any maskable'
  },
  {
    src: ASSETS.icons.icon384,
    sizes: '384x384',
    type: 'image/png',
    purpose: 'any maskable'
  },
  {
    src: ASSETS.icons.icon512,
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any maskable'
  }
];

export default ASSETS;
