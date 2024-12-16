import { Component, createSignal, Show } from 'solid-js'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import { FiEdit2, FiTrash2 } from 'solid-icons/fi'
import MultipleImageUpload from '~/components/MultiImageUpload'
import type { ColorVariant } from '~/db/schema'
import { showToast } from '~/components/ui/toast'

type ColorEditDialogProps = {
  variant: ColorVariant
  onSave: (updatedVariant: ColorVariant) => void
  onClose: () => void
}

const ColorEditDialog: Component<ColorEditDialogProps> = (props) => {
  const [editedVariant, setEditedVariant] = createSignal<ColorVariant>({ ...props.variant })

  const handleImageUpload = (urls: string[]) => {
    setEditedVariant((prev) => ({
      ...prev,
      colorImageUrls: urls,
    }))
  }

  return (
    <DialogContent class='sm:max-w-[425px] lg:max-w-[550px]'>
      <DialogHeader>
        <DialogTitle>Edit Color Variant</DialogTitle>
      </DialogHeader>

      <div class='space-y-4 pt-4'>
        <div class='grid grid-cols-2 gap-4'>
          <div class='space-y-2'>
            <label class='text-sm font-medium'>Color</label>
            <Select
              value={editedVariant().color}
              onChange={(value: ColorVariant['color'] | null) => {
                if (value) setEditedVariant((prev) => ({ ...prev, color: value }))
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
              <SelectTrigger aria-label='Color' class='w-full'>
                <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>

          <div class='space-y-2'>
            <label class='text-sm font-medium'>Inventory</label>
            <Input
              type='number'
              value={editedVariant().inventory}
              onInput={(e) =>
                setEditedVariant((prev) => ({
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
          <label class='text-sm font-medium'>Images (Up to 5)</label>
          <MultipleImageUpload
            onSuccess={handleImageUpload}
            maxFiles={5}
            accept='image/*'
            maxSize={5 * 1024 * 1024}
            defaultValues={editedVariant().colorImageUrls}
          />
        </div>

        <div class='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={editedVariant().isDefault}
            onChange={(e) =>
              setEditedVariant((prev) => ({
                ...prev,
                isDefault: e.currentTarget.checked,
              }))
            }
          />
          <label class='text-sm'>Set as default color</label>
        </div>

        <div class='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (editedVariant().colorImageUrls.length === 0) {
                showToast({
                  title: 'Error',
                  description: 'Please upload at least one image',
                  variant: 'destructive',
                })
                return
              }
              props.onSave(editedVariant())
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

type ProductColorManagerProps = {
  variants: ColorVariant[]
  onUpdate: (variants: ColorVariant[]) => void
}

const ProductColorManager: Component<ProductColorManagerProps> = (props) => {
  const [editingVariant, setEditingVariant] = createSignal<ColorVariant | null>(null)

  return (
    <div class='space-y-4'>
      <div class='space-y-2'>
        {props.variants.map((variant) => (
          <Card class='border rounded-lg'>
            <CardContent class='p-4'>
              <div class='flex items-center justify-between'>
                <div class='flex items-center space-x-4'>
                  <div class='w-6 h-6 rounded-full border' style={{ 'background-color': variant.color }} />
                  <span class='font-medium'>{variant.color}</span>
                  <Badge variant='secondary'>{variant.inventory} in stock</Badge>
                  <Show when={variant.isDefault}>
                    <Badge variant='outline'>Default</Badge>
                  </Show>
                </div>

                <div class='flex items-center space-x-2'>
                  <Button variant='ghost' size='sm' onClick={() => setEditingVariant(variant)}>
                    <FiEdit2 class='h-4 w-4' />
                  </Button>

                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const newVariants = props.variants.filter((v) => v.colorId !== variant.colorId)
                      props.onUpdate(newVariants)
                    }}
                  >
                    <FiTrash2 class='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div class='mt-4 grid grid-cols-5 gap-2'>
                {variant.colorImageUrls.map((url) => (
                  <img
                    src={url}
                    alt={`${variant.color} variant`}
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

export default ProductColorManager
