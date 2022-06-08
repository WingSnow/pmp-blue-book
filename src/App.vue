<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
.mw-vh {
  max-width: 75vh;
}

@media screen and (max-height: 640px) {
  .mw-vh {
    max-width: 480px;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: auto;
  min-height: 100vh;
  background: #fff;
  position: relative;
}

body {
  background: rgba(0, 0, 0, 0.1);
}
</style>
