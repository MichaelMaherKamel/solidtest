import { Component, createSignal, Show, createEffect, onCleanup, JSX } from 'solid-js'
import { Button } from '~/components/ui/button'
import { BiRegularDotsVerticalRounded } from 'solid-icons/bi'

export interface MenuAction {
  label: string
  onClick: () => void
  className?: string
  disabled?: boolean
}

interface CustomDropdownProps {
  trigger?: JSX.Element
  actions: MenuAction[]
  isLoading?: boolean
  position?: 'left' | 'right'
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon'
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export const CustomDropdown: Component<CustomDropdownProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const [menuPosition, setMenuPosition] = createSignal<'left' | 'right'>(props.position || 'right')
  let dropdownRef: HTMLDivElement | undefined
  let buttonRef: HTMLButtonElement | undefined

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef &&
      buttonRef &&
      !dropdownRef.contains(event.target as Node) &&
      !buttonRef.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  const updateMenuPosition = () => {
    if (!buttonRef || !dropdownRef) return

    const buttonRect = buttonRef.getBoundingClientRect()
    const menuRect = dropdownRef.getBoundingClientRect()
    const viewportWidth = window.innerWidth

    if (buttonRect.left + menuRect.width > viewportWidth - 10) {
      setMenuPosition('left')
    } else {
      setMenuPosition(props.position || 'right')
    }
  }

  createEffect(() => {
    if (isOpen()) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', updateMenuPosition)
      updateMenuPosition()
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', updateMenuPosition)
    }

    onCleanup(() => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', updateMenuPosition)
    })
  })

  const getMenuStyles = () => {
    if (!buttonRef) return {}

    const rect = buttonRef.getBoundingClientRect()
    const baseStyles = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
    } as JSX.CSSProperties

    if (menuPosition() === 'left') {
      baseStyles.right = `${window.innerWidth - rect.right}px`
    } else {
      baseStyles.left = `${rect.left}px`
    }

    return baseStyles
  }

  return (
    <div class='relative inline-block'>
      <Button
        ref={buttonRef}
        variant={props.buttonVariant || 'ghost'}
        size={props.buttonSize || 'icon'}
        disabled={props.isLoading}
        onClick={() => setIsOpen(!isOpen())}
        aria-label='Open menu'
      >
        {props.trigger || <BiRegularDotsVerticalRounded class={props.isLoading ? 'animate-spin' : ''} />}
      </Button>

      <Show when={isOpen()}>
        <div
          ref={dropdownRef}
          class='w-[8rem] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50'
          style={getMenuStyles()}
        >
          <div class='py-1' role='menu' aria-orientation='vertical'>
            {props.actions.map((action) => (
              <button
                class={`w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 
                       disabled:opacity-50 disabled:cursor-not-allowed truncate
                       ${action.className || ''}`}
                role='menuitem'
                onClick={() => {
                  action.onClick()
                  setIsOpen(false)
                }}
                disabled={action.disabled || props.isLoading}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </Show>
    </div>
  )
}
