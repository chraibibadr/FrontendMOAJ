<template>
    <q-page class="  justify-center items-center">
        <div class="q-pa-lg q-mt-lg">    
            <div class="row q-my-md ">
                <div class="col-6   "  >
                    <q-btn
                color="grey-6"
                flat
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
             <q-input :type="type" class="col-6" dense densdebounce="300"  v-model="filter" placeholder="Recherche" rounded outlined color="light-blue-9">
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
                      <q-tr :props="props"   class=" row "
                      style="background-color:rgb(244,246,250) ;" >
                    <q-th
                       class="q-mt-sm "
                       style="font-family:Georgia; font-weight: bold;  color: rgb(116,124,128) ; width: 9%;">
                        Date
                     </q-th>
                    <q-th
                       class="q-mt-sm col-sm-0 "
                       style="font-family:Georgia; font-weight: bold;  
                       color: rgb(116,124,128) ;width: 60%;">      
                       Type
                    </q-th>
                    <q-th
                       class="q-mt-sm  "
                       style="font-family:Georgia; font-weight: bold;   color: rgb(116,124,128) ;">
                      <span class="float-left"   @click="sortByColumn('amount')"> Montant
                       <span v-if="sortColumn == 'amountE'" class="material-icons cursor-pointer">{{arrowIconName}}</span>
                        <span v-else class="material-icons cursor-pointer">sort</span>
                      </span>
                    </q-th>
                      </q-tr>
                      
                     
                  </template>
                   
                           
                            <template v-slot:body=props >
                   
                   <q-tr  class=" text-grey-6 text"  >
                    
                      <q-table  
                      dense
                      style="width:100%"
                     v-if="props.row==rows[0]"
                      v-model:pagination="pagination1"
                      hide-pagination
                   
                      flat
                      separator='none'
                      :rows=" rows[0].incomes"
                      :columns="columns"
                      >
                      
                      <template v-slot:header="props" >
                      <q-tr :props="props" >  
                        <q-th
                         v-for="col in props.cols"
                        :key="col.name" 
                        :props="props" 
                       class="hidden">
                       </q-th>
                       </q-tr>
                      </template>
                       <template v-slot:top><div class="q-mt-xs">
                        <q-pagination
                            v-model="pagination1.page"
                            :max="pageNumber(rows[0].incomes.length)"
                            size="sm"
                            direction-links
                            :max-pages="5"
                            color="light-blue-9"
                            outline/>
                           </div>
                          </template>
                          <template v-slot:body="props" >
                          <q-tr   :props="props"   class=" text-grey-6 text q-ma-0"  >
                            <q-td key="date"  style="width:9%;" :props="props">
                            {{props.row.date}}
                            </q-td>
                            <q-td key="type"  style="width:57%  ;"  class="content center" :props="props">
                               {{props.row.type[0].name}}
                            </q-td>
                            <q-td key="amount" style="width: ;" class=" text-bold "  :props="props">  
                               {{props.row.amount}}
                            </q-td>
                            <q-td key="action"   :props="props">
                            <q-btn  size="15px" class="q-mt-sm " round flat   >
                            <q-icon  name="edit" color="grey-5" @click="toUpdate(props.row._id)" /> </q-btn>
                            <q-btn  size="15px" class="q-mt-sm " round flat  @click="idOfRow(props.row._id),confirm  = true" >
                            <q-icon  name="delete" color="grey-5"/> </q-btn>
                            </q-td>
                           </q-tr>
                           </template>
                          </q-table>        
                          <q-tr  v-if="props.row==rows[0]"  class=" text row justify-end"   >
                           <q-td key="totalI"  class="col-4 col-xs-6 col-sm-4"  >
                            <span class="text-light-blue-8 text-bold q-mr-lg" >Total </span> 
                            <span class="text-black text-bold" > {{props.row.totalI}}</span> 
                            </q-td>
                            </q-tr>
                            <q-tr  v-if="props.row==rows[0]" class=" text row justify-end"   >
                            <q-td key="totalGNet"  class="col-4 col-xs-6 col-sm-4"  v-if="props.row==rows[0]">
                            <span class=" text-light-blue-10 text-bold q-mr-sm">Total Net</span> 
                            <span class=" text-black text-bold ">{{props.row.totalGNet}}</span> 
                            </q-td>
                            </q-tr>  
                          </q-tr>
                          <q-tr class=" text-grey-6 text"  >
                        <q-table  
                        dense
                        v-if="props.row==rows[1]"
                        v-model:pagination="pagination2"
                        hide-pagination
                        style="width: 100%;"
                        flat
                        separator='none'
                        :rows=" rows[1].incomes"
                        :columns="columns"
                        >      
                        <template v-slot:header="props" >
                          <q-tr :props="props" >  
                            <q-th
                              v-for="col in props.cols"
                            :key="col.name" 
                            :props="props"
                            class="hidden">
                            </q-th>
                            </q-tr>
                        </template>
                        <template v-slot:top>
                        <div class="q-mt-xs">
                        <q-pagination
                          v-model="pagination2.page"
                         :max="pageNumber(rows[1].incomes.length)"
                          size="sm"
                          direction-links
                          :max-pages="5"
                          color="light-blue-10"
                         outline />
                        </div>
                       </template>
                         <template v-slot:body="props" >
                          <q-tr   :props="props"   class=" text-grey-6 text"  >
                          <q-td key="date"   style="width:9%;" :props="props">
                          {{props.row.date}}
                          </q-td>
                          <q-td key="type"  style="width:60%;"  :props="props">
                          {{props.row.type[0].name}}
                          </q-td>
                          <q-td key="amount" style="" class=" text-bold "  :props="props">
                         {{props.row.amount}}
                          </q-td>
                          <q-td key="action"   :props="props">
                        <q-btn  size="15px" class="q-mt-sm " round flat   >
                        <q-icon  name="edit" color="grey-5" @click="toUpdate(props.row._id)" /> </q-btn>
                        <q-btn  size="15px" class="q-mt-sm " round flat  @click="idOfRow(props.row._id),confirm  = true" >
                        <q-icon  name="delete" color="grey-5"/> </q-btn>
                        </q-td>
                        </q-tr>
                        </template>   
                        </q-table>
                       <q-tr  v-if="props.row==rows[1]"  class="row text-grey-6 text justify-end">
                        <q-td key="totalI"  class="col-4 col-xs-6 col-sm-4">
                            <span class="text-light-blue-8 text-bold q-mr-lg">Total </span> 
                            <span class="text-black text-bold"> {{props.row.totalI}}</span> 
                            </q-td>
                            </q-tr>
                            <q-tr  v-if="props.row==rows[1]" class="justify-end text-grey-6 text row">
                            
                           <q-td key="totalGNet" class="col-4 col-xs-6 col-sm-4"   v-if="props.row==rows[1]">
                            <span class=" text-light-blue-10 text-bold q-mr-sm">Total Net</span> 
                            <span class=" text-black text-bold ">{{props.row.totalGNet}}</span> 
                            </q-td>
                            </q-tr>
                        </q-tr>
                       </template>
                           <template v-slot:bottom >
                            
                            <div class="col-8 q-pt-lg" style="padding-left: 35%;">
                              
                           <div class="row " >
                           <span class="text-light-blue-9 text text-bold col-12 col-md-5 ">Somme Des Totaux Net</span> 
                            <span class="text-black  text text-bold col-sm-2 col-6 ">  {{incomesNet}}</span>
                            
                            </div>
                            <div v-if="isclicked" class="row q-mt-sm" >
                            
                            <span  class="text-light-blue-9 text text-bold col-12 col-md-5"> Date Dernier Revenu</span> 
                            <span class="text-black text text-bold ">  {{lastIncome}}</span>
                            </div>
                            <div v-if="isclicked" class="row  q-mt-sm ">
                            
                            <span class="text-light-blue-9 text text-bold  col-12 col-md-5"> Revenu D'Aujourd'Hui</span> 
                            <span class="text-black  text text-bold ">  {{dailyIncomes}}</span>
                            </div>
                            <div v-if="isclicked"  class="row  q-mt-sm ">
                           
                            <span class="text-light-blue-9 text text-bold col-12 col-md-5  "> Revenu    </span> 
                            <span class="text-black  text text-bold ">  {{incomes}}</span>
                            </div>
                            <div v-if="isclicked"  class="row  q-mt-sm " >
                            
                            <span class="text-light-blue-9 text text-bold col-12 col-md-5  "> Revenu Net  </span> 
                            <span class="text-black  text text-bold  ">  {{incomeNet}}</span>
                            </div>
                          </div>
                          <div class="q-pt-lg">   <q-btn
                              @click="showMore"
                              padding="none"
                              size="sm"
                              color="grey-6"
                              >
                              <q-icon :name="isclicked?'remove':'add'" size="18px "></q-icon>
                            </q-btn></div>
                            </template>
                            
                    </q-table>
                    
                </div>
                <q-dialog v-model="confirm" persistent>
                <q-card class="bg-light-blue-10"  >
                    <q-card-section class="row items-center">
                    <q-avatar icon="info" color="red-2" text-color="red-7" />
                    <span class="q-ml-sm text-white">Vous etes entrin de supprimer un revenu</span>
                    </q-card-section>

                    <q-card-actions align="right">
                    <q-btn  label="Annuler" color="white"  outline v-close-popup />
                    <q-btn  label="Continuer" color="red-7" v-close-popup @click="deleteRow" />
                    </q-card-actions>
                </q-card>
                </q-dialog>
                
                </q-page>
                </template>

<script>
 import { useQuasar } from 'quasar';
import {   computed,  ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import{getAll,deleteData,getFromDB} from 'src/util/methods';
import exportFromJSON from 'export-from-json';
        const columns=[
        {
                        name: '_id',
                        classes:'hidden',
                        field: row => row._id,
                        format: val => `${val}`,
                      
                    },

                    {
                        name: 'date',
                        label: 'Date',
                         align: 'center',
                       
                       
                       
                    },
                    {
                        name: 'type',
                        label: 'Type',
                         align: 'center',   
                       
                    },
                    {
                        name: 'amount',
                        label: 'Montant',
                         align: 'left',
                       
                       
                       
                    },
                    {
                        name: 'totalGNet',
                      
                         align: 'left',
                         field: row => row.totalGNet,
                        format: val => `${val}`,
                       
                       
                    },
                    {
                        name: 'totalI',
                      
                         align: 'left',
                         field: row => row.totalI,
                        format: val => `${val}`,
                       
                       
                    },
                   
                    { name: 'action',
                       },
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

                        const pagination1 = ref({
                      
                      descending: false,
                      page: 1,
                      rowsPerPage: 5,
                     
                      });

                      const pagination2 = ref({
                      
                      descending: false,
                      page: 1,
                      rowsPerPage: 5,
                      
                      });
   
const lastIncome=ref(0);
const dailyIncomes=ref(0);
const incomeNet=ref(0);
const incomesNet=ref(0);
const incomes=ref(0);
const rows=ref([]);
const loading=ref(true);
const filter=ref('');
const filterBy=ref( {value:'type',name:'Type'});
const sortColumn = ref('_id');
const arrowIconName = ref('arrow_drop_up');
const sortDirection = ref(1);
const type=ref('text');
const $router = useRouter();
const $q=useQuasar();
const id=ref('');
var data=[];
const isclicked=ref(false)

/********************************** interaction with db************************************ */
                async  function fetchData(page,sort){
                    const originalRows=ref([]);
                  
                      await  getAll('incomes/get',page+'/','',filterBy.value.value,filter.value,sort).then(res=>{
                           if(res.status==200)
                           { originalRows.value= res.data.docs;
                            pagination.value.rowsNumber=res.data.totalDocs;
                           }

                           else{
                            $q.notify({
                                            message: 'Une erreur a été survenue lors du chargement',
                                            color: 'red-5',
                                            icon: 'gpp_bad',
                                            position:'top'
                                        });
                           }
                            })
                        .finally(()=>{
                            loading.value=false;
                        });;
                          
                        
                            rows.value.splice(0, rows.value.length);
                            rows.value=originalRows.value;
                            incomesNet.value=0;
                            rows.value.forEach(row => {
                             incomesNet.value+=row.totalGNet;

                            });

                      
                    }
                      function deleteRow(){
                                deleteData('incomes',id.value).then((res)=>{
                                if(res.status==200){
                                    $q.notify({
                                                            message: 'Revenu supprimé avec succés',
                                                            color: 'light-blue-10',
                                                            icon: 'done',
                                                            position:'top',
                                                            badgeClass: ' bg-light-blue-8'
                                                        });
                                   handleRequest()
                                }
                                else{
                                  $q.notify({
                                                            message: 'Une erreur a été survenue lors de la suppression',
                                                            color: 'red-5',
                                                            icon: 'gpp_bad',
                                                            position:'top'
                                                        });
                                }
                                
                                })
                                 }
                              // get last incomes saved
                      getFromDB('incomes').then((res)=>{
                        if(res.data.length!=0)
                           { const array=res.data[0].date.split('T')
                            lastIncome.value=array[0]+' '+array[1].split('.')[0].split(':')[0]+':'+array[1].split('.')[0].split(':')[1];}
                            }
                        ); 
                        // get sum of daily incomes registred
                       getFromDB('incomes/daily/incomes').then((res)=>{
                           if(res.data.length!=0)
                            dailyIncomes.value=res.data[0].amount;
                            }
                        ); 
                        // get sum of incomes -sum expends
                        getFromDB('incomes/sum/net/incomes').then((res)=>{
                              res.data.forEach(row=>{
                               incomeNet.value+=row.totalGNet;
                              });});
                          // get sum of incomes only
                          getFromDB('incomes/sum/incomes').then(
                           (res)=>{
                            if(res.data.length!=0) incomes.value=res.data[0].sum;
                           }
                            
                          );
                        /****************helping functions********************* */
                          //sorting
                        const sortByColumn = (columnName) => {
                           
                            if(columnName=='amount')
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
                                         type.value='date';
                                    }
                                   else type.value='text';
                                    });
                        // update
                                    function  toUpdate(id){
                                      
                                    $router.push({ path: '/incomes/expends/u-income/'+id });
                                 }
                        // history
                                 function historique(){
                                    $router.push({ path: '/incomes/expends/history-i/' });
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
                                           type: 'warning'
                                        });
                                        }
                                    }
                           // to export   
                           const excelParser = () => {
                                        rows.value.forEach ((value) =>{
                                             
                                                    value.incomes.forEach((v)=>{
                                                      data.push({
                                                        'date':v.date,
                                                        'type':v.type[0].name,
                                                        'montant':v.amount
                                                      })
                                                    });
                                                    data.push(
                                                  { 'total':value.totalI,'totalNet':value.totalGNet}
                                                
                                                );
                                                    });
                                        data.push({'':'somme des totaux '+incomeNet.value})
                                         data.push({'':'date dernier revenu '+lastIncome.value})
                                         data.push({'':"revenus d'Aujourd'hui "+dailyIncomes.value})
                                         data.push({'':"revenu net "+incomesNet.value})
                                                    exportDataFromJSON(data,null,null)
                                                }
                                                  
                                      function  pageNumber(number){
                                        return   Math.ceil( number/ 5)
                                      } 
                                      function showMore(){
                                            isclicked.value=!isclicked.value
                                          }
                                    
                                     
                                            
                                          
                                        

                        return{
                            rows,pagination,filterBy,columns,sortColumn,lastIncome,dailyIncomes,type,
                            arrowIconName,options,filter,loading,incomesNet,incomes,
                            incomeNet,pagination1,pagination2,isclicked,
                            sortByColumn,handleRequest,toUpdate,historique,deleteRow,
                            idOfRow,excelParser,pageNumber,showMore,
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