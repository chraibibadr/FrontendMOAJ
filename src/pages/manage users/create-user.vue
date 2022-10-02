import { util } from 'webpack';

<template>
  <q-page class=" q-pa-lg ">




    <div class="row q-py-md fit justify-center items-center q-mt-xl ">


      <q-card round class="shadow-15 col-sm-12 col-md-9" style="border:1px transparent ;border-radius: 20px;">
        <q-card-section style=" background-color:rgb(244,246,250) ;  color: rgb(116,124,128) ;
                           ">
          <div class="row  justify-between">
            <div class="  q-my-sm text-bold col-10  " style="font-family:Georgia ;font-size: 16px;">Nouveau Utilsateur
            </div>
            <q-icon name="person_add" size="27px" color="light-blue-10"> </q-icon>
          </div>
        </q-card-section>
        <q-card-section class=" q-px-none">
          <q-form class="q-px-sm q-pt-xl q-pb-lg  " @submit.prevent="create">
            <div class="row q-ma-0  justify-between q-pb-lg">
              <div class="col-12 col-md-5 q-mb-lg">
                <div class="row justify-between">
                  <q-input class="  col-8 col-md-9 " standout="bg-grey text-white" disable v-model="matricule"
                    label="Matricule" />
                  <div class="col-2 col-sm-1 items-center ">
                    <q-btn @click="getMatricule()" size="12px" class="q-mt-sm " round flat>
                      <q-icon size="24px" name="autorenew" color="grey-9"></q-icon>
                    </q-btn>
                  </div>
                  <div class="col-2 items-center ">
                    <q-btn @click="copy(matricule)" size="12px" class="q-mt-sm " round flat>
                      <q-icon size="22px" name=" content_copy" color="grey-9"></q-icon>
                    </q-btn>
                  </div>


                </div>
              </div>
              <div class="col-12 col-md-5">
                <div class="row justify-between">
                  <q-input class=" col-8  col-md-9 " disable standout="bg-grey text-white" v-model="password"
                    label="Password" />
                  <div class="col-2   col-sm-1 items-center ">
                    <q-btn @click="getPassword()" size="12px" class="q-mt-sm " round flat>
                      <q-icon size="24px" name="autorenew" color="grey-9"></q-icon>
                    </q-btn>
                  </div>
                  <div class="col-2    items-center  ">
                    <q-btn @click="copy(password)" size="12px" class="q-mt-sm " round flat>
                      <q-icon size="22px" name="content_copy" color="grey-9"></q-icon>
                    </q-btn>
                  </div>
                </div>
              </div>

              <!--Role-->

            </div>
            <!--lastname && firstname-->
            <div class="row q-ma-0  justify-between q-pb-lg">
              <q-input class="  col-5 " standout="bg-grey text-white" :class="{'error':v$.firstname.$error}"
                v-model="state.firstname" label="Prenom">
                <template v-if="v$.firstname.$error" v-slot:prepend>
                  <q-icon round name="info" color="red">
                    <q-tooltip v-if="v$.firstname.required.$invalid" class="bg-red-5" :offset="[10, 10]">
                      Ce champ est important veuillez le remplire
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>

              <q-input class="  col-5 " standout="bg-grey text-white" :class="{'error':v$.lastname.$error}"
                v-model="state.lastname" label="Nom">
                <template v-if="v$.lastname.$error" v-slot:prepend>
                  <q-icon round name="info" color="red">
                    <q-tooltip v-if="v$.lastname.required.$invalid" class="bg-red-5" :offset="[10, 10]">
                      Ce champ est important veuillez le remplire
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>


            </div>

            <div class="row q-ma-0  justify-between q-pb-lg">

              <!--Email-->
              <q-input class=" col-5 self-end float-right" :class="{'error':v$.Email.$error}"
                standout="bg-grey text-white" v-model="state.Email" label="Email">
                <template v-if="v$.Email.$error" v-slot:prepend>
                  <q-icon round name="info" color="red">
                    <q-tooltip v-if="v$.Email.required.$invalid" class="bg-red-5" :offset="[10, 10]">
                      Ce champ est important veuillez le remplire
                    </q-tooltip>
                    <q-tooltip v-else class="bg-red-5" :offset="[10, 10]">
                      Email invalide
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>

              <q-input class="  col-5 " :class="{'error':v$.phone.$error}" standout="bg-grey text-white" type="tel"
                v-model="state.phone" label="Téléphone">
                <template v-if="v$.phone.$error" v-slot:prepend>
                  <q-icon round name="info" color="red">
                    <q-tooltip v-if="v$.phone.required.$invalid" class="bg-red-5" :offset="[10, 10]">
                      Ce champ est important veuillez le remplire
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>

            </div>



            <div class="row q-ma-0  justify-between q-pb-lg">

              <!--fonction-->
              <q-select class=" col-5 self-end float-right" :class="{'error':v$.fonction.$error}"
                standout="bg-grey text-white" v-model="state.fonction" option-label="name" :options="fonctions"
                label="Fonction">
                <template v-if="v$.fonction.$error" v-slot:prepend>
                  <q-icon round name="info" color="red">
                    <q-tooltip v-if="v$.fonction.required.$invalid" class="bg-red-5" :offset="[10, 10]">
                      Ce champ est important veuillez le remplire
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-select>
              <!--department-->
              <q-select class=" col-5 self-end float-right" :class="{'error':v$.department.$error}"
                standout="bg-grey text-white" v-model="state.department" option-label="name" :options="departments"
                label="Département">
                <template v-if="v$.department.$error" v-slot:prepend>
                  <q-icon round name="info" color="red">
                    <q-tooltip v-if="v$.department.required.$invalid" class="bg-red-5" :offset="[10, 10]">
                      Ce champ est important veuillez le remplire
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-select>


            </div>

            <div class="row q-ma-0  justify-between q-pb-lg">

              <!--Role-->
              <q-select class=" col-5 self-end float-right " :class="{'error':v$.role.$error}"
                standout="bg-grey text-white" :options="Roles" option-label="name" v-model="state.role" label="Role">
                <template v-if="v$.role.$error" v-slot:prepend>
                  <q-icon round name="info" color="red">
                    <q-tooltip v-if="v$.role.required.$invalid" class="bg-red-5" :offset="[10, 10]">
                      Ce champ est important veuillez le remplire
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-select>
            </div>

            <q-card-section v-show="show" class="q-ma-xs ">
              <fieldset class=" q-pa-md shadow-2 " :class="{'fieldsetError':validatePermissions() && iscliked}">
                <legend class="text-h6" style="font-family:Georgia ;color: grey;"
                  :class="{'text-red-5':validatePermissions() && iscliked}">Permissions</legend>
                <div v-if="validatePermissions() && iscliked" class="absolute-top-right q-pa-lg"
                  style="transform: translateY(15%);">

                  <q-icon round name="info" size="22px" color="red">
                    <q-tooltip class="bg-red-5" :offset="[10, 10]">
                      Vous devez accorder des permissions aux utlisateurs
                    </q-tooltip>
                  </q-icon>

                </div>
                <div class=" row  justify-between ">

                  <div class="col-12 col-md-5 ">
                    <div class="row  q-mb-lg">
                      <label for="" class="col-4 q-pa-md text-subtitle2 text-grey-6">Stock</label>
                      <q-select class=" col-8 " standout="bg-grey text-white" v-model="stock" option-label="name"
                        :options="Permission" label="Permissions" />
                    </div>


                    <div class="row q-mb-lg ">
                      <label class="col-4  text-subtitle2 text-grey-6">Programme de revenus</label>
                      <q-select class=" col-8" standout="bg-grey text-white" v-model="prgRevenus" option-label="name"
                        :options="Permission" label="Permissions" />
                    </div>
                  </div>
                  <div class="col-12 col-md-5">
                    <div class="row q-mb-lg">
                      <label for="" class="col-4  text-subtitle2 text-grey-6">Bureau de contrôle</label>
                      <q-select class=" col-8 " standout="bg-grey text-white" v-model="BDC" option-label="name"
                        :options="Permission" label="Permissions" />
                    </div>
                    <div class="row q-mb-lg">
                      <label for="" class="col-4 text-subtitle2 text-grey-6">Proprieté privé public</label>
                      <q-select class=" col-8 " standout="bg-grey text-white" v-model="PPP" option-label="name"
                        :options="Permission" label="Permissions" />
                    </div>
                  </div>
                </div>

              </fieldset>
            </q-card-section>

            <div class="row  justify-evenly  ">
              <q-btn class="col-5 col-sm-3 col-md-2 text-bold " @click="reset()" type="button" outline
                color="light-blue-9" label="Annuler" />
              <q-btn class="col-5 col-sm-3 col-md-2 bg-light-blue-10 " color="wight" type="submit" label="Ajouter" />
            </div>
          </q-form>
        </q-card-section>

      </q-card>
    </div>
    <div class="q-pa-md">

    </div>
  </q-page>
</template>



<style>

</style>
 
<script>
import { ref, watch } from 'vue';
import { getAll, createObject, } from '../../util/methods';
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const Roles = [{ value: 'admin', name: 'Administrateur' }, { value: 'user', name: 'Utilisateur' }];
    const Permission = [{ value: true, name: 'autorisé' }, { value: false, name: 'non autorisé' }];
    const state = ref({
      firstname: '',
      lastname: '',
      fonction: '',
      department: '',
      Email: '',
      role: '',
      phone: ''

    });
    var matricule = ref('');
    const password = ref('');
    const passwordLength = 10;
    const matriculeLengthP1 = 2;
    const matriculeLengthP2 = 6;
    const charsPass = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+?><:{}[]';
    const charsMatP1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charsMatP2 = '1234567890';
    const show = ref(false);
    const iscliked = ref(false);
    const stock = ref('');
    const prgRevenus = ref('');
    const BDC = ref('');
    const PPP = ref('');
    const permissions = [];
    const $q = useQuasar();

    /********Interaction with DB******** */
    //get from db    
    const fonctions = ref([]);
    const departments = ref([]);
    async function getData(url) {
      await getAll(url).then((res) => {
        if (url == 'functions/get') fonctions.value = res.data;
        else departments.value = res.data;

      });
    }
    getData('functions/get');
    getData('departments/get');




    // create
    const create = function () {
      iscliked.value = true;
      v$.value.$validate();
      if (!v$.value.$error && !validatePermissions()) {

        const postData = {
          matricule: matricule.value,
          firstname: state.value.firstname,
          lastname: state.value.lastname,
          password: password.value,
          email: state.value.Email,
          function: state.value.fonction,
          department: state.value.department,
          phone: state.value.phone,
          role: state.value.role.value
        };
        if (postData.role == 'user') Object.assign(postData, { permissions: permissions });
        createObject('users', postData).then((res) => {
          if (res.status == 201) {
            iscliked.value = false;
            reset();

            $q.notify({
              message: 'Utilisateur crée avec succés',
              color: 'light-blue-10',
              icon: 'done',
              position: 'top',
              badgeClass: ' bg-light-blue-8'
            });
          }
          else {
            $q.notify({
              message: 'Une erreur a été survenue lors de la transmition ,' +
                'Régénérez un matricule,et saisissez un E-mail valide ',
              color: 'red-5',
              icon: 'gpp_bad',
              position: 'top',

            });
          }

        });

      }


    }

    // helping functions
    //generate password

    function getPassword() {
      var generatedPassword = '';
      for (var i = 0; i < passwordLength; i++) {
        generatedPassword += charsPass.charAt(Math.floor(Math.random() * charsPass.length));
      }
      password.value = generatedPassword;
    }
    getPassword();
    // generate matricule
    function getMatricule() {
      var generatedMatriculeP1 = '';
      var generatedMatriculeP2 = '';
      for (var i = 0; i < matriculeLengthP1; i++) {
        generatedMatriculeP1 += charsMatP1.charAt(Math.floor(Math.random() * charsMatP1.length));
      }
      for (var i = 0; i < matriculeLengthP2; i++) {
        generatedMatriculeP2 += charsMatP2.charAt(Math.floor(Math.random() * charsMatP2.length));
      }
      matricule.value = generatedMatriculeP1 + ' ' + generatedMatriculeP2;
    }
    getMatricule();
    // copy
    function copy(str) {
      navigator.clipboard.writeText(str);
    }

    // reset 
    function reset() {
      state.value.firstname = '';
      state.value.lastname = '';
      state.value.Email = '';
      state.value.phone = '';
      state.value.department = '';
      state.value.fonction = '';
      state.value.role = '';
      stock.value = '';
      PPP.value = '';
      prgRevenus.value = '';
      BDC.value = '';
      show.value = false;
      permissions.splice(0, permissions.length);
      v$.value.$reset();
      getMatricule();
      getPassword();


    }
    // validation
    const rules = {
      firstname: { required },
      lastname: { required },
      fonction: { required },
      department: { required },
      Email: { required, email },
      role: { required },
      phone: { required },

    }
    const v$ = useVuelidate(rules, state);

    function validatePermissions() {
      return (state.value.role.value == 'user' && permissions.length === 0)
    }



    // watch
    watch(state.value, function (v) {
      if (v.role.value == 'user') {
        show.value = true;
        if (iscliked.value) iscliked.value = false;
      }
      else show.value = false;
    })
    watch([stock, prgRevenus, BDC, PPP], function (v) {
      if (v[0].value && !permissions.includes('App1')) permissions.push('App1');
      else if (!v[0].value && permissions.includes('App1')) permissions.splice('App1', 1);

      if (v[1].value && !permissions.includes('App2')) permissions.push('App2');
      else if (!v[1].value && permissions.includes('App2')) permissions.splice('App2', 1);

      if (v[2].value && !permissions.includes('App3')) permissions.push('App3');
      else if (!v[2].value && permissions.includes('App3')) permissions.splice('App3', 1);

      if (v[3].value && !permissions.includes('App4')) permissions.push('App4');
      else if (!v[3].value && permissions.includes('App4')) permissions.splice('App4', 1);
    },

    )






    // return
    return {
      create, validatePermissions, getPassword, getMatricule,
      matricule, PPP, iscliked, copy, reset,
      password, Roles, state, v$,
      Permission, departments,
      show, stock, prgRevenus, BDC, fonctions,

    }
  }


}

</script>
<style>
.error {
  outline: 2px solid red;
  border-radius: 3px;
}

fieldset {
  border: 2px solid #dcdcdc;
  border-radius: 3px;
}

legend {
  color: #a9a9a9;
}

.fieldsetError {
  border-color: red;

}
</style>