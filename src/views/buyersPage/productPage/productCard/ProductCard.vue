<template>
  <div class="card-container">
    <router-link
      :to="{
        name: 'productDetail',
        params: { id: product.id, createLink: false },
      }"
      style="text-decoration: none"
    >
      <div class="card-top">
        <div class="image-container">
          <img :src="product.product.image" alt="" />
        </div>
      </div>
      <div class="card-bottom">
        <h4 class="mb-0 mb-sm-1 product-name" style="color: black">
          {{ product.product.name }}
        </h4>
        <p class="secondary--text mb-0 mb-sm-3 total_price">
          &#8358;{{ product.product.total_price_label }}
        </p>

        <v-btn
          class="primary sell-now"
          @click.prevent.stop="showAddtoCartModal()"
          depressed
          >Add to cart</v-btn
        >
      </div>
      <p class="points">{{ product.product.points }}pts</p>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "ProductCard",
  props: ["product", "addToCartDialog"],
  data: function () {
    return {};
  },
  methods: {
    showAddtoCartModal() {
      this.$emit("addToCart", this.product);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./ProductCard"
</style>
