import { queryProductOption, deleteProductOption, addProductOption, editProductOption } from '@/services/api';

export default {
    namespace: 'option',
    state: {
    },
    effects: {
        *queryProductOption({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(queryProductOption);
            !!resolve && resolve(response);
        },

        *deleteProductOption({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(deleteProductOption, params);
            !!resolve && resolve(response);
        },

        *addProductOption({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(addProductOption, params);
            !!resolve && resolve(response);
        },

        *editProductOption({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(editProductOption, params);
            !!resolve && resolve(response);
        },
    },
    reducers: {
    },
};