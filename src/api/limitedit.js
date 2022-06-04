import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/limit/limit-edit',
    method: 'get',
    params: query
  })
}
export function update(data) {
  return request({
    url: '/limit/update-limit',
    method: 'post',
    data
  })
}
