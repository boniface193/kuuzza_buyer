// layouts
import CatalogLayout from "@/layouts/CatalogLayout.vue"
// store catalog
import StoreCatalog from "@/views/buyersPage/publicCatalogPage/Catalog.vue";
import ProductDatail from "@/views/buyersPage/productPage/productDetail/ProductDetail.vue";
import ShoppingCart from "@/views/buyersPage/productPage/cart/shoppingCart/ShoppingCart.vue"
import CustomerForm from "@/views/buyersPage/productPage/CustomerDetailsForm/CustomerDetailsForm.vue"
import CheckoutLayout from "@/layouts/CheckoutLayout.vue"
import CheckoutDetails from "@/views/buyersPage/checkoutPages/CheckoutDetails.vue"
import paymentDetails from "@/views/buyersPage/checkoutPages/PaymentDetails.vue"

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
    },
    {
      path: "customer-form",
      name: "customerForm",
      component: CustomerForm
    },
    {
      path: "checkout-details",
      component: CheckoutLayout,
      children: [
        {
          path: "",
          name: "checkoutDetails",
          component: CheckoutDetails
        },
        {
          path: "/payment-details",
          name: "paymentDetails",
          component: paymentDetails
        }
      ]
    },

  ]
}