import { queryProductAttr } from '@/services/api';

export default {
    namespace: 'globalAttribute',
    state: {
    },
    effects: {
        *queryProductAttr({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(queryProductAttr);
            !!resolve && resolve(response);
        }
    },
    reducers: {
    },
};