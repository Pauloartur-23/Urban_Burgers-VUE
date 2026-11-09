<script setup lang="ts">
import AppAbout from '@/components/layout/pages/home/appAbout.vue';
import appBanner from '@/components/layout/pages/home/appBanner.vue';
import appCarouselLogo from '@/components/layout/pages/home/appCarouselLogo.vue';
import appMenu from '@/components/layout/pages/home/appMenu.vue';
import appContato from '@/components/layout/pages/home/appContato.vue';
import appComoFunciona from '@/components/layout/pages/home/appComoFunciona.vue';

</script>

<template>
  <div>
    <appBanner />
    <appCarouselLogo />
    <appMenu />
    <appComoFunciona />
    <AppAbout />
    <appContato />
  </div>
</template>