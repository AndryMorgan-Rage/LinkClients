<script setup>
</script>

<template>
  <RouterView />
</template>

<style>
/* Supprime le "scoped" et les styles par défaut pour laisser Tailwind gérer le plein écran */
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>