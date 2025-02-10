import { Component, createSignal, createEffect, onMount, onCleanup } from 'solid-js'
import { Card, CardContent } from '~/components/ui/card'
import type { JSX } from 'solid-js'

interface Store {
  name: string
  image: string
  description: string
}

interface MarqueeStoresProps {
  stores: Store[]
}

const MarqueeStores: Component<MarqueeStoresProps> = (props) => {
  const [isHovered, setIsHovered] = createSignal(false)
  const [isTouching, setIsTouching] = createSignal(false)
  const [duplicatedStores, setDuplicatedStores] = createSignal<Store[]>([])
  const [scrollPosition, setScrollPosition] = createSignal(0)
  let scrollerRef: HTMLDivElement | undefined
  let animationFrameId: number

  // Initialize duplicated stores for seamless scrolling
  createEffect(() => {
    // Duplicate more times for wider screens
    setDuplicatedStores([...props.stores, ...props.stores, ...props.stores, ...props.stores])
  })

  const animate = () => {
    if (!scrollerRef || isHovered() || isTouching()) return

    setScrollPosition((prev) => {
      const newPosition = prev + 0.5
      const maxScroll = scrollerRef!.scrollWidth / 2

      // Reset position when we've scrolled through half the content
      if (newPosition >= maxScroll) {
        scrollerRef!.scrollLeft = 0
        return 0
      }

      scrollerRef!.scrollLeft = newPosition
      return newPosition
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  onMount(() => {
    animationFrameId = requestAnimationFrame(animate)

    // Reset scroll position when window is resized
    const handleResize = () => {
      if (scrollerRef) {
        scrollerRef.scrollLeft = 0
        setScrollPosition(0)
      }
    }

    window.addEventListener('resize', handleResize)

    onCleanup(() => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    })
  })

  const handleInteractionStart = () => {
    cancelAnimationFrame(animationFrameId)
    setIsHovered(true)
  }

  const handleInteractionEnd = () => {
    setIsHovered(false)
    animationFrameId = requestAnimationFrame(animate)
  }

  // Touch event handlers
  const handleTouchStart = () => {
    setIsTouching(true)
    handleInteractionStart()
  }

  const handleTouchEnd = () => {
    setIsTouching(false)
    handleInteractionEnd()
  }

  return (
    <div class='w-full overflow-hidden bg-gray-50 py-20'>
      <div class='container mx-auto px-4'>
        <h2 class='text-3xl font-bold text-center mb-12 animate-on-scroll'>Featured Stores</h2>

        <div
          ref={scrollerRef}
          class='flex overflow-x-hidden gap-8 py-4 cursor-pointer select-none touch-pan-y'
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div class='flex gap-8 animate-scroll'>
            {duplicatedStores().map((store, idx) => (
              <Card class='flex-shrink-0 w-72 md:w-80 transform transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                <div class='relative h-48 overflow-hidden'>
                  <img
                    src={store.image}
                    alt={store.name}
                    class='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
                    loading='lazy'
                  />
                  <div class='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end'>
                    <div class='p-4 text-white'>
                      <p class='text-sm font-medium'>{store.description}</p>
                    </div>
                  </div>
                </div>
                <CardContent class='p-6'>
                  <h3 class='text-xl font-semibold mb-2'>{store.name}</h3>
                  <div class='flex items-center justify-between'>
                    <span class='text-sm text-muted-foreground'>{store.description.substring(0, 60)}...</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarqueeStores
