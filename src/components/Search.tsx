import { createSignal, Show, For, onMount, onCleanup, Match, Switch, createEffect } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { searchProducts } from '~/db/fetchers/products'
import { useI18n } from '~/contexts/i18n'
import { Skeleton } from './ui/skeleton'
import type { ColorVariant } from '~/db/schema'

interface SearchProps {
  onOpenChange: (isOpen: boolean) => void
  isSearchOpen: boolean
}

interface SearchResult {
  productId: string
  productName: string
  price: number
  storeId: string
  storeName: string | null
  colorVariants: ColorVariant[]
  image: string
}

export const Search = (props: SearchProps) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [query, setQuery] = createSignal('')
  const [results, setResults] = createSignal<SearchResult[]>([])
  const [isLoading, setIsLoading] = createSignal(false)
  const [showResults, setShowResults] = createSignal(false)
  const [hasFocus, setHasFocus] = createSignal(false)
  let searchRef: HTMLDivElement | undefined
  let inputRef: HTMLInputElement | undefined

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await searchProducts(value)
      setResults(data as SearchResult[])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProductImage = (product: SearchResult) => {
    if (product.image) {
      return product.image
    }
    return product.colorVariants?.[0]?.colorImageUrls?.[0] || ''
  }

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false)
      inputRef?.blur()
      props.onOpenChange(false) // Notify Nav to close
    }
  }

  createEffect(() => {
    props.onOpenChange(hasFocus())
  })

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  const handleResultClick = () => {
    setQuery('') // Clear the search bar
    setShowResults(false)
    props.onOpenChange(false)
  }

  return (
    <div ref={searchRef} class='relative flex-1 max-w-xl mx-4'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (query()) {
            navigate(`/search?q=${encodeURIComponent(query())}`)
            setQuery('') // Clear the search bar on submit as well
            setShowResults(false)
            props.onOpenChange(false)
          }
        }}
      >
        <input
          ref={inputRef}
          type='search'
          placeholder={t('common.search')}
          class='w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
          value={query()}
          onInput={(e) => {
            const value = e.currentTarget.value
            setQuery(value)
            setShowResults(!!value)
            handleSearch(value)
          }}
          onFocus={() => {
            setHasFocus(true)
          }}
          onBlur={() => setTimeout(() => setHasFocus(false), 100)}
        />
      </form>

      <Show when={showResults() && hasFocus()}>
        <div class='absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-[60vh] overflow-auto'>
          <Show
            when={!isLoading()}
            fallback={
              <div class='p-4 space-y-2'>
                <For each={Array(3)}>{() => <Skeleton class='h-16 w-full' />}</For>
              </div>
            }
          >
            <Switch>
              <Match when={results().length === 0 && query().length > 0}>
                <div class='p-4 text-gray-500 text-center'>{t('search.noResults')}</div>
              </Match>

              <Match when={results().length > 0}>
                <For each={results()}>
                  {(product) => (
                    <A
                      href={`/shopping/products/${product.productId}`}
                      class='flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 h-24'
                      onClick={() => {
                        handleResultClick()
                      }}
                    >
                      <div class='w-16 h-16 flex-shrink-0'>
                        <div class='w-full h-full relative bg-gray-100 rounded-md overflow-hidden'>
                          <Show
                            when={getProductImage(product)}
                            fallback={
                              <div class='absolute inset-0 flex items-center justify-center text-gray-400'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke-width='1.5'
                                  stroke='currentColor'
                                  class='w-6 h-6'
                                >
                                  <path
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                                  />
                                </svg>
                              </div>
                            }
                          >
                            <img
                              src={getProductImage(product)}
                              alt={product.productName}
                              class='absolute inset-0 w-full h-full object-cover'
                            />
                          </Show>
                        </div>
                      </div>
                      <div class='flex-1 min-w-0 flex flex-col justify-between h-16'>
                        <div>
                          <h3 class='font-medium text-sm line-clamp-1'>{product.productName}</h3>
                          <div class='text-sm text-gray-500 mt-1 line-clamp-1'>
                            {product.storeName || t('store.unnamed')}
                          </div>
                        </div>
                        <div class='font-semibold text-sm text-blue-600'>
                          {new Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency: 'EGP',
                          }).format(product.price)}
                        </div>
                      </div>
                    </A>
                  )}
                </For>
              </Match>
            </Switch>
          </Show>
        </div>
      </Show>
    </div>
  )
}
