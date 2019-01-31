import {
    queryCategories, switchInMenu, delCategory, allCategories, addCategory,
    firstCategory, updateCategory,
    uploadImage
} from '@/services/api';

export default {
    namespace: 'category',
    state: {

    },

    effects: {
        *queryCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(queryCategories, params);
            !!resolve && resolve(response);
        },

        *allCategories({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(allCategories);
            !!resolve && resolve(response);
        },

        *switchCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(switchInMenu, params);
            !!resolve && resolve(response);
        },

        *delCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(delCategory, params);
            !!resolve && resolve(response);
        },

        *addCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(addCategory, params);
            !!resolve && resolve(response);
        },

        *updateCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(updateCategory, params);
            !!resolve && resolve(response);
        },

        *uploadImage({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(uploadImage, params);
            !!resolve && resolve(response);
        },

        *firstCategory({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const response = yield call(firstCategory, params);
            !!resolve && resolve(response);
        },
    },

    reducers: {

    },
};