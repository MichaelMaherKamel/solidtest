// ~/pages/orders/search.tsx
import { Component, createSignal, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useI18n } from '~/contexts/i18n'
import { Card } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { FiSearch } from 'solid-icons/fi'
import { getOrderByOrderNumber } from '~/db/fetchers/order'

const OrderSearch: Component = () => {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const isRTL = () => locale() === 'ar'

  const [orderNumber, setOrderNumber] = createSignal('')
  const [error, setError] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(false)

  const handleSearch = async (e: Event) => {
    e.preventDefault()
    if (!orderNumber()) {
      setError(t('order.search.enterOrderNumber'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const order = await getOrderByOrderNumber(orderNumber())
      if (order) {
        navigate(`/orders/${order.orderId}`)
      } else {
        setError(t('order.search.notFound'))
      }
    } catch (err) {
      setError(t('order.search.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class='container mx-auto px-4 py-8' dir={isRTL() ? 'rtl' : 'ltr'}>
      <div class='max-w-md mx-auto'>
        <Card>
          <div class='p-6 space-y-6'>
            <h1 class='text-2xl font-semibold text-gray-900'>{t('order.search.title')}</h1>

            <form onSubmit={handleSearch} class='space-y-4'>
              <div class='space-y-2'>
                <label for='orderNumber' class='block text-sm font-medium text-gray-700'>
                  {t('order.search.orderNumber')}
                </label>
                <Input
                  id='orderNumber'
                  type='text'
                  placeholder={t('order.search.placeholder')}
                  value={orderNumber()}
                  onInput={(e) => {
                    setOrderNumber(e.currentTarget.value)
                    setError('')
                  }}
                  class='w-full'
                />
                <Show when={error()}>
                  <p class='text-sm text-red-600'>{error()}</p>
                </Show>
              </div>

              <Button
                variant={'pay'}
                type='submit'
                class='w-full flex items-center justify-center gap-2'
                disabled={isLoading()}
              >
                <FiSearch class='w-4 h-4' />
                {isLoading() ? t('order.search.searching') : t('order.search.search')}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OrderSearch
