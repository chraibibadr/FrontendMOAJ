<template>
<q-page class="row justify-center items-center" >
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
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
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
               <q-input class=" col-12"   :type="isPwdC ? 'password' : 'text'"  standout="bg-grey text-white" :class="{'error':v$.confPass.$error}"  v-model="state.confPass" label="Confirmer le nouveau mot de passe" >
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
                {{v$.confPass.$errors[0].$message}}
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
  </q-page>
</template>
<script>
import useVuelidate from '@vuelidate/core';
import { updateObject,verifyPassword } from 'src/util/methods';
import { computed, ref } from 'vue';
import { required,minLength, sameAs} from '@vuelidate/validators';
import { useQuasar } from 'quasar';

   export default{
      setup(){
        const state=ref({
            pass:'',
           newPass:'',
           confPass:''
        });
        var iscliked=false;
        const $q = useQuasar();
       
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
 var verifyPass=ref(true);
        async function passIsMatching(){
            v$.value.$validate();
             console.log(state.value.confPass);
             console.log(v$);
            if(iscliked && !v$.value.pass.$error)
          {  await verifyPassword('62f3aae9a49b597ea2c5438f',state.value.pass).then((res)=>{
       
            verifyPass.value= res.data;});
        }}


// interaction with db
      const update=async function(){
        iscliked=true;
       await  passIsMatching();
        if(!v$.value.$error && verifyPass){
            updateObject('users',{password:state.value.pass},'62f3aae9a49b597ea2c5438f').then((res)=>{
         if(res.status==201){
           iscliked=false;
            $q.notify({
                                       message:'Mot de pass a été  rénitialiser avec succés',
                                         color: 'light-blue-10',
                                         icon: 'done',
                                         position:'top',
                                         badgeClass: ' bg-light-blue-8'
                 });
               
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

        return{state,v$,update,verifyPass, isPwd:ref(true),isPwdC:ref(true)}
      }}
</script>
<style>
    .error{
  outline: 2px solid red;
  border-radius: 3px;
}
</style>