import { queryProductOption } from '@/services/api';

export default {
    namespace: 'globalOption',
    state: {
    },
    effects: {
        *queryProductOption({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(queryProductOption);
            !!resolve && resolve(response);
        }

    },
    reducers: {
    },
};