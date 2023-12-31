import Vue from 'vue'
import VueRouter from 'vue-router'
import { unAuthenticatedRoutes } from "./unAuthenticated.route.js";
import PageNotFound from "@/views/PageNotFound.vue";

Vue.use(VueRouter)

const routes = [
  unAuthenticatedRoutes,
  {
    path: "*",
    name: "pageNotFound",
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
