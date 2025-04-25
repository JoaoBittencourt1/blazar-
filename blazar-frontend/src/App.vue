<script setup>
import { onMounted, ref } from 'vue';
import Auth from 'layouts/LoginLayout.vue';
import { supabase } from './supabase';

const session = ref(null);
const loading = ref(true);

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
    loading.value = false;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
    loading.value = false;
  });
});
</script>

<template>
  <div v-if="loading">
    Carregando...
  </div>
  <router-view v-else-if="session" :session="session" />
  <Auth v-else />
</template>
