<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="#30BCED"
    >
      <div class="d-flex align-center">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
      </div>
    </v-app-bar> -->
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.v-application {
  a, #nav {
    color: white;
  }
}
</style>
