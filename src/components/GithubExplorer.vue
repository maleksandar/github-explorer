<template>
  <v-container id="github-explorer">
    <v-card class="container" dark>
      <v-card-title class="header">
        Search for Github repositories
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="model"
          :items="repositoryNames"
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
      <div class="pa-2">
        <v-expansion-panels color="grey darken-3">

        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-row no-gutters>
              Edit
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
          Fields:
          <v-select
              deletable-chips
              @click="selectionClicked($event)"
              v-model="reposityInfoKeysSelection"
              :items="availableRepositoryInfoKeys"
              chips
              label="Chips"
              multiple
              solo
            ></v-select>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>

      </div>
      <div class="pa-2">
        <v-expand-transition>
          <v-list v-if="model" color="grey darken-3">
            <v-list-item v-for="(field, i) in repoProps" :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="field.value"></v-list-item-title>
                <v-list-item-subtitle v-text="field.key"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expand-transition>
      </div>
      <v-card-actions v-if="!!model">
        <v-btn :disabled="!model" color="grey darken-3" @click="openRepositoryDetails(model)">
          Details
          <v-icon right>
            mdi-information-outline
          </v-icon>
        </v-btn>
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
import { repositoriesResponse } from './mock-data';
import { RepositoryShortInfo, DefaultRepositoryShortInfoKeys } from './GithubExplorer.models';

function mockGetGithubData(val: string): Promise<any> {
  return new Promise((resolve: Function) => {
    setTimeout(resolve(repositoriesResponse));
  });
}

function getGithubData(val: string) {
  return fetch(`https://api.github.com/search/repositories?q=${val}`)
    .then((res) => res.json());
}

@Component
export default class GithubExplorerComponent extends Vue {
    descriptionLimit = 60;

    repositories: RepositoryShortInfo[] = [];

    isLoading = false;

    model = '';

    count = 0;

    searchTerm = '';

    reposityInfoKeysSelection = DefaultRepositoryShortInfoKeys;

    availableRepositoryInfoKeys = DefaultRepositoryShortInfoKeys;

    get repoProps(): { key: string; value: string | object }[] {
      const entry = this.repositories.find((x) => x.full_name === this.model);

      this.availableRepositoryInfoKeys = entry
        ? Object.keys(entry)
        : DefaultRepositoryShortInfoKeys;

      return this.reposityInfoKeysSelection
        .map((key) => ({
          key,
          value: (entry ? (entry as any)[key] : null),
        }));
    }

    get repositoryNames(): string[] {
      return this.repositories.map((x) => x.full_name);
    }

    selectionClicked($event: MouseEvent) {
      console.log('Selection clicked, ', $event, this);
    }

    @Watch('searchTerm')
    search(val: string) {
      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      mockGetGithubData(val)
        .then((res) => {
          this.count = res.total_count;
          this.repositories = res.items;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => { this.isLoading = false; });
    }

    openRepositoryDetails(repositoryName: string) {
      this.$router.push({ name: 'repo-details', params: { repoFullName: this.model } });
    }
}
</script>

<style scoped lang="scss">
  #github-explorer {
    .container {
      background-color: #30BCED;
      color: #FFFAFF;

      .header {
        background-color: #30BCED
      }

      .repository-properties {
        background-color: #303036;
      }
    }
  }
</style>
