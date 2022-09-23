import { defineStore } from 'pinia';
import { axios } from 'src/boot/axios';

export const useIsAuthenticated = defineStore('isAuthenticated', {
  state: () => ({
    isAuthenticated: false,
    isAdmin: false,
    permissions: ['', ''],
    username: '',
  }),

  getters: {
    getIsAuthenticated(state) {
      return state.isAuthenticated;
    },
    getIsAdmin(state) {
      return state.isAdmin;
    },
    getUsername(state) {
      return state.username;
    },
    getPermissions(state) {
      return state.permissions;
    },
  },

  actions: {
    setIsAuthenticated(remplacement: boolean) {
      this.isAuthenticated = remplacement;
    },
    setUsername(remplacement: string) {
      this.username = remplacement;
    },
    async loadData() {
      const { data } = await axios.post('auth/user');
      if (data === undefined) this.isAuthenticated = false;
      else {
        this.isAuthenticated = true;
        this.username = data['matricule'];
        this.isAdmin = data['role'] == 'admin';
        this.permissions = data['permissions'];
      }
    },
  },
});
