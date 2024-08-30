import request from '@/api/request'

const base = '/user'

// 登录
export function login(data) {
  return request({
    url: base + '/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: base + '/register',
    method: 'post',
    data
  })
}

export function idconfirm(data) {
  return request({
    url: base + '/idconfirm',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: base + '/get/' + id,
    method: 'get',
  })
}

export function update(data) {
  return request({
    url: base + '/update',
    method: 'post',
    data
  })
}

export function modifypass(data) {
  return request({
    url: base + '/modifypass',
    method: 'post',
    data
  })
}

export function getUserList(params) {
  return request({
    url: base + '/list',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: base + '/add',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(data) {
  return request({
    url: base + '/update',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: base + '/delete/' + id,
    method: 'delete'
  })
}

export function resetPassword(id) {
  return request({
    url: '/user/reset_password',
    method: 'post',
    data: { id }
  })
}