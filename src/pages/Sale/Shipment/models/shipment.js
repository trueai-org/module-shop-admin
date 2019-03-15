import {
    addShipment
} from '@/services/api';

export default {
    namespace: 'shipment',
    state: {
    },
    effects: {
        *add({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(addOrder, params);
            !!resolve && resolve(response);
        },

    },
    reducers: {
    },
};