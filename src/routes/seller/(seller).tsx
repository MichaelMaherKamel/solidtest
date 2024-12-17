// import { Component, JSX, Suspense } from 'solid-js'
// import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
// import { LineChart, BarChart, PieChart } from '~/components/ui/charts'
// import { Skeleton } from '~/components/ui/skeleton'
// import { TbCurrencyDollar, TbShoppingBag, TbPackage, TbChartBar } from 'solid-icons/tb'
// import { useI18n } from '~/contexts/i18n'

// // Interfaces
// interface DashboardCardProps {
//   title: string
//   value: string
//   icon: any
//   description: string
// }

// interface CardProps {
//   children?: JSX.Element
//   class?: string
// }

// // Styled Components
// const StyledCard: Component<CardProps> = (props) => <Card class={props.class}>{props.children}</Card>
// const StyledCardContent: Component<CardProps> = (props) => (
//   <CardContent class={props.class}>{props.children}</CardContent>
// )

// // Loading Skeleton Components
// const DashboardCardSkeleton: Component = () => (
//   <StyledCard>
//     <CardHeader class='flex flex-row items-center justify-between pb-2'>
//       <Skeleton class='h-4 w-24' />
//       <Skeleton class='h-4 w-4 rounded-full' />
//     </CardHeader>
//     <StyledCardContent>
//       <Skeleton class='h-8 w-28 mb-1' />
//       <Skeleton class='h-3 w-36' />
//     </StyledCardContent>
//   </StyledCard>
// )

// const ChartSkeleton: Component = () => (
//   <StyledCard>
//     <CardHeader>
//       <Skeleton class='h-6 w-48' />
//     </CardHeader>
//     <StyledCardContent>
//       <Skeleton class='h-64 w-full' />
//     </StyledCardContent>
//   </StyledCard>
// )

// const DashboardCard: Component<DashboardCardProps> = (props) => {
//   const { locale } = useI18n()
//   const isRTL = () => locale() === 'ar'
//   const Icon = props.icon

//   return (
//     <StyledCard>
//       <CardHeader
//         class={`flex items-center justify-between space-y-0 pb-2 ${isRTL() ? 'flex-row-reverse' : 'flex-row'}`}
//       >
//         <CardTitle class='text-sm font-medium'>{props.title}</CardTitle>
//         <Icon class='h-4 w-4 text-muted-foreground' />
//       </CardHeader>
//       <StyledCardContent>
//         <div class='text-2xl font-bold'>{props.value}</div>
//         <p class='text-xs text-muted-foreground'>{props.description}</p>
//       </StyledCardContent>
//     </StyledCard>
//   )
// }

// const SellerDashboard: Component = () => {
//   const { t } = useI18n()

//   // Dummy Data
//   const salesOverTimeData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Sales',
//         data: [4500, 3800, 5200, 4800, 5500, 6200],
//         fill: true,
//       },
//     ],
//   }

//   const topProductsData = {
//     labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
//     datasets: [
//       {
//         label: 'Units Sold',
//         data: [120, 98, 85, 74, 65],
//       },
//     ],
//   }

//   const categoryData = {
//     labels: ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports'],
//     datasets: [
//       {
//         data: [35, 25, 20, 15, 5],
//       },
//     ],
//   }

//   const inventoryData = {
//     labels: ['Low Stock', 'In Stock', 'Overstock'],
//     datasets: [
//       {
//         data: [15, 65, 20],
//       },
//     ],
//   }

//   return (
//     <div class='flex-1 space-y-4 p-4 md:p-8'>
//       {/* Stats Cards */}
//       <div class='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
//         <Suspense fallback={<DashboardCardSkeleton />}>
//           <DashboardCard
//             title={t('seller.dashboard.stats.totalRevenue')}
//             value='$15,231.89'
//             icon={TbCurrencyDollar}
//             description='+20.1% from last month'
//           />
//         </Suspense>
//         <Suspense fallback={<DashboardCardSkeleton />}>
//           <DashboardCard
//             title={t('seller.dashboard.stats.totalOrders')}
//             value='256'
//             icon={TbShoppingBag}
//             description='+12.5% from last month'
//           />
//         </Suspense>
//         <Suspense fallback={<DashboardCardSkeleton />}>
//           <DashboardCard
//             title={t('seller.dashboard.stats.totalProducts')}
//             value='45'
//             icon={TbPackage}
//             description='5 products low stock'
//           />
//         </Suspense>
//         <Suspense fallback={<DashboardCardSkeleton />}>
//           <DashboardCard
//             title={t('seller.dashboard.stats.totalSales')}
//             value='$4,321'
//             icon={TbChartBar}
//             description='+15.2% from last month'
//           />
//         </Suspense>
//       </div>

//       {/* Charts Grid - First Row */}
//       <div class='grid gap-4 grid-cols-1 md:grid-cols-2'>
//         <Suspense fallback={<ChartSkeleton />}>
//           <StyledCard>
//             <CardHeader>
//               <CardTitle>Sales Over Time</CardTitle>
//             </CardHeader>
//             <StyledCardContent class='w-full overflow-x-auto'>
//               <div class='h-64 min-w-[500px]'>
//                 <LineChart data={salesOverTimeData} />
//               </div>
//             </StyledCardContent>
//           </StyledCard>
//         </Suspense>

//         <Suspense fallback={<ChartSkeleton />}>
//           <StyledCard>
//             <CardHeader>
//               <CardTitle>Top Selling Products</CardTitle>
//             </CardHeader>
//             <StyledCardContent class='w-full overflow-x-auto'>
//               <div class='h-64 min-w-[500px]'>
//                 <BarChart data={topProductsData} />
//               </div>
//             </StyledCardContent>
//           </StyledCard>
//         </Suspense>
//       </div>

//       {/* Charts Grid - Second Row */}
//       <div class='grid gap-4 grid-cols-1 md:grid-cols-2'>
//         <Suspense fallback={<ChartSkeleton />}>
//           <StyledCard>
//             <CardHeader>
//               <CardTitle>Revenue by Category</CardTitle>
//             </CardHeader>
//             <StyledCardContent class='flex justify-center items-center'>
//               <div class='h-64 w-64 sm:w-80 sm:h-80'>
//                 <PieChart data={categoryData} />
//               </div>
//             </StyledCardContent>
//           </StyledCard>
//         </Suspense>

//         <Suspense fallback={<ChartSkeleton />}>
//           <StyledCard>
//             <CardHeader>
//               <CardTitle>Inventory Levels</CardTitle>
//             </CardHeader>
//             <StyledCardContent class='flex justify-center items-center'>
//               <div class='h-64 w-64 sm:w-80 sm:h-80'>
//                 <PieChart data={inventoryData} />
//               </div>
//             </StyledCardContent>
//           </StyledCard>
//         </Suspense>
//       </div>
//     </div>
//   )
// }

// export default SellerDashboard

export default function SellerDashboard() {
  return <div>Seller Dashboard</div>
}
