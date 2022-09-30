<template>
   <q-layout view="hHh lpR fFf" style="background-color:rgb(244,246,250) ;">
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
                  to="users/profile"
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
  <q-page-container class=" q-pa-lg justify-center " >

    <div class="row q-pa-lg fit justify-center items-center " >
     
        <q-card round class="shadow-15 col-4  "  style="border:1px transparent ;border-radius: 20px;">
          <q-card-section  style=" background-color:rgb(244,246,250) ;  color: rgb(116,124,128) ;
                           ">
            <div class="row  justify-between">
                  <div class="  q-my-sm  col-10 text-bold  " style="font-family:Georgia ;font-size: 16px;">Nouveau mot de passe</div>
                  <q-icon class="col-2" name="key" size="22px" color="light-blue-10"/>
            </div>
          </q-card-section>
          <q-separator  />
          <q-card-section class="" >
            <q-form class=" q-py-lg  " @submit.prevent="update"  >
              <div class="row q-ma-0  justify-center q-pb-lg">
                <q-input class="  col-12 "  standout="bg-grey text-white" :class="{'error':v$.pass.$error || !verifyPass}" v-model="state.pass" label="Mot de passe actuel" >
             <template  v-if="v$.pass.$error || !verifyPass"   v-slot:prepend>
               <q-icon round   name="info" color="red" >
               <q-tooltip v-if="v$.pass.$error" class="bg-red-5"  :offset="[10, 10]">
                Ce champ est important veuillez le remplire
               </q-tooltip>
               <q-tooltip  v-else-if=" !verifyPass" class="bg-red-5"  :offset="[10, 10]">
                Ancien mot de passe est incorrecte
               </q-tooltip>
               </q-icon>
               </template>
                </q-input>
              </div>
               <div class="row q-ma-0   justify-center q-pb-lg">

               <q-input class=" col-12  "  :type="isPwdC ? 'password' : 'text'" standout="bg-grey text-white" :class="{'error':v$.newPass.$error}" v-model="state.newPass"  label="Nouveau mot de passe" >
                <template v-slot:append>
                  <q-icon
                    :name="isPwdC ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdC = !isPwdC"
                  />
                </template>
                <template  v-if="v$.newPass.$error"   v-slot:prepend>
               <q-icon round  name="info" color="red" >
               <q-tooltip v-if="v$.newPass.required.$invalid" class="bg-red-5"  :offset="[10, 10]">
                Ce champ est important veuillez le remplire
               </q-tooltip>
               <q-tooltip  v-else-if="v$.newPass.minLength.$invalid" class="bg-red-5"  :offset="[10, 10]">
               Le mot de passe doit contenir au minimum  8 caractéres
               </q-tooltip>
               <q-tooltip  v-else-if="v$.newPass.differentFromPass.$invalid" class="bg-red-5"  :offset="[10, 10]">
               Saisissez un mot de passe different de l'ancien
               </q-tooltip>
               <q-tooltip  v-else class="bg-red-5"  :offset="[10, 10]">
                Mot de passe doit contenir des lettres  majiscule, <br/>miniscule,des nombres et des caractére speciaux
               </q-tooltip>
               </q-icon>
               </template>
               </q-input>

               </div>

               <div class="row q-ma-0  justify-center q-pb-lg">
               <q-input class=" col-12"   :type="isPwd? 'password' : 'text'"  standout="bg-grey text-white" :class="{'error':v$.confPass.$error}"  v-model="state.confPass" label="Confirmer le nouveau mot de passe" >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
                <template  v-if="v$.confPass.$error"   v-slot:prepend>
               <q-icon round   name="info" color="red" >
               <q-tooltip v-if="v$.confPass.required.$invalid" class="bg-red-5"  :offset="[10, 10]">
                Ce champ est important veuillez le remplire
               </q-tooltip>
               <q-tooltip  v-else class="bg-red-5"  :offset="[10, 10]">
                Les mots de passe sont differents
               </q-tooltip>
               </q-icon>
               </template>
               </q-input> 

               
          
               </div>
                 <div class="row  justify-center ">
                          <q-btn class="col-12 bg-light-blue-10 "  color="wight"  type="submit" label="Rénistialiser" />
                 </div>
            </q-form>
          </q-card-section>

        </q-card>
    </div>
    <div class="q-pa-md">
   
      </div>
  </q-page-container>
</q-layout>
</template>
<script>
import useVuelidate from '@vuelidate/core';
import { updateObject,verifyPassword } from 'src/util/methods';
import { computed, ref } from 'vue';
import { required,minLength, sameAs} from '@vuelidate/validators';
import { useQuasar } from 'quasar';
import { useIsAuthenticated } from 'src/stores/isAuthenticated';
import { logout } from 'boot/functions';
   export default{
      setup(){
        
       const verifyPass=ref(true);
        const state=ref({
            pass:'',
           newPass:'',
           confPass:''
        });
        var iscliked=false;
        const $q = useQuasar();
        const store = useIsAuthenticated();
        const username = store.getUsername;
      // validation
        const rules = computed(() => {
            return {
                pass:{required},
                newPass:{required,minLength: minLength(8),differentFromPass:function(){
                    return state.value.newPass!= state.value.pass
                },valid: function(value) {
                                 const containsUppercase = /[A-Z]/.test(value)
                                    const containsLowercase = /[a-z]/.test(value)
                                    const containsNumber = /[0-9]/.test(value)
                                    const containsSpecial = /[#?!@$%^&*-]/.test(value)
                                    return containsUppercase && containsLowercase && containsNumber && containsSpecial
                },},
                confPass:{required, sameAsPassword:sameAs(state.value.newPass) },
                    
                    }
                }); 
                
                const v$=useVuelidate(rules, state);
        async function passIsMatching(){
            v$.value.$validate();
            if(iscliked && !v$.value.pass.$error)
          {  await verifyPassword(store.id,state.value.pass).then((res)=>{
       
            verifyPass.value= res.data;});
        }}


/********************interaction with DB******************************* */
      const update=async function(){
        iscliked=true;
       await  passIsMatching();
        if(!v$.value.$error && verifyPass){
        
            updateObject('users',{password:state.value.newPass},store.id).then((res)=>{
         if(res.status==201){
           iscliked=false;
            $q.notify({
                                       message:'Mot de pass a été  rénitialiser avec succés',
                                         color: 'light-blue-10',
                                         icon: 'done',
                                         position:'top',
                                         badgeClass: ' bg-light-blue-8'
                 });
               reset();
          } 
          else{
            $q.notify({
                                   message: 'Une erreur a été survenue lors de la transmition ',
                                     color: 'red-5',
                                     icon: 'gpp_bad',
                                      position:'top'
                   });
          }
                        })
      
        }

      }
    // reset
      function reset(){
    state.value.pass='';
    state.value.newPass='';
    state.value.confPass='';
   v$.value.$reset();
  }

      // return
        return{state,v$,update,verifyPass, isPwd:ref(true),isPwdC:ref(true),username,
       logout, link: ref(null),}
      }}
</script>
<style>
    .error{
  outline: 2px solid red;
  border-radius: 3px;
}
</style>