import { queryBrandAll } from '@/services/api';

export default {
    namespace: 'globalBrand',
    state: {

    },

    effects: {
        *queryBrandAll({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(queryBrandAll, params);
            !!resolve && resolve(response);
        },
    },

    reducers: {

    },
};