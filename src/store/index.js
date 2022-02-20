import Vue from "vue";
import Vuex from "vuex";
import catalog from "./modules/inventory.js"
import orders from "./modules/orders.js"

// initial state
const initialState = {
  catalog,
  orders
}

//Convert object in string 
const COPY = JSON.stringify(initialState);

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    catalog,
    orders
  },
  mutations: {
    reset(state) {
      //Convert string in object 
      let copyState = JSON.parse(COPY);
      Object.keys(state).forEach(key => {
        Object.assign(state[key], copyState[key]);
      })
    }
  }
});
