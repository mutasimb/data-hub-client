<template>
  <v-container style="max-width: 1200px; margin-top: 112px;">
    <v-row class="flex-column-reverse flex-lg-row">
      <v-col cols="12">
        <v-card
          outlined
          flat
          class="pa-4 d-flex align-center justify-center"
          style="min-height: 300px;"
        >
          <div class="text-h4">{{ $route.meta.title }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
