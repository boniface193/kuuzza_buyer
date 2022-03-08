import axios from "axios";
import store from "@/store";

// let requestQueue = [];

// base url for development environment
let inventoryBaseUrl = "https://nova-inventory.herokuapp.com";

// set base url if environment is staging
if (process.env.VUE_APP_ENV == "staging") {
    inventoryBaseUrl = "https://inventory-staging.kuuzza.com";
}
// set base url if environment is prodution
if (process.env.VUE_APP_ENV == "production") {
    inventoryBaseUrl = "https://inventory.kuuzza.com";
}
const inventoryHttpClient = axios.create({
    baseURL: inventoryBaseUrl,
});

/** Adding the response interceptors */
inventoryHttpClient.interceptors.response.use(
    (response) => {
        if (response.status === 200 || response.status === 201) {

            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    }, (error) => {
        if (error.response.status === 404) {
            store.commit("catalog/setErrorTracker", {
                message: "404 Not found",
                error: true
            })
        }
        else if (error.response.status === 500) {
            store.commit("catalog/setErrorTracker", {
                message: "The server encountered an internal server error or misconfiguration and was unable to complete your request.",
                error: true
            })
        } else if (!navigator.onLine) {
            store.commit("catalog/setErrorTracker", {
                message: "No internet connection.",
                error: true
            })
        }

        return Promise.reject(error.response);
    }
);

export default inventoryHttpClient;