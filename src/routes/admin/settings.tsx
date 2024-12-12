import { Component } from 'solid-js'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { siteConfig } from '~/config/site'

const SettingsPage: Component = () => {
  return (
    <main class='absolute inset-0 flex flex-col'>
      {/* Fixed Header */}
      <header class='flex-none border-b bg-background'>
        <div class='p-6'>
          <h1 class='text-2xl font-bold'>Settings</h1>
          <p class='text-muted-foreground'>View your site settings</p>
        </div>
      </header>

      {/* Scrollable Content */}
      <div class='flex-1 overflow-y-auto'>
        <div class='container mx-auto p-6'>
          <div class='grid gap-6 pb-6'>
            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent class='grid gap-4'>
                <div>
                  <h3 class='font-medium mb-2'>Site Name</h3>
                  <p class='text-muted-foreground'>{siteConfig.name}</p>
                </div>
                <div>
                  <h3 class='font-medium mb-2'>Description</h3>
                  <p class='text-muted-foreground'>{siteConfig.description}</p>
                </div>
                <div>
                  <h3 class='font-medium mb-2'>Developer Contact</h3>
                  <p class='text-muted-foreground'>Name: {siteConfig.contact.developer.name}</p>
                  <p class='text-muted-foreground'>Email: {siteConfig.contact.developer.email}</p>
                  <p class='text-muted-foreground'>Phone: {siteConfig.contact.developer.phone}</p>
                </div>
                <div>
                  <h3 class='font-medium mb-2'>Support Email</h3>
                  <p class='text-muted-foreground'>{siteConfig.contact.support.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Site Images */}
            <Card>
              <CardHeader>
                <CardTitle>Site Images</CardTitle>
              </CardHeader>
              <CardContent class='grid gap-6'>
                <div class='grid md:grid-cols-2 gap-6'>
                  <div class='space-y-3'>
                    <h3 class='font-medium'>Main Site Image</h3>
                    <div class='aspect-video rounded-lg overflow-hidden border bg-muted'>
                      <img
                        loading='lazy'
                        src={siteConfig.images.siteImage}
                        alt='Main site image'
                        class='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                  <div class='space-y-3'>
                    <h3 class='font-medium'>Responsive Site Image</h3>
                    <div class='aspect-video rounded-lg overflow-hidden border bg-muted'>
                      <img
                        src={siteConfig.images.siteResponsiveImage}
                        loading='lazy'
                        alt='Responsive site image'
                        class='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent class='grid gap-4'>
                <div>
                  <h3 class='font-medium mb-2'>Facebook</h3>
                  <p class='text-muted-foreground'>{siteConfig.social.facebook}</p>
                </div>
                <div>
                  <h3 class='font-medium mb-2'>Instagram</h3>
                  <p class='text-muted-foreground'>{siteConfig.social.instagram}</p>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div class='flex flex-wrap gap-2'>
                  {siteConfig.categories.map((category) => (
                    <span class='px-3 py-1 bg-muted rounded-full text-sm'>
                      {category.name} - {category.slug}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div class='grid gap-4 sm:grid-cols-3'>
                  {siteConfig.plans.map((plan) => (
                    <div class='p-4 border rounded-lg'>
                      <h3 class='font-medium mb-2'>{plan.name}</h3>
                      <p class='text-xl font-bold mb-4'>${plan.price}/month</p>
                      <ul class='space-y-2'>
                        {plan.features.map((feature) => (
                          <li class='text-muted-foreground text-sm'>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Localization */}
            <Card>
              <CardHeader>
                <CardTitle>Localization</CardTitle>
              </CardHeader>
              <CardContent class='grid gap-6'>
                {/* Cities */}
                <div>
                  <h3 class='font-medium mb-2'>Cities</h3>
                  <div class='flex flex-wrap gap-2'>
                    {Object.entries(siteConfig.localization.cities).map(([en, ar]) => (
                      <span class='px-3 py-1 bg-muted rounded-full text-sm'>
                        {en} - {ar}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Countries */}
                <div>
                  <h3 class='font-medium mb-2'>Countries</h3>
                  <div class='flex flex-wrap gap-2'>
                    {Object.entries(siteConfig.localization.countries).map(([en, ar]) => (
                      <span class='px-3 py-1 bg-muted rounded-full text-sm'>
                        {en} - {ar}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SettingsPage
