// layouts
import CatalogLayout from "@/layouts/CatalogLayout.vue"
// store catalog
import StoreCatalog from "@/views/buyersPage/publicCatalogPage/Catalog.vue";
import ProductDatail from "@/views/buyersPage/productPage/productDetail/ProductDetail.vue";
import ShoppingCart from "@/views/buyersPage/productPage/cart/shoppingCart/ShoppingCart.vue"

export const unAuthenticatedRoutes = {
  path: "/",
  component: CatalogLayout,
  children: [
    {
      path: "",
      name: "storeCatalog",
      component: StoreCatalog
    },
    {
      path: "storeCatalog/:id",
      name: "productDetail",
      component: ProductDatail
    },
    {
      path: "cart",
      name: "shoppingCart",
      component: ShoppingCart
    }
  ]
}