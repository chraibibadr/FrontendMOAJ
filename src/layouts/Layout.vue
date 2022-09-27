<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ route.meta.title || 'Gestion des stocks' }}
        </q-toolbar-title>
        <q-btn flat round icon="person">
          <q-menu transition-show="jump-down" transition-hide="scale">
            <div class="row no-wrap q-pa-md justify-center items-center">
              <q-list class="rounded-borders text-primary">
                <q-item clickable v-ripple :active="link === 'profile'" @click="link = 'profile'"
                  active-class="text-white bg-blue-9">
                  <q-item-section avatar>
                    <q-icon name="manage_accounts" />
                  </q-item-section>

                  <q-item-section>Profile</q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item clickable v-ripple :active="link === 'settings'" @click="link = 'settings'"
                  active-class="text-white bg-blue-9">
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>

                  <q-item-section>Paramètres</q-item-section>
                </q-item>
              </q-list>

              <q-separator vertical inset class="q-mx-md" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                </q-avatar>

                <div class="q-mt-xs q-mb-md text-center text-weight-medium">
                  @{{ username }}
                </div>

                <q-btn color="primary" label="Déconnecter" push size="sm" v-close-popup @click="logout" />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label header> Menu </q-item-label>
          <template v-for="(menuItem, index) in linksList" :key="index">
            <q-item :to="menuItem.link" exact clickable v-ripple v-if="
              route.path.includes(menuItem.context) || menuItem.context == '/'
            ">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useIsAuthenticated } from 'src/stores/isAuthenticated';
import { logout } from 'boot/functions';
import { useRoute } from 'vue-router';
import { axios } from 'src/boot/axios';

const linksList = [
  {
    context: 'demand',
    label: 'Les demandes',
    icon: 'topic',
    link: '/demands',
    separator: false,
  },
  {
    context: 'demand',
    label: 'Configuration',
    icon: 'settings',
    link: '/demands/config',
    separator: true,
  },
  {
    context: 'property',
    label: 'Les propriétés',
    icon: 'real_estate_agent',
    link: '/property',
    separator: false,
  },
  {
    context: 'property',
    label: 'Configuration',
    icon: 'settings',
    link: '/property/config',
    separator: true,
  },
  {
    context: '/',
    label: 'Les applications',
    icon: 'widgets',
    link: '/',
    separator: false,
  },
];

export default {
  name: 'SecondLayout',
  setup() {
    const store = useIsAuthenticated();
    const username = store.getUsername;
    const route = useRoute();

    const leftDrawerOpen = ref(false);

    setInterval(async () => {
      const { status, data } = await axios.post('auth/refresh', {}, { withCredentials: true, });

      if (status === 202) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;

        console.log('SET TRUE (LAYOUT)');

        store.setIsAuthenticated(true);
      }
    }, 60000 * 14);

    return {
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer() { leftDrawerOpen.value = !leftDrawerOpen.value; },
      username,
      logout,
      link: ref(null),
      route,
    };
  },
};
</script>
