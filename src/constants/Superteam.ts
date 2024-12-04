import { Regions } from '@prisma/client';

import { ASSET_URL } from './ASSET_URL';

interface People {
  name: string;
  pfp: string;
  role?: string;
}

export interface Superteam {
  name: string;
  icons: string;
  banner: string;
  region: Regions;
  displayValue: string;
  country: string[];
  code: string;
  hello: string;
  people?: People[];
}

const basePath = ASSET_URL + '/superteams/';

export const Superteams = [
  {
    name: 'Superteam India',
    icons: basePath + 'logosindia.jpg',
    banner: basePath + 'banners/India.png',
    region: Regions.INDIA,
    displayValue: 'India',
    country: ['India'],
    code: 'IN',
    hello: 'Namaste',
  },
  {
    name: 'Superteam Germany',
    icons: basePath + 'logosgermany.jpg',
    banner: basePath + 'banners/Germany.png',
    region: Regions.GERMANY,
    displayValue: 'Germany',
    country: ['Germany'],
    code: 'DE',
    hello: 'Hallo',
  },
  {
    name: 'Superteam UK',
    icons: basePath + 'logosuk.png',
    banner: basePath + 'banners/UK.png',
    region: Regions.UK,
    displayValue: 'UK',
    country: ['United Kingdom'],
    code: 'GB',
    hello: 'Hello',
  },
  {
    name: 'Superteam Turkey',
    icons: basePath + 'logosturkey.jpg',
    banner: basePath + 'banners/Turkey.png',
    region: Regions.TURKEY,
    displayValue: 'Turkey',
    country: ['Turkey'],
    code: 'TR',
    hello: 'Merhaba',
  },
  {
    name: 'Superteam Vietnam',
    icons: basePath + 'logosvietnam.png',
    banner: basePath + 'banners/Vietnam.png',
    region: Regions.VIETNAM,
    displayValue: 'Vietnam',
    country: ['Vietnam'],
    code: 'VN',
    hello: 'Xin chào',
  },
  {
    name: 'Superteam UAE',
    icons: basePath + 'logosuae.png',
    banner: basePath + 'banners/UAE.png',
    region: Regions.UAE,
    displayValue: 'UAE',
    country: ['United Arab Emirates'],
    code: 'AE',
    hello: 'Marhaba',
  },
  {
    name: 'Superteam Nigeria',
    icons: basePath + 'logosnigeria.png',
    banner: basePath + 'banners/Nigeria.png',
    region: Regions.NIGERIA,
    displayValue: 'Nigeria',
    country: ['Nigeria'],
    code: 'NG',
    hello: 'Hello',
  },
  {
    name: 'Superteam Brazil',
    icons: basePath + 'logosbrazil.png',
    banner: basePath + 'banners/Brazil.png',
    region: Regions.BRAZIL,
    displayValue: 'Brazil',
    country: ['Brazil'],
    code: 'BR',
    hello: 'Olá',
  },
  {
    name: 'Superteam Malaysia',
    icons: basePath + 'logosmalaysia.jpg',
    banner: basePath + 'banners/Malaysia.png',
    region: Regions.MALAYSIA,
    displayValue: 'Malaysia',
    country: ['Malaysia'],
    code: 'MY',
    hello: 'Salaam',
  },
  {
    name: 'Superteam Balkan',
    icons: basePath + 'logosbalkan.png',
    banner: basePath + 'banners/Balkan.png',
    region: Regions.BALKAN,
    displayValue: 'Balkan',
    country: [
      'Albania',
      'Bosnia and Herzegovina',
      'Bulgaria',
      'Croatia',
      'Kosovo',
      'Montenegro',
      'North Macedonia',
      'Romania',
      'Serbia',
      'Slovenia',
      'Greece',
    ],
    code: 'BALKAN',
    hello: 'Pozdrav',
  },
  {
    name: 'Superteam Philippines',
    icons: basePath + 'logosphilippines.png',
    banner: basePath + 'banners/Philippines.png',
    region: Regions.PHILIPPINES,
    displayValue: 'Philippines',
    country: ['Philippines'],
    code: 'PH',
    hello: 'Kumusta',
  },
  {
    name: 'Superteam Japan',
    icons: basePath + 'logosjapan.png',
    banner: basePath + 'banners/Japan.png',
    region: Regions.JAPAN,
    displayValue: 'Japan',
    country: ['Japan'],
    code: 'JP',
    hello: `Kon'nichiwa`,
  },
  {
    name: 'Superteam France',
    icons: basePath + 'logosfrance.png',
    banner: basePath + 'banners/France.png',
    region: Regions.FRANCE,
    displayValue: 'France',
    country: ['France'],
    code: 'FR',
    hello: `Bonjour`,
  },
  {
    name: 'Superteam Mexico',
    icons: basePath + 'logosmexico.jpg',
    banner: basePath + 'banners/Mexico.png',
    region: Regions.MEXICO,
    displayValue: 'Mexico',
    country: ['Mexico'],
    code: 'MX',
    hello: `Hola`,
  },
  {
    name: 'Superteam Canada',
    icons: basePath + 'logoscanada.png',
    banner: basePath + 'banners/Canada.png',
    region: Regions.CANADA,
    displayValue: 'Canada',
    country: ['Canada'],
    code: 'CA',
    hello: 'Hello',
  },
  {
    name: 'Superteam Singapore',
    icons: basePath + 'logossingapore.png',
    banner: basePath + 'banners/Singapore.png',
    region: Regions.SINGAPORE,
    displayValue: 'Singapore',
    country: ['Singapore'],
    code: 'SG',
    hello: 'Hello',
  },
];

const NonSTRegions = [
  {
    region: Regions.UKRAINE,
    displayValue: 'Ukraine',
    country: ['Ukraine'],
    code: 'UA',
  },
  {
    region: Regions.ARGENTINA,
    displayValue: 'Argentina',
    country: ['Argentina'],
    code: 'AR',
  },
  {
    region: Regions.USA,
    displayValue: 'USA',
    country: ['United States'],
    code: 'US',
  },
  {
    region: Regions.SPAIN,
    displayValue: 'Spain',
    country: ['Spain'],
    code: 'ES',
  },
];

export const CombinedRegions = [...Superteams, ...NonSTRegions];
