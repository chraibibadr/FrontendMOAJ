

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
  <q-page-container  class="q-pa-sm">
        
          
    <div class="row q-py-md fit  q-mt-md justify-between " style="border:2px solid transparent ;border-radius: 10px;">
     
      
      <div round class=" col-12 col-sm-4 "  >
    <div class="row q-pa-sm justify-center"> 
      <q-avatar size="130px" font-size="85px" color="light-blue-10" text-color="white" icon="person" />
     </div>
      <div  class="row justify-center"  style="font-size: 11px;"  >
      <p v-if="isAdmin" class="text text-bold">
        Administrateur
      </p>
      <p v-else class=" text text-bold">
       Utilisateur
      </p>
       </div> 
       <div  class="row justify-center"  style="font-size: 16px;"><p class="text-weight-medium text">{{state.email}}</p></div>   
        <div class="row justify-center q-ml-xl"><q-icon name="work" class="col-2 " size="xs" color="light-blue-10"/>  
          <p class="text-weight-medium text col-6 q-mt-md "  style="font-size: 16px;">{{state.function.name}}</p>
        </div>
        <div  class="row justify-center q-ml-xl"><q-icon name="apartment"  class="col-2 " size="xs" color="light-blue-10" /> 
         <p class="text-weight-medium text col-6 q-mt-md " style="font-size: 16px;">{{state.department.name}}</p></div>
        <div  class="row justify-center q-ml-xl">
        <q-icon class="col-2 " size="xs" color="light-blue-10" name="phone" /> 
         <p  class="text-weight-medium text col-6 q-mt-md "  style="font-size: 16px;">{{state.phone}}</p>
        </div>

      </div>
      
        <q-card round class="shadow-12 col-12 col-sm-6 "  style="border-radius: 20px;height: 50%;">
          <q-card-section class=" " style=" background-color:rgb(244,246,250) ;  color: rgb(116,124,128) ;
                           ">
            <div class="row  justify-between">
                  <div class="  q-my-sm text-bold col-10  " style="font-family:Georgia ;font-size: 16px;">Infos </div>
                  <q-icon name="info" color="light-blue-10"  size="27px" > </q-icon>
            </div>  </q-card-section>
          <q-card-section class=" q-mt-xs q-px-none" >
            <div class=" q-pt-xl q-pb-lg  "  >
              <div class="row  q-ml-sm  q-pb-sm"> 
                <label class=" text">Matricule</label>  
               </div>
        
              <div class="row q-ml-sm    q-pb-lg">
                <div class="col-11" >
               <q-input dense  class="text-bold " standout="bg-grey text-white" readonly v-model="state.matricule"  />
              </div>    
              </div>
              <div class="q-ml-sm row q-pb-sm"> 
                <label class=" text">Nom</label>  
               </div>
               <div class="row q-ml-sm q-pb-lg">
               <q-input class="  col-11 " standout="bg-grey text-white" dense readonly   v-model="state.lastname" label="Prenom">
               </q-input>
               </div>

              <div class="q-ml-sm row q-pb-sm"> 
                <label class=" text">Prénom</label>  
               </div>
               <div class="row q-ml-sm q-pb-lg">
               <q-input class="  col-11 " standout="bg-grey text-white" dense readonly   v-model="state.firstname" label="Prenom">
               </q-input>
               </div>
            
            </div>
            <div class="row  justify-end q-mr-sm ">
                          <q-btn class="bg-light-blue-10 " @click="toUpdatePass" color="white"  no-caps  type="submit" label="Mot de passe" icon-right="key" />
                 </div>
          </q-card-section>
          
        </q-card>
        <div class="col-0 col-md-2"></div>
       
    </div>
   
  </q-page-container>
</q-layout>
</template>



<style>
</style>
 
<script>
import {ref,} from 'vue';
import { useRouter } from 'vue-router';
import{axios} from 'boot/axios';
import { useIsAuthenticated } from 'src/stores/isAuthenticated';
import { logout } from 'boot/functions';

    export default{
      setup(){
        const store = useIsAuthenticated();
        const username = store.getUsername;
        const $router = useRouter();
      const state=ref({
        matricule:'',
        firstname:'',
         lastname:'',
         function:'',
         department:'',
         email:'',
         role:'',
         phone:''
       
      });
     
    
/********Interaction with DB******** */
//get from DB   

    async function getInfoUser() {
     await axios.post('auth/user').then((res)=>{
             state.value=res.data;
       
    });
  }
  getInfoUser();
  
      function  toUpdatePass(){
                               $router.push({ path: 'password' });
                                 }
     
    
  // return
      return {
       state,
       isAdmin:store.isAdmin,
       toUpdatePass,
       username,
       logout,
      link: ref(null),
    
      }
      }

     
}

</script>
<style>
   .text{
    font-family:Georgia ;
   }

</style>