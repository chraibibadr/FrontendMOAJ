<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered>
      <q-toolbar>
        <q-toolbar-title> Gestion des stocks </q-toolbar-title>
        <q-btn flat round icon="person">
          <q-menu transition-show="jump-down" transition-hide="scale">
            <div class="row no-wrap q-pa-md justify-center items-center">
              <q-list class="rounded-borders text-primary">
                <q-item
                  clickable
                  v-ripple
                  :active="link === 'profile'"
                  @click="link = 'profile'"
                  to="/profile"
                  exact
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
    <q-page-container class="window-height">
      <div class="q-pa-md full-height">
        <q-card bordered>
          <q-card-section>
            <div class="row q-col-gutter-x-sm q-col-gutter-y-sm justify-center">
              <div class="col-12" v-if="role">
                <q-btn class="fit" color="blue-5" stack>
                  <q-icon size="8em" name="manage_accounts" />
                  <div>Gestion des utilisateurs</div>
                </q-btn>
              </div>
              <div
                class="col-xs-12 col-sm-6 col-md-3"
                v-if="role || permissions.includes('App1')"
              >
                <q-btn class="fit" color="blue" stack>
                  <q-icon size="8em" name="point_of_sale" />
                  <div>Programme des revenus</div>
                </q-btn>
              </div>
              <div
                class="col-xs-12 col-sm-6 col-md-3"
                v-if="role || permissions.includes('App2')"
              >
                <q-btn class="fit" color="blue" stack>
                  <q-icon size="8em" name="inventory" />
                  <div>Stock</div>
                </q-btn>
              </div>
              <div
                class="col-xs-12 col-sm-6 col-md-3"
                v-if="role || permissions.includes('App3')"
              >
                <q-btn class="fit" color="blue" stack to="property">
                  <q-icon size="8em" name="room_preferences" />
                  <div>Propriété privé/publique</div>
                </q-btn>
              </div>
              <div
                class="col-xs-12 col-sm-6 col-md-3"
                v-if="role || permissions.includes('App4')"
              >
                <q-btn class="fit" color="blue" stack to="demands">
                  <q-icon size="8em" name="desk" />
                  <div>Bureau de contrôle</div>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useIsAuthenticated } from 'stores/isAuthenticated';
import { logout } from 'boot/functions';
import { ref } from 'vue';

export default {
  name: 'AppsMenu',

  setup() {
    const store = useIsAuthenticated();
    const permissions = store.getPermissions;
    const role = store.getIsAdmin;
    const username = store.getUsername;

    return {
      username,
      permissions,
      role,
      logout,
      link: ref(null),
    };
  },
};
</script>
