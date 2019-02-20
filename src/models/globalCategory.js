import { categories } from '@/services/api';

export default {
    namespace: 'globalCategory',
    state: {

    },

    effects: {
        *all({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(categories);
            !!resolve && resolve(response);
        },
    },

    reducers: {

    },
};