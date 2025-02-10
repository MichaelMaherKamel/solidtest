import { Component, Show, createSignal, createEffect, For } from 'solid-js'
import { BiRegularSearch } from 'solid-icons/bi'
import { IoClose } from 'solid-icons/io'
import { Dock, DockIcon } from '~/components/Dock'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const SearchDock: Component = () => {
  const [isSearchActive, setIsSearchActive] = createSignal(false)
  const [searchQuery, setSearchQuery] = createSignal('')
  const [searchResults, setSearchResults] = createSignal([])
  const [isResultsVisible, setIsResultsVisible] = createSignal(false)

  // Mock search function - replace with your actual search logic
  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchResults([
        { id: 1, title: 'Sample Result 1' },
        { id: 2, title: 'Sample Result 2' },
        { id: 3, title: 'Sample Result 3' },
      ])
    } else {
      setSearchResults([])
    }
  }

  createEffect(() => {
    // Debounced search effect
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery())
    }, 300)

    return () => clearTimeout(timeoutId)
  })

  const handleSearchClick = () => {
    setIsSearchActive(true)
    // Delay showing results to allow for transition
    setTimeout(() => setIsResultsVisible(true), 50)
  }

  const handleCloseSearch = () => {
    setIsResultsVisible(false)
    // Delay hiding search to allow for results transition
    setTimeout(() => {
      setIsSearchActive(false)
      setSearchQuery('')
      setSearchResults([])
    }, 300)
  }

  return (
    <>
      {/* Search Results */}
      <Show when={isSearchActive()}>
        <div
          class={cn(
            'fixed bottom-16 left-0 right-0 bg-white shadow-lg max-h-64 overflow-y-auto',
            'transition-all duration-300 ease-in-out',
            isResultsVisible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <div class='p-4'>
            <For each={searchResults()}>
              {(result) => (
                <div class='p-2 hover:bg-gray-100 cursor-pointer rounded transition-colors'>{result.title}</div>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Search Bar */}
      <Show
        when={isSearchActive()}
        fallback={
          <DockIcon>
            <div
              class={cn(
                buttonVariants({ size: 'icon', variant: 'ghost' }),
                'transition-transform duration-300 ease-in-out'
              )}
              onClick={handleSearchClick}
            >
              <BiRegularSearch class='w-5 h-5' />
            </div>
          </DockIcon>
        }
      >
        <div class={cn('flex items-center gap-2 px-4 w-full', 'transition-all duration-300 ease-in-out')}>
          <input
            type='text'
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            placeholder='Search...'
            class={cn(
              'w-full p-2 outline-none border-b focus:border-blue-500',
              'transition-all duration-300 ease-in-out'
            )}
            autofocus
          />
          <div
            class={cn(
              buttonVariants({ size: 'icon', variant: 'ghost' }),
              'transition-transform duration-300 ease-in-out'
            )}
            onClick={handleCloseSearch}
          >
            <IoClose class='w-5 h-5' />
          </div>
        </div>
      </Show>
    </>
  )
}

export default SearchDock
