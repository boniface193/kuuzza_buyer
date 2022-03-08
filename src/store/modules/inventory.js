import inventoryHttpClient from '@/services/inventory.service.js'
import setItemPerPage from "@/helpers/general.js";

const state = {
    products: [],
    page: 1,
    itemPerPage: 15,
    pageDetails: {},
    errorTracker: {
        message: "",
        error: false
    },
    doNothing: null
};

const getters = {
    products: (state) => state.products
};

const actions = {
    getCatalogList(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`catalogue/${data}/products`)
                .then((response) => {
                    resolve(response.data)
                    context.commit("setProducts", response.data.data);
                    context.commit("setPageDetails", response.data.meta);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    getCatalogDetail(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`catalogue/${data}`)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                    context.commit('doNothing')
                })
        })
    },

    getSellerStore(context, data) {
        return new Promise((resolve, reject) => {
            inventoryHttpClient.get(`seller-store/${data}/guest`)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                    context.commit('doNothing')
                })
        })
    },
};

const mutations = {
    setProducts: (state, data) => (state.products = data),
    setPageDetails: (state, data) => (state.pageDetails = data),
    setItemPerPage: (state, itemPerPage) => {
        state.itemPerPage = itemPerPage;
        let page = setItemPerPage(itemPerPage, state.pageDetails.per_page, state.pageDetails.from);
        state.page = page;
    },
    setPage: (state, page) => (state.page = page),
    // commit nothing
    doNothing: (state) => (state.doNothing = null),
    setErrorTracker(state, data) {
        state.errorTracker = data
    }
}

export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};