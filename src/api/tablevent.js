import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/tablevent/list',
    method: 'get',
    params: query
  })
}
