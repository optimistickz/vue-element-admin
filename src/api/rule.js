import request from '@/utils/request'

export function getWords() {
  return request({
    url: '/word/getWords',
    method: 'get'
  })
}

export function delRule(id) {
  return request({
    url: '/word/delWord',
    method: 'get',
    params: { id }
  })
}

export function updateRule(data) {
  return request({
    url: '/word/updateWord',
    method: 'post',
    data
  })
}

export function addRule(data) {
  return request({
    url: '/word/addWord',
    method: 'post',
    data
  })
}

