import { Component, createSignal, Show, Suspense } from 'solid-js'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { DataTable } from '~/components/admin/dataTable'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import TableSkeleton from '~/components/seller/TableSkeleton'
import { useSellerContext } from '~/contexts/seller'
import { useI18n } from '~/contexts/i18n'
import { showToast } from '~/components/ui/toast'
import { FiSearch, FiPackage, FiEdit2 } from 'solid-icons/fi'
import { useAction } from '@solidjs/router'
import type { Order, OrderStatus, PaymentMethod, ShippingAddress, OrderTableColumn } from '~/db/schema/types'
import { updateStoreOrderAction, isValidShippingAddress } from '~/db/actions/order'

// Stats Card Components
const StatsCardSkeleton: Component = () => (
  <Card class='h-10 w-36 bg-primary/10'>
    <CardContent class='p-2 flex items-center justify-center gap-2'>
      <Skeleton class='w-4 h-4 rounded-full bg-primary/20' />
      <Skeleton class='h-4 w-14 bg-primary/20' />
    </CardContent>
  </Card>
)

const StatsCard: Component<{ count: number }> = (props) => {
  const { t } = useI18n()

  const getPluralKey = (count: number) => {
    if (count === 1) return '1'
    return 'other'
  }

  return (
    <Card class='h-10 bg-primary/10'>
      <CardContent class='p-2 flex items-center justify-center gap-2'>
        <FiPackage class='w-4 h-4 text-blue-600' />
        <span class='text-sm font-medium text-primary'>
          {/* Correctly uses the pluralized string from the i18n context */}
          {t(`order.seller.pluralKeys.${getPluralKey(props.count)}`, { count: props.count })}
        </span>
      </CardContent>
    </Card>
  )
}

// Payment Method Badge Component
const PaymentMethodBadge: Component<{ method: PaymentMethod }> = (props) => {
  const { t } = useI18n()
  return (
    <Badge variant={props.method === 'card' ? 'businessAlt' : 'premiumAlt'} round>
      {t(`order.paymentMethod.${props.method}`)}
    </Badge>
  )
}
// Order Status Badge Component
const OrderStatusBadge: Component<{ status: OrderStatus }> = (props) => {
  const { t } = useI18n()
  const getVariant = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'success'
      case 'shipped':
        return 'warning'
      case 'processing':
        return 'default'
      case 'cancelled':
      case 'refunded':
        return 'error'
      default:
        return 'secondary'
    }
  }

  return (
    <Badge variant={getVariant(props.status)} round>
      {t(`order.status.${props.status}`)}
    </Badge>
  )
}

// Store Status Display Component
const StoreStatusDisplay: Component<{ status: OrderStatus }> = (props) => {
  const { t } = useI18n()
  return (
    <div class='space-y-1'>
      <div class='text-sm font-medium text-muted-foreground'>{t('order.storeStatus')}</div>
      <OrderStatusBadge status={props.status} />
    </div>
  )
}

// Customer Info Component
const CustomerInfo: Component<{ address: ShippingAddress }> = (props) => {
  return (
    <div class='space-y-1'>
      <div class='font-medium'>
        {props.address.name} - {props.address.phone}
      </div>
      <div class='text-sm text-muted-foreground'>{props.address.email}</div>
    </div>
  )
}

// Status Update Dialog Component
interface StatusUpdateDialogProps {
  isOpen: boolean
  onClose: () => void
  order: (Order & { shippingAddress: ShippingAddress }) | null
  onConfirm: (status: OrderStatus) => void
  isUpdating: boolean
}

const StatusUpdateDialog: Component<StatusUpdateDialogProps> = (props) => {
  const { t } = useI18n()
  const [selectedStatus, setSelectedStatus] = createSignal<OrderStatus>(props.order?.orderStatus || 'pending')

  const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent class='max-w-xs lg:max-w-md rounded-md'>
        <DialogHeader>
          <DialogTitle>{t('order.updateStatus')}</DialogTitle>
        </DialogHeader>

        <div class='space-y-4 py-4'>
          <div class='space-y-2'>
            <label class='text-sm font-medium'>{t('order.status.label')}</label>
            <select
              class='w-full px-3 py-2 border rounded-md'
              value={selectedStatus()}
              onChange={(e) => setSelectedStatus(e.currentTarget.value as OrderStatus)}
            >
              {statusOptions.map((status) => (
                <option value={status}>{t(`order.status.${status}`)}</option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='destructive' onClick={props.onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant='general' onClick={() => props.onConfirm(selectedStatus())} disabled={props.isUpdating}>
            {props.isUpdating ? t('common.updating') : t('common.update')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main Orders Page Component
const SellerOrdersPage: Component = () => {
  const { t } = useI18n()
  const { orders, refreshOrders, store } = useSellerContext()
  const updateOrder = useAction(updateStoreOrderAction)

  // Local state
  const [search, setSearch] = createSignal('')
  const [selectedOrder, setSelectedOrder] = createSignal<(Order & { shippingAddress: ShippingAddress }) | null>(null)
  const [isUpdating, setIsUpdating] = createSignal(false)

  // Get store orders from context
  const storeOrders = () => {
    const allOrders = orders() || []
    return allOrders.filter((order): order is Order & { shippingAddress: ShippingAddress } =>
      isValidShippingAddress(order.shippingAddress)
    )
  }

  // Filter orders based on search
  const filteredOrders = () => {
    const orderData = storeOrders()
    const searchTerm = search().toLowerCase()

    return orderData.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.name.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.phone.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.email.toLowerCase().includes(searchTerm)
    )
  }

  // Handle status update
  const handleStatusUpdate = async (status: OrderStatus) => {
    const order = selectedOrder()
    if (!order || !store()) return

    try {
      setIsUpdating(true)

      const formData = new FormData()
      formData.append('orderId', order.orderId)
      formData.append('storeId', store()!.storeId)
      formData.append('orderStatus', status)

      const result = await updateOrder(formData)

      if (result.success) {
        showToast({
          title: t('common.success'),
          description: t('order.seller.statusUpdateSuccess'),
          variant: 'success',
        })
        setSelectedOrder(null)
        refreshOrders()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      showToast({
        title: t('common.error'),
        description: t('order.seller.statusUpdateError'),
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Table columns configuration
  const columns: OrderTableColumn[] = [
    {
      header: t('order.number'),
      accessorKey: 'orderNumber',
      minWidth: '120px',
    },
    {
      header: t('order.seller.customer'),
      accessorKey: 'shippingAddress',
      minWidth: '250px',
      cell: (order) => <CustomerInfo address={order.shippingAddress} />,
    },
    {
      header: t('order.seller.total'),
      accessorKey: 'total',
      minWidth: '100px',
      cell: (order) => {
        const storeSummary = order.storeSummaries.find((summary) => summary.storeId === store()?.storeId)
        return <span>${storeSummary?.subtotal.toFixed(2) || '0.00'}</span>
      },
    },
    {
      header: t('order.paymentMethod.paymentMethod'),
      accessorKey: 'paymentMethod',
      minWidth: '120px',
      cell: (order) => <PaymentMethodBadge method={order.paymentMethod} />,
    },
    {
      header: t('order.storeOrderStatus'), // Changed this to be explicit about it being store status
      accessorKey: 'orderStatus',
      minWidth: '120px',
      cell: (order) => {
        const storeSummary = order.storeSummaries.find((summary) => summary.storeId === store()?.storeId)
        return <OrderStatusBadge status={storeSummary?.status || 'pending'} />
      },
    },
    {
      header: t('order.seller.date'),
      accessorKey: 'createdAt',
      minWidth: '120px',
      cell: (order) => new Date(order.createdAt).toLocaleDateString(),
    },
    {
      header: t('common.actions'),
      accessorKey: 'orderId',
      minWidth: '80px',
      cell: (order) => (
        <div class='flex items-center justify-center'>
          <Button variant='ghost' size='sm' onClick={() => setSelectedOrder(order)}>
            <FiEdit2 class='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ]
  return (
    <>
      {/* Header */}
      <div class='sticky top-0 bg-background z-10 border-b'>
        <div class='p-6'>
          <div class='flex items-center justify-between'>
            <div>
              <h1 class='text-2xl font-bold tracking-tight'>{t('order.seller.title')}</h1>
              <p class='text-muted-foreground'>{t('order.seller.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div class='max-w-[1600px] w-full mx-auto'>
        <div class='container mx-auto p-6'>
          <div class='space-y-6'>
            {/* Search and Stats */}
            <div class='flex items-center justify-between gap-4'>
              <div class='relative flex-1 max-w-sm'>
                <FiSearch class='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder={t('order.seller.searchPlaceholder')}
                  class='pl-8'
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
              <Suspense fallback={<StatsCardSkeleton />}>
                <Show when={storeOrders()}>
                  <StatsCard count={filteredOrders().length} />
                </Show>
              </Suspense>
            </div>

            {/* Orders Table */}
            <div class='rounded-md border'>
              <Suspense fallback={<TableSkeleton />}>
                <Show when={storeOrders()}>
                  <Show
                    when={storeOrders().length > 0}
                    fallback={<div class='p-4 text-center text-muted-foreground'>{t('order.seller.noOrders')}</div>}
                  >
                    <DataTable data={filteredOrders()} columns={columns} />
                  </Show>
                </Show>
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        isOpen={Boolean(selectedOrder())}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder()}
        onConfirm={handleStatusUpdate}
        isUpdating={isUpdating()}
      />
    </>
  )
}

export default SellerOrdersPage
