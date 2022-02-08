<template>
  <div>
    <div class="secondary-container pt-sm-10 pt-16">
      <div>
        <v-app-bar app color="#fafafa" elevation="0" class="px-3 px-sm-8">
          <span
            class="back-btn"
            @click="$router.back()"
            style="cursor: pointer"
          >
            <v-icon color="black" style="font-size: 25px"
              >mdi-chevron-left</v-icon
            >
          </span>
          <v-spacer></v-spacer>
          <div
            class="secondary-container__header__cart"
            @click="$router.push({ name: 'shoppingCart' })"
          >
            <img
              width="29.84px"
              height="20.11px"
              src="@/assets/icons/cart-icon.svg"
              class="mr-2"
            />
            <span class="no-of-item-in-cart pa-1">0</span>
          </div>
        </v-app-bar>
        <!-- loader container -->
        <div class="text-center pt-16 pb-5" v-if="loader">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-row v-else>
          <v-col class="col-12 col-md-6 px-5 pb-5" style="padding: 90px 0">
            <div class="image-container pt-10">
              <div class="image-container__main">
                <img
                  :src="productDetails.image"
                  alt=""
                  style="height: 100%; width: 100%"
                />
                <span class="points">{{ productDetails.points }}pts</span>
              </div>
              <!-- sliding images -->
              <v-sheet class="mx-auto" max-width="800">
                <v-slide-group
                  v-model="model"
                  class="pa-sm-4 py-4"
                  mandatory
                  show-arrows
                >
                  <v-slide-item
                    v-for="n in productDetails.other_images"
                    :key="n"
                    v-slot="{ active, toggle }"
                  >
                    <v-card
                      :class="active ? 'primary' : 'grey lighten-1'"
                      class="ma-4 elevation-0"
                      height="80"
                      width="90"
                      @click="toggle"
                      v-on:click="selectByImage(n)"
                    >
                      <v-img :src="selectedImg" height="80" width="90"></v-img>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-sheet>
              <!-- sliding images -->
            </div>
          </v-col>
          <!-- prduct details -->
          <v-col class="col-12 col-md-6 pt-md-15 px-8">
            <h2 class="mb-4">{{ productDetails.name }}</h2>
            <p class="secondary--text mb-4" style="font-size: 14px">
              <span class="mr-5">&#8358;{{ productDetails.price_label }}</span
              ><span> SKU: {{ productDetails.sku }} </span
              ><span class="mx-2">|</span
              ><span style="font-weight: 600; color: black"
                >{{ productDetails.quantity }} Available</span
              >
              <span class="mx-2">|</span>
              <span
                ><span style="font-weight: 600">Minimum order quantity:</span>
                {{ productDetails.min_order_quantity }}</span
              >
            </p>
            <p class="secondary--text" style="font-size: 14px">
              Inventory: Manapas
            </p>
            <hr class="secondary--text" />

            <div class="py-5">
              <h4 class="mb-4">Description</h4>
              <p class="secondary--text mb-2" style="font-size: 14px">
                {{ productDetails.description }}
              </p>

              <!-- <div
                v-if="
                  productDetails.variants.length > 0 &&
                  productDetails.variants.length != null
                "
              >
                <h4>Variants</h4>
                <p
                  class="secondary--text small-font-size mb-1"
                  v-for="(variant, index) in productDetails.variants"
                  :key="index"
                >
                  {{ variant.name }}: {{ variant.value }}
                </p>
              </div> -->

              <h4 class="mt-4 mb-2">Shipping and returns</h4>
              <p
                v-show="storeDetails.refund_policy.return_allowed == 'true'"
                style="font-size: 14px"
              >
                <span class="secondary--text"
                  >Free return within
                  {{ storeDetails.refund_policy.return_window }}
                  {{
                    storeDetails.refund_policy.return_window > 1
                      ? "days"
                      : "day"
                  }}
                  from {{ storeDetails.name }}</span
                ><br />
                <span style="font-weight: 600"
                  >What qualifies a product for returns ?</span
                ><br />
                <span>{{ storeDetails.refund_policy.return_precondition }}</span
                ><br />
                <span style="font-size: 14px; font-weight: 600"
                  >Can a customer replace a product in the event of a return
                  ?</span
                ><br />
                <span>{{
                  storeDetails.refund_policy.product_replacable_on_return ==
                  "true"
                    ? "Yes, a customer can replace a product on return"
                    : "No, a customer cannot replace a product on return"
                }}</span>
              </p>
              <p
                v-show="storeDetails.refund_policy.return_allowed == 'false'"
                style="font-size: 14px"
              >
                Returns are not allowed for this product
              </p>

              <v-btn
                class="primary elevation-0"
                width="300"
                :disabled="addToCartLoad"
                @click="addToCart"
                >Add to Cart
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

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
        :addToCartLoad="addToCartLoad"
        :productNames="productNames"
      />
    </div>
  </div>
</template>
<script>
import Modal from "@/components/secondary/Modal.vue";
import failedImage from "@/assets/images/failed-img.svg";
import addToCartLoader from "@/views/buyersPage/productPage/cart/AddToCartLoader";
import { mapState } from "vuex";
export default {
  name: "Product",
  components: { Modal, addToCartLoader }, //Facebook, Twitter, WhatsApp },
  data: function () {
    return {
      model: null,
      selectedImg: "",
      addToCartLoad: false,
      productNames: "",
      productDetails: {
        description: "",
        min_order_quantity: "",
        variants: [],
      },
      storeDetails: {
        refund_policy: {},
      },
      loader: false,
      statusImage: null,
      dialog: false,
      dialogMessage: "",
    };
  },
  computed: {
    createLink() {
      const params = new URLSearchParams(window.location.search);
      const link = new URLSearchParams(
        decodeURIComponent(window.location.search)
      );
      if (params.get("createLink")) {
        const linkStatus = params.get("createLink");
        const url = link.get("link");
        return {
          status: linkStatus,
          url: url,
        };
      } else {
        return {
          status: false,
        };
      }
    },
    ...mapState({
      sellerName: (state) => state.settings.profile.name,
      totalNumberOfProductsInCart: (state) =>
        state.orders.totalNumberOfProductsInCart,
    }),
  },
  created() {
    this.loader = true;
    this.$store
      .dispatch("catalog/getCatalogDetail", this.$route.params.id)
      .then((res) => {
        this.productDetails = res.data.product;
        this.loader = false;
        this.productDetails.other_images.push(this.productDetails.image);
      })
      .catch((err) => {
        this.loader = false;
        this.statusImage = failedImage;
        if (err.data.message == "") {
          this.dialogMessage = err.statusText;
        } else {
          this.dialogMessage = err.message;
        }
        this.dialog = true;
      });
  },
  methods: {
    addToCart() {
      this.addToCartLoad = true;
      this.productNames = this.productDetails.name;
    },
    selectByImage(params) {
      this.selectedImg = this.productDetails.other_images.find(
        (item) => item == params
      );
    },
    removeHttp(url) {
      return url.replace(/(^\w+:|^)\/\//, "");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ProductDetail.scss";
</style>