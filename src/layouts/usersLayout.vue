<template >
    <q-layout view="hHh Lpr lFf" style="background-color:rgb(244,246,250) ;" >
      <q-header   style="background-color:rgb(244,246,250) ;color: grey;" >
        <q-toolbar  >
          <q-btn
            flat
            dense
            round
             bordered
            color="light-blue-9"
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
          
          <q-toolbar-title class="text-light-blue-9  text-bold text-h5 " style="font-style: italic; font-family: Georgia; margin-left: 34%;">
           Gestion Des Utilisateurs
          </q-toolbar-title>
          <q-btn  round icon="person" size="sm" color="light-blue-9">
          <q-menu transition-show="jump-down" transition-hide="scale">
            <div class="column">
              <q-list class="rounded-borders text-primary">
                <q-item
                  clickable
                  v-ripple
                  :active="link === 'inbox'"
                 :to= "'/users/profile'"
                  active-class="text-white bg-blue-9"
                >
                  <q-item-section avatar>
                    <q-icon name="manage_accounts" />
                  </q-item-section>

                  <q-item-section>Profile</q-item-section>
                </q-item>

               

                
              </q-list>

              <q-separator  />

              <div class="column q-pa-sm items-center">
                <q-avatar size="72px">
                  <img src="src/assets/profile.jpg" />
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
  
      <q-drawer
      v-model="leftDrawerOpen"
      behavior="desktop"
      show-if-above
          style="background-color:rgb(244,246,250) ;padding-top: 70px;"
          flat
          :mini="!leftDrawerOpen || miniState"
          @click.capture="drawerClick"
           
          :width="250"
          :breakpoint="500"
       
          class="  q-pl-sm  " 
     
  
  
     
        
      >
      <q-scroll-area class="fit "  >
        <q-list   class="q-py-xl q-mb-lg text-white text-bold  bg-light-blue-10"  style="border:1px transparent; border-radius: 10px">
          
         
  
          <template v-for="(menuItem, index) in essentialLinks" :key="index">
                <q-item v-if="menuItem.items?false:true"  clickable v-ripple   @click="$router.push(menuItem.link)">
                  <q-item-section  avatar>
                    <q-avatar round color="light-blue-8" style="width: 34px;" text-color="white" :icon="menuItem.icon" />
                    
                  </q-item-section>
                  <q-item-section>
                    {{ menuItem.title}}
                  
                  </q-item-section>
                </q-item>
                <q-expansion-item
                
                 v-else
              >
              <template v-slot:header>
            <q-item-section avatar>
             
                <q-avatar round color="light-blue-8" style="width: 34px;"  text-color="white" :icon="menuItem.icon" />
              
            </q-item-section>
  
            <q-item-section>
              {{ menuItem.title}}
            </q-item-section>
          </template>
          <q-card class="bg-light-blue-10 q-ml-sm">
            <q-card-section>
            
              <template v-for="(item, index) in menuItem.items" :key="index">
                <q-item  clickable  :to="item.link" active-class="text-light-blue-6">
                  <q-item-section  avatar>
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
            <q-btn
              dense
              round
              unelevated
             flat
              color="white"
              icon="chevron_left"
              @click="miniState =true"
            />
          </div>
      </q-drawer>
  
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  
  <script>

import {  defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { axios } from 'boot/axios';

  
   
  const linksList = [
    {
      title: 'Applications',
       icon: 'widgets',
       link: '/menu'
    },
   
    {
      title: 'Utilisateurs',
       icon: 'people',
      items:[{
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
      title: 'Configuration',
      icon: 'settings',
      items:[{
      title: 'Fonctions',
      icon: 'work',
      link: '/users/functions'
    },
    {
      title: 'Departements',
      icon: 'apartment',
      link: '/users/departments'
    },
   
  
  
  ],
    },
    
   
  ];
  
  export default defineComponent({
    name: 'UsersLayout',
  
    
  
    setup () {
      const leftDrawerOpen = ref(false)
      const $router = useRouter();
      const miniState = ref(true);
      const username=ref('');
    //logout function
    const logout = async () => {
      await axios.post('auth/logout', {}, { withCredentials: true });
      axios.defaults.headers.common['Authorization'] = '';
      await $router.push('/login');
    };

    onMounted(async () => {
      const { data } = await axios.post('auth/user');
       username.value = data.matricule.toUpperCase();
    });
   
      return {
        essentialLinks: linksList,
       
        
        leftDrawerOpen,
        toggleLeftDrawer () {
          leftDrawerOpen.value = !leftDrawerOpen.value
        },
        drawer: ref(false),
        miniState,
  
        drawerClick (e) {
         
          if (miniState.value) {
            miniState.value = false
  
          
            e.stopPropagation()
          }
      },
     
     $router,logout,username
    }
  }});
  </script>
  