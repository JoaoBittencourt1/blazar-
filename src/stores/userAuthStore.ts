import { defineStore } from 'pinia';
import { User } from './userAuthStoreType';

export const userAuthStore = defineStore('auth', {
  state: (): User => ({
    user: {
      id: '',
      email: '',
      user_metadata: {
        avatar_blob: '',
        avatar_url: '',
        fullname: '',
      },
    },
    recoverPassword: false,
  }),
  getters: {
    getPasswordModeActive: (state) => state.recoverPassword,
    getUser: (state) => state.user,
  },
  persist: true,
});
