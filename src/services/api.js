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

export async function categories() {
  return request('/api/categories');
}

export async function queryCategory(params) {
  return request('/api/categories/grid', {
    method: 'POST',
    body: params,
  });
}

export async function categoryInMenuSwitch(params) {
  return request(`/api/categories/switch/${params.id}`, {
    method: 'PUT'
  });
}

export async function deleteCategory(params) {
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

export async function editCategory(params) {
  return request(`/api/categories/${params.id}`, {
    method: 'PUT',
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

// 上传

export async function uploadImage(params) {
  return requestUpload(`/api/upload`, {
    method: 'POST',
    body: params
  });
}

// 产品选项

export async function queryProductOption(params) {
  return request('/api/product-options');
}

export async function deleteProductOption(params) {
  return request(`/api/product-options/${params.id}`, {
    method: 'DELETE'
  });
}

export async function addProductOption(params) {
  return request(`/api/product-options`, {
    method: 'POST',
    body: params
  });
}

export async function editProductOption(params) {
  return request(`/api/product-options/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

// 产品属性组

export async function queryProductAGS(params) {
  return request('/api/product-attribute-groups');
}

export async function deleteProductAGS(params) {
  return request(`/api/product-attribute-groups/${params.id}`, {
    method: 'DELETE'
  });
}

export async function addProductAGS(params) {
  return request(`/api/product-attribute-groups`, {
    method: 'POST',
    body: params
  });
}

export async function editProductAGS(params) {
  return request(`/api/product-attribute-groups/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

// 产品属性

export async function queryProductAttr(params) {
  return request('/api/product-attributes');
}

export async function deleteProductAttr(params) {
  return request(`/api/product-attributes/${params.id}`, {
    method: 'DELETE'
  });
}

export async function addProductAttr(params) {
  return request(`/api/product-attributes`, {
    method: 'POST',
    body: params
  });
}

export async function editProductAttr(params) {
  return request(`/api/product-attributes/${params.id}`, {
    method: 'PUT',
    body: params
  });
}