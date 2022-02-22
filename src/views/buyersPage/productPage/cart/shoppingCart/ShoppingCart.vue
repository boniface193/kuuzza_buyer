<template>
  <div class="shopping-cart-container">
    <v-container>
      <!-- shopping header -->
      <div class="shopping-cart-container__header">
        <!-- go to previous page -->
        <a @click="$router.back()" style="text-decoration: none">
          <span class="shopping-cart-container__header__back-btn">
            <v-icon style="font-size: 25px">mdi-chevron-left</v-icon>
          </span>
        </a>
        <!-- title -->
        <h3>Cart</h3>
      </div>

      <div v-show="cartProducts.length !== 0 && !loader">
        <v-row class="mt-8">
          <v-col
            md="6"
            cols=""
            class="mb-2"
            v-for="(item, index) in cartProducts"
            :key="index"
          >
            <v-card class="elevation-0 px-4">
              <v-row>
                <v-col lg="4" cols="" class="text-center">
                  <div class="imageContainer">
                    <img :src="item.product.image" alt="product image" />
                  </div>
                </v-col>
                <v-col lg="8" cols="" class="mt-5">
                  <h4 class="mb-1">{{ item.product.name }}</h4>
                  <p class="secondary--text mb-1">
                    &#8358;{{ item.product.total_price_label }}
                  </p>
                  <p class="secondary--text mb-1">
                    Available quantity: {{ item.product.quantity }}
                  </p>
                  <div
                    class="
                      shopping-cart-container__content-section__item__right
                    "
                  >
                    <div class="d-flex justify-space-between mt-8">
                      <div
                        class="d-flex align-center"
                        style="cursor: pointer"
                        @click="deleteProductFromCart(item.id, index)"
                      >
                        <img
                          class="mr-2"
                          src="@/assets/icons/trash.svg"
                          alt="remove"
                        />
                        <span
                          style="color: red"
                          v-show="deleteLoaderIndex != index"
                          >Remove</span
                        >
                        <v-progress-circular
                          indeterminate
                          color="red"
                          class="ml-3"
                          size="20"
                          v-show="deleteLoader && deleteLoaderIndex == index"
                        ></v-progress-circular>
                      </div>

                      <div class="error--text caption pt-2">{{errMsg}}</div>

                      <div class="quantiy-selection d-flex align-center">
                        <span
                          class="decreaseQuantity background"
                          @click="decreaseQuantity(index, item)"
                          >-</span
                        >
                        <span class="mx-2">{{ item.quantity || 1 }}</span>
                        <span
                          class="increaseQuantity primary"
                          @click="increaseQuantity(index, item)"
                          >+</span
                        >
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <div class="my-3 mx-3">
          <p class="mx-3 mx-sm-0 row">
            <span>Total price to be paid (&#8358;): </span>

            <span class="primary--text"> {{ overallTotalCost }}</span>
          </p>
          <router-link :to="{ name: 'customerForm' }">
            <v-btn class="primary elevation-0">Proceed to Payment</v-btn>
          </router-link>
        </div>
      </div>

      <!-- loader section -->
      <div class="d-flex py-5 text-center mx-auto" v-if="loader">
        <v-progress-circular
          indeterminate
          color="primary"
          class="mx-auto"
        ></v-progress-circular>
      </div>

      <!-- no data -->
      <div
        class="text-center pt-10 pb-5"
        v-show="cartProducts.length == 0 && !loader"
      >
        <p class="mb-0 secondary--text" style="font-size: 20px">
          Your cart is empty.
        </p>
        <router-link :to="{ name: 'storeCatalog' }">
          <v-btn class="primary mx-auto mt-4">Continue Buying</v-btn>
        </router-link>
      </div>
    </v-container>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "ShoppingCart",
  data: function () {
    return {
      loader: false,
      deleteLoader: false,
      deleteLoaderIndex: -1,
      errMsg: ''
    };
  },
  created() {
    this.loader = true;
    this.$store
      .dispatch("orders/getCartProducts")
      .then(() => (this.loader = false));
  },
  computed: {
    ...mapState({
      cartProducts: (state) => state.orders.productsInCart,
      overallTotalCost: (state) => state.orders.overallTotalCost,
    }),
  },
  methods: {
    deleteProductFromCart(productId, index) {
      this.deleteLoaderIndex = index;
      this.deleteLoader = true;
      this.$store
        .dispatch("orders/deleteProductFromCart", { id: productId })
        .then(() => {
          this.deleteLoaderIndex = -1;
          this.deleteLoader = false;
        })
        .catch(() => {
          this.deleteLoaderIndex = -1;
          this.deleteLoader = false;
        });
    },
    increaseQuantity(index, item) {
      if (parseInt(item.quantity, 10) < parseInt(item.product.quantity, 10)) {
        let newProductDetails = {};
        newProductDetails.quantity = parseInt(item.quantity, 10) + 1;
        newProductDetails.product_id = item.id;
        newProductDetails.variants = item.variants;
        this.cartProducts[index].quantity = newProductDetails.quantity;
        this.errMsg = ''
        this.$store
          .dispatch("orders/updateCartProduct", newProductDetails)
          .catch(() => {
            this.cartProducts[index].quantity = newProductDetails.quantity - 1;
          });
      }
    },
    decreaseQuantity(index, item) {
      if (
        parseInt(item.quantity, 10) >
        parseInt(item.product.min_order_quantity, 10)
      ) {
        let newProductDetails = {};
        newProductDetails.quantity = parseInt(item.quantity, 10) - 1;
        newProductDetails.product_id = item.id;
        newProductDetails.variants = item.variants;
        this.cartProducts[index].quantity = newProductDetails.quantity;
        this.$store
          .dispatch("orders/updateCartProduct", newProductDetails)
          .catch(() => {
            this.cartProducts[index].quantity = newProductDetails.quantity + 1;
          });
      } else {
        this.errMsg = `minimum quantity is ${item.product.min_order_quantity}`;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ShoppingCart.scss";
.v-btn:not(.v-btn--round).v-size--default {
  height: 45px;
  width: 300px;
  padding: 0 16px;
}
@media (max-width: 550px) {
  .v-btn:not(.v-btn--round).v-size--default {
    height: 45px;
    width: 100%;
    padding: 0 16px;
  }
}
</style>