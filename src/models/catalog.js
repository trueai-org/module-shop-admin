import {
    queryProductOption,
    queryBrandAll,
    queryProductAttributeTemplates,
    queryProductAttr,
    queryProductAttributeGroupArray
} from '@/services/api';

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
        },

        *options({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(queryProductOption);
            !!resolve && resolve(response);
        },

        *brands({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(queryBrandAll, params);
            !!resolve && resolve(response);
        }
    },

    reducers: {

    },
};