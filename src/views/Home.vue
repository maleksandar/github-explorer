<template>
  <div class="home">
    <GithubExplorer/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GithubExplorer from '@/components/GithubExplorer.vue'; // @ is an alias to /src

@Component({
  components: {
    GithubExplorer,
  },
})
export default class Home extends Vue {}
</script>
