<script setup>
import { onMounted, ref } from 'vue';
import Auth from 'layouts/LoginLayout.vue';
import { supabase } from './supabase';

const session = ref();

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});
</script>

<template>
  <router-view v-if="session" :session="session" />
  <Auth v-else />
</template>

