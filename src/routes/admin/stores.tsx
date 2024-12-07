import { DataTable } from '~/components/admin/dataTable'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { createSignal } from 'solid-js'
import { AiOutlinePlusCircle } from 'solid-icons/ai'
import { FiSearch } from 'solid-icons/fi'

interface Store {
  id: string
  name: string
  owner: string
  products: number
  status: 'active' | 'pending' | 'suspended'
  revenue: number
}

const dummyStores: Store[] = [
  {
    id: '1',
    name: 'Tech Haven',
    owner: 'John Doe',
    products: 150,
    status: 'active',
    revenue: 25000,
  },
  {
    id: '2',
    name: 'Fashion Hub',
    owner: 'Jane Smith',
    products: 300,
    status: 'active',
    revenue: 45000,
  },
  {
    id: '3',
    name: 'Sports Corner',
    owner: 'Bob Wilson',
    products: 75,
    status: 'pending',
    revenue: 12000,
  },
]

const columns = [
  {
    header: 'Store Name',
    accessorKey: 'name' as const,
  },
  {
    header: 'Owner',
    accessorKey: 'owner' as const,
  },
  {
    header: 'Products',
    accessorKey: 'products' as const,
  },
  {
    header: 'Status',
    accessorKey: 'status' as const,
    cell: (store: Store) => (
      <Badge variant={store.status === 'active' ? 'success' : store.status === 'pending' ? 'warning' : 'error'}>
        {store.status}
      </Badge>
    ),
  },
  {
    header: 'Revenue',
    accessorKey: 'revenue' as const,
    cell: (store: Store) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(store.revenue),
  },
]
export default function StoresPage() {
  const [search, setSearch] = createSignal('')

  const filteredStores = () =>
    dummyStores.filter(
      (store) =>
        store.name.toLowerCase().includes(search().toLowerCase()) ||
        store.owner.toLowerCase().includes(search().toLowerCase())
    )

  return (
    <div class='space-y-4'>
      <div class='flex justify-between'>
        <h1 class='text-2xl font-bold tracking-tight'>Stores</h1>
        <Button>
          <AiOutlinePlusCircle class='mr-2 h-4 w-4' />
          Add Store
        </Button>
      </div>

      <div class='flex items-center justify-between'>
        <div class='relative w-64'>
          <FiSearch class='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search stores...'
            class='pl-8'
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
          />
        </div>
      </div>

      <DataTable data={filteredStores()} columns={columns} />
    </div>
  )
}
