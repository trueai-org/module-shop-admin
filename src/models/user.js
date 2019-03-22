import { query as queryUsers, queryCurrent } from '@/services/user';
import {
  confirmEmail,
  getForgotPassword, forgotPasswordSendEmail, resetPasswordByEmail, forgotPasswordSendPhone, resetPasswordByPhone,
  removePhone, removeEmail
} from '@/services/api';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },


    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },

    *confirmEmail({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(confirmEmail, params);
      !!resolve && resolve(response);
    },

    *getForgotPassword({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(getForgotPassword, params);
      !!resolve && resolve(response);
    },

    *forgotPasswordSendEmail({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(forgotPasswordSendEmail, params);
      !!resolve && resolve(response);
    },

    *resetPasswordByEmail({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(resetPasswordByEmail, params);
      !!resolve && resolve(response);
    },

    *forgotPasswordSendPhone({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(forgotPasswordSendPhone, params);
      !!resolve && resolve(response);
    },

    *resetPasswordByPhone({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(resetPasswordByPhone, params);
      !!resolve && resolve(response);
    },

    *removePhone({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(removePhone, params);
      !!resolve && resolve(response);
    },

    *removeEmail({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(removeEmail, params);
      !!resolve && resolve(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
