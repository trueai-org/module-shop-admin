import {
    addShipment, firstOrderByNo
} from '@/services/api';

export default {
    namespace: 'shipment',
    state: {
    },
    effects: {
        *add({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(addShipment, params);
            !!resolve && resolve(response);
        },

        *getByNo({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(firstOrderByNo, params);
            !!resolve && resolve(response);
        },
    },
    reducers: {
    },
};