import request from '@/utils/request'

export function fetchWatches() {
  return request({
    url: '/watch/getWatches',
    method: 'get'
  })
}
export function update(data) {
  return request({
    url: '/watch/updateWatch',
    method: 'post',
    data
  })
}
