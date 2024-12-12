import { Component, createSignal, createResource, Suspense, Show, createEffect } from 'solid-js'
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
import type { Store } from '~/db/schema'
import { BiSolidStore } from 'solid-icons/bi'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { showToast } from '~/components/ui/toast'

type SellerData = {
  id: string
  name: string | null
}

type FormData = {
  userId: string
  storeOwner: string
  storeName: string
  storePhone: string
  storeAddress: string
  subscription: 'basic' | 'business' | 'premium'
  storeImage: string
}

// Store Form Component
const StoreForm: Component<{ onSuccess: () => void; onClose: () => void }> = (props) => {
  const submission = useSubmission(createStoreAction)
  const [stores] = createResource<Store[]>(async () => await getStores())
  const [sellers] = createResource<SellerData[]>(async () => await getSellers())
  const [formData, setFormData] = createSignal<FormData>({
    userId: '',
    storeOwner: '',
    storeName: '',
    storePhone: '',
    storeAddress: '',
    subscription: 'basic',
    storeImage: '',
  })

  // Filter sellers who don't have stores
  const availableSellers = () => {
    const allSellers = sellers() || []
    const existingStores = stores() || []
    const sellersWithStores = new Set(existingStores.map((store) => store.userId))
    return allSellers.filter((seller) => !sellersWithStores.has(seller.id))
  }

  // Form reset function
  const resetForm = () => {
    setFormData({
      userId: '',
      storeOwner: '',
      storeName: '',
      storePhone: '',
      storeAddress: '',
      subscription: 'basic',
      storeImage: '',
    })
    submission.clear?.()
  }

  // Watch submission result
  createEffect(() => {
    if (submission.result && !submission.pending) {
      if (submission.result.success) {
        showToast({
          title: 'Success',
          description: 'Store has been created successfully.',
          variant: 'success',
        })
        props.onSuccess()
        props.onClose()
        resetForm()
      } else {
        showToast({
          title: 'Error',
          description: submission.result.error || 'Failed to create store',
          variant: 'destructive',
        })
      }
    }
  })

  // Seller selection helpers
  const sellerMap = () => {
    const available = availableSellers()
    return new Map(available.map((s) => [s.name || 'Unnamed Seller', s.id]))
  }

  const sellerNames = () => {
    return availableSellers().map((s) => s.name || 'Unnamed Seller')
  }

  const handleSellerChange = (displayName: string | null) => {
    if (displayName) {
      const id = sellerMap().get(displayName)
      if (id) {
        setFormData((prev) => ({ ...prev, userId: id, storeOwner: displayName }))
      }
    }
  }

  const getCurrentSellerName = () => {
    const available = availableSellers()
    const seller = available.find((s) => s.id === formData().userId)
    return seller ? seller.name || 'Unnamed Seller' : ''
  }

  // File upload handlers
  const handleFileUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, storeImage: url }))
  }

  const handleFileUploadError = (error: string) => {
    showToast({
      title: 'Upload Error',
      description: error,
      variant: 'destructive',
    })
  }

  return (
    <form action={createStoreAction} method='post' class='space-y-6'>
      <div class='space-y-4'>
        {/* Seller Select - Moved to top */}
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
          <input type='hidden' name='subscription' value={formData().subscription} />
          <Select
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
            onSuccess={handleFileUploadSuccess}
            onError={handleFileUploadError}
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
          variant='general'
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

// Stats Card Components
const StatsCardSkeleton: Component = () => (
  <Card class='h-10 w-36 bg-primary/10'>
    <CardContent class='p-2 flex items-center justify-center gap-2'>
      <Skeleton class='w-4 h-4 rounded-full bg-primary/20' />
      <Skeleton class='h-4 w-14 bg-primary/20' />
    </CardContent>
  </Card>
)

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

// Main Stores Page Component
const StoresPage: Component = () => {
  const [search, setSearch] = createSignal('')
  const [isOpen, setIsOpen] = createSignal(false)
  const [refetchTrigger, setRefetchTrigger] = createSignal(0)

  const [stores] = createResource(refetchTrigger, async () => await getStores())
  const [sellers] = createResource(refetchTrigger, async () => await getSellers())

  const triggerRefetch = () => setRefetchTrigger((prev) => prev + 1)

  const availableSellers = () => {
    const allSellers = sellers() || []
    const existingStores = stores() || []
    const sellersWithStores = new Set(existingStores.map((store) => store.userId))
    return allSellers.filter((seller) => !sellersWithStores.has(seller.id))
  }

  const isAddStoreDisabled = () => {
    const available = availableSellers()
    return available.length === 0
  }

  // Table columns configuration
  const columns = [
    {
      header: 'Store',
      accessorKey: 'storeName' as keyof Store,
      cell: (store: Store) => (
        <div class='flex items-center space-x-4'>
          <Avatar>
            <AvatarImage src={store.storeImage || ''} alt={store.storeName} />
            <AvatarFallback>{store.storeName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{store.storeName}</span>
        </div>
      ),
    },
    {
      header: 'Store Owner',
      accessorKey: 'storeOwner' as keyof Store,
    },
    {
      header: 'Phone',
      accessorKey: 'storePhone' as keyof Store,
    },
    {
      header: 'Address',
      accessorKey: 'storeAddress' as keyof Store,
    },
    {
      header: 'Subscription',
      accessorKey: 'subscription' as keyof Store,
      cell: (store: Store) => (
        <Badge
          variant={
            store.subscription === 'premium' ? 'premium' : store.subscription === 'business' ? 'warning' : 'basic'
          }
        >
          {store.subscription}
        </Badge>
      ),
    },
    {
      header: 'Featured',
      accessorKey: 'featured' as keyof Store,
      cell: (store: Store) => (
        <Badge variant={store.featured === 'yes' ? 'success' : 'secondary'}>{store.featured}</Badge>
      ),
    },
  ]

  // Filtered stores for search
  const filteredStores = () => {
    const storeData = stores()
    if (!storeData) return []

    const searchTerm = search().toLowerCase()
    return storeData.filter(
      (store: Store) =>
        store.storeName.toLowerCase().includes(searchTerm) ||
        store.storeOwner.toLowerCase().includes(searchTerm) ||
        (store.storePhone?.toLowerCase() || '').includes(searchTerm) ||
        (store.storeAddress?.toLowerCase() || '').includes(searchTerm)
    )
  }

  // Event handlers
  const handleAddStoreClick = () => {
    if (!isAddStoreDisabled()) {
      setIsOpen(true)
    } else {
      showToast({
        title: 'Cannot Create Store',
        description: 'No available sellers found or all sellers already have stores.',
        variant: 'destructive',
      })
    }
  }

  const handleStoreCreated = () => {
    triggerRefetch()
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
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
            <Suspense fallback={<Button size={'lg'} disabled />}>
              <Button
                variant='general'
                onClick={handleAddStoreClick}
                disabled={isAddStoreDisabled()}
                class={isAddStoreDisabled() ? 'opacity-50 cursor-not-allowed' : ''}
                title={isAddStoreDisabled() ? 'No available sellers' : 'Add Store'}
              >
                <FiPlus class='mr-2 h-4 w-4' />
                Add Store
              </Button>
            </Suspense>
          </div>
        </div>
      </div>

      <div class='max-w-[1600px] w-full mx-auto'>
        <div class='container mx-auto p-6'>
          <div class='space-y-6'>
            {/* Search and Stats Section */}
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

            {/* Data Table Section */}
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

      {/* Create Store Dialog */}
      <Dialog open={isOpen()} onOpenChange={handleDialogChange}>
        <DialogContent class='rounded-xl sm:max-w-[425px] lg:max-w-[550px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Create New Store</DialogTitle>
          </DialogHeader>
          <StoreForm onSuccess={handleStoreCreated} onClose={() => handleDialogChange(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StoresPage
