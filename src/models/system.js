import {
    queryCountryAll, queryProvinceTree
} from '@/services/api';

export default {
    namespace: 'system',
    state: {

    },

    effects: {
        *countries({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(queryCountryAll, params);
            !!resolve && resolve(response);
        },

        *provinces({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(queryProvinceTree, params);
            !!resolve && resolve(response);
        },
    },

    reducers: {

    },
};