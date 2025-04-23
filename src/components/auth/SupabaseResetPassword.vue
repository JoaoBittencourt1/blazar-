<script lang="ts">
import { supabase } from 'src/supabase';
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { userAuthStore } from 'stores/userAuthStore';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'SupabaseResetPassword',
  setup: () => {
    const store = userAuthStore();
    setRecoveryPasswordMode(true);
    const router = useRouter();
    const loading = ref(false);
    const password = ref('');

    function setRecoveryPasswordMode(mode: boolean) {
      store.recoverPassword = mode;
    }

    async function updateProfile() {
      try {
        loading.value = true;
        const user = store.getUser;
        const updates = {
          id: user.id,
          updated_at: new Date(),
          password: password.value,
        };

        const { data, error } = await supabase.auth.updateUser(updates);
        if (error) {
          throw error;
        }
        setRecoveryPasswordMode(false);
        Notify.create('Password updated with success!');
        store.$patch({
          user: user,
        });
        await router.push({ name: 'Index' });

        return data;
      } catch (error: any) {
        Notify.create({
          message: `Error: ${error.message}`,
          type: 'negative',
        });
      } finally {
        loading.value = false;
      }
    }
    return {
      updateProfile,
      password,
      loading,
    };
  },
});
</script>

<template>
  <q-layout
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#41b1e4, #53b799)"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-form class="q-px-sm q-pt-xl" @submit="updateProfile">
          <q-card square class="shadow-24" style="width: 300px; height: 500px">
            <q-card-section>
              <div class="text-h3 text-center">SciTARC</div>
            </q-card-section>
            <q-card-section>
              <div class="text-h6 text-center">Type your new password</div>
            </q-card-section>
            <q-card-section class="text-center" style="height: 150px">
              <q-img
                class="center"
                :img-style="{
                  borderRadius: '80px',
                  width: '150px',
                  height: '150px',
                }"
                src="~assets/images/logo.jpg"
                round
              />
            </q-card-section>
            <q-card-section class="q-mt-lg">
              <q-input
                square
                clearable
                v-model="password"
                type="password"
                label="New Password"
              >
                <template #prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions class="q-px-lg">
              <q-btn
                type="submit"
                unelevated
                size="lg"
                color="primary"
                class="full-width text-white"
                label="Update"
                :loading="loading"
                :disabled="loading"
              />
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-layout>
</template>
