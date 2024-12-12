import * as i18n from '@solid-primitives/i18n'
import type { Dictionary, Locale } from './types'
import { enDict } from './en'
import { arDict } from './ar'

// Define the available dictionaries
const dictionaries: Record<Locale, Partial<Dictionary>> = {
  en: enDict,
  ar: arDict,
}

export async function fetchDictionary(locale: Locale): Promise<i18n.BaseRecordDict> {
  const dict = dictionaries[locale]
  if (!dict) {
    throw new Error(`Locale "${locale}" not found.`)
  }
  return i18n.flatten(dict as Dictionary) as i18n.BaseRecordDict
}
