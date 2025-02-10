import { Component, Show, createSignal, Suspense } from 'solid-js'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'
import { Skeleton } from '~/components/ui/skeleton'
import { DataTable } from '~/components/admin/dataTable'
import TableSkeleton from '~/components/seller/TableSkeleton'
import { deleteProductAction } from '~/db/actions/products'
import type { Product } from '~/db/schema'
import { useI18n } from '~/contexts/i18n'
import { showToast } from '~/components/ui/toast'
import { useSellerContext } from '~/contexts/seller'
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'solid-icons/fi'
import { FaSolidBoxesStacked } from 'solid-icons/fa'
import SellerProductForm from '~/components/seller/SellerProductForm'
import { Badge } from '~/components/ui/badge'
import { useAction } from '@solidjs/router'

// Stats Card Components
const StatsCardSkeleton: Component = () => (
  <div class='h-10 w-36 bg-primary/10 rounded-lg'>
    <div class='p-2 flex items-center justify-center gap-2'>
      <Skeleton class='w-4 h-4 rounded-full bg-primary/20' />
      <Skeleton class='h-4 w-14 bg-primary/20' />
    </div>
  </div>
)

const StatsCard: Component<{ count: number }> = (props) => {
  const { t } = useI18n()
  return (
    <div class='h-10 bg-primary/10 rounded-lg'>
      <div class='p-2 flex items-center justify-center gap-2'>
        <FaSolidBoxesStacked class='w-4 h-4 text-blue-600' />
        <span class='text-sm font-medium text-primary'>
          {props.count} {props.count === 1 ? t('common.product') : t('common.products')}
        </span>
      </div>
    </div>
  )
}

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog: Component<{
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}> = (props) => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent lang={locale()} class='rounded-xl sm:max-w-[425px]'>
        <DialogHeader lang={locale()}>
          <DialogTitle lang={locale()} class='text-xl'>
            {t('seller.products.confirmDelete')}
          </DialogTitle>
        </DialogHeader>

        <DialogFooter lang={locale()}>
          <div class='flex flex-col-reverse sm:flex-row justify-end gap-2 w-full'>
            <Button variant='outline' onClick={props.onClose} class={`text-base ${isRTL() ? 'sm:ml-2' : 'sm:mr-2'}`}>
              {' '}
              {/* Added text-base */}
              {t('common.cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={props.onConfirm}
              disabled={props.isDeleting}
              class='w-full sm:w-auto text-base' // Added text-base
            >
              <Show when={!props.isDeleting} fallback={t('common.saving')}>
                {t('seller.products.form.buttons.delete')}
              </Show>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main Products Page Component
const ProductsPage: Component = () => {
  const { t, locale } = useI18n()
  const isRTL = () => locale() === 'ar'
  const { store, products, refreshProducts } = useSellerContext()
  const deleteProduct = useAction(deleteProductAction)

  // Local state
  const [search, setSearch] = createSignal('')
  const [isOpen, setIsOpen] = createSignal(false)
  const [editProduct, setEditProduct] = createSignal<Product | null>(null)
  const [productToDelete, setProductToDelete] = createSignal<Product | null>(null)
  const [isDeleting, setIsDeleting] = createSignal(false)

  // Filter products based on search
  const filteredProducts = () => {
    const productData = products()
    if (!productData) return []

    const searchTerm = search().toLowerCase()
    return productData.filter(
      (product: Product) =>
        product.productName.toLowerCase().includes(searchTerm) ||
        product.productDescription.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    )
  }

  // Delete handler with automatic refresh
  const handleDeleteProduct = async (product: Product) => {
    try {
      setIsDeleting(true)
      const formData = new FormData()
      formData.append('productId', product.productId)

      const result = await deleteProduct(formData)

      if (result.success) {
        showToast({
          title: t('common.success'),
          description: t('seller.products.form.success.deleted'),
          variant: 'success',
        })
        setProductToDelete(null)
        // Refresh products after successful deletion
        refreshProducts()
      } else {
        showToast({
          title: t('common.error'),
          description: result.error || t('seller.products.form.errors.deleteFailed'),
          variant: 'destructive',
        })
      }
    } catch (error) {
      showToast({
        title: t('common.error'),
        description: t('seller.products.form.errors.deleteFailed'),
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Table columns configuration
  const tableColumns = [
    {
      header: t('seller.products.table.name'),
      accessorKey: 'productName' as keyof Product,
      minWidth: '200px',
      maxWidth: '300px',
      cell: (product: Product) => (
        <div class='flex items-center gap-4 overflow-hidden'>
          {product.colorVariants.length > 0 && (
            <img
              src={product.colorVariants[0].colorImageUrls[0]}
              alt={product.productName}
              class='w-12 h-12 object-cover rounded flex-shrink-0'
            />
          )}
          <span class='truncate text-base'>{product.productName}</span>
        </div>
      ),
    },
    {
      header: t('seller.products.table.description'),
      accessorKey: 'productDescription' as keyof Product,
      minWidth: '200px',
      maxWidth: '300px',
      cell: (product: Product) => (
        <div class='overflow-hidden'>
          <span class='truncate block w-full text-base'>{product.productDescription}</span>
        </div>
      ),
    },
    {
      header: t('seller.products.table.category'),
      accessorKey: 'category' as keyof Product,
      minWidth: '150px',
      cell: (product: Product) => (
        <Badge variant='outline' class='text-base'>
          {t(`categories.${product.category}`)}
        </Badge>
      ),
    },
    {
      header: t('seller.products.table.price'),
      accessorKey: 'price' as keyof Product,
      minWidth: '100px',
      cell: (product: Product) => <span class='text-base'>${product.price.toFixed(2)}</span>,
    },
    {
      header: t('seller.products.table.inventory'),
      accessorKey: 'totalInventory' as keyof Product,
      minWidth: '200px',
      cell: (product: Product) => (
        <div class='space-y-1'>
          <span class='block text-base'>
            {product.totalInventory} {t('common.total')}
          </span>
          <div class='flex gap-1 flex-wrap'>
            {product.colorVariants.map((variant) => (
              <Badge variant='outline' class='text-xs'>
                {t(`product.colors.${variant.color}`)}: {variant.inventory}
              </Badge>
            ))}
          </div>
        </div>
      ),
    },
    {
      header: t('seller.products.table.actions'),
      accessorKey: 'productId' as keyof Product,
      minWidth: '100px',
      cell: (product: Product) => (
        <div class='flex items-center gap-2'>
          <Button variant='ghost' size='sm' onClick={() => setEditProduct(product)} class='text-base'>
            <FiEdit2 class='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm' onClick={() => setProductToDelete(product)} class='text-base'>
            <FiTrash2 class='h-4 w-4 text-red-500' />
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
              <h1 class='text-2xl font-bold tracking-tight'>{t('seller.products.title')}</h1>
              <p class='text-muted-foreground'>{t('seller.products.subtitle')}</p>
            </div>
            <Button variant='general' onClick={() => setIsOpen(true)} class='text-base'>
              <FiPlus class='mr-2 h-4 w-4' />
              {t('seller.products.addProduct')}
            </Button>
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
                  placeholder={`${t('common.search')}...`}
                  class='pl-8 no-zoom-input text-base'
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
              <Suspense fallback={<StatsCardSkeleton />}>
                <Show when={products()}>
                  <StatsCard count={filteredProducts().length} />
                </Show>
              </Suspense>
            </div>

            {/* Products Table */}
            <div class='rounded-md border'>
              <Suspense fallback={<TableSkeleton />}>
                <Show when={products()}>
                  <Show
                    when={products()!.length > 0}
                    fallback={<div class='p-4 text-center text-muted-foreground'>{t('seller.layout.noProducts')}</div>}
                  >
                    <DataTable data={filteredProducts()} columns={tableColumns} />
                  </Show>
                </Show>
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Show when={isOpen() || editProduct()}>
        <Dialog
          open={isOpen() || Boolean(editProduct())}
          onOpenChange={(open) => {
            if (!open) {
              setIsOpen(false)
              setEditProduct(null)
            }
          }}
        >
          <DialogContent
            lang={locale()}
            class='rounded-xl sm:max-w-[425px] lg:max-w-[700px] max-h-[85vh] overflow-y-auto'
          >
            <DialogHeader lang={locale()}>
              <DialogTitle lang={locale()} class='text-lg'>
                {editProduct() ? t('seller.products.form.buttons.edit') : t('seller.products.addProduct')}
              </DialogTitle>
            </DialogHeader>
            <Show
              when={store()}
              fallback={
                <div class='p-4 text-center'>
                  <Skeleton class='h-4 w-[200px] mx-auto' />
                </div>
              }
            >
              <SellerProductForm
                mode={editProduct() ? 'edit' : 'create'}
                storeId={store()!.storeId}
                storeName={store()!.storeName}
                initialData={editProduct() || undefined}
                onSuccess={() => {
                  setIsOpen(false)
                  setEditProduct(null)
                  // Refresh products after successful creation/edit
                  refreshProducts()
                }}
                onClose={() => {
                  setIsOpen(false)
                  setEditProduct(null)
                }}
              />
            </Show>
          </DialogContent>
        </Dialog>
      </Show>

      {/* Delete Confirmation Dialog */}
      <Show when={productToDelete()}>
        <DeleteConfirmationDialog
          isOpen={Boolean(productToDelete())}
          onClose={() => setProductToDelete(null)}
          onConfirm={() => {
            if (productToDelete()) {
              handleDeleteProduct(productToDelete()!)
            }
          }}
          isDeleting={isDeleting()}
        />
      </Show>
    </>
  )
}

export default ProductsPage
