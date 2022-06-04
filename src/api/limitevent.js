import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/limit/list',
    method: 'get',
    params: query
  })
}
