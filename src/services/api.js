import { stringify } from 'qs';
import request from '@/utils/request';
import requestUpload from '@/utils/requestUpload';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

/**
 * add 
 * 
 */
export async function loginAdmin(params) {
  return request('/api/token/create', {
    method: 'POST',
    body: params,
  });
}

export async function currentAccount() {
  return request('/api/account');
}


// 分类

export async function allCategories() {
  return request('/api/categories');
}

export async function queryCategories(params) {
  return request('/api/categories/grid', {
    method: 'POST',
    body: params,
  });
}

export async function switchInMenu(params) {
  return request(`/api/categories/switch/${params.id}`, {
    method: 'PUT'
  });
}

export async function delCategory(params) {
  return request(`/api/categories/${params.id}`, {
    method: 'DELETE'
  });
}

export async function firstCategory(params) {
  return request(`/api/categories/${params.id}`);
}

export async function addCategory(params) {
  return request(`/api/categories`, {
    method: 'POST',
    body: params
  });
}

export async function updateCategory(params) {
  return request(`/api/categories/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

export async function uploadImage(params) {
  return requestUpload(`/api/upload`, {
    method: 'POST',
    body: params
  });
}

// 品牌

export async function queryBrand(params) {
  return request('/api/brands/grid', {
    method: 'POST',
    body: params,
  });
}

export async function deleteBrand(params) {
  return request(`/api/brands/${params.id}`, {
    method: 'DELETE'
  });
}

export async function firstBrand(params) {
  return request(`/api/brands/${params.id}`);
}

export async function addBrand(params) {
  return request(`/api/brands`, {
    method: 'POST',
    body: params
  });
}

export async function editBrand(params) {
  return request(`/api/brands/${params.id}`, {
    method: 'PUT',
    body: params
  });
}