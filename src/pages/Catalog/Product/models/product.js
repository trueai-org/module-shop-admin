import {
    queryProductGrid, addProduct, editProduct, deleteProduct
} from '@/services/api';

export default {
    namespace: 'product',
    state: {
    },
    effects: {
        *queryProductGrid({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(queryProductGrid, params);
            !!resolve && resolve(response);
        },

        *addProduct({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(addProduct, params);
            !!resolve && resolve(response);
        },

        *editProduct({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(editProduct, params);
            !!resolve && resolve(response);
        },

        *deleteProduct({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(deleteProduct, params);
            !!resolve && resolve(response);
        },

    },
    reducers: {
    },
};