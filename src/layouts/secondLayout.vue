<template >
  <q-layout :view="$q.screen.lt.sm && !miniState?'lHh Lpr lff':'hHh Lpr lff'"
    style="background-color:rgb(244,246,250) ;">
    <q-header style="background-color:rgb(244,246,250) ;color: grey;">
      <q-toolbar>
        <q-btn flat dense round bordered color="light-blue-9" icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-light-blue-9  text-bold text-h5 "
          style="font-style: italic; font-family: Georgia; margin-left: 34%;">
          <span v-if="($q.screen.lt.sm && miniState) || !$q.screen.lt.sm">{{ route.meta.title }}</span>
        </q-toolbar-title>
        <q-btn round icon="person" size="sm" color="light-blue-9">
          <q-menu transition-show="jump-down" transition-hide="scale">
            <div class="column">
              <q-list class="rounded-borders text-primary">
                <q-item clickable v-ripple :active="link === 'inbox'" :to="'/profile'"
                  active-class="text-white bg-blue-9">
                  <q-item-section avatar>
                    <q-icon name="manage_accounts" />
                  </q-item-section>

                  <q-item-section>Profile</q-item-section>
                </q-item>
              </q-list>

              <q-separator />

              <div class="column q-pa-sm items-center">
                <q-avatar size="72px">
                  <img src="src/assets/avatar.png" />
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

    <q-drawer v-model="leftDrawerOpen" behavior="desktop" show-if-above :overlay="$q.screen.lt.sm && !miniState"
      style="background-color:rgb(244,246,250) ;padding-top: 70px;" flat :mini="!leftDrawerOpen || miniState"
      @click.capture="drawerClick" :width="250" :breakpoint="500"
      :class="$q.screen.lt.sm && !miniState?'bg-light-blue-10 ': 'q-pl-sm '">
      <q-scroll-area class="fit" :class="$q.screen.lt.sm?'border-tp':'border-rd'">
        <q-list class="q-py-lg q-mb-xs text-white text-bold  bg-light-blue-10 border-rd">

          <template v-for="(menuItem) in essentialLinks" :key="menuItem">
            <q-item v-if="menuItem.items?false:true" clickable v-ripple :to=menuItem.link exact>
              <q-item-section avatar>
                <q-avatar round color="light-blue-8" style="width: 34px;" text-color="white" :icon="menuItem.icon" />

              </q-item-section>
              <q-item-section>
                {{ menuItem.title}}

              </q-item-section>
            </q-item>
            <q-expansion-item v-if="menuItem.items && route.path.includes(menuItem.context)">
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar round color="light-blue-8" style="width: 34px;" text-color="white" :icon="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.title}}
                </q-item-section>
              </template>
              <q-card class="bg-light-blue-10 q-ml-sm">
                <q-card-section>
                  <template v-for="(item) in menuItem.items" :key="item">
                    <q-item clickable :to="item.link" exact active-class="text-light-blue-6">
                      <q-item-section avatar>
                        <q-icon color="white" size="" text-color="white" :name="item.icon" />
                      </q-item-section>
                      <q-item-section>
                        {{ item.title}}

                      </q-item-section>
                    </q-item>
                  </template>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </template>
        </q-list>
      </q-scroll-area>
      <div class="q-mini-drawer-hide absolute" style="top: 75px; right: 5px">
        <q-btn dense round unelevated flat color="white" icon="chevron_left" @click="miniState =true" />
      </div>
      <div v-if="$q.screen.lt.sm && !miniState">
        <div class="absolute-top q-pa-md text-bold text-white text-h6"
          style=" font-style: italic;font-family: Georgia;">
          Menu
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script>

import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { axios } from 'boot/axios';
import { logout } from 'boot/functions';
import { useIsAuthenticated } from 'src/stores/isAuthenticated';



const linksList = [

  {

    title: 'Applications',
    icon: 'widgets',
    link: '/'
  },

  {
    context: 'users',
    title: 'Utilisateurs',
    icon: 'people',
    items: [{
      title: 'Ajout',
      icon: 'person_add',
      link: '/users'
    },
    {
      title: 'Liste',
      icon: 'people',
      link: '/users/list'
    },


    ],
  },

  {
    context: 'users',
    title: 'Configuration',
    icon: 'settings',
    items: [{
      title: 'Fonctions',
      icon: 'work',
      link: '/users/functions'
    },
    {
      title: 'Départements',
      icon: 'apartment',
      link: '/users/departments'
    },



    ],
  },
  {
    context: 'incomes/expends',
    title: 'Revenus',
    icon: 'money',
    items: [{
      title: 'Ajout',
      icon: 'attach_money',
      link: '/incomes/expends'
    },
    {
      title: 'Liste',
      icon: 'ballot',
      link: '/incomes/expends/incomes'
    },


    ],
  },

  {
    context: 'incomes/expends',
    title: 'Dépenses',
    icon: 'payments',
    items: [{
      title: 'Ajout',
      icon: 'monetization_on ',
      link: '/incomes/expends/c-exp'
    },
    {
      title: 'Liste',
      icon: 'ballot',
      link: '/incomes/expends/expds'
    },


    ],

  },


  {
    context: 'incomes/expends',
    title: 'Configuration',
    icon: 'settings',
    items: [{
      title: 'Types',
      icon: 'styles',
      link: '/incomes/expends/types'
    },

    ],
  },



];

export default defineComponent({
  name: 'UsersLayout',



  setup() {
    const leftDrawerOpen = ref(false)
    const route = useRoute();
    const miniState = ref(true);
    const store = useIsAuthenticated();
    const username = store.getUsername;
    //logout function
    setInterval(async () => {
      const { status, data } = await axios.post(
        'auth/refresh',
        {},
        {
          withCredentials: true,
        }
      );

      if (status === 202) {
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + data.access_token;

        console.log('SET TRUE (LAYOUT)');

        store.setIsAuthenticated(true);
      }
    }, 60000 * 14);
    return {
      essentialLinks: linksList,


      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      drawer: ref(false),
      miniState,

      drawerClick(e) {

        if (miniState.value) {
          miniState.value = false


          e.stopPropagation()
        }
      },

      route, logout, username
    }
  }
});
</script>
<style>
.border-rd {
  border-radius: 10px;
}

.border-tp {
  border-top: 2px white solid;
}
</style>
