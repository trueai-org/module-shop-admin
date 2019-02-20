import { queryProductAttributeTemplates, queryProductAttr,queryProductAttributeGroupArray } from '@/services/api';

export default {
    namespace: 'catalog',
    state: {

    },

    effects: {
        *templates({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(queryProductAttributeTemplates);
            !!resolve && resolve(response);
        },

        *attributes({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(queryProductAttr);
            !!resolve && resolve(response);
        },

        *attributesGroupArray({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(queryProductAttributeGroupArray);
            !!resolve && resolve(response);
        }
    },

    reducers: {

    },
};