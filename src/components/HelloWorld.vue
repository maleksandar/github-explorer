<template>
  <v-container>
    <v-card color="red lighten-2" dark>
      <v-card-title class="headline red lighten-3">
        Search for Public APIs
      </v-card-title>
      <v-card-text>
        Explore hundreds of free API's ready for consumption! For more information visit
        <a
          class="grey--text text--lighten-3"
          href="https://github.com/toddmotto/public-apis"
          target="_blank"
          >the Github repository</a
        >.
      </v-card-text>
      <v-card-text>
        <v-autocomplete
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="searchTerm"
          color="white"
          hide-no-data
          hide-selected
          item-text="Description"
          item-value="API"
          label="Github repos"
          placeholder="Start typing to Search"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
      </v-card-text>
      <v-divider></v-divider>
      <v-expand-transition>
        <v-list v-if="model" class="red lighten-3">
          <v-list-item v-for="(field, i) in fields" :key="i">
            <v-list-item-content>
              <v-list-item-title v-text="field.value"></v-list-item-title>
              <v-list-item-subtitle v-text="field.key"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-expand-transition>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!model" color="grey darken-3" @click="model = null">
          Clear
          <v-icon right>
            mdi-close-circle
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">

import { Vue, Component, Watch } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
    descriptionLimit = 60;

    entries: { Description: string }[] = [];

    isLoading = false;

    model: { [key: string]: string } | null = null;

    count = 0;

    searchTerm = '';

    get fields(): { key: string; value: string }[] {
      if (!this.model) return [];

      return Object.keys(this.model).map((key) => ({
        key,
        value: (this.model ? this.model[key] : null) || 'n/a',
      }));
    }

    get items(): { Description: string }[] {
      return this.entries.map((entry) => {
        const Description = entry.Description.length > this.descriptionLimit
          ? `${entry.Description.slice(0, this.descriptionLimit)}'...'`
          : entry.Description;

        return { ...entry, Description };
      });
    }

    @Watch('searchTerm')
    search(val: string) {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch(`https://api.github.com/search/repositories?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          const { count, entries } = res;
          this.count = count;
          this.entries = entries;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => { this.isLoading = false; });
    }
}

</script>
