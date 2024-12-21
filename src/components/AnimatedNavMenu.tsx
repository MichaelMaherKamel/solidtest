import { Component, Show } from 'solid-js'
import { A } from '@solidjs/router'

interface MenuLink {
  path: string
  key: string
  roles?: string[]
}

interface AnimatedDropdownProps {
  links: MenuLink[]
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
  containerRef: HTMLDivElement | undefined
}

const AnimatedDropdown: Component<AnimatedDropdownProps> = (props) => {
  // Calculate dropdown position and width based on container
  const getDropdownStyle = () => {
    if (!props.containerRef) return {}
    const rect = props.containerRef.getBoundingClientRect()
    return {
      left: `-${rect.left}px`,
      width: '100vw',
      top: `${rect.height}px`,
    }
  }

  return (
    <div class='relative flex items-center justify-center'>
      {/* Animated Hamburger Icon */}
      <div class='w-5 h-5 flex items-center justify-center'>
        <span
          class={`absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
            props.isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'translate-y-[-4px]'
          }`}
        />
        <span
          class={`absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
            props.isOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'translate-y-[4px]'
          }`}
        />
      </div>

      {/* Full-width Dropdown Menu */}
      <Show when={props.isOpen}>
        <div
          class='fixed supports-backdrop-blur:bg-white/95 backdrop-blur-md border-b border-gray-200'
          style={{
            ...getDropdownStyle(),
            animation: 'dropdownIn 0.2s ease-out forwards',
          }}
        >
          <div class='container mx-auto py-4'>
            <ul class='space-y-2'>
              {props.links.map((link, index) => (
                <li
                  class='list-none'
                  style={{
                    animation: `menuItemIn 0.3s ease-out forwards`,
                    'animation-delay': `${index * 0.05}s`,
                    opacity: '0',
                    transform: 'translateY(10px)',
                  }}
                >
                  <A
                    href={link.path}
                    class='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors'
                  >
                    {props.t(link.key)}
                  </A>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Show>

      <style>
        {`
          @keyframes dropdownIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes menuItemIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

export default AnimatedDropdown
