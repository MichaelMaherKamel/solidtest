import { Component, createSignal, createResource, Suspense, Show } from 'solid-js'
import { useSubmission } from '@solidjs/router'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { FiSearch, FiPlus } from 'solid-icons/fi'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Card, CardContent } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { DataTable } from '~/components/admin/dataTable'
import TableSkeleton from '~/components/admin/tableSkelton'
import FileUpload from '~/components/FileUpload'
import { createStoreAction } from '~/db/actions/stores'
import { getStores } from '~/db/fetchers/stores'
import { getSellers } from '~/db/fetchers/users'
import type { Store, User } from '~/db/schema'
import { BiSolidStore } from 'solid-icons/bi'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'

type FormData = {
  userId: string
  storeOwner: string
  storeName: string
  storePhone: string
  storeAddress: string
  subscription: 'basic' | 'business' | 'premium'
  storeImage: string
}

const StoreForm: Component<{ onSuccess: () => void; onClose: () => void }> = (props) => {
  const submission = useSubmission(createStoreAction)
  const [sellers] = createResource(() => getSellers())
  const [formData, setFormData] = createSignal<FormData>({
    userId: '',
    storeOwner: '',
    storeName: '',
    storePhone: '',
    storeAddress: '',
    subscription: 'basic',
    storeImage: '',
  })
  const [error, setError] = createSignal('')

  // Store the mapping of display names to IDs
  const sellerMap = () => {
    const list = sellers() || []
    return new Map(list.map((s) => [s.name || 'Unnamed Seller', s.id]))
  }

  // Get just the display names for the select
  const sellerNames = () => {
    const list = sellers() || []
    return list.map((s) => s.name || 'Unnamed Seller')
  }

  // Convert display name back to ID when selected
  const handleSellerChange = (displayName: string | null) => {
    if (displayName) {
      const id = sellerMap().get(displayName)
      if (id) {
        setFormData((prev) => ({ ...prev, userId: id, storeOwner: displayName }))
      }
    }
  }

  // Get display name from ID for current value
  const getCurrentSellerName = () => {
    const list = sellers() || []
    const seller = list.find((s) => s.id === formData().userId)
    return seller ? seller.name || 'Unnamed Seller' : ''
  }

  return (
    <form action={createStoreAction} method='post' class='space-y-6'>
      <Show when={error() || submission.error}>
        <div class='bg-red-50 text-red-600 p-3 rounded'>{error() || submission.error}</div>
      </Show>

      <div class='space-y-4'>
        {/* Seller Select */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>
            Select Seller {sellers.loading && <span class='ml-2 text-muted-foreground'>(Loading...)</span>}
          </label>
          <Suspense fallback={<Skeleton class='h-10 w-full' />}>
            <Select
              value={getCurrentSellerName()}
              onChange={handleSellerChange}
              options={sellerNames()}
              placeholder={sellers.loading ? 'Loading...' : 'Select a seller'}
              itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
            >
              <SelectTrigger aria-label='Seller' class='w-full'>
                <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
            <input type='hidden' name='userId' value={formData().userId} />
            <input type='hidden' name='storeOwner' value={formData().storeOwner} />
          </Suspense>
          <Show when={!sellers.loading && sellerNames().length === 0}>
            <p class='text-sm text-red-500'>No sellers available. Please add sellers first.</p>
          </Show>
        </div>

        {/* Store Name */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>Store Name</label>
          <Input
            name='storeName'
            value={formData().storeName}
            onInput={(e) => setFormData((prev) => ({ ...prev, storeName: e.currentTarget.value }))}
            placeholder='Enter store name'
            required
          />
        </div>

        {/* Store Phone */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>Store Phone</label>
          <Input
            name='storePhone'
            value={formData().storePhone}
            onInput={(e) => setFormData((prev) => ({ ...prev, storePhone: e.currentTarget.value }))}
            placeholder='Enter store phone number'
          />
        </div>

        {/* Store Address */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>Store Address</label>
          <Input
            name='storeAddress'
            value={formData().storeAddress}
            onInput={(e) => setFormData((prev) => ({ ...prev, storeAddress: e.currentTarget.value }))}
            placeholder='Enter store address'
          />
        </div>

        {/* Subscription Plan */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>Subscription Plan</label>
          <Select
            name='subscription'
            value={formData().subscription}
            onChange={(value: 'basic' | 'business' | 'premium' | null) => {
              if (value !== null) {
                setFormData((prev) => ({ ...prev, subscription: value }))
              }
            }}
            options={['basic', 'business', 'premium']}
            placeholder='Select a plan...'
            itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
          >
            <SelectTrigger aria-label='Subscription' class='w-full'>
              <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>

        {/* Store Image */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>Store Image</label>
          <input type='hidden' name='storeImage' value={formData().storeImage} />
          <FileUpload
            onSuccess={(url) => setFormData((prev) => ({ ...prev, storeImage: url }))}
            onError={(err) => setError(err)}
            accept='image/*'
            maxSize={5 * 1024 * 1024}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div class='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={props.onClose}>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={
            submission.pending ||
            !formData().userId ||
            !formData().storeOwner ||
            !formData().storeName ||
            !formData().storeImage
          }
        >
          {submission.pending ? 'Creating...' : 'Create Store'}
        </Button>
      </div>
    </form>
  )
}

const StatsCard = ({ count }: { count: number }) => (
  <Card class='h-10 bg-primary/10'>
    <CardContent class='p-2 flex items-center justify-center gap-2'>
      <BiSolidStore class='w-4 h-4 text-blue-600' />
      <span class='text-sm font-medium text-primary'>
        {count} store{count !== 1 ? 's' : ''}
      </span>
    </CardContent>
  </Card>
)

const StatsCardSkeleton: Component = () => (
  <Card class='h-10 w-36 bg-primary/10'>
    <CardContent class='p-2 flex items-center justify-center gap-2'>
      <Skeleton class='w-4 h-4 rounded-full bg-primary/20' />
      <Skeleton class='h-4 w-14 bg-primary/20' />
    </CardContent>
  </Card>
)

const StoresPage: Component = () => {
  const [search, setSearch] = createSignal('')
  const [isOpen, setIsOpen] = createSignal(false)
  const [refetchTrigger, setRefetchTrigger] = createSignal(0)
  const [stores] = createResource(() => getStores())

  const columns = [
    {
      header: 'Store',
      accessorKey: 'storeName' as const,
      cell: (store: Store) => (
        <div class='flex items-center space-x-4'>
          <Avatar>
            <AvatarImage src={store.storeImage as string} alt={store.storeName} />
            <AvatarFallback>{store.storeName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{store.storeName}</span>
        </div>
      ),
    },
    {
      header: 'Store Owner',
      accessorKey: 'storeOwner' as const,
    },
    {
      header: 'Phone',
      accessorKey: 'storePhone' as const,
    },
    {
      header: 'Address',
      accessorKey: 'storeAddress' as const,
    },
    {
      header: 'Subscription',
      accessorKey: 'subscription' as const,
      cell: (store: Store) => (
        <Badge
          variant={
            store.subscription === 'premium' ? 'default' : store.subscription === 'business' ? 'warning' : 'secondary'
          }
        >
          {store.subscription}
        </Badge>
      ),
    },
    {
      header: 'Featured',
      accessorKey: 'featured' as const,
      cell: (store: Store) => (
        <Badge variant={store.featured === 'yes' ? 'success' : 'secondary'}>{store.featured}</Badge>
      ),
    },
  ]

  const filteredStores = () => {
    const storeData = stores()
    if (!storeData) return []

    const searchTerm = search().toLowerCase()
    return storeData.filter(
      (store) =>
        store.storeName.toLowerCase().includes(searchTerm) ||
        store.storeOwner.toLowerCase().includes(searchTerm) ||
        (store.storePhone?.toLowerCase() || '').includes(searchTerm) ||
        (store.storeAddress?.toLowerCase() || '').includes(searchTerm)
    )
  }

  const handleStoreCreated = () => {
    setRefetchTrigger((prev) => prev + 1)
  }

  return (
    <>
      <div class='sticky top-0 bg-background z-10 border-b'>
        <div class='p-6'>
          <div class='flex items-center justify-between'>
            <div>
              <h1 class='text-2xl font-bold tracking-tight'>Stores</h1>
              <p class='text-muted-foreground'>Manage marketplace stores</p>
            </div>
            <Button onClick={() => setIsOpen(true)}>
              <FiPlus class='mr-2 h-4 w-4' />
              Add Store
            </Button>
          </div>
        </div>
      </div>

      <div class='max-w-[1600px] w-full mx-auto'>
        <div class='container mx-auto p-6'>
          <div class='space-y-6'>
            <div class='flex items-center justify-between gap-4 mb-6'>
              <div class='relative flex-1 max-w-sm'>
                <FiSearch class='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search stores...'
                  class='pl-8'
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
              <Suspense fallback={<StatsCardSkeleton />}>
                <Show when={stores()}>
                  <StatsCard count={filteredStores().length} />
                </Show>
              </Suspense>
            </div>

            <Suspense fallback={<TableSkeleton />}>
              <Show when={stores()}>
                <div class='rounded-md border'>
                  <DataTable data={filteredStores()} columns={columns} />
                </div>
              </Show>
            </Suspense>
          </div>
        </div>
      </div>

      <Dialog open={isOpen()} onOpenChange={setIsOpen}>
        <DialogContent class='rounded-xl'>
          <DialogHeader>
            <DialogTitle>Create New Store</DialogTitle>
          </DialogHeader>
          <StoreForm onSuccess={handleStoreCreated} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StoresPage
