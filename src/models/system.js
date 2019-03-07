import {
    queryCountryAll, queryProvinceTree, queryWarehouseAll
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

        *warehouses({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(queryWarehouseAll, params);
            !!resolve && resolve(response);
        },
    },

    reducers: {

    },
};