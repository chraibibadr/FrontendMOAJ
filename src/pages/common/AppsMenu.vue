<template>
  <div class="q-pa-md window-height window-width">
    <h4 class="text-center">Liste d'applications</h4>

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
  </div>
</template>

<script>
import { useIsAuthenticated } from 'stores/isAuthenticated';
import { storeToRefs } from 'pinia';

export default {
  name: 'AppsMenu',

  setup() {
    const store = useIsAuthenticated();
    const storeObject = storeToRefs(store);
    const permissions = storeObject.getPermissions;
    const role = storeObject.getIsAdmin;

    return {
      permissions,
      role,
    };
  },
};
</script>
