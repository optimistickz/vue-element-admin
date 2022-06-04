import request from '@/utils/request'

export async function fetchList(query) {
  return request({
    url: '/apicall/countStatics',
    method: 'get',
    params: query
  })
}

export async function fetchApiTimeList(query) {
  return request({
    url: '/apicall/countStaticsBytime',
    method: 'get',
    params: query
  })
}
