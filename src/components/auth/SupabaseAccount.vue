<script setup>
import { supabase } from 'src/supabase';
import { onMounted, ref } from 'vue';
import Avatar from './SupabaseAvatar.vue';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import { userAuthStore } from 'stores/userAuthStore';

const router = useRouter();
const loading = ref(false);
const signOutLoading = ref(false);
const user = ref('');
const password = ref('');
const avatarUrl = ref('');
const fullName = ref('');
const email = ref('');

onMounted(() => {
  getProfile();
});

async function getProfile() {
  try {
    loading.value = true;
    const {
      data: { user },
    } = await supabase.auth.refreshSession();
    if (user) {
      fullName.value = user?.user_metadata?.fullname;
      avatarUrl.value = user?.user_metadata?.avatar_url;
      email.value = user.email;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function updateProfile() {
  try {
    loading.value = true;

    const updates = {
      id: user.value.id,
      updated_at: new Date(),
      email: email.value,
      data: {
        fullname: fullName.value,
        avatar_url: avatarUrl.value,
      },
    };
    if (password.value) {
      updates.password = password.value;
    }
    const { data, error } = await supabase.auth.updateUser(updates);
    const store = userAuthStore();

    store.$patch({
      user: data.user,
    });
    Notify.create('User updated with success!');

    if (error) throw error;

    return data;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function signOut() {
  try {
    signOutLoading.value = true;
    await supabase.auth.signOut();
    localStorage.clear();
    await router.push({ name: 'Index' });
  } finally {
    signOutLoading.value = false;
  }
}
</script>

<template>
  <div class="q-pl-md">
    <div class="row col-12 text-h4">Manage your account</div>
    <form class="q-gutter-md q-mt-md" @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-12">
          <Avatar v-model:path="avatarUrl" @upload="updateProfile" size="60" />
        </div>
      </div>

      <div class="row">
        <div class="col-3">
          <q-input
            id="email"
            outlined
            disabled
            :model-value="email"
            label="Email"
            readonly
            disable
          />
        </div>
        <div class="col-3 q-ml-md">
          <q-input id="name" outlined v-model="fullName" label="Full Name" />
        </div>
        <div class="col-3 q-ml-md">
          <q-input
            id="name"
            type="password"
            outlined
            v-model="password"
            label="Password"
          />
        </div>
      </div>
      <div>
        <q-btn
          type="submit"
          outlined
          color="primary"
          :loading="loading"
          label="Submit"
        />
        <q-btn
          class="q-ml-lg"
          type="button"
          outlined
          color="secondary"
          :loading="signOutLoading"
          label="Sign Out"
          @click="signOut"
        />
      </div>
    </form>
  </div>
</template>
