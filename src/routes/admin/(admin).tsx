import { Component, JSX, Suspense } from 'solid-js'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { LineChart, BarChart, PieChart } from '~/components/ui/charts'
import { Skeleton } from '~/components/ui/skeleton'
import { FiActivity, FiDollarSign, FiShoppingBag, FiUsers } from 'solid-icons/fi'

interface StatCardProps {
  title: string
  value: string
  icon: Component
  description: string
}

// Add type for component props
interface CardProps {
  children?: JSX.Element
  class?: string
}

// Create wrapper components to handle the class prop
const StyledCard: Component<CardProps> = (props) => <Card class={props.class}>{props.children}</Card>

const StyledCardContent: Component<CardProps> = (props) => (
  <CardContent class={props.class}>{props.children}</CardContent>
)

const StatCard: Component<StatCardProps> = (props) => {
  const Icon = props.icon
  return (
    <StyledCard>
      <CardHeader class='flex flex-row items-center justify-between pb-2'>
        <CardTitle class='text-sm font-medium text-muted-foreground'>{props.title}</CardTitle>
        <Icon class='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <StyledCardContent>
        <div class='text-2xl font-bold'>{props.value}</div>
        <p class='text-xs text-muted-foreground'>{props.description}</p>
      </StyledCardContent>
    </StyledCard>
  )
}

const StatCardSkeleton: Component = () => (
  <StyledCard>
    <CardHeader class='flex flex-row items-center justify-between pb-2'>
      <Skeleton class='h-4 w-24' />
      <Skeleton class='h-4 w-4 rounded-full' />
    </CardHeader>
    <StyledCardContent>
      <Skeleton class='h-8 w-28 mb-1' />
      <Skeleton class='h-3 w-36' />
    </StyledCardContent>
  </StyledCard>
)

const AdminDashboard: Component = () => {
  const revenueData = {
    labels: ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24'],
    datasets: [
      {
        label: 'Kitchen Supplies',
        data: [3890, 2956, 3522, 3870, 3675, 3929],
        fill: true,
      },
      {
        label: 'Bathroom Supplies',
        data: [2538, 2403, 2694, 2808, 2912, 3026],
        fill: true,
      },
    ],
  }

  const categoryData = {
    labels: ['Kitchen Supplies', 'Bathroom Supplies', 'Home Supplies'],
    datasets: [
      {
        data: [4500, 3200, 2800],
      },
    ],
  }

  const storePerformanceData = {
    labels: ['Store A', 'Store B', 'Store C', 'Store D', 'Store E'],
    datasets: [
      {
        label: 'Monthly Sales (USD)',
        data: [4200, 3800, 3400, 3000, 2600],
      },
    ],
  }

  return (
    <div class='flex flex-1 flex-col gap-4 p-4 max-w-full'>
      {/* Stats Grid */}
      <div class='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCard title='Total Revenue' value='$45,231.89' icon={FiDollarSign} description='+20.1% from last month' />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCard title='Active Stores' value='24' icon={FiShoppingBag} description='2 stores added this month' />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCard title='Active Users' value='1,234' icon={FiUsers} description='+180 new users' />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCard title='Sales Growth' value='+12.4%' icon={FiActivity} description='Compared to last month' />
        </Suspense>
      </div>

      {/* Charts Grid */}
      <div class='grid gap-4 grid-cols-1 md:grid-cols-2'>
        {/* Sales by Category */}
        <StyledCard>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <StyledCardContent class='flex justify-center items-center'>
            <div class='h-64 w-64 sm:w-80 sm:h-80'>
              <Suspense fallback={<Skeleton class='h-full w-full' />}>
                <PieChart data={categoryData} />
              </Suspense>
            </div>
          </StyledCardContent>
        </StyledCard>

        {/* Store Performance */}
        <StyledCard>
          <CardHeader>
            <CardTitle>Top Performing Stores</CardTitle>
          </CardHeader>
          <StyledCardContent class='w-full overflow-x-auto'>
            <div class='h-64 min-w-[500px]'>
              <Suspense fallback={<Skeleton class='h-full w-full' />}>
                <BarChart data={storePerformanceData} />
              </Suspense>
            </div>
          </StyledCardContent>
        </StyledCard>

        {/* Revenue Overview - Full Width */}
        <StyledCard class='md:col-span-2'>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <StyledCardContent class='w-full overflow-x-auto'>
            <div class='h-64 min-w-[500px]'>
              <Suspense fallback={<Skeleton class='h-full w-full' />}>
                <LineChart data={revenueData} />
              </Suspense>
            </div>
          </StyledCardContent>
        </StyledCard>
      </div>
    </div>
  )
}

export default AdminDashboard
