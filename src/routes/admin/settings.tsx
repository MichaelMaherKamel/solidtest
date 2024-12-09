import { Component } from 'solid-js'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

const SettingsPage: Component = () => {
  // Dummy data
  const siteSettings = {
    siteName: 'Souq El Rafay3',
    description: 'Your one-stop shop for all your needs',
    logo: '/images/logo.png',
    socialLinks: {
      facebook: 'https://facebook.com/souqelrafay3',
      instagram: 'https://instagram.com/souqelrafay3',
    },
    categories: ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Toys', 'Food'],
    subscriptionPlans: [
      {
        name: 'Basic',
        price: 9.99,
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
      },
      {
        name: 'Pro',
        price: 19.99,
        features: ['Everything in Basic', 'Feature 4', 'Feature 5'],
      },
    ],
  }

  return (
    <div class='h-full flex flex-col'>
      {/* Fixed Header */}
      <div class='sticky top-0 bg-background z-10 border-b'>
        <div class='p-6'>
          <h1 class='text-2xl font-bold'>Settings</h1>
          <p class='text-muted-foreground'>Manage your site settings</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div class='flex-1'>
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
                  <p class='text-muted-foreground'>{siteSettings.siteName}</p>
                </div>
                <div>
                  <h3 class='font-medium mb-2'>Description</h3>
                  <p class='text-muted-foreground'>{siteSettings.description}</p>
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
                  <p class='text-muted-foreground'>{siteSettings.socialLinks.facebook}</p>
                </div>
                <div>
                  <h3 class='font-medium mb-2'>Instagram</h3>
                  <p class='text-muted-foreground'>{siteSettings.socialLinks.instagram}</p>
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
                  {siteSettings.categories.map((category) => (
                    <span class='px-3 py-1 bg-muted rounded-full text-sm'>{category}</span>
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
                <div class='grid gap-4 sm:grid-cols-2'>
                  {siteSettings.subscriptionPlans.map((plan) => (
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

            {/* Action Buttons */}
            <div class='flex justify-end gap-4'>
              <Button variant='outline'>Reset</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
