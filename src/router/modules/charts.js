/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '统计图表',
    icon: 'chart'
  },
  children: [
    {
      path: 'mix-chart',
      component: () => import('@/views/charts/mix-chart'),
      name: 'MixChart',
      meta: { title: '数据变化统计图', noCache: true, 'icon': 'el-icon-s-data' }
    },
    {
      path: 'api-time-lineChart',
      component: () => import('@/views/charts/api-lineChart'),
      name: 'api-time-lineChart',
      meta: { title: '时序API访问量图', noCache: true, 'icon': 'el-icon-s-data' }
    }
  ]
}

export default chartsRouter
