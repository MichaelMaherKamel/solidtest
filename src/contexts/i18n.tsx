// src/contexts/i18n.tsx
import { ParentComponent, createContext, useContext, createSignal, createResource, createEffect } from 'solid-js'
import type { Resource } from 'solid-js'
import * as i18n from '@solid-primitives/i18n'
import type { Locale, Dictionary } from '~/i18n/types'
import { fetchDictionary } from '~/i18n'
import { isServer } from 'solid-js/web'

interface I18nContextType {
  locale: () => Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, any>) => string
  dict: Resource<i18n.BaseRecordDict>
}

const I18nContext = createContext<I18nContextType>()

export const I18nProvider: ParentComponent = (props) => {
  // Default to 'en' during SSR
  const [locale, setLocale] = createSignal<Locale>('en')

  // Initialize locale from localStorage only on client-side
  createEffect(() => {
    if (!isServer) {
      const savedLocale = localStorage.getItem('locale') as Locale
      if (savedLocale) {
        setLocale(savedLocale)
      }
    }
  })

  const [dict] = createResource(locale, fetchDictionary)

  const translate = (key: string, params?: Record<string, any>): string => {
    const currentDict = dict()
    if (!currentDict) return key

    const rawTranslation = i18n.translator(() => currentDict)(key)
    const translatedText = (rawTranslation || key) as string

    if (params) {
      const resolvedText = i18n.resolveTemplate(translatedText, params) as string
      return resolvedText || translatedText
    }

    return translatedText
  }

  const handleLocaleChange = (newLocale: Locale) => {
    if (!isServer) {
      localStorage.setItem('locale', newLocale)
      document.documentElement.lang = newLocale
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    }
    setLocale(newLocale)
  }

  const value: I18nContextType = {
    locale,
    setLocale: handleLocaleChange,
    t: translate,
    dict,
  }

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
