import { Component, createSignal } from 'solid-js'
import { Button } from './ui/button'
import { RiEditorTranslate2 } from 'solid-icons/ri'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu'
import { useI18n } from '~/contexts/i18n'
import NavDropdown from './NavDropDown'

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
  iconOnly?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const LocalizationButton: Component<LocalizationButtonProps> = (props) => {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = createSignal(false)

  const handleLanguageChange = (lang: Language) => {
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
          variant={props.variant || 'ghost'}
          size={props.size || (props.iconOnly ? 'icon' : 'sm')}
          class={`${props.iconOnly ? '' : 'flex items-center gap-2 rounded-full'} ${props.class || ''}`}
          aria-label='Change language'
        >
          <RiEditorTranslate2 class='w-5 h-5' />
          {!props.iconOnly && <span class='text-xs font-semibold'>{getCurrentLanguage().nativeName}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
