import { Component, createSignal, Show, For } from 'solid-js'
import { useAction } from '@solidjs/router'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { TextArea } from '~/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { showToast } from '~/components/ui/toast'
import MultipleImageUpload from '~/components/MultiImageUpload'
import { createProductAction, updateProductAction } from '~/db/actions/products'
import type { Product, ProductFormData, ColorVariant } from '~/db/schema'
import { useI18n } from '~/contexts/i18n'
import { FiEdit2, FiTrash2, FiX, FiSave } from 'solid-icons/fi'

const ColorCircle: Component<{ color: string; class?: string }> = (props) => {
  return (
    <div class={`w-4 h-4 rounded-full inline-block ${props.class || ''}`} style={{ 'background-color': props.color }} />
  )
}

const ColorEditDialog: Component<{
  variant: ColorVariant
  onSave: (updatedVariant: ColorVariant) => void
  onClose: () => void
}> = (props) => {
  const { t, locale } = useI18n()
  const [editingVariant, setEditingVariant] = createSignal<ColorVariant>({ ...props.variant })
  const isRTL = () => locale() === 'ar'

  const handleImageUpload = (urls: string[]) => {
    setEditingVariant((prev) => ({
      ...prev,
      colorImageUrls: urls,
    }))
  }

  const colorOptions = [
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
  ] as const

  return (
    <DialogContent lang={locale()} class='rounded-xl sm:max-w-[425px] lg:max-w-[700px] max-h-[85vh] overflow-y-auto'>
      <DialogHeader lang={locale()}>
        <DialogTitle lang={locale()}>{t('seller.products.colorVariants.edit')}</DialogTitle>
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
              options={colorOptions}
              itemComponent={(props) => (
                <SelectItem item={props.item}>
                  <div class='flex items-center gap-2' dir={isRTL() ? 'rtl' : 'ltr'}>
                    <ColorCircle color={props.item.rawValue} />
                    <span>{t(`product.colors.${props.item.rawValue}`)}</span>
                  </div>
                </SelectItem>
              )}
            >
              <SelectTrigger aria-label={t('seller.products.colorVariants.color')} class='w-full'>
                <SelectValue<string>>
                  {(state) => (
                    <div class='flex items-center gap-2' dir={isRTL() ? 'rtl' : 'ltr'}>
                      <ColorCircle color={state.selectedOption()} />
                      <span>{t(`product.colors.${state.selectedOption()}`)}</span>
                    </div>
                  )}
                </SelectValue>
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

        <div class={`flex ${isRTL() ? 'flex-row-reverse' : 'justify-end'} gap-3`}>
          <Button type='button' variant='outline' onClick={props.onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            variant={'general'}
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
  const { t, locale } = useI18n()
  const [editingVariant, setEditingVariant] = createSignal<ColorVariant | null>(null)
  const isRTL = () => locale() === 'ar'

  return (
    <div class='space-y-2'>
      <For each={props.variants}>
        {(variant) => (
          <div class='flex items-center gap-4 p-2 bg-white rounded-lg border'>
            <img
              src={variant.colorImageUrls[0]}
              alt={`${t(`product.colors.${variant.color}`)} preview`}
              class='w-16 h-16 object-cover rounded-md'
            />

            <div class='flex-1 flex items-center gap-2'>
              <ColorCircle color={variant.color} />
              <span class='font-medium'>{t(`product.colors.${variant.color}`)}</span>
              <span class='text-sm text-gray-500' dir={isRTL() ? 'rtl' : 'ltr'}>
                ({variant.inventory})
              </span>
            </div>

            <div class='flex items-center'>
              <Button type='button' variant='ghost' size={'icon'} onClick={() => setEditingVariant(variant)}>
                <FiEdit2 class='h-4 w-4' />
              </Button>
              <Button
                type='button'
                variant='ghost'
                size={'icon'}
                onClick={() => {
                  const newVariants = props.variants.filter((v) => v.colorId !== variant.colorId)
                  props.onUpdate(newVariants)
                }}
              >
                <FiTrash2 class='h-4 w-4 text-red-500' />
              </Button>
            </div>
          </div>
        )}
      </For>

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

const SellerProductForm: Component<{
  onSuccess: () => void
  onClose: () => void
  storeId: string
  storeName: string
  initialData?: Product
  mode: 'create' | 'edit'
}> = (props) => {
  const { t, locale } = useI18n()
  const createProduct = useAction(createProductAction)
  const updateProduct = useAction(updateProductAction)
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [uploadKey, setUploadKey] = createSignal(0)
  const isRTL = () => locale() === 'ar'

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
  })

  const resetForm = () => {
    setFormData({
      productName: '',
      productDescription: '',
      category: 'kitchensupplies',
      price: 0,
      colorVariants: [],
    })
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.target as HTMLFormElement
      const formDataToSend = new FormData(form)

      const result = props.mode === 'create' ? await createProduct(formDataToSend) : await updateProduct(formDataToSend)

      if (result.success) {
        showToast({
          title: t('common.success'),
          description: t(`seller.products.form.success.${props.mode}${props.mode === 'edit' ? 'ed' : 'd'}`),
          variant: 'success',
        })
        props.onSuccess()
        props.onClose()
        resetForm()
      } else {
        showToast({
          title: t('common.error'),
          description: result.error || t(`seller.products.form.errors.${props.mode}Failed`),
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      showToast({
        title: t('common.error'),
        description: t(`seller.products.form.errors.${props.mode}Failed`),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleColorImagesUpload = (urls: string[]) => {
    setCurrentColorVariant((prev) => ({
      ...prev,
      colorImageUrls: urls,
    }))
  }

  const addColorVariant = () => {
    const variant = currentColorVariant()
    if (
      variant.color &&
      variant.inventory !== undefined &&
      variant.colorImageUrls &&
      variant.colorImageUrls.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        colorVariants: [...prev.colorVariants, variant as ColorVariant],
      }))

      // Reset the current variant and upload component
      setCurrentColorVariant({
        colorId: crypto.randomUUID(),
        color: 'red',
        inventory: 0,
        colorImageUrls: [],
      })
      setUploadKey((prev) => prev + 1) // Force reset of upload component
    }
  }

  const colorOptions = [
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
  ] as const

  return (
    <form onSubmit={handleSubmit} class='space-y-6'>
      {props.mode === 'edit' && <input type='hidden' name='productId' value={props.initialData?.productId} />}
      <input type='hidden' name='storeId' value={props.storeId} />
      <input type='hidden' name='storeName' value={props.storeName} />
      <input type='hidden' name='colorVariants' value={JSON.stringify(formData().colorVariants)} />

      <div class='space-y-4'>
        <div class='space-y-2'>
          <label class='text-sm font-medium'>{t('seller.products.table.name')}</label>
          <Input
            name='productName'
            value={formData().productName}
            onInput={(e) => setFormData((prev) => ({ ...prev, productName: e.currentTarget.value }))}
            placeholder={t('seller.products.form.placeholders.name')}
            required
          />
        </div>

        <div class='space-y-2'>
          <label class='text-sm font-medium'>{t('seller.products.table.description')}</label>
          <TextArea
            name='productDescription'
            value={formData().productDescription}
            onInput={(e) => setFormData((prev) => ({ ...prev, productDescription: e.currentTarget.value }))}
            placeholder={t('seller.products.form.placeholders.description')}
            required
          />
        </div>

        <div class='grid grid-cols-2 gap-4'>
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
                <SelectItem item={props.item}>{t(`categories.${props.item.rawValue}`)}</SelectItem>
              )}
            >
              <SelectTrigger aria-label={t('seller.products.table.category')} class='w-full'>
                <SelectValue<string>>{(state) => t(`categories.${state.selectedOption()}`)}</SelectValue>
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
              placeholder={t('seller.products.form.placeholders.price')}
              min='0'
              step='0.01'
              required
            />
          </div>
        </div>

        {/* Color Variants Section */}
        <div class='space-y-4'>
          <div class='flex items-center justify-between'>
            <label class='text-sm font-medium'>{t('seller.products.colorVariants.title')}</label>
            <Badge variant='outline' class='text-xs'>
              {formData().colorVariants.length} {t('seller.products.colorVariants.variants')}
            </Badge>
          </div>

          <ProductColorManager
            variants={formData().colorVariants}
            onUpdate={(newVariants) => setFormData((prev) => ({ ...prev, colorVariants: newVariants }))}
          />

          {/* Add New Variant Section */}
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
                      options={colorOptions}
                      itemComponent={(props) => (
                        <SelectItem item={props.item}>
                          <div class='flex items-center gap-2' dir={isRTL() ? 'rtl' : 'ltr'}>
                            <ColorCircle color={props.item.rawValue} />
                            <span>{t(`product.colors.${props.item.rawValue}`)}</span>
                          </div>
                        </SelectItem>
                      )}
                    >
                      <SelectTrigger aria-label={t('seller.products.colorVariants.color')} class='w-full'>
                        <SelectValue<string>>
                          {(state) => (
                            <div class='flex items-center gap-2' dir={isRTL() ? 'rtl' : 'ltr'}>
                              <ColorCircle color={state.selectedOption()} />
                              <span>{t(`product.colors.${state.selectedOption()}`)}</span>
                            </div>
                          )}
                        </SelectValue>
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
                    key={uploadKey()}
                    onSuccess={handleColorImagesUpload}
                    maxFiles={5}
                    accept='image/*'
                    maxSize={5 * 1024 * 1024}
                  />
                </div>

                <Button
                  variant='secondary'
                  type='button'
                  onClick={addColorVariant}
                  disabled={
                    !currentColorVariant().color ||
                    currentColorVariant().inventory === undefined ||
                    !currentColorVariant().colorImageUrls ||
                    currentColorVariant().colorImageUrls.length === 0
                  }
                  class='w-full'
                >
                  {t('seller.products.colorVariants.add')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div class='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={props.onClose} class='gap-2'>
          <FiX class='w-4 h-4' />
          {t('common.cancel')}
        </Button>
        <Button
          type='submit'
          variant='general'
          disabled={
            isSubmitting() ||
            !formData().productName ||
            !formData().productDescription ||
            formData().price <= 0 ||
            formData().colorVariants.length === 0
          }
          class='gap-2'
        >
          <FiSave class='w-4 h-4' />
          {isSubmitting()
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

export default SellerProductForm
