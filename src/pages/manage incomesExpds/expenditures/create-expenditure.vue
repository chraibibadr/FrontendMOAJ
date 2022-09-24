<template>
    <q-page class="row justify-center items-center" >
        <div class="row q-pa-lg fit justify-center items-center " >
         
            <q-card round class="shadow-15 col-9  "  style="border:1px transparent ;border-radius: 20px;">
              <q-card-section style=" background-color:rgb(244,246,250) ;  color: rgb(116,124,128) ;
                               ">
                <div class="row  justify-between">
                      <div class="  q-my-sm  col-10 text-bold  " style="font-family:Georgia ;font-size: 16px;">Nouvelle Depense</div>
                      <q-icon color="light-blue-10" name="monetization_on" size="30px" />
                </div>
              </q-card-section>
              <q-separator  />
              <q-card-section>
                <q-form class=" q-py-lg  "  @submit.prevent="create"  >
                  <div class="row q-ma-0  justify-between q-pb-lg">
                
                    <q-input class="col-5" filled v-model="state.dateE" tandout="bg-grey text-white" :class="{'error':v$.dateE.$error}">
                      <template  v-slot:prepend >
                            <q-icon   v-if="v$.dateE.$error" round  name="info" color="red" >
                            <q-tooltip  class="bg-red-5"  :offset="[10, 10]">
                                Ce champ est important veuillez le remplire(date et heure)
                            </q-tooltip>
                            </q-icon>
                            <q-icon v-else-if="!v$.dateE.$error" name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="state.dateE" mask="YYYY-MM-DD HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Fermer" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
       
                    </template>

                      <template v-slot:append>
                        <q-icon   name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="state.dateE" mask="YYYY-MM-DD HH:mm">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Fermer" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                        
                      </template>
                    </q-input>
                    <q-input class="  col-5" v-model="state.amountE" standout="bg-grey text-white" :class="{'error':v$.amountE.$error}"  label="Montant">
                     
                        <template v-if="v$.amountE.$error"   v-slot:prepend>
                        <q-icon round  name="info" color="red" >
                        <q-tooltip  v-if="v$.amountE.required.$invalid" class="bg-red-5"  :offset="[10, 10]">
                            Ce champ est important veuillez le remplire
                        </q-tooltip>
                        </q-icon>
                      </template>
                   </q-input>
                  </div>
                   <div class="row q-ma-0   q-pb-lg">
    
                   <q-select class=" col-5  "  standout="bg-grey text-white"  v-model="state.typeE" 
                    label="Type"  :class="{'error':v$.typeE.$error}"
                    :options="types"
                    option-label="name"
                     >
                    <template v-if="v$.typeE.$error"   v-slot:prepend>
                        <q-icon round   name="info" color="red" >
                        <q-tooltip  v-if="v$.typeE.required.$invalid" class="bg-red-5"  :offset="[10, 10]">
                            Ce champ est important veuillez le remplire
                        </q-tooltip>
                        </q-icon>
                    </template>
                     </q-select>
    
                     </div>
                   <div class="row  justify-evenly q-mt-md justify-end">
                          <q-btn class="col-2 text-bold " @click="reset()" type="button"  outline  color="light-blue-10" label="Annuler" />
                          <q-btn class="col-2 bg-light-blue-10 "  color="wight"  type="submit" label="Ajouter" />
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
import { useQuasar } from 'quasar';
import { createObject, getAll } from 'src/util/methods';
import { required} from '@vuelidate/validators';
import { ref } from 'vue';

           export default{
      setup(){
           
        const types=ref([]);
        const state=ref({
        amountE:'',
        dateE:'',
        typeE:'',
       });
       const $q = useQuasar();

/*******************interaction with db********************************* */
   async function getData(url) {
           await getAll(url).then((res)=>{
        
           types.value = res.data
            
       
    });}

    getData('types/get')
  
       const create=function(){
       
        v$.value.$validate();
        if(!v$.value.$error){
          const array=state.value.dateE.split(' ');
          state.value.dateE=array[0]+'Z'+array[1];
            createObject('expenditures',state.value).then((res)=>{
          if(res.status==201){
             reset();
          
            $q.notify({
                                       message:'Une dépense a été rajouter avec succés',
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


      // validation
     const rules = {
     amountE: { required }, 
      dateE: { required },
     typeE:{required} ,
    
    }
     const v$ = useVuelidate(rules, state);
    
     //helping function
     function reset(){
    state.value.dateE='';
    state.value.amountE='';
    state.value.typeE='';
   
    v$.value.$reset();
  
    
    
  }
     return{v$,state,types,create,reset}
    }
}
    </script>

    <style>
        .error{
      outline: 2px solid red;
     border-radius: 3px;
       }
    </style>