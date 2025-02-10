import { Component, createSignal, Show, For, Switch, Match } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Button, buttonVariants } from '~/components/ui/button'
import { useI18n } from '~/contexts/i18n'
import { searchProducts } from '~/db/fetchers/products'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { BiRegularSearch } from 'solid-icons/bi'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import { Card } from '~/components/ui/card'
import { cn, formatCurrency } from '~/lib/utils'
import type { ColorVariant } from '~/db/schema'

interface SearchResult {
  productId: string
  productName: string
  price: number
  storeId: string
  storeName: string | null
  colorVariants: ColorVariant[]
  image: string
}

const SearchSheet: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [searchQuery, setSearchQuery] = createSignal('')
  const [searchResults, setSearchResults] = createSignal<SearchResult[]>([])
  const [isLoading, setIsLoading] = createSignal(false)
  const { t } = useI18n()
  const navigate = useNavigate()

  const performSearch = async (query: string) => {
    if (!query) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const results = await searchProducts(query)
      setSearchResults(results as SearchResult[])
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchInputChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    setSearchQuery(value)
    performSearch(value)
  }

  const getProductImage = (product: SearchResult) => {
    if (product.image) {
      return product.image
    }
    return product.colorVariants?.[0]?.colorImageUrls?.[0] || ''
  }

  return (
    <Sheet open={isOpen()} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button variant='ghost' size='icon' class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}>
          <BiRegularSearch class='h-5 w-5' />
        </Button>
      </SheetTrigger>

      <SheetContent position='bottom' class='h-[100dvh] px-0'>
        <div class='flex flex-col h-full'>
          <SheetHeader class='border-b px-4 py-3 flex-shrink-0'>
            <SheetTitle class='text-lg font-semibold'>{t('search.title')}</SheetTitle>
          </SheetHeader>

          <div class='p-4 flex-shrink-0'>
            <Input
              type='search'
              placeholder={t('search.placeholder')}
              value={searchQuery()}
              onInput={handleSearchInputChange}
              class='w-full text-base' // Using Tailwind's text-base class
            />
          </div>

          <div class='flex-1 overflow-auto'>
            <Switch
              fallback={
                <div class='flex flex-col items-center justify-center h-full text-center p-4'>
                  <BiRegularSearch class='h-12 w-12 text-muted-foreground mb-4' />
                  <p class='text-lg font-medium mb-2'>{t('search.startSearching')}</p>
                  <p class='text-sm text-muted-foreground'>{t('search.searchDescription')}</p>
                </div>
              }
            >
              <Match when={isLoading()}>
                <div class='space-y-4 p-4'>
                  <Skeleton class='h-24 w-full' />
                  <Skeleton class='h-24 w-full' />
                  <Skeleton class='h-24 w-full' />
                </div>
              </Match>

              <Match when={!isLoading() && searchQuery() && searchResults().length === 0}>
                <div class='flex flex-col items-center justify-center h-full text-center p-4'>
                  <p class='text-lg font-medium mb-2'>{t('search.noResults')}</p>
                  <p class='text-sm text-muted-foreground'>{t('search.tryDifferentSearch')}</p>
                </div>
              </Match>

              <Match when={!isLoading() && searchResults().length > 0}>
                <div class='p-4 space-y-4'>
                  <For each={searchResults()}>
                    {(product) => (
                      <Card class='overflow-hidden'>
                        <div
                          class='p-3 flex items-center gap-4 cursor-pointer hover:bg-secondary/10 transition-colors h-24'
                          onClick={() => {
                            setIsOpen(false)
                            navigate(`/shopping/products/${product.productId}`)
                          }}
                        >
                          <div class='w-20 h-20 flex-shrink-0'>
                            <div class='w-full h-full relative bg-secondary/20 rounded-md overflow-hidden'>
                              <Show
                                when={getProductImage(product)}
                                fallback={
                                  <div class='absolute inset-0 flex items-center justify-center text-muted-foreground'>
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      fill='none'
                                      viewBox='0 0 24 24'
                                      stroke-width='1.5'
                                      stroke='currentColor'
                                      class='w-8 h-8'
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
                          <div class='flex-1 min-w-0 flex flex-col justify-between h-20'>
                            <div>
                              <h3 class='font-medium text-sm line-clamp-1'>{product.productName}</h3>
                              <div class='text-sm text-muted-foreground mt-1'>
                                {product.storeName || t('store.unnamed')}
                              </div>
                            </div>
                            <div class='font-medium text-sm'>{formatCurrency(product.price)}</div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </For>
                </div>
              </Match>
            </Switch>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SearchSheet
