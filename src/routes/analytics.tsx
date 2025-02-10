// // ~/routes/analytics.tsx
// import { Component, createSignal, Show } from 'solid-js'
// import { createResource } from 'solid-js'
// import { Chart } from 'chart.js/auto'
// import { Line } from 'solid-chartjs'
// import { formatDistanceToNow } from 'date-fns'

// type AnalyticsResponse = {
//   pageViews: {
//     rows: Array<{
//       dimensions: string[]
//       metrics: Array<{ value: string }>
//     }>
//   }
//   topPages: {
//     rows: Array<{
//       dimensions: string[]
//       metrics: Array<{ value: string }>
//     }>
//   }
//   configured: boolean
//   error?: string
// }

// const AnalyticsDashboard: Component = () => {
//   const [days, setDays] = createSignal(7)

//   const [data] = createResource<AnalyticsResponse, number>(
//     days,
//     async (daysValue) => {
//       const response = await fetch(`/api/analytics?days=${daysValue}`)
//       if (!response.ok) throw new Error('Failed to fetch analytics')
//       return response.json()
//     },
//     {
//       initialValue: {
//         pageViews: { rows: [] },
//         topPages: { rows: [] },
//         configured: false,
//       },
//     }
//   )

//   const formatDuration = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60)
//     return `${minutes}m ${Math.floor(seconds % 60)}s`
//   }

//   return (
//     <div class='container mx-auto px-4 py-8'>
//       <div class='flex justify-between items-center mb-8'>
//         <h1 class='text-3xl font-bold'>Analytics Dashboard</h1>
//         <select class='border rounded p-2' value={days()} onChange={(e) => setDays(parseInt(e.currentTarget.value))}>
//           <option value='7'>Last 7 days</option>
//           <option value='14'>Last 14 days</option>
//           <option value='30'>Last 30 days</option>
//         </select>
//       </div>

//       <Show
//         when={data()?.configured}
//         fallback={
//           <div class='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8'>
//             <div class='flex'>
//               <div class='flex-shrink-0'>
//                 <svg class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'>
//                   <path
//                     fill-rule='evenodd'
//                     d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
//                     clip-rule='evenodd'
//                   />
//                 </svg>
//               </div>
//               <div class='ml-3'>
//                 <p class='text-sm text-yellow-700'>
//                   Google Analytics is not configured. Please set up your credentials in the environment variables.
//                 </p>
//               </div>
//             </div>
//           </div>
//         }
//       >
//         <Show when={!data.error} fallback={<div class='text-red-500'>Error loading analytics data</div>}>
//           <Show when={!data.loading} fallback={<div class='text-gray-500'>Loading analytics data...</div>}>
//             <div class='space-y-8'>
//               {/* Overview Cards */}
//               <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
//                 <div class='bg-white rounded-lg shadow p-6'>
//                   <h3 class='text-gray-500 text-sm'>Total Page Views</h3>
//                   <p class='text-2xl font-bold'>
//                     {data()
//                       ?.pageViews.rows?.reduce((acc, row) => acc + parseInt(row.metrics[0].value), 0)
//                       .toLocaleString()}
//                   </p>
//                 </div>
//                 <div class='bg-white rounded-lg shadow p-6'>
//                   <h3 class='text-gray-500 text-sm'>Active Users</h3>
//                   <p class='text-2xl font-bold'>
//                     {data()
//                       ?.pageViews.rows?.reduce((acc, row) => acc + parseInt(row.metrics[1].value), 0)
//                       .toLocaleString()}
//                   </p>
//                 </div>
//                 <div class='bg-white rounded-lg shadow p-6'>
//                   <h3 class='text-gray-500 text-sm'>Avg. Session Duration</h3>
//                   <p class='text-2xl font-bold'>
//                     {formatDuration(
//                       data()?.pageViews.rows?.reduce((acc, row) => acc + parseFloat(row.metrics[2].value), 0) /
//                         (data()?.pageViews.rows?.length || 1)
//                     )}
//                   </p>
//                 </div>
//               </div>

//               {/* Traffic Chart */}
//               <div class='bg-white rounded-lg shadow p-6'>
//                 <h2 class='text-xl font-semibold mb-4'>Traffic Overview</h2>
//                 <div class='h-64'>
//                   <Line
//                     data={{
//                       labels: data()?.pageViews.rows?.map((row) => row.dimensions[0]),
//                       datasets: [
//                         {
//                           label: 'Page Views',
//                           data: data()?.pageViews.rows?.map((row) => parseInt(row.metrics[0].value)),
//                           borderColor: 'rgb(59, 130, 246)',
//                           tension: 0.1,
//                         },
//                         {
//                           label: 'Active Users',
//                           data: data()?.pageViews.rows?.map((row) => parseInt(row.metrics[1].value)),
//                           borderColor: 'rgb(16, 185, 129)',
//                           // Continuation of ~/routes/analytics.tsx from where we left off...
//                           tension: 0.1,
//                         },
//                       ],
//                     }}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       plugins: {
//                         legend: {
//                           position: 'top',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Top Pages Table */}
//               <div class='bg-white rounded-lg shadow'>
//                 <h2 class='text-xl font-semibold p-6 border-b'>Top Pages</h2>
//                 <div class='overflow-x-auto'>
//                   <table class='w-full'>
//                     <thead class='bg-gray-50'>
//                       <tr>
//                         <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Page Path</th>
//                         <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Views</th>
//                         <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Users</th>
//                         <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Bounce Rate</th>
//                       </tr>
//                     </thead>
//                     <tbody class='divide-y divide-gray-200'>
//                       {data()?.topPages.rows?.map((row, index) => (
//                         <tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                           <td class='px-6 py-4 text-sm text-gray-900'>{row.dimensions[0]}</td>
//                           <td class='px-6 py-4 text-sm text-gray-900'>
//                             {parseInt(row.metrics[0].value).toLocaleString()}
//                           </td>
//                           <td class='px-6 py-4 text-sm text-gray-900'>
//                             {parseInt(row.metrics[1].value).toLocaleString()}
//                           </td>
//                           <td class='px-6 py-4 text-sm text-gray-900'>
//                             {(parseFloat(row.metrics[2].value) * 100).toFixed(1)}%
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </Show>
//         </Show>
//       </Show>
//     </div>
//   )
// }

// export default AnalyticsDashboard
