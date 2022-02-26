<template>
  <div>
    <v-app-bar app color="white" elevation="0" class="catalog__main-container">
      <img
        src="@/assets/images/primary-logo.png"
        alt=""
        width="100px"
        height="32.1px"
      />
      <v-spacer></v-spacer>
      <div
        class="catalog__cart"
        @click="$router.push({ name: 'shoppingCart' })"
      >
        <img
          width="29.84px"
          height="20.11px"
          src="@/assets/icons/cart-icon.svg"
          class="mr-2"
        />
        <span class="no-of-item-in-cart pa-1">{{
          totalNumberOfProductsInCart
        }}</span>
      </div>
    </v-app-bar>
    <div class="text-center" style="margin-top: 150px" v-if="inventoryLoader">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!-- no data -->
    <div
      class="text-center pt-10 pb-5"
      v-else-if="products.length == 0 && !inventoryLoader"
    >
      <p class="mb-0 secondary--text" style="font-size: 20px">
        Opps! No product found.
      </p>
    </div>
    <div v-else class="catalog__container">
      <div class="justify-center d-flex">
        <div class="catalog__justify-header">
          <h5 class="catalog__storeName">{{ getSellerInfo.name }}</h5>
          <p class="catalog__discript">
            {{ getSellerInfo.description }}
          </p>
        </div>
      </div>
      <div class="my-8">
        <h5 class="catalog__product">Products</h5>
        <div class="d-flex flex-wrap justify-center">
          <ProductCard
            class="mb-5 mr-auto mr-sm-6"
            v-for="(product, index) in products"
            :key="product.id"
            :product="product"
            :index="index"
            @addToCart="addToCart"
          />
        </div>
      </div>

      <div class="d-flex justify-space-between align-center flex-wrap mt-6">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <p class="mb-2 mr-5">
            Page {{ pageDetails.current_page }} of {{ pageDetails.last_page }}
          </p>
        </div>
        <div class="pagination mb-2">
          <v-pagination
            v-model="pageDetails.current_page"
            :length="pageDetails.last_page"
            @input="setCurentPage"
            circle
          >
          </v-pagination>
        </div>
      </div>
    </div>

    <!--------------------------- Modal for dialog messages ------------------------------>
    <Modal :dialog="dialog" width="400">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="dialog = false"
            >mdi-close</v-icon
          >
        </div>

        <div class="mb-7 mt-5 mx-auto status-img">
          <v-img :src="statusImage"></v-img>
        </div>

        <h4>{{ dialogMessage }}</h4>
      </div>
    </Modal>

    <!-- add to cart dialog modal -->
    <addToCartLoader
      :product="currentProduct"
      :addToCartDialog="addToCartDialog"
      @closeAddToCartDialog="addToCartDialog = false"
    />
  </div>
</template>

<script>
import ProductCard from "../productPage/productCard/ProductCard.vue";
import addToCartLoader from "@/components/secondary/inventory/AddToCartModal";
import failedImage from "@/assets/images/failed-img.svg";
import Modal from "@/components/secondary/Modal.vue";
import { mapState } from "vuex";
export default {
  components: {
    ProductCard,
    addToCartLoader,
    Modal,
  },
  data() {
    return {
      addToCartDialog: false,
      inventoryLoader: true,
      dialogMessage: "",
      statusImage: null,
      dialog: false,
      products: [],
      getSellerInfo: {},
      currentProduct: {
        product: {},
      },
    };
  },

  computed: {
    ...mapState({
      page: (state) => state.catalog.page,
      pageDetails: (state) => state.catalog.pageDetails,
      totalNumberOfProductsInCart: (state) =>
        state.orders.totalNumberOfProductsInCart,
    }),
  },

  created() {
    this.getCatalogList();
    this.getStoreDetails();
  },

  methods: {
    getCatalogList() {
      let getUrl = window.location.host.split(".")[1]
        ? window.location.host.split(".")[0]
        : "denco";
      this.$store
        .dispatch("catalog/getCatalogList", getUrl)
        .then((res) => {
          this.products = res.data;
          this.inventoryLoader = false;
        })
        .catch((err) => {
          this.inventoryLoader = false;
          this.statusImage = failedImage;
          if (err.data.message == "") {
            this.dialogMessage = err.statusText;
          } else {
            this.dialogMessage = err.message;
          }
          this.dialog = true;
        });
    },
    getStoreDetails() {
      let getUrl = window.location.host.split(".")[1]
        ? window.location.host.split(".")[0]
        : "denco";
      this.$store.dispatch("catalog/getSellerStore", getUrl).then((res) => {
        this.getSellerInfo = res.data;
      });
    },
    // set current page
    setCurentPage(params) {
      this.$store.commit("catalog/setPage", params);
      this.$store.commit("catalog/setPageDetails", params);
    },
    addToCart(params) {
      this.currentProduct = params;
      this.addToCartDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Catalog";
</style>