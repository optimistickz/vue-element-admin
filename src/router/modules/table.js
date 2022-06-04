/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '审计表格',
    icon: 'table'
  },
  children: [
    {
      path: 'callinfo-table',
      component: () => import('@/views/table/callinfo-table'),
      name: 'ComplexTable1',
      meta: { title: '接口调用审计表', 'icon': 'el-icon-menu' }
    },
    {
      path: 'datachange-table/:traceId',
      component: () => import('@/views/table/datachange-table'),
      name: 'ComplexTable2',
      meta: { title: '数据变化', 'icon': 'el-icon-info', roles: ['worker'] }
    },
    {
      path: 'limitevent-table',
      component: () => import('@/views/table/limitevent-table'),
      name: 'ComplexTable3',
      meta: { title: '高频调用', 'icon': 'el-icon-question' }
    },
    {
      path: 'tabevent-table',
      component: () => import('@/views/table/limitevent-table'),
      name: 'ComplexTable8',
      meta: { title: '数据告警变更', 'icon': 'el-icon-warning' }
    }
  ]
}
export default tableRouter
