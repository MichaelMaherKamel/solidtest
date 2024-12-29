interface CookieOptions {
  days?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  const { days = 365, path = '/', domain, secure = true, sameSite = 'lax' } = options

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expires}`,
    `path=${path}`,
    domain && `domain=${domain}`,
    secure && 'secure',
    `samesite=${sameSite}`,
  ]
    .filter(Boolean)
    .join('; ')
}

export const deleteCookie = (name: string, path = '/') => {
  setCookie(name, '', { days: -1, path })
}
