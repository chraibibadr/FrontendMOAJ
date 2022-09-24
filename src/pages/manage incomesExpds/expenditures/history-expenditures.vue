<template>
    <q-page class=" q-pa-lg justify-center items-center">
        <div class="q-pa-lg">    
            <div >    
                        <div class="row q-my-md ">
                            <div class="col-6   "  ></div>
                            <div class="col-6 ">
                                <q-btn
                                class="float-right"
                            color="light-blue-9"
                            rounded
                            icon-right="archive"
                            label="Exporter "
                            no-caps
                            @click="excelParser"
                            />
                            </div>
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
                            :class="{'hidden':(col.name=='date')}"
                            style="font-family:Georgia; font-weight: bold;
                            background-color:rgb(244,246,250) ;
                            color: rgb(116,124,128) ;"    
                        >
                        {{ col.label }} 
                      
                        <span v-if="
                        sortColumn == col.name && col.name=='amount'" class="material-icons cursor-pointer">{{arrowIconName}}</span>
                        <span v-else-if="col.name=='amount'" class="material-icons cursor-pointer">sort</span>
                        </q-th>
                        </q-tr>
                        
                       
                    </template>
                    <template v-slot:body="props" >
                     
                        <q-tr    class="q-ma-lg text-grey-6 text"  >
                           
                            <q-td key="_id"   :props="props">
                            {{props.row._id}}
                            </q-td>
                            
                            <q-td key="amount" class=" text-bold "  :props="props">
                           
                             {{props.row.amount}}
                            </q-td>
                           
                           </q-tr>
                        
                            
                           </template>
                          
                            
                    </q-table>
                    
                </div>
                
                
                </q-page>
                </template>


<script>
import { getHistoryIncomes } from 'src/util/methods';
import { computed, ref, watch } from 'vue';
import exportFromJSON from 'export-from-json';

const columns=[
        {
                        name: '_id',
                        align:'left',
                        label:'Date',
                        field: row => row._id,
                        format: val => `${val}`,
                      
                    },

                    {
                        name: 'amount',
                        label:'Montant',
                        align:'center',
                        field: row => row.amount,
                        format: val => `${val}`,
                       
                       
                       
                    }, ]


                    const options=[

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
                        rowsPerPage: 10,
                        rowsNumber:14
                        });
const rows=ref([]);
const loading=ref(true);
const filter=ref('');
const filterBy=ref( {value:'date',name:'Date'});
const sortColumn = ref('_id');
const arrowIconName = ref('arrow_drop_up');
const sortDirection = ref(1);
const type=ref('date');
var data=[];
            /************interaction with db********************* */
            async  function fetchData(page,sort){
                    const originalRows=ref([]);
                    await getHistoryIncomes('expenditures/history',page+'/',filterBy.value.value,filter.value,sort).then(res=>{
                          if(res.status)
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
                         
                
                }
                    // helping function
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
                                                
                                                data.push({
                                                    'date':value._id,
                                                    'montant':value.amount,
                                                    
                                                   
                                                
                                                })
                                                    });
                                
                                                    exportDataFromJSON(data,null,null)
                                                        
                                                };

                 /****************sorting********************* */
                 const sortByColumn = (columnName) => {
                           
                           if(columnName=='amount')
                      { 
                       sortColumn.value = columnName;
                       sortDirection.value = -1 * sortDirection.value;
                  
                       if (sortDirection.value == 1) {
                           arrowIconName.value = 'arrow_drop_up';
                       
                         fetchData(pagination.value.page,1)
                       } else {
                           arrowIconName.value = 'arrow_drop_down';
                          fetchData(pagination.value.page,-1)
                       }}
                      
                       }
                       fetchData(1);
                                       const handleRequest= ()=>{
                                        fetchData(pagination.value.page);
                                     }
                    //
                    watch(filterBy,function(v){
                                    if(v.value=='date') {
                                         type.value=v;
                                    }
                                   else type.value='text';
                                    });

    return{pagination,arrowIconName,sortColumn,
        rows,columns,filter,loading,options,type,filterBy,
        handleRequest,sortByColumn,excelParser,
        pagesNumber:computed(() =>   Math.ceil(  pagination.value.rowsNumber/ pagination.value.rowsPerPage)),}
         
        }
    }
</script>