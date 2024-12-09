import { DataTable } from '~/components/admin/dataTable'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { createSignal } from 'solid-js'
import { FiSearch } from 'solid-icons/fi'

interface Order {
  id: string
  customer: string
  store: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  date: string
}

const dummyOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    store: 'Tech Haven',
    amount: 299.99,
    status: 'completed',
    date: '2024-03-07T10:00:00',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    store: 'Fashion Hub',
    amount: 149.5,
    status: 'processing',
    date: '2024-03-07T09:30:00',
  },
  {
    id: 'ORD-003',
    customer: 'Bob Wilson',
    store: 'Sports Corner',
    amount: 79.99,
    status: 'pending',
    date: '2024-03-06T15:45:00',
  },
]

const columns = [
  {
    header: 'Order ID',
    accessorKey: 'id' as const,
  },
  {
    header: 'Customer',
    accessorKey: 'customer' as const,
  },
  {
    header: 'Store',
    accessorKey: 'store' as const,
  },
  {
    header: 'Amount',
    accessorKey: 'amount' as const,
    cell: (order: Order) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(order.amount),
  },
  {
    header: 'Status',
    accessorKey: 'status' as const,
    cell: (order: Order) => (
      <Badge
        variant={
          order.status === 'completed'
            ? 'success'
            : order.status === 'processing'
            ? 'warning'
            : order.status === 'pending'
            ? 'secondary'
            : 'error'
        }
      >
        {order.status}
      </Badge>
    ),
  },
  {
    header: 'Date',
    accessorKey: 'date' as const,
    cell: (order: Order) => new Date(order.date).toLocaleString(),
  },
]

export default function OrdersPage() {
  const [search, setSearch] = createSignal('')

  const filteredOrders = () =>
    dummyOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(search().toLowerCase()) ||
        order.customer.toLowerCase().includes(search().toLowerCase()) ||
        order.store.toLowerCase().includes(search().toLowerCase())
    )

  return (
    <>
      {/* Fixed Header */}
      <div class='sticky top-0 bg-background z-10 border-b'>
        <div class='p-6'>
          <h1 class='text-2xl font-bold tracking-tight'>Orders</h1>
          <p class='text-muted-foreground'>Manage and track your orders</p>
        </div>
      </div>

      {/* Content */}
      <div class='max-w-[1600px] w-full mx-auto'>
        <div class='container mx-auto p-6'>
          <div class='space-y-4'>
            <div class='flex items-center justify-between'>
              <div class='relative w-64'>
                <FiSearch class='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search orders...'
                  class='pl-8'
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
            </div>

            <DataTable data={filteredOrders()} columns={columns} />
          </div>
        </div>
      </div>
    </>
  )
}
