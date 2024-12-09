import { Component, onMount, createSignal } from 'solid-js'
import { A } from '@solidjs/router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { TextArea } from '~/components/ui/textarea'
import { Card, CardContent } from '~/components/ui/card'
import { siteConfig } from '~/config/site'
import { animate } from 'motion'
import type { JSX } from 'solid-js'
import { SiteCategory } from '~/config/site'

const HomePage: Component = () => {
  const [isHydrated, setIsHydrated] = createSignal(false)
  let heroRef: HTMLDivElement | undefined
  let categoriesRef: HTMLElement | undefined
  let storesRef: HTMLElement | undefined
  let contactRef: HTMLElement | undefined

  // Properly typed style object
  const hiddenBeforeHydration = (): JSX.CSSProperties => ({
    visibility: isHydrated() ? 'visible' : 'hidden',
    opacity: isHydrated() ? '1' : '0',
    transition: 'opacity 0.3s ease-in',
  })

  const categories = siteConfig.categories.map((category: SiteCategory) => ({
    title: category.name,
    icon: category.icon,
    description: category.description,
  }))

  const featuredStores = [
    {
      name: 'Kitchen Paradise',
      image: '/api/placeholder/400/300',
      description: 'Premium kitchen equipment and accessories',
    },
    {
      name: 'Bath & Beyond',
      image: '/api/placeholder/400/300',
      description: 'Luxury bathroom essentials',
    },
    {
      name: 'Home Comfort',
      image: '/api/placeholder/400/300',
      description: 'Everything for your comfortable living',
    },
  ]

  const scrollToCategories = () => {
    if (categoriesRef) {
      const isMobile = window.innerWidth < 768

      categoriesRef.scrollIntoView({
        behavior: isMobile ? 'auto' : 'smooth',
        block: 'start',
      })

      animate(
        categoriesRef,
        {
          transform: ['translateY(20px)', 'translateY(0px)'],
          opacity: ['0.5', '1'],
        },
        {
          duration: 0.5,
          easing: [0.22, 0.03, 0.26, 1],
        }
      )
    }
  }

  onMount(() => {
    // Set hydrated state immediately after mount
    setIsHydrated(true)

    // Initial hero animations
    animate(
      '.hero-title',
      {
        transform: ['translateY(20px)', 'translateY(0px)'],
        opacity: ['0', '1'],
      },
      {
        duration: 0.8,
        easing: 'ease-out',
      }
    )

    animate(
      '.hero-description',
      {
        transform: ['translateY(20px)', 'translateY(0px)'],
        opacity: ['0', '1'],
      },
      {
        duration: 0.8,
        delay: 0.2,
        easing: 'ease-out',
      }
    )

    animate(
      '.hero-button',
      {
        transform: ['scale(0.9)', 'scale(1)'],
        opacity: ['0', '1'],
      },
      {
        duration: 0.5,
        delay: 0.4,
        easing: 'ease-out',
      }
    )

    // Set up scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(
              entry.target,
              {
                transform: ['translateY(20px)', 'translateY(0px)'],
                opacity: ['0', '1'],
              },
              {
                duration: 0.6,
                easing: [0.22, 0.03, 0.26, 1],
              }
            )

            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })
  })

  return (
    <div class='relative' dir='rtl'>
      {/* Hero Section */}
      <div ref={heroRef} class='min-h-screen relative flex items-center justify-center'>
        <div class='absolute inset-0'>
          {/* Mobile image (default, always loaded first) */}
          <img
            src='https://tveclffztmubyxyjxart.supabase.co/storage/v1/object/public/SouqElRafay3Bucket/SouqElRafay3Resposive.jpeg'
            alt='Hero Background Mobile'
            class='w-full h-full object-cover object-center block md:hidden'
          />

          {/* Desktop image (hidden by default, shown on larger screens) */}
          <img
            src='https://tveclffztmubyxyjxart.supabase.co/storage/v1/object/public/SouqElRafay3Bucket/SouqElRafay3'
            alt='Hero Background Desktop'
            class='w-full h-full object-cover object-center hidden md:block'
            style={hiddenBeforeHydration()}
          />
          <div class='absolute inset-0 bg-black bg-opacity-60' />
        </div>

        <div class='relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4'>
          <h1 class='hero-title text-5xl md:text-6xl font-bold text-white opacity-0'>أهلاً بيكم في سوق الرفايع</h1>
          <p class='hero-description text-xl text-white/90 opacity-0'>كل اللي بيتك محتاجه في مكان واحد</p>
          <Button
            size='lg'
            variant='pay'
            onClick={scrollToCategories}
            class='hero-button opacity-0 hover:scale-105 transition-transform'
          >
            اتسوق دلوقتي
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <section ref={categoriesRef} class='py-20 bg-background'>
        <div class='container mx-auto px-4'>
          <h2 class='text-3xl font-bold text-center mb-12 animate-on-scroll'>الأقسام</h2>
          <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {siteConfig.categories.map((category) => (
              <Card class='animate-on-scroll hover:shadow-lg transition-all duration-300 hover:-translate-y-2'>
                <CardContent class='p-6 text-center'>
                  <category.icon class='w-12 h-12 mx-auto mb-4' />
                  <h3 class='text-xl font-semibold mb-2'>{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section ref={storesRef} class='py-20 bg-gray-50'>
        <div class='container mx-auto px-4'>
          <h2 class='text-3xl font-bold text-center mb-12 animate-on-scroll'>Featured Stores</h2>
          <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {featuredStores.map((store) => (
              <Card class='animate-on-scroll overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2'>
                <img src={store.image} alt={store.name} class='w-full h-48 object-cover' />
                <CardContent class='p-6'>
                  <h3 class='text-xl font-semibold mb-2'>{store.name}</h3>
                  <p class='text-muted-foreground'>{store.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={contactRef} class='py-20 bg-background'>
        <div class='container mx-auto px-4 max-w-2xl'>
          <h2 class='text-3xl font-bold text-center mb-12 animate-on-scroll'>Contact Us</h2>
          <Card class='animate-on-scroll'>
            <CardContent class='p-6'>
              <form class='space-y-6'>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>Name</label>
                  <Input placeholder='Your name' />
                </div>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>Email</label>
                  <Input type='email' placeholder='your@email.com' />
                </div>
                <div class='space-y-2'>
                  <label class='text-sm font-medium'>Message</label>
                  <TextArea placeholder='How can we help?' class='min-h-[150px]' />
                </div>
                <Button type='submit' class='w-full'>
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer class='bg-gray-900 text-white py-12'>
        <div class='container mx-auto px-4'>
          <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h3 class='text-xl font-bold mb-4'>Souq EL Rafay3</h3>
              <p class='text-gray-400'>Your destination for quality home essentials</p>
            </div>
            <div>
              <h3 class='text-xl font-bold mb-4'>Quick Links</h3>
              <ul class='space-y-2'>
                <li>
                  <A href='#' class='text-gray-400 hover:text-white transition-colors'>
                    Categories
                  </A>
                </li>
                <li>
                  <A href='#' class='text-gray-400 hover:text-white transition-colors'>
                    Featured Stores
                  </A>
                </li>
                <li>
                  <A href='#' class='text-gray-400 hover:text-white transition-colors'>
                    Contact
                  </A>
                </li>
              </ul>
            </div>
            <div>
              <h3 class='text-xl font-bold mb-4'>Contact</h3>
              <p class='text-gray-400'>Email: contact@souqelrafay3.com</p>
              <p class='text-gray-400'>Phone: +1 234 567 890</p>
            </div>
          </div>
          <div class='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
            <p>© 2024 Souq EL Rafay3. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
