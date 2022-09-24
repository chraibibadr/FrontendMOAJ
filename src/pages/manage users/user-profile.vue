

<template>
  <q-page class=" q-pa-lg justify-center " >
        
          
    <div class="row q-py-md fit  q-mt-md justify-between " style="border:2px solid transparent ;border-radius: 10px;">
     
 
      <div round class=" col-12 col-sm-4  "  >
    <div class="row q-pa-sm justify-center">  <q-img src="../../assets/profile.jpg"   style="height: 140px; max-width: 150px"/></div>
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
      
        <q-card round class="shadow-15 col-12 col-sm-4 "  style="border:1px solid transparent ;border-radius: 20px;height: 50%;">
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
   
  </q-page>
</template>



<style>
</style>
 
<script>
import {ref,} from 'vue';
import { useRouter } from 'vue-router';
import{axios} from 'boot/axios';


    export default{
      setup(){
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
//get from db    

    async function getInfoUser() {
     await axios.post('auth/user').then((res)=>{
             state.value=res.data;
       
    });
  }
  getInfoUser();
  
  function    toUpdatePass(){
                               $router.push({ path: '/users/password/' });
                                 }
     
    
  // return
      return {
       state,
       toUpdatePass
      }
      }

     
}

</script>
<style>
   .text{
    font-family:Georgia ;
   }

</style>