import { queryCategories, switchInMenu, delCategory, allCategories, addCategory } from '@/services/api';

export default {
    namespace: 'category',

    state: {
        list: [],
        total: 0,
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        *queryCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(queryCategories, params);
            !!resolve && resolve(response);

            if (response.success === true) {
                yield put({
                    type: 'save',
                    payload: response.data,
                });
                yield put({
                    type: 'saveCategoryList',
                    payload: response.data.list,
                });
                yield put({
                    type: 'saveCategoryListTotal',
                    payload: response.data.pagination.total,
                });
            }
        },

        *allCategories({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(allCategories);
            !!resolve && resolve(response);
        },

        *switchCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(switchInMenu, params);
            !!resolve && resolve(response);
        },

        *delCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(delCategory, params);
            !!resolve && resolve(response);
        },

        *addCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(addCategory, params);
            !!resolve && resolve(response);
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        saveCategoryList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
        saveCategoryListTotal(state, { payload }) {
            return {
                ...state,
                total: payload,
            };
        },
    },
};