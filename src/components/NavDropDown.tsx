import { Component, createSignal, Show, createEffect, onCleanup, JSX } from 'solid-js'

interface NavDropdownProps {
  trigger: JSX.Element
  content: JSX.Element
  open?: boolean
  onOpenChange?: (isOpen: boolean) => void
  align?: 'left' | 'right'
  class?: string
}

export const NavDropdown: Component<NavDropdownProps> = (props) => {
  const [internalOpen, setInternalOpen] = createSignal(false)
  const [position, setPosition] = createSignal<'left' | 'right'>(props.align || 'right')
  let dropdownRef: HTMLDivElement | undefined
  let buttonRef: HTMLButtonElement | undefined

  // Use controlled or uncontrolled open state
  const isOpen = () => (props.open !== undefined ? props.open : internalOpen())
  const setIsOpen = (value: boolean) => {
    if (props.onOpenChange) {
      props.onOpenChange(value)
    } else {
      setInternalOpen(value)
    }
  }

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

  const updatePosition = () => {
    if (!buttonRef || !dropdownRef) return

    const buttonRect = buttonRef.getBoundingClientRect()
    const menuRect = dropdownRef.getBoundingClientRect()
    const viewportWidth = window.innerWidth

    if (buttonRect.left + menuRect.width > viewportWidth - 10) {
      setPosition('left')
    } else {
      setPosition(props.align || 'right')
    }
  }

  createEffect(() => {
    if (isOpen()) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', updatePosition)
      updatePosition()
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', updatePosition)
    }

    onCleanup(() => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', updatePosition)
    })
  })

  const getContentStyles = () => {
    if (!buttonRef) return {}

    const rect = buttonRef.getBoundingClientRect()
    const baseStyles = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
    } as JSX.CSSProperties

    if (position() === 'left') {
      baseStyles.right = `${window.innerWidth - rect.right}px`
    } else {
      baseStyles.left = `${rect.left}px`
    }

    return baseStyles
  }

  return (
    <div class={`relative inline-block ${props.class || ''}`}>
      <div ref={buttonRef} onClick={() => setIsOpen(!isOpen())}>
        {props.trigger}
      </div>

      <Show when={isOpen()}>
        <div
          ref={dropdownRef}
          class='min-w-[8rem] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50'
          style={getContentStyles()}
        >
          {props.content}
        </div>
      </Show>
    </div>
  )
}

export default NavDropdown
