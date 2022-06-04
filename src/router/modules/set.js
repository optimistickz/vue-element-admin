/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const setRouter = {
  path: '/set',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '配置和编辑',
    icon: 'table'
  },
  children: [
    {
      path: 'limitedit-table',
      component: () => import('@/views/table/limitedit-table'),
      name: 'ComplexTable4',
      meta: { title: 'Api告警配置', 'icon': 'el-icon-setting' }
    },
    {
      path: 'useredit-table',
      component: () => import('@/views/table/useredit-table'),
      name: 'ComplexTable5',
      meta: { title: '用户编辑', 'icon': 'el-icon-user' }
    },
    {
      path: 'dataedit-table',
      component: () => import('@/views/table/tablewatch-table'),
      name: 'ComplexTable6',
      meta: { title: '数据变化告警配置', 'icon': 'el-icon-setting' }
    },
    {
      path: 'wordsedit-table',
      component: () => import('@/views/table/rule-table'),
      name: 'ComplexTable7',
      meta: { title: '关键字配置', 'icon': 'el-icon-edit' }
    }
  ]
}
export default setRouter
