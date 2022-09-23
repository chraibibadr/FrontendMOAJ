<template>
  <div class="q-pa-md window-height">
    <div class="row justify-center full-height items-center">
      <div class="col-xs-10 col-sm-8 col-md-4">
        <q-icon
          class="text-center full-width"
          size="5em"
          color="primary"
          name="yard"
        />
        <h6 class="text-center text-primary">
          Se connecter avec votre compte.
        </h6>
        <q-form @submit.prevent="submit" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            name="email"
            label="Adresse e-mail / nom d'utilisateur"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Requis']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            name="password"
            label="Mot de passe"
            filled
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Requis']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>

            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              padding="md"
              class="full-width"
              label="SE CONNECTER"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { axios } from 'boot/axios';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useIsAuthenticated } from 'src/stores/isAuthenticated';

export default {
  name: 'LoginPage',
  setup() {
    const email = ref(null);
    const password = ref(null);
    const router = useRouter();

    const submit = async (e) => {
      const form = new FormData(e.target);

      const inputs = Object.fromEntries(form.entries());

      await axios
        .post('auth/login', inputs, {
          withCredentials: true,
        })
        .then(function (response) {
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + response.data['access_token'];
          router.push('/');
        })
        .catch(function (error) {
          //console.log('ON ERROR', error);
        });
    };

    return {
      isPwd: ref(true),
      submit,
      email,
      password,
    };
  },
};
</script>
