import { Component, createSignal, createResource, Suspense, Show, createEffect } from 'solid-js'
import { useSubmission } from '@solidjs/router'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'solid-icons/fi'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Card, CardContent } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { DataTable } from '~/components/admin/dataTable'
import TableSkeleton from '~/components/seller/TableSkeleton'
import MultipleImageUpload from '~/components/MultiImageUpload'
import { createProductAction, updateProductAction, deleteProductAction } from '~/db/actions/products'
import type { Product, ProductFormData, ColorVariant } from '~/db/schema'
import { useI18n } from '~/contexts/i18n'
import { TextArea } from '~/components/ui/textarea'
import { showToast } from '~/components/ui/toast'
import { FaSolidBoxesStacked } from 'solid-icons/fa'
import { useSellerContext } from '~/contexts/seller'

const ColorEditDialog: Component<{
  variant: ColorVariant
  onSave: (updatedVariant: ColorVariant) => void
  onClose: () => void
}> = (props) => {
  const { t } = useI18n()
  const [editingVariant, setEditingVariant] = createSignal<ColorVariant>({ ...props.variant })

  const handleImageUpload = (urls: string[]) => {
    setEditingVariant((prev) => ({
      ...prev,
      colorImageUrls: urls,
    }))
  }

  return (
    <DialogContent class='rounded-xl sm:max-w-[425px] lg:max-w-[700px] max-h-[85vh] overflow-y-auto'>
      <DialogHeader>
        <DialogTitle>{t('seller.products.colorVariants.edit')}</DialogTitle>
      </DialogHeader>
      <div class='space-y-4 pt-4'>
        <div class='grid grid-cols-2 gap-4'>
          <div class='space-y-2'>
            <label class='text-sm font-medium'>{t('seller.products.colorVariants.color')}</label>
            <Select
              value={editingVariant().color}
              onChange={(value: ColorVariant['color'] | null) => {
                if (value) setEditingVariant((prev) => ({ ...prev, color: value }))
              }}
              options={[
                'red',
                'blue',
                'green',
                'yellow',
                'orange',
                'purple',
                'pink',
                'white',
                'black',
                'gray',
                'brown',
                'gold',
                'silver',
                'beige',
                'navy',
                'turquoise',
                'olive',
                'indigo',
                'peach',
                'lavender',
              ]}
              itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
            >
              <SelectTrigger aria-label={t('seller.products.colorVariants.color')} class='w-full'>
                <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>

          <div class='space-y-2'>
            <label class='text-sm font-medium'>{t('seller.products.form.labels.inventory')}</label>
            <Input
              type='number'
              value={editingVariant().inventory}
              onInput={(e) =>
                setEditingVariant((prev) => ({
                  ...prev,
                  inventory: parseInt(e.currentTarget.value),
                }))
              }
              min='0'
              required
            />
          </div>
        </div>

        <div class='space-y-2'>
          <label class='text-sm font-medium'>{t('seller.products.colorVariants.images')}</label>
          <MultipleImageUpload
            onSuccess={handleImageUpload}
            maxFiles={5}
            accept='image/*'
            maxSize={5 * 1024 * 1024}
            defaultValues={editingVariant().colorImageUrls}
          />
        </div>

        <div class='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={editingVariant().isDefault}
            onChange={(e) =>
              setEditingVariant((prev) => ({
                ...prev,
                isDefault: e.currentTarget.checked,
              }))
            }
          />
          <label class='text-sm'>{t('seller.products.colorVariants.setDefault')}</label>
        </div>

        <div class='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={props.onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              if (editingVariant().colorImageUrls.length === 0) {
                showToast({
                  title: t('common.error'),
                  description: t('seller.products.form.errors.imageRequired'),
                  variant: 'destructive',
                })
                return
              }
              props.onSave(editingVariant())
            }}
          >
            {t('common.save')}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

const ProductColorManager: Component<{
  variants: ColorVariant[]
  onUpdate: (variants: ColorVariant[]) => void
}> = (props) => {
  const { t } = useI18n()
  const [editingVariant, setEditingVariant] = createSignal<ColorVariant | null>(null)

  return (
    <div class='space-y-4'>
      <div class='space-y-2'>
        {props.variants.map((variant) => (
          <Card class='border rounded-lg'>
            <CardContent class='p-4'>
              <div class='flex items-center justify-between'>
                <div class='flex items-center space-x-2'>
                  <div class='w-4 h-4 rounded-full' style={{ background: variant.color }} />
                  <span>{variant.color}</span>
                  <span>
                    ({variant.inventory} {t('seller.products.table.color.inStock')})
                  </span>
                  {variant.isDefault && <Badge>{t('seller.products.colorVariants.setDefault')}</Badge>}
                </div>
                <div class='flex items-center space-x-2'>
                  <Button type='button' variant='ghost' onClick={() => setEditingVariant(variant)}>
                    <FiEdit2 class='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => {
                      const newVariants = props.variants.filter((v) => v.colorId !== variant.colorId)
                      props.onUpdate(newVariants)
                    }}
                  >
                    <FiTrash2 class='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <div class='mt-2 grid grid-cols-5 gap-2'>
                {variant.colorImageUrls.map((url) => (
                  <img
                    src={url}
                    alt={`${t('seller.products.colorVariants.preview')} - ${variant.color}`}
                    class='w-full aspect-square object-cover rounded-md'
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Show when={editingVariant()}>
        <Dialog open={Boolean(editingVariant())} onOpenChange={(open) => !open && setEditingVariant(null)}>
          <ColorEditDialog
            variant={editingVariant()!}
            onSave={(updatedVariant) => {
              const newVariants = props.variants.map((v) => (v.colorId === updatedVariant.colorId ? updatedVariant : v))
              props.onUpdate(newVariants)
              setEditingVariant(null)
            }}
            onClose={() => setEditingVariant(null)}
          />
        </Dialog>
      </Show>
    </div>
  )
}

const ProductForm: Component<{
  onSuccess: () => void
  onClose: () => void
  storeId: string
  initialData?: Product
  mode: 'create' | 'edit'
}> = (props) => {
  const { t } = useI18n()
  const submission = useSubmission(props.mode === 'create' ? createProductAction : updateProductAction)
  const [formData, setFormData] = createSignal<ProductFormData>({
    productName: props.initialData?.productName || '',
    productDescription: props.initialData?.productDescription || '',
    category: props.initialData?.category || 'kitchensupplies',
    price: props.initialData?.price || 0,
    colorVariants: props.initialData?.colorVariants || [],
  })

  const [currentColorVariant, setCurrentColorVariant] = createSignal<Partial<ColorVariant>>({
    colorId: crypto.randomUUID(),
    color: 'red',
    inventory: 0,
    colorImageUrls: [],
    isDefault: false,
  })

  const resetForm = () => {
    setFormData({
      productName: '',
      productDescription: '',
      category: 'kitchensupplies',
      price: 0,
      colorVariants: [],
    })
    submission.clear?.()
  }

  createEffect(() => {
    if (submission.result && !submission.pending) {
      if (submission.result.success) {
        showToast({
          title: t('common.success'),
          description:
            props.mode === 'create'
              ? 'Product has been created successfully.'
              : 'Product has been updated successfully.',
          variant: 'success',
        })
        props.onSuccess()
        props.onClose()
        resetForm()
      } else {
        showToast({
          title: t('common.error'),
          description: submission.result.error || `Failed to ${props.mode} product`,
          variant: 'destructive',
        })
      }
    }
  })

  const handleColorImagesUpload = (urls: string[]) => {
    setCurrentColorVariant((prev) => ({
      ...prev,
      colorImageUrls: urls,
    }))
  }

  const addColorVariant = () => {
    const variant = currentColorVariant()
    if (variant.color && variant.inventory !== undefined && variant.colorImageUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        colorVariants: [...prev.colorVariants, variant as ColorVariant],
      }))
      setCurrentColorVariant({
        colorId: crypto.randomUUID(),
        color: 'red',
        inventory: 0,
        colorImageUrls: [],
        isDefault: false,
      })
    }
  }

  return (
    <form action={props.mode === 'create' ? createProductAction : updateProductAction} method='post' class='space-y-6'>
      {props.mode === 'edit' && <input type='hidden' name='productId' value={props.initialData?.productId} />}
      <input type='hidden' name='storeId' value={props.storeId} />
      <input type='hidden' name='colorVariants' value={JSON.stringify(formData().colorVariants)} />

      <div class='space-y-4'>
        <div class='space-y-2'>
          <label class='text-sm font-medium'>{t('seller.products.table.name')}</label>
          <Input
            name='productName'
            value={formData().productName}
            onInput={(e) => setFormData((prev) => ({ ...prev, productName: e.currentTarget.value }))}
            placeholder='Enter product name'
            required
          />
        </div>

        <div class='space-y-2'>
          <label class='text-sm font-medium'>{t('seller.products.table.description')}</label>
          <TextArea
            name='productDescription'
            value={formData().productDescription}
            onInput={(e) => setFormData((prev) => ({ ...prev, productDescription: e.currentTarget.value }))}
            placeholder='Enter product description'
            required
          />
        </div>

        <div class='space-y-2'>
          <label class='text-sm font-medium'>{t('seller.products.table.category')}</label>
          <input type='hidden' name='category' value={formData().category} />
          <Select
            value={formData().category}
            onChange={(value: 'kitchensupplies' | 'bathroomsupplies' | 'homesupplies' | null) => {
              if (value) setFormData((prev) => ({ ...prev, category: value }))
            }}
            options={['kitchensupplies', 'bathroomsupplies', 'homesupplies']}
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                {props.item.rawValue === 'kitchensupplies'
                  ? t('stores.kitchen')
                  : props.item.rawValue === 'bathroomsupplies'
                  ? t('stores.bath')
                  : t('stores.home')}
              </SelectItem>
            )}
          >
            <SelectTrigger aria-label='Category' class='w-full'>
              <SelectValue<string>>
                {(state) => {
                  const value = state.selectedOption()
                  return value === 'kitchensupplies'
                    ? t('stores.kitchen')
                    : value === 'bathroomsupplies'
                    ? t('stores.bath')
                    : t('stores.home')
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>

        <div class='space-y-2'>
          <label class='text-sm font-medium'>{t('seller.products.table.price')}</label>
          <Input
            type='number'
            name='price'
            value={formData().price}
            onInput={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.currentTarget.value) }))}
            placeholder='Enter price'
            min='0'
            step='0.01'
            required
          />
        </div>

        <div class='space-y-4'>
          <label class='text-sm font-medium'>{t('seller.products.colorVariants.title')}</label>
          <ProductColorManager
            variants={formData().colorVariants}
            onUpdate={(newVariants) => setFormData((prev) => ({ ...prev, colorVariants: newVariants }))}
          />

          <Card class='border rounded-lg'>
            <CardContent class='p-4'>
              <div class='space-y-4'>
                <div class='grid grid-cols-2 gap-4'>
                  <div class='space-y-2'>
                    <label class='text-sm font-medium'>{t('seller.products.colorVariants.color')}</label>
                    <Select
                      value={currentColorVariant().color}
                      onChange={(value: ColorVariant['color'] | null) => {
                        if (value) setCurrentColorVariant((prev) => ({ ...prev, color: value }))
                      }}
                      options={[
                        'red',
                        'blue',
                        'green',
                        'yellow',
                        'orange',
                        'purple',
                        'pink',
                        'white',
                        'black',
                        'gray',
                        'brown',
                        'gold',
                        'silver',
                        'beige',
                        'navy',
                        'turquoise',
                        'olive',
                        'indigo',
                        'peach',
                        'lavender',
                      ]}
                      itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
                    >
                      <SelectTrigger aria-label={t('seller.products.colorVariants.color')} class='w-full'>
                        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
                      </SelectTrigger>
                      <SelectContent />
                    </Select>
                  </div>

                  <div class='space-y-2'>
                    <label class='text-sm font-medium'>{t('seller.products.form.labels.inventory')}</label>
                    <Input
                      type='number'
                      value={currentColorVariant().inventory}
                      onInput={(e) =>
                        setCurrentColorVariant((prev) => ({
                          ...prev,
                          inventory: parseInt(e.currentTarget.value),
                        }))
                      }
                      min='0'
                      required
                    />
                  </div>
                </div>

                <div class='space-y-2'>
                  <label class='text-sm font-medium'>{t('seller.products.colorVariants.images')}</label>
                  <MultipleImageUpload
                    onSuccess={handleColorImagesUpload}
                    maxFiles={5}
                    accept='image/*'
                    maxSize={5 * 1024 * 1024}
                  />
                </div>

                <div class='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={currentColorVariant().isDefault}
                    onChange={(e) =>
                      setCurrentColorVariant((prev) => ({
                        ...prev,
                        isDefault: e.currentTarget.checked,
                      }))
                    }
                  />
                  <label class='text-sm'>{t('seller.products.colorVariants.setDefault')}</label>
                </div>

                <Button
                  type='button'
                  onClick={addColorVariant}
                  disabled={
                    !currentColorVariant().color ||
                    currentColorVariant().inventory === undefined ||
                    currentColorVariant().colorImageUrls.length === 0
                  }
                >
                  {t('seller.products.colorVariants.add')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div class='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={props.onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          type='submit'
          variant='general'
          disabled={
            submission.pending ||
            !formData().productName ||
            !formData().productDescription ||
            formData().price <= 0 ||
            formData().colorVariants.length === 0
          }
        >
          {submission.pending
            ? t(
                props.mode === 'create'
                  ? 'seller.products.form.buttons.creating'
                  : 'seller.products.form.buttons.updating'
              )
            : t(
                props.mode === 'create' ? 'seller.products.form.buttons.create' : 'seller.products.form.buttons.update'
              )}
        </Button>
      </div>
    </form>
  )
}

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
  return (
    <Card class='h-10 bg-primary/10'>
      <CardContent class='p-2 flex items-center justify-center gap-2'>
        <FaSolidBoxesStacked class='w-4 h-4 text-blue-600' />
        <span class='text-sm font-medium text-primary'>
          {props.count} {props.count === 1 ? t('common.product') : t('common.products')}
        </span>
      </CardContent>
    </Card>
  )
}

const ProductsPage: Component = () => {
  const { t } = useI18n()
  const { store, products } = useSellerContext()

  // Local state
  const [search, setSearch] = createSignal('')
  const [isOpen, setIsOpen] = createSignal(false)
  const [isEditOpen, setIsEditOpen] = createSignal(false)
  const [editProduct, setEditProduct] = createSignal<Product | null>(null)

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

  // Delete handler
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(t('seller.products.confirmDelete'))) return

    const formData = new FormData()
    formData.append('productId', product.productId)

    const result = await deleteProductAction(formData)

    if (result.success) {
      showToast({
        title: t('common.success'),
        description: t('seller.products.form.success.deleted'),
        variant: 'success',
      })
    } else {
      showToast({
        title: t('common.error'),
        description: result.error || t('seller.products.form.errors.deleteFailed'),
        variant: 'destructive',
      })
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
          <span class='truncate'>{product.productName}</span>
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
          <span class='truncate block w-full'>{product.productDescription}</span>
        </div>
      ),
    },
    {
      header: t('seller.products.table.category'),
      accessorKey: 'category' as keyof Product,
      minWidth: '150px',
      cell: (product: Product) => (
        <Badge variant='outline'>
          {product.category === 'kitchensupplies'
            ? t('stores.kitchen')
            : product.category === 'bathroomsupplies'
            ? t('stores.bath')
            : t('stores.home')}
        </Badge>
      ),
    },
    {
      header: t('seller.products.table.price'),
      accessorKey: 'price' as keyof Product,
      minWidth: '100px',
      cell: (product: Product) => <span>${product.price.toFixed(2)}</span>,
    },
    {
      header: t('seller.products.table.inventory'),
      accessorKey: 'totalInventory' as keyof Product,
      minWidth: '200px',
      cell: (product: Product) => (
        <div class='space-y-1'>
          <span class='block'>
            {product.totalInventory} {t('common.total')}
          </span>
          <div class='flex gap-1 flex-wrap'>
            {product.colorVariants.map((variant) => (
              <Badge variant='outline' class='text-xs'>
                {variant.color}: {variant.inventory}
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
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setEditProduct(product)
              setIsEditOpen(true)
            }}
          >
            <FiEdit2 class='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm' onClick={() => handleDeleteProduct(product)}>
            <FiTrash2 class='h-4 w-4' />
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
            <Button variant='general' onClick={() => setIsOpen(true)}>
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
                  class='pl-8'
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

      {/* Create Dialog */}
      <Dialog open={isOpen()} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DialogContent class='rounded-xl sm:max-w-[425px] lg:max-w-[700px] max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{t('seller.products.addProduct')}</DialogTitle>
          </DialogHeader>
          <Show
            when={store()}
            fallback={
              <div class='p-4 text-center'>
                <Skeleton class='h-4 w-[200px] mx-auto' />
              </div>
            }
          >
            <ProductForm
              mode='create'
              storeId={store()!.storeId}
              onSuccess={() => setIsOpen(false)}
              onClose={() => setIsOpen(false)}
            />
          </Show>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditOpen()}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditOpen(false)
            setEditProduct(null)
          }
        }}
      >
        <DialogContent class='rounded-xl sm:max-w-[425px] lg:max-w-[700px] max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{t('seller.products.form.buttons.edit')}</DialogTitle>
          </DialogHeader>
          <Show
            when={editProduct() && store()}
            fallback={
              <div class='p-4 text-center'>
                <Skeleton class='h-4 w-[200px] mx-auto' />
              </div>
            }
          >
            <ProductForm
              mode='edit'
              storeId={store()!.storeId}
              initialData={editProduct()!}
              onSuccess={() => setIsEditOpen(false)}
              onClose={() => setIsEditOpen(false)}
            />
          </Show>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProductsPage
