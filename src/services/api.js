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

export async function queryBrandAll() {
  return request('/api/brands');
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

export async function uploadMultipleImage(params) {
  return requestUpload(`/api/upload/multiple`, {
    method: 'POST',
    body: params
  });
}

// 产品选项
export async function firstProductOption(params) {
  return request(`/api/product-options/${params.id}`);
}

export async function queryProductOption(params) {
  return request('/api/product-options');
}

export async function queryProductOptionGrid(params) {
  return request(`/api/product-options/grid`, {
    method: 'POST',
    body: params
  });
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

// 产品选项值

export async function queryProductOptionData(params) {
  return request(`/api/product-options/data/${params.optionId}`);
}

export async function queryProductOptionDataGrid(params) {
  return request(`/api/product-options/data/${params.optionId}/grid`, {
    method: 'POST',
    body: params
  });
}
export async function addProductOptionData(params) {
  return request(`/api/product-options/data/${params.optionId}`, {
    method: 'POST',
    body: params
  });
}

export async function editProductOptionData(params) {
  return request(`/api/product-options/data/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

export async function deleteProductOptionData(params) {
  return request(`/api/product-options/data/${params.id}`, {
    method: 'DELETE'
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

export async function queryProductAttr() {
  return request('/api/product-attributes');
}

export async function queryProductAttributeGroupArray() {
  return request('/api/product-attributes/group-array');
}


export async function queryProductAttrGrid(params) {
  return request(`/api/product-attributes/grid`, {
    method: 'POST',
    body: params
  });
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

// 产品属性值

export async function queryProductAttrData(params) {
  return request(`/api/product-attributes/data/${params.attributeId}`);
}

export async function queryProductAttrDataGrid(params) {
  return request(`/api/product-attributes/data/${params.attributeId}/grid`, {
    method: 'POST',
    body: params
  });
}

export async function addProductAttrData(params) {
  return request(`/api/product-attributes/data/${params.attributeId}`, {
    method: 'POST',
    body: params
  });
}

export async function editProductAttrData(params) {
  return request(`/api/product-attributes/data/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

export async function deleteProductAttrData(params) {
  return request(`/api/product-attributes/data/${params.id}`, {
    method: 'DELETE'
  });
}


//产品
export async function queryProductFirst(params) {
  return request(`/api/products/${params.id}`);
}

export async function queryProductGrid(params) {
  return request(`/api/products/grid`, {
    method: 'POST',
    body: params
  });
}

export async function addProduct(params) {
  return request(`/api/products`, {
    method: 'POST',
    body: params
  });
}

export async function editProduct(params) {
  return request(`/api/products/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

export async function deleteProduct(params) {
  return request(`/api/products/${params.id}`, {
    method: 'DELETE'
  });
}

export async function publishProduct(params) {
  return request(`/api/products/${params.id}/publish`, {
    method: 'PUT',
    body: params
  });
}

export async function unpublishProduct(params) {
  return request(`/api/products/${params.id}/unpublish`, {
    method: 'PUT',
    body: params
  });
}

export async function copyProduct(params) {
  return request(`/api/products/${params.id}/clone`, {
    method: 'POST',
    body: params
  });
}


// 产品属性模板

export async function firstProductAttributeTemplate(params) {
  return request(`/api/product-attribute-templates/${params.id}`);
}

export async function queryProductAttributeTemplates() {
  return request('/api/product-attribute-templates');
}

export async function queryProductAttributeTemplateGrid(params) {
  return request(`/api/product-attribute-templates/grid`, {
    method: 'POST',
    body: params
  });
}

export async function deleteProductAttributeTemplate(params) {
  return request(`/api/product-attribute-templates/${params.id}`, {
    method: 'DELETE'
  });
}

export async function addProductAttributeTemplate(params) {
  return request(`/api/product-attribute-templates`, {
    method: 'POST',
    body: params
  });
}

export async function editProductAttributeTemplate(params) {
  return request(`/api/product-attribute-templates/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

//国家、省市区、、、
export async function firstCountry(params) {
  return request(`/api/countries/${params.id}`);
}

export async function queryCountryGrid(params) {
  return request(`/api/countries/grid`, {
    method: 'POST',
    body: params
  });
}

export async function addCountry(params) {
  return request(`/api/countries`, {
    method: 'POST',
    body: params
  });
}

export async function editCountry(params) {
  return request(`/api/countries/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

export async function deleteCountry(params) {
  return request(`/api/countries/${params.id}`, {
    method: 'DELETE'
  });
}

// 省市区

export async function firstProvince(params) {
  return request(`/api/countries/provinces/${params.id}`);
}

export async function queryProvinceTree(params) {
  return request(`/api/countries/provinces/tree/${params.countryId}`);
}

export async function queryProvinceGrid(params) {
  return request(`/api/countries/provinces/grid/${params.countryId}`, {
    method: 'POST',
    body: params
  });
}

export async function addProvince(params) {
  return request(`/api/countries/provinces/${params.countryId}`, {
    method: 'POST',
    body: params
  });
}

export async function editProvince(params) {
  return request(`/api/countries/provinces/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

export async function deleteProvince(params) {
  return request(`/api/countries/provinces/${params.id}`, {
    method: 'DELETE'
  });
}

//用户
export async function firstUser(params) {
  return request(`/api/users/${params.id}`);
}

export async function queryUserGrid(params) {
  return request(`/api/users/grid`, {
    method: 'POST',
    body: params
  });
}

export async function addUser(params) {
  return request(`/api/users`, {
    method: 'POST',
    body: params
  });
}

export async function editUser(params) {
  return request(`/api/users/${params.id}`, {
    method: 'PUT',
    body: params
  });
}

export async function deleteUser(params) {
  return request(`/api/users/${params.id}`, {
    method: 'DELETE'
  });
}