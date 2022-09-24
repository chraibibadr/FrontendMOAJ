<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Bureau de contrôle </q-toolbar-title>
        <q-btn flat round icon="person">
          <q-menu transition-show="jump-down" transition-hide="scale">
            <div class="row no-wrap q-pa-md justify-center items-center">
              <q-list class="rounded-borders text-primary">
                <q-item
                  clickable
                  v-ripple
                  :active="link === 'inbox'"
                  @click="link = 'inbox'"
                  active-class="text-white bg-blue-9"
                >
                  <q-item-section avatar>
                    <q-icon name="manage_accounts" />
                  </q-item-section>

                  <q-item-section>Profile</q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item
                  clickable
                  v-ripple
                  :active="link === 'settings'"
                  @click="link = 'settings'"
                  active-class="text-white bg-blue-9"
                >
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

                <q-btn
                  color="primary"
                  label="Déconnecter"
                  push
                  size="sm"
                  v-close-popup
                  @click="logout"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { axios } from 'boot/axios';
import { useRouter } from 'vue-router';

const linksList = [
  {
    title: 'Les demandes',
    icon: 'topic',
    link: '/demands',
  },
  {
    title: 'Configuration',
    icon: 'settings',
    link: '/demands/config',
  },
  {
    title: 'Les applications',
    icon: 'widgets',
    link: '/menu',
  },
];

export default defineComponent({
  name: 'DemandLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const username = ref(null);
    const router = useRouter();

    onMounted(async () => {
      const { data } = await axios.post('auth/user');
      username.value = data.matricule.toUpperCase();
    });

    const leftDrawerOpen = ref(false);

    //logout function
    const logout = async () => {
      await axios.post('auth/logout', {}, { withCredentials: true });
      axios.defaults.headers.common['Authorization'] = '';
      await router.push('/login');
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      mobileData: ref(true),
      bluetooth: ref(false),
      username,
      logout,
      link: ref('inbox'),
    };
  },
});
</script>
