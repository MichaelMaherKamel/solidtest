import { TbToolsKitchen2 } from 'solid-icons/tb'
import { BiRegularHomeAlt2, BiRegularBath } from 'solid-icons/bi'

export const siteConfig = {
  // Branding
  name: 'SouqElRafay3',
  description: 'Your one-stop shop for kitchen, bathroom and home supplies',
  images: {
    siteImage: 'https://tveclffztmubyxyjxart.supabase.co/storage/v1/object/public/SouqElRafay3Bucket/SouqElRafay3.webp',
    siteResponsiveImage:
      'https://tveclffztmubyxyjxart.supabase.co/storage/v1/object/public/SouqElRafay3Bucket/SouqElRafay3Responsive.webp',
  },

  // Business & Contact
  contact: {
    developer: {
      name: 'Michael Maher',
      email: 'michaelmaherkamel@gmail.com',
      phone: '+201022618610',
      portfolio: 'https://michaelmaher-portfolio.vercel.app/',
    },
    support: {
      email: 'support@homemart.com',
    },
  },

  // Categories
  categories: [
    {
      id: '1',
      name: 'مستلزمات  المطبخ',
      slug: 'kitchensupplies',
      href: '/shopping/kitchensupplies',
      description: 'Everything you need for your kitchen',
      icon: TbToolsKitchen2,
    },
    {
      id: '2',
      name: 'مستلزمات  الحمام',
      slug: 'bathroomsupplies',
      href: '/shopping/bathroomsupplies',
      description: 'Complete bathroom essentials',
      icon: BiRegularBath,
    },
    {
      id: '3',
      name: 'مستلزمات  المنزل',
      slug: 'homesupplies',
      href: '/shopping/homesupplies',
      description: 'General home maintenance and decor',
      icon: BiRegularHomeAlt2,
    },
  ],

  // Subscription Plans
  plans: [
    {
      name: 'Basic',
      price: 9.99,
      features: ['List up to 10 products', 'Basic analytics', 'Standard support', 'Single store'],
    },
    {
      name: 'Business',
      price: 29.99,
      features: [
        'List up to 50 products',
        'Advanced analytics',
        'Priority support',
        'Multiple stores',
        'Custom store URL',
      ],
    },
    {
      name: 'Premium',
      price: 99.99,
      features: [
        'Unlimited products',
        'Real-time analytics',
        '24/7 Priority support',
        'Multiple stores',
        'Custom store URL',
        'Featured listings',
        'Marketing tools',
      ],
    },
  ],

  // Social Media
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
  },

  // Localization Maps
  localization: {
    colors: [
      { nameAr: 'أحمر', nameEn: 'red' },
      { nameAr: 'أزرق', nameEn: 'blue' },
      { nameAr: 'أخضر', nameEn: 'green' },
      { nameAr: 'أصفر', nameEn: 'yellow' },
      { nameAr: 'برتقالي', nameEn: 'orange' },
      { nameAr: 'بنفسجي', nameEn: 'purple' },
      { nameAr: 'وردي', nameEn: 'pink' },
      { nameAr: 'أبيض', nameEn: 'white' },
      { nameAr: 'أسود', nameEn: 'black' },
      { nameAr: 'رمادي', nameEn: 'gray' },
      { nameAr: 'بني', nameEn: 'brown' },
      { nameAr: 'ذهبي', nameEn: 'gold' },
      { nameAr: 'فضي', nameEn: 'silver' },
      { nameAr: 'بيج', nameEn: 'beige' },
      { nameAr: 'كحلي', nameEn: 'navy' },
      { nameAr: 'فيروزي', nameEn: 'turquoise' },
      { nameAr: 'زيتي', nameEn: 'olive' },
      { nameAr: 'نيلي', nameEn: 'indigo' },
      { nameAr: 'خوخي', nameEn: 'peach' },
      { nameAr: 'بنفسجي فاتح', nameEn: 'lavender' },
    ],
    cities: {
      Cairo: 'القاهرة',
      Alex: 'الإسكندرية',
      Matrouh: 'مطروح',
    },
    countries: {
      Egypt: 'مصر',
      'Saudi Arabia': 'المملكة العربية السعودية',
      UAE: 'الإمارات العربية المتحدة',
    },
  },
} as const

// Type exports
export type SiteCategory = (typeof siteConfig.categories)[number]
export type SitePlan = (typeof siteConfig.plans)[number]
export type ProductColor = (typeof siteConfig.localization.colors)[number]

// Helper functions for categories
export function getCategoryById(id: string) {
  return siteConfig.categories.find((category) => category.id === id)
}

export function getCategoryBySlug(slug: string) {
  return siteConfig.categories.find((category) => category.slug === slug)
}

// Helper functions for plans
export function getPlanByName(name: string) {
  return siteConfig.plans.find((plan) => plan.name.toLowerCase() === name.toLowerCase())
}

export function getPlanByPrice(price: number) {
  return siteConfig.plans.find((plan) => plan.price === price)
}

// Helper functions for colors
export function getColorByEnglishName(name: string) {
  return siteConfig.localization.colors.find((color) => color.nameEn.toLowerCase() === name.toLowerCase())
}

export function getColorByArabicName(name: string) {
  return siteConfig.localization.colors.find((color) => color.nameAr === name)
}

// Helper functions for locations
export function getCityInArabic(cityName: keyof typeof siteConfig.localization.cities) {
  return siteConfig.localization.cities[cityName]
}

export function getCountryInArabic(countryName: keyof typeof siteConfig.localization.countries) {
  return siteConfig.localization.countries[countryName]
}

// Utility function to check if a plan exists
export function isPlanValid(planName: string): boolean {
  return siteConfig.plans.some((plan) => plan.name.toLowerCase() === planName.toLowerCase())
}

// Utility function to get all available cities
export function getAvailableCities(): string[] {
  return Object.keys(siteConfig.localization.cities)
}

// Utility function to get all available countries
export function getAvailableCountries(): string[] {
  return Object.keys(siteConfig.localization.countries)
}

// Utility function to get all available colors in both languages
export function getAvailableColors(): { english: string[]; arabic: string[] } {
  return {
    english: siteConfig.localization.colors.map((color) => color.nameEn),
    arabic: siteConfig.localization.colors.map((color) => color.nameAr),
  }
}
