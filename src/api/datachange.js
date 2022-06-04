import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/datachange/list',
    method: 'get',
    params: query
  })
}

