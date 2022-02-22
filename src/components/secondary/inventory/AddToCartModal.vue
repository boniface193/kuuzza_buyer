<template>
  <div class="add-to-cart-container">
    <div
      class="add-to-cart-container__notification"
      v-if="productNames.length > 0"
    >
      <div
        class="add-to-cart-container__notification__message"
        v-for="(productName, index) in productNames"
        :key="index"
      >
        <p class="white--text mb-0">
          <v-progress-circular
            size="20"
            indeterminate
            color="white mr-3"
          ></v-progress-circular>

          <span>Adding {{ productName }} to cart</span>
          <v-icon style="cursor: pointer" class="ml-1 error--text"
            >mdi-close</v-icon
          >
        </p>
      </div>
    </div>

    <!--------------------------- Modal for dialog messages ------------------------------>
    <Modal :dialog="addToCartDialog" width="500">
      <div class="white pa-3 pb-10 text-center dialog">
        <div class="d-flex justify-end">
          <v-icon class="error--text close-btn" @click="closeAddToCartDialog"
            >mdi-close</v-icon
          >
        </div>
        <h3 class="text-left mt-3">
          Product name:
          <span style="font-weight: normal">{{ product.product.name }}</span>
        </h3>

        <!-- variant form -->
        <v-form class="text-left mt-1" ref="variantForm">
          <!-- quantiy input -->
          <div class="d-flex align-center mb-5">
            <p class="mr-5 mb-0" style="font-weight: 600">Quantity:</p>
            <div class="d-flex align-center">
              <span class="minus-btn" @click="decreaseNum">-</span>
              <span class="mx-4">{{ this.quantity }}</span>
              <span class="add-btn mr-3" @click="increaseNum">+</span>
            </div>
            <p
              class="error--text mb-0"
              v-show="quantityError"
              style="font-size: 14px"
            >
              {{ quantityErrorMsg }}
            </p>
          </div>
          <div v-if="product.product.variants != null">
            <h4 class="mb-2">Variants</h4>
            <div
              class="ml-2"
              v-for="(item, index) in product.product.variants"
              :key="index"
            >
              <p class="mb-1">{{ item.name }}</p>
              <v-radio-group
                row
                class="mt-1"
                :rules="variantRules"
                v-model="variants[index].value"
              >
                <v-radio
                  class="primary--text mb-0"
                  v-for="(value, index2) in item.values"
                  :key="index2"
                  :label="value"
                  :value="value"
                ></v-radio>
              </v-radio-group>
            </div>
          </div>
          <v-btn
            height="30"
            class="primary"
            :disabled="productIsAddedToCart || addToCartLoader"
            :loading="addToCartLoader"
            rounded
            depressed
            @click="addToCart"
            >{{ productIsAddedToCart ? "Added" : "Add" }}</v-btn
          >
        </v-form>
      </div>
    </Modal>
    <!-- Modal for dialog messages -->
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
  </div>
</template>
<script>
import Modal from "@/components/secondary/Modal.vue";
import failedImage from "@/assets/images/failed-img.svg";
import { mapState } from "vuex";
export default {
  name: "AddToCartModal",
  components: {
    Modal,
  },
  props: ["product", "addToCartDialog"],
  data: function () {
    return {
      statusImage: null,
      dialog: false,
      dialogMessage: "",
      variantDialog: false,
      variants: [
        {
          name: "",
          value: [],
        },
      ],
      quantityError: false,
      quantityErrorMsg: "",
      quantity: this.product.product.min_order_quantity,
      productNames: [],
      addToCartLoader: false,
      loaderIndex: -1,
      productIsAddedToCart: false,
      variantRules: [(v) => !!v || "Required"],
    };
  },
  computed: {
    ...mapState({
      totalNumberOfProductsInCart: (state) =>
        state.orders.totalNumberOfProductsInCart,
    }),
  },
  created() {
    this.$store.dispatch("orders/getCartProducts");
  },
  watch: {
    immediate: true,
    product: function (currentProduct) {
      this.quantity = currentProduct.product.min_order_quantity;
      this.variants = currentProduct.product.variants || [];
    },
  },
  methods: {
    closeAddToCartDialog() {
      this.$emit("closeAddToCartDialog");
      this.$refs.variantForm.reset();
      this.productIsAddedToCart = false;
    },
    addToCart() {
      if (this.$refs.variantForm.validate()) {
        this.addToCartLoader = true;
        this.productNames.push(this.product.product.name);
        this.$store
          .dispatch("orders/addProductToCart", {
            product_id: this.product.product_id,
            catalogue_item_id: this.product.id,
            quantity: this.quantity,
            variants: this.variants,
          })
          .then(() => {
            let productPosition = this.removeItemFromArray(
              this.productNames,
              this.product.product.name
            );
            this.productNames.splice(productPosition, 1);
            this.$store.commit(
              "orders/setTotalNumberOfProductsInCart",
              this.totalNumberOfProductsInCart + 1
            );
            this.productIsAddedToCart = true;
            this.addToCartLoader = false;
            this.closeAddToCartDialog();
          })
          .catch((error) => {
            let productPosition = this.removeItemFromArray(
              this.productNames,
              this.product.product.name
            );
            this.productNames.splice(productPosition, 1);
            this.productIsAddedToCart = false;
            this.addToCartLoader = false;
            if (error.status === 400) {
              this.statusImage = failedImage;
              this.dialog = true;
              this.dialogMessage = error.data.message;
            }
          });
      }
    },
    increaseNum() {
      if (this.quantity < this.product.product.quantity) {
        this.quantity = parseInt(this.quantity, 10) + 1;
        this.quantityError = false;
      } else {
        this.quantityError = true;
        let placeholder = this.product.product.quantity > 1 ? "items" : "item";
        this.quantityErrorMsg =
          "Only " +
          this.product.product.quantity +
          " " +
          placeholder +
          " Available in stock";
      }
    },
    decreaseNum() {
      if (this.quantity > this.product.product.min_order_quantity) {
        this.quantity = parseInt(this.quantity, 10) - 1;
        this.quantityError = false;
      } else {
        this.quantityError = true;
        this.quantityErrorMsg =
          "The minimum quantity allowed is " +
          this.product.product.min_order_quantity;
      }
    },
    removeItemFromArray(arr, itemName) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === itemName) {
          return i;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.add-to-cart-container {
  &__notification {
    position: fixed;
    right: 10px;
    top: 10px;
    z-index: 203;
    &__message {
      border-radius: 5px;
      padding: 10px;
      background: #ffba00;
      margin-bottom: 5px;
    }
  }
}
.add-btn {
  border-radius: 50%;
  background: #029b97;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: center;
  cursor: pointer;
}
.minus-btn {
  border-radius: 50%;
  background: #f3f5ff;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  color: #029b97;
  justify-content: center;
  cursor: pointer;
}
.status-img {
  width: 140px;
  .v-image {
    width: 100%;
  }
}
</style>