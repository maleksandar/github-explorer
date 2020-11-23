<template>
  <v-container>
    <div class="about">
      <div>User {{ $route.params.repoFullName }}</div>
      <router-link :to="{ path: '/' }"> Home </router-link>
    </div>
  </v-container>
</template>
