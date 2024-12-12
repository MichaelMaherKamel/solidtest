// src/i18n/index.ts
import * as i18n from '@solid-primitives/i18n'
import type { Dictionary, Locale } from './types'

export async function fetchDictionary(locale: Locale): Promise<i18n.BaseRecordDict> {
  const module = await import(`./${locale}.ts`)
  const dict = module.dict as Dictionary
  return i18n.flatten(dict) as i18n.BaseRecordDict
}
