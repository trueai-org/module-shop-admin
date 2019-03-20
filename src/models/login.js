import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, loginAdmin, loginPhone, loginPhoneGetCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
import token from '../utils/token';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *loginAdmin({ payload }, { call, put }) {
      console.log(payload);
      let response = {};
      if (payload.type === 'account') {
        response = yield call(loginAdmin, payload);
      } else {
        response = yield call(loginPhone, payload);
      }

      if (!response) {
        return;
      }
      if (response.success === true) {
        response.status = 'ok';
        response.type = 'account';
        response.currentAuthority = 'admin'; //response.data.name;//'admin';//
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
      } else {
        message.warning(response.message)
      }

      // Login successfully
      if (response.success === true) {
        reloadAuthorized();
        token.save(response.data.token);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(loginPhoneGetCaptcha, params);
      return response;
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
