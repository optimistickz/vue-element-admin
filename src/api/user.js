import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUsers() {
  return request({
    url: '/user/getWorkers',
    method: 'get'
  })
}

export function delUser(userName) {
  return request({
    url: '/user/delWorker',
    method: 'get',
    params: { userName }
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateWorker',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/addWorker',
    method: 'post',
    data
  })
}
