import { Component, createSignal, createResource, Suspense, Show, createEffect } from 'solid-js'
import { useSubmission } from '@solidjs/router'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { FiSearch, FiPlus, FiEdit2 } from 'solid-icons/fi'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Card, CardContent } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { DataTable } from '~/components/admin/dataTable'
import TableSkeleton from '~/components/admin/tableSkelton'
import FileUpload from '~/components/FileUpload'
import { createStoreAction, updateStoreAction } from '~/db/actions/stores'
import { getStores } from '~/db/fetchers/stores'
import { getSellers } from '~/db/fetchers/users'
import type { Store, NewStore } from '~/db/schema'
import { BiSolidStore } from 'solid-icons/bi'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { showToast } from '~/components/ui/toast'
import { useAdminContext } from '~/contexts/admin'

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

type DataTableColumn = {
  header: string
  accessorKey: keyof Store
  cell?: (item: Store) => any
}

// Store Form Component for Creating New Store
const StoreForm: Component<{ onSuccess: () => void; onClose: () => void }> = (props) => {
  const { refreshStores } = useAdminContext()
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
        refreshStores() // Call refresh after successful creation
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

  const handleFileUploadSuccess = (url: string) => {
    if (url) {
      setFormData((prev) => ({ ...prev, storeImage: url }))
      showToast({
        title: 'Image Updated',
        description: 'Store image has been updated successfully.',
        variant: 'success',
      })
    }
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
              itemComponent={(props) => (
                <SelectItem item={props.item} class='text-base'>
                  {props.item.rawValue}
                </SelectItem>
              )} // Added text-base
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
            class='no-zoom-input' // Added no-zoom-input
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
            class='no-zoom-input' // Added no-zoom-input
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
            class='no-zoom-input' // Added no-zoom-input
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
            itemComponent={(props) => (
              <SelectItem item={props.item} class='text-base'>
                {props.item.rawValue}
              </SelectItem>
            )} // Added text-base
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
            defaultValue={formData().storeImage} // Add this
          />
        </div>
      </div>

      {/* Form Actions */}
      <div class='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={props.onClose} class='text-base'>
          {' '}
          {/* Added text-base */}
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
          class='text-base' // Added text-base
        >
          {submission.pending ? 'Creating...' : 'Create Store'}
        </Button>
      </div>
    </form>
  )
}

// Edit Store Form Component
const EditStoreForm: Component<{
  store: Store
  onSuccess: () => void
  onClose: () => void
}> = (props) => {
  const { refreshStores } = useAdminContext()
  const submission = useSubmission(updateStoreAction)
  const [formData, setFormData] = createSignal<Omit<Store, 'userId' | 'storeOwner' | 'createdAt' | 'updatedAt'>>({
    storeId: props.store.storeId,
    storeName: props.store.storeName,
    storePhone: props.store.storePhone ?? '',
    storeAddress: props.store.storeAddress ?? '',
    subscription: props.store.subscription,
    storeImage: props.store.storeImage ?? '',
    featured: props.store.featured,
  })

  // Reset form function
  const resetForm = () => {
    submission.clear?.()
  }

  // Watch submission result
  createEffect(() => {
    if (submission.result && !submission.pending) {
      if (submission.result.success) {
        showToast({
          title: 'Success',
          description: 'Store has been updated successfully.',
          variant: 'success',
        })
        refreshStores() // Call refresh after successful update
        props.onSuccess()
        props.onClose()
        resetForm()
      } else {
        showToast({
          title: 'Error',
          description: submission.result.error || 'Failed to update store',
          variant: 'destructive',
        })
      }
    }
  })

  // File upload handlers
  const handleFileUploadSuccess = (url: string) => {
    if (url) {
      setFormData((prev) => ({ ...prev, storeImage: url }))
      showToast({
        title: 'Image Updated',
        description: 'Store image has been updated successfully.',
        variant: 'success',
      })
    }
  }

  const handleFileUploadError = (error: string) => {
    showToast({
      title: 'Upload Error',
      description: error,
      variant: 'destructive',
    })
  }

  return (
    <form action={updateStoreAction} method='post' class='space-y-6'>
      <input type='hidden' name='storeId' value={formData().storeId} />

      <div class='space-y-4'>
        {/* Store Name */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>Store Name</label>
          <Input
            name='storeName'
            value={formData().storeName}
            onInput={(e) => setFormData((prev) => ({ ...prev, storeName: e.currentTarget.value }))}
            placeholder='Enter store name'
            required
            class='no-zoom-input' // Added no-zoom-input
          />
        </div>

        {/* Store Phone */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>Store Phone</label>
          <Input
            name='storePhone'
            value={formData().storePhone || ''}
            onInput={(e) => setFormData((prev) => ({ ...prev, storePhone: e.currentTarget.value }))}
            placeholder='Enter store phone number'
            class='no-zoom-input' // Added no-zoom-input
          />
        </div>

        {/* Store Address */}
        <div class='space-y-2'>
          <label class='text-sm font-medium'>Store Address</label>
          <Input
            name='storeAddress'
            value={formData().storeAddress || ''} // Convert null to empty string
            onInput={(e) => setFormData((prev) => ({ ...prev, storeAddress: e.currentTarget.value }))}
            placeholder='Enter store address'
            class='no-zoom-input' // Added no-zoom-input
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
            itemComponent={(props) => (
              <SelectItem item={props.item} class='text-base'>
                {props.item.rawValue}
              </SelectItem>
            )} // Added text-base
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
          <input type='hidden' name='storeImage' value={formData().storeImage || ''} />
          <FileUpload
            onSuccess={handleFileUploadSuccess}
            onError={handleFileUploadError}
            accept='image/*'
            maxSize={5 * 1024 * 1024}
            defaultValue={formData().storeImage || undefined}
            currentImage={props.store.storeImage || undefined}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div class='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={props.onClose} class='text-base'>
          {' '}
          {/* Added text-base */}
          Cancel
        </Button>
        <Button
          type='submit'
          variant='general'
          disabled={submission.pending || !formData().storeName || !formData().storeImage}
          class='text-base' // Added text-base
        >
          {submission.pending ? 'Updating...' : 'Update Store'}
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
  const { stores, users } = useAdminContext()
  const [search, setSearch] = createSignal('')
  const [isOpen, setIsOpen] = createSignal(false)
  const [isEditOpen, setIsEditOpen] = createSignal(false)
  const [editStore, setEditStore] = createSignal<Store | null>(null)

  // Filter available sellers using context data
  const availableSellers = () => {
    const allSellers = users()?.filter((user) => user.role === 'seller') || []
    const existingStores = stores() || []
    const sellersWithStores = new Set(existingStores.map((store) => store.userId))
    return allSellers.filter((seller) => !sellersWithStores.has(seller.id))
  }

  const isAddStoreDisabled = () => {
    const available = availableSellers()
    return available.length === 0
  }

  // Table columns configuration
  const columns: DataTableColumn[] = [
    {
      header: 'Store',
      accessorKey: 'storeName',
      cell: (store: Store) => (
        <div class='flex items-center space-x-4'>
          <Avatar>
            <AvatarImage src={store.storeImage || ''} alt={store.storeName} />
            <AvatarFallback>{store.storeName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span class='text-base'>{store.storeName}</span>
        </div>
      ),
    },
    {
      header: 'Store Owner',
      accessorKey: 'storeOwner',
      cell: (store: Store) => <span class='text-base'>{store.storeOwner}</span>,
    },
    {
      header: 'Phone',
      accessorKey: 'storePhone',
      cell: (store: Store) => <span class='text-base'>{store.storePhone}</span>,
    },
    {
      header: 'Address',
      accessorKey: 'storeAddress',
      cell: (store: Store) => <span class='text-base'>{store.storeAddress}</span>,
    },
    {
      header: 'Subscription',
      accessorKey: 'subscription',
      cell: (store: Store) => (
        <Badge
          variant={
            store.subscription === 'premium' ? 'premium' : store.subscription === 'business' ? 'warning' : 'basic'
          }
          class='text-base'
        >
          {store.subscription}
        </Badge>
      ),
    },
    {
      header: 'Featured',
      accessorKey: 'featured',
      cell: (store: Store) => (
        <Badge variant={store.featured === 'yes' ? 'success' : 'secondary'} class='text-base'>
          {store.featured}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'storeId',
      cell: (store: Store) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            setEditStore(store)
            setIsEditOpen(true)
          }}
        >
          <FiEdit2 class='h-4 w-4' />
        </Button>
      ),
    },
  ]

  // Filtered stores using context data
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
    // Close dialogs after successful operation
    setIsOpen(false)
    setIsEditOpen(false)
    setEditStore(null)
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setIsEditOpen(false)
      setEditStore(null)
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
            <Suspense fallback={<Button variant={'general'} class='w-28' disabled />}>
              <Button
                variant='general'
                onClick={handleAddStoreClick}
                disabled={isAddStoreDisabled()}
                title={isAddStoreDisabled() ? 'No available sellers' : 'Add Store'}
                class={`text-base ${isAddStoreDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`} 
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
                  class='pl-8 no-zoom-input text-base' // Added no-zoom-input and text-base
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
                  <DataTable<Store> data={filteredStores()} columns={columns} />
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
            <DialogTitle class='text-lg'>Create New Store</DialogTitle>
          </DialogHeader>
          <StoreForm onSuccess={handleStoreCreated} onClose={() => handleDialogChange(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Store Dialog */}
      <Dialog open={isEditOpen()} onOpenChange={handleEditDialogChange}>
        <DialogContent class='rounded-xl sm:max-w-[425px] lg:max-w-[550px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle class='text-lg'>Edit Store</DialogTitle>
          </DialogHeader>
          <Show when={editStore()}>
            {(store) => (
              <EditStoreForm
                store={store()}
                onSuccess={handleStoreCreated}
                onClose={() => handleEditDialogChange(false)}
              />
            )}
          </Show>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StoresPage
