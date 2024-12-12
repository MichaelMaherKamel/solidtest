import { Component, createSignal } from 'solid-js'
import { Button } from './ui/button'
import { RiEditorTranslate2 } from 'solid-icons/ri'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu'
import { useI18n } from '~/contexts/i18n'

interface Language {
  code: 'en' | 'ar'
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
  },
]

export interface LocalizationButtonProps {
  variant?: 'ghost' | 'outline' | 'default'
  class?: string
  onLocaleChange?: () => void
}

export const LocalizationButton: Component<LocalizationButtonProps> = (props) => {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = createSignal(false)

  const handleLanguageChange = (lang: Language) => {
    // Update document direction based on language
    document.documentElement.dir = lang.direction
    document.documentElement.lang = lang.code
    setLocale(lang.code)
    setIsOpen(false)
    props.onLocaleChange?.()
  }

  const getCurrentLanguage = () => languages.find((lang) => lang.code === locale()) || languages[0]

  return (
    <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <Button
          variant={props.variant || 'outline'}
          size='sm'
          class={`flex items-center gap-2 rounded-full ${props.class || ''}`}
        >
          <RiEditorTranslate2 class='w-5 h-5' />
          <span class='text-xs font-semibold'>{getCurrentLanguage().nativeName}</span>
          <span class='sr-only'>Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class='min-w-[150px]'>
        {languages.map((lang) => (
          <DropdownMenuItem
            class={`flex items-center justify-between px-3 py-2 ${locale() === lang.code ? 'bg-primary/10' : ''}`}
            onClick={() => handleLanguageChange(lang)}
          >
            <span>{lang.nativeName}</span>
            {locale() === lang.code && <span class='text-primary'>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
