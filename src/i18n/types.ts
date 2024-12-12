// src/i18n/types.ts
export type Locale = 'en' | 'ar'

// Define nested dictionary types
type DictionaryValue = string | { [key: string]: DictionaryValue }

export interface Dictionary {
  [key: string]: DictionaryValue
  common: {
    loading: string
    error: string
    save: string
    cancel: string
    [key: string]: string
  }
  nav: {
    home: string
    products: string
    stores: string
    about: string
    [key: string]: string
  }
  auth: {
    login: string
    signup: string
    logout: string
    [key: string]: string
  }
}


