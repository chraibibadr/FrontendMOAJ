<template>
    <q-page class=" q-pa-lg justify-center items-center">
        <div class="q-pa-lg">    
            <div class="row q-my-md ">
                <div class="col-6   "  >
                    <q-btn
                 
                color="grey-5"
                rounded
                icon-right="history"
                label="Historique "
                no-caps
                @click="historique"
                />
                </div>
                <div class="col-6 ">
                    <q-btn
                  class="float-right"
                color="light-blue-9"
                @click="excelParser"
                rounded
                icon-right="archive"
                label="Exporter "
                no-caps
   
                />
                </div>
            </div>
        <q-table
        style="border:1px transparent ;border-radius: 20px;"
                    :rows="rows"
                    :columns="columns"
                    separator='none'
                    v-model:pagination="pagination"
                    :loading="loading"
                    rounded
                    :filter="filter"
                    class="q-py-lg  shadow-5"
                   @request="handleRequest"
                    ref="table"
                    hide-pagination
                    no-data-label="rien n'est trouvé"
                    no-results-label="Le filtre n’a révélé aucun résultat "
                   >
                   <template v-slot:loading>
                        <q-inner-loading showing color="primary" />
                    </template>
            <template v-slot:top> 
             <q-input v-if="type=='text'" class="col-6" dense densdebounce="300"  v-model="filter" placeholder="Recherche" rounded outlined color="light-blue-9">
                <template v-slot:prepend>
                    <q-icon name="search"  color="grey-5"/>
                </template>
                </q-input>
                <q-input v-else class="col-6" dense densdebounce="300"  type="date" v-model="filter" placeholder="Recherche" rounded outlined color="light-blue-9">
                <template v-slot:prepend>
                    <q-icon name="search"  color="grey-5"/>
                </template>
                </q-input>
                <q-space />
                       <q-select class="col-4 " :popup-content-style="{ color: 'grey' }"  color="light-blue-9"
                       chips-color="yellow"
                       rounded outlined dense v-model="filterBy" 
                       :options="options"    
                        :display-value="`filtrer par: ${filterBy ?  filterBy.name: '*none*'}`" 
                       option-label="name"
                       
                       
                       />       
                       <q-space />
                       <div class=" flex flex-center justify-between">
                      
                    <q-pagination
                        v-model="pagination.page"
                      
                        :max="pagesNumber"
                        size="sm"
                        direction-links
                        :max-pages="5"
                        color="grey-6"
                        active-color="light-blue-9"
                        @update:model-value="() => $refs.table.requestServerInteraction()"
                    />
                        </div>
                    </template>
                    
                        <template v-slot:header="props" >
                        <q-tr :props="props" >
                        <q-th
                            v-for="col in props.cols"
                            :key="col.name" 
                             :props="props"
                             @click="sortByColumn(col.name)"
                            :class="{'hidden':(col.name=='_id' ||col.name=='totalI' ||col.name=='totalGNet')}"
                            style="font-family:Georgia; font-weight: bold;
                            background-color:rgb(244,246,250) ;
                            color: rgb(116,124,128) ;"    
                        >
                        {{ col.label }} 
                      
                        <span v-if="
                        sortColumn == col.name && col.name=='amountE'" class="material-icons cursor-pointer">{{arrowIconName}}</span>
                        <span v-else-if="col.name=='amountE'" class="material-icons cursor-pointer">sort</span>
                        </q-th>
                        </q-tr>
                        
                       
                    </template>
                    <template v-slot:body="props" >
                     
                        <q-tr v-for="row in props.row.incomes" :key="row"  :props="props"   class="q-ma-lg text-grey-6 text"  >
                           
                            <q-td key="dateE"   :props="props">
                            {{row.date}}
                            </q-td>
                            <q-td key="type"   :props="props">
                            {{row.type[0].name}}
                            </q-td>
                            <q-td key="amountE" class=" text-bold "  :props="props">
                            <span class="q-mr-md"> </span>
                            <span> {{row.amountE}}</span>
                            </q-td>
                           <q-td key="action"   :props="props">
                            <q-btn  size="15px" class="q-mt-sm " round flat   >
                            <q-icon  name="edit" color="grey-5" @click="toUpdate(row._id)" /> </q-btn>
                            <q-btn  size="15px" class="q-mt-sm " round flat  @click="idOfRow(row._id),confirm  = true" >
                            <q-icon  name="delete" color="grey-5"/> </q-btn>
                            </q-td>
                           </q-tr>
                        
                            <q-tr :props="props" class="q-ma-lg text-grey-6 text"   >
                            <q-td></q-td>
                            <q-td></q-td>
                           <q-td key="totalE"   :props="props">
                            <span class="text-green text-bold q-mr-lg">Total </span> 
                            <span class="text-black text-bold"> {{props.row.totalE}}</span> 
                            </q-td>
                            </q-tr>
                            
                           </template>
                           <template v-slot:bottom >
                           <div class="row q-pt-lg" style="margin-left: 35%;">
                            <div class="col-6"></div>
                            <span class="text-light-blue-9 text text-bold q-mr-xl q-mb-sm">Somme Des Totaux </span> 
                            <span class="text-black  text text-bold">  {{expsNet}}</span>
                            </div>
                            <div class="row " style="margin-left: 35%;">
                            <div class="col-6"></div>
                            <span class="text-light-blue-9 text text-bold q-mr-md q-mb-sm"> Date Derniere Dépense</span> 
                            <span class="text-black  text text-bold">  {{lastExp}}</span>
                            </div>
                            <div class="row " style="margin-left: 35%;">
                            <div class="col-6"></div>
                            <span class="text-light-blue-9 text text-bold q-mr-lg"> Dépenses D'Aujourd'Hui</span> 
                            <span class="text-black  text text-bold">  {{dailyExps}}</span>
                            </div>
                            
                            </template>
                            
                    </q-table>
                    
                </div>
                <q-dialog v-model="confirm" persistent>
                <q-card  >
                    <q-card-section class="row items-center">
                    <q-avatar icon="info" color="grey-4" text-color="red" />
                    <span class="q-ml-sm text-grey-6">Vous etes entrien de supprimer un revenuu.</span>
                    </q-card-section>

                    <q-card-actions align="right">
                    <q-btn  label="Cancel" color="red"  outline v-close-popup />
                    <q-btn  label="Continuer" color="grey-5" v-close-popup @click="deleteRow" />
                    </q-card-actions>
                </q-card>
                </q-dialog>
                
                </q-page>
                </template>

<script>
 import { useQuasar } from 'quasar';
import {   computed, ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import{getAll,getLastIncome,getDailyIncomes, deleteData} from '../../util/methods';
import exportFromJSON from 'export-from-json';
        const columns=[
        {
                        name: '_id',
                        classes:'hidden',
                        field: row => row._id,
                        format: val => `${val}`,
                      
                    },

                    {
                        name: 'dateE',
                        label: 'Date',
                         align: 'left',
                       
                       
                       
                    },
                    {
                        name: 'type',
                        label: 'Type',
                         align: 'left',   
                       
                    },
                    {
                        name: 'amountE',
                        label: 'Montant',
                         align: 'left',
                       
                       
                       
                    },
                    
                    {
                        name: 'totalE',
                      
                         align: 'left',
                         field: row => row.totalI,
                        format: val => `${val}`,
                       
                       
                    },
                   
                    { name: 'action',},
                   // { name: 'action',},
            
        ]
        const options=[
                        {value:'type',name:'Type'},
                        {value:'date',name:' Date '},
                        {value:'month',name:'Mois'},
                        {value:'year',name:'Année'},
                        ]

        export default{   
            setup(){
              
                const pagination = ref({
                        sortBy: 'desc',
                        descending: false,
                        page: 1,
                        rowsPerPage: 2,
                        rowsNumber:14
                        });
   
const lastExp=ref(0);
const dailyExps=ref(0);
const rows=ref([]);
const loading=ref(true);
const filter=ref('');
const filterBy=ref( {value:'type',name:'Type'});
const sortColumn = ref('_id');
const arrowIconName = ref('arrow_drop_up');
const sortDirection = ref(1);
const expsNet=ref(0);
const type=ref('text');
const $router = useRouter();
const $q=useQuasar();
const id=ref('');
var data=[];
/********************************** interaction with db************************************ */
                async  function fetchData(page,sort){
                    const originalRows=ref([]);
                  
                      await  getAll('expenditures/get',page+'/',filterBy.value.value,filter.value,sort).then(res=>{
                           
                            originalRows.value= res.data.docs;
                            pagination.value.rowsNumber=res.data.totalDocs;
                           
                            })
                        .finally(()=>{
                            loading.value=false;
                        });;
                          
                             loading.value=loading.value;  
                           
                            rows.value.splice(0, rows.value.length);
                            rows.value=originalRows.value;
                            expsNet.value=0;
                            rows.value.forEach(row => {
                            expsNet.value+=row.totalE;
                            });

                      
                    }
                      function deleteRow(){
                                deleteData('expenditures',id.value).then((res)=>{
                                if(res.status==200){
                                    $q.notify({
                                                            message: 'Revenu supprimé avec succés',
                                                            color: 'green-13',
                                                            icon: 'done',
                                                            position:'top'
                                                        });
                                    fetchData(pagination.value.page);
                                }
                                
                                }).catch(()=> {
                                    $q.notify({
                                                            message: 'Une erreur a été survenue lors de la suppression',
                                                            color: 'red-5',
                                                            icon: 'gpp_bad',
                                                            position:'top'
                                                        });
                                });
                                 }

                      getLastIncome('expenditures').then((res)=>{
                            const array=res.data[0].dateE.split('T')
                            lastExp.value=array[0]+' '+array[1].split('.')[0].split(':')[0]+':'+array[1].split('.')[0].split(':')[1];
                            }
                        ); 
                        
                       getDailyIncomes('expenditures/daily/exp').then((res)=>{
                           
                            dailyExps.value=res.data[0].amount;
                            }
                        );    
                        /****************helping functions********************* */
                          //sorting
                        const sortByColumn = (columnName) => {
                           
                            if(columnName=='amountE')
                       { 
                        sortColumn.value = columnName;
                        sortDirection.value = -1 * sortDirection.value;
                   
                        if (sortDirection.value == 1) {
                            arrowIconName.value = 'arrow_drop_up';
                          
                          fetchData(pagination.value.page,1);
                        } else {
                            arrowIconName.value = 'arrow_drop_down';
                         
                           fetchData(pagination.value.page,-1);
                        }}
                       
                        }
                        fetchData(1);
                                        const handleRequest= ()=>{
                                         fetchData(pagination.value.page);
                                      }

                                    watch(filterBy,function(v){
                                    if(v.value=='date') {
                                         type.value=v;
                                    }
                                   else type.value='text';
                                    });
                        // update
                                    function  toUpdate(id){
                                    $router.push({ path: '/u-exp/'+id });
                                 }
                        // history
                                 function historique(){
                                    $router.push({ path: '/history-e/' });
                                 }
                         //delete
                         function idOfRow(v){
                        id.value=v;
                           }
                       // exporting
                       function exportDataFromJSON(data, newFileName, fileExportType) {
                                        if (!data) return;
                                        try {
                                        const fileName = newFileName || 'exported-data';
                                        const exportType = exportFromJSON.types[fileExportType || 'xls'];
                                        exportFromJSON({ data, fileName, exportType });
                                        } catch (e) {
                                            $q.notify({
                                            message: 'Téléchargement de fichiers refusé par le navigateur...',
                                            color: 'negative',
                                            icon: 'warning'
                                        });
                                        }
                                    }
                           // to export   
                           const excelParser = () => {
                                        rows.value.forEach ((value) =>{
                                             
                                                    value.incomes.forEach((v)=>{
                                                      data.push({
                                                        'date':v.dateE,
                                                        'type':v.type[0].name,
                                                        'montant':v.amountE
                                                      })
                                                    });
                                                    data.push(
                                                  { 'total':value.totalE,'totalNet':value.totalGNet}
                                                
                                                );
                                                    });
                                
                                                    exportDataFromJSON(data,null,null)
                                                }
                                                

                        return{
                            rows,pagination,filterBy,columns,sortColumn, lastExp, dailyExps,type,
                            arrowIconName,options,filter,loading, expsNet,
                            sortByColumn,handleRequest,toUpdate,historique,deleteRow,idOfRow,excelParser,
                            confirm: ref(false),
                         pagesNumber:computed(() =>   Math.ceil(  pagination.value.rowsNumber/ pagination.value.rowsPerPage)),
                             
                        }

            }
            
            
            }
</script>
<style>
      .text{
    font-family:Georgia ;
   }
  
</style>