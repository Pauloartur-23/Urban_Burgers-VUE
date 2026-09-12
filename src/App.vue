<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/header/appHeader.vue';
import AppFooter from '@/components/layout/footer/appFooter.vue';

</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>

<style scoped>
</style>
