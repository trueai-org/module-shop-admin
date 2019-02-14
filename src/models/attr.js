import { queryProductAttr, deleteProductAttr, addProductAttr, editProductAttr } from '@/services/api';

export default {
    namespace: 'attr',
    state: {
    },
    effects: {
        *queryProductAttr({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(queryProductAttr);
            !!resolve && resolve(response);
        },

        *deleteProductAttr({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(deleteProductAttr, params);
            !!resolve && resolve(response);
        },

        *addProductAttr({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(addProductAttr, params);
            !!resolve && resolve(response);
        },

        *editProductAttr({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(editProductAttr, params);
            !!resolve && resolve(response);
        },
    },
    reducers: {
    },
};