import orderHttpClient from "@/services/order.service.js";

let getCartToken = localStorage.getItem('cartToken')
if (!getCartToken) {
    let cartToken = Date.now()
    localStorage.setItem('cartToken', cartToken)
}

const state = {
    totalNumberOfProductsInCart: 0,
    productsInCart: [{ product: {} }],
    overallTotalCost: 0,
    doNothing: null
};

const getters = {};

const actions = {
    addProductToCart(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .post(`/cart-items`, data, {
                    headers: {
                        gid: localStorage.getItem('cartToken')
                    }
                })
                .then((response) => {
                    resolve(response);
                    context.commit("doNothing");
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    getCartProducts(context) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .get(`/cart-items`, {
                    headers: {
                        gid: localStorage.getItem('cartToken')
                    }
                })
                .then(response => {
                    context.commit("setProductsInCart", response.data.data);
                    context.commit("setTotalNumberOfProductsInCart", response.data.data.length);
                    context.commit("setOverallTotalCost", response.data.overall_total_cost);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    deleteProductFromCart(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .delete(`/cart-items/${data.id}`, {
                    headers: {
                        gid: localStorage.getItem('cartToken')
                    }
                })
                .then(response => {
                    context.commit("setProductsInCart", response.data.data);
                    context.commit("setTotalNumberOfProductsInCart", response.data.data.length);
                    context.commit("setOverallTotalCost", response.data.overall_total_cost);
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing")
                    reject(error);
                });
        });
    },
    updateCartProduct(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .put(`/cart-items/${data.product_id}`, data, {
                    headers: {
                        gid: localStorage.getItem('cartToken')
                    }
                })
                .then(response => {
                    context.commit("setProductsInCart", response.data.data);
                    context.commit("setTotalNumberOfProductsInCart", response.data.data.length);
                    context.commit("setOverallTotalCost", response.data.overall_total_cost);
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing")
                    reject(error);
                });
        });
    },
    // create order
    createOrder(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.post("/checkout-sessions", data, {
                headers: {
                    gid: localStorage.getItem('cartToken')
                }
            }).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    // get order details for customer
    getOrderDetailsForCustomer(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.get(`/checkout-sessions/${data.id}`, {
                headers: {
                    gid: localStorage.getItem('cartToken')
                }
            }).then(response => {
                resolve(response);
            }).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    // pay for order
    payForOrder(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient.post(`/checkout-sessions/${data.id}/pay`, {}, {
                headers: {
                    gid: localStorage.getItem('cartToken')
                }
            }).then(response => {
                resolve(response);
            })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
    // edit order address
    editOrderAddress(context, data) {
        return new Promise((resolve, reject) => {
            orderHttpClient
                .post(`/checkout-sessions/${data.order_id}/location`, data, {
                    headers: {
                        gid: localStorage.getItem('cartToken')
                    }
                })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    context.commit("doNothing");
                    reject(error);
                });
        });
    },
};

const mutations = {
    setProductsInCart: (state, productsInCart) => state.productsInCart = productsInCart,
    setTotalNumberOfProductsInCart: (state, totalNumberOfProductsInCart) => state.totalNumberOfProductsInCart = totalNumberOfProductsInCart,
    setOverallTotalCost: (state, overallTotalCost) => state.overallTotalCost = overallTotalCost,
    // commit nothing
    doNothing: state => (state.doNothing = null)
};

export default {
    //export all the listed properties
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};