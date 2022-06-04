import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/apicall/list',
    method: 'get',
    params: query
  })
}

export function fetchDescriptionList() {
  return request({
    url: '/apicall/description-list',
    method: 'get'
  })
}
