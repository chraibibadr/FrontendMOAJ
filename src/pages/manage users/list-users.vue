<template>
    <q-page class="  justify-center items-center">
        <div class="q-pa-lg q-mt-lg">
            <div class="row q-my-lg ">
                <div class="col-6   "></div>
                <div class="col-6 ">
                    <q-btn class="float-right" color="light-blue-9" rounded icon-right="archive" label="Exporter "
                        no-caps @click="excelParser" />
                </div>
            </div>
            <q-table style="border:1px transparent ;border-radius: 20px;" :rows="rows" :columns="columns"
                separator='none' row-key="matricule" v-model:pagination="pagination" :loading="loading" rounded
                :filter="filter" class="q-py-lg  shadow-5" @request="handleRequest" ref="table" hide-pagination
                no-data-label="rien n'est trouvé" no-results-label="Le filtre n’a révélé aucun résultat "
                loading-label="Chargement...">

                <template v-slot:loading>
                    <q-inner-loading showing color="primary" />
                </template>

                <template v-slot:top>
                    <q-input class="col-6" dense densdebounce="300" v-model="filter" placeholder="Recherche" rounded
                        outlined color="light-blue-9">
                        <template v-slot:prepend>
                            <q-icon name="search" color="grey-5" />
                        </template>
                    </q-input>
                    <q-space />
                    <q-select dense class="col-4 " :popup-content-style="{ color: 'grey' }" color="light-blue-9" rounded
                        outlined v-model="filterBy" :options="options"
                        :display-value="`filtrer par: ${filterBy ?  filterBy.name: '*none*'}`" option-label="name"
                        @update:model-value="() =>{ if(filter) $refs.table.requestServerInteraction()}" />
                    <q-space />
                    <div class=" ">

                        <q-pagination v-model="pagination.page" :max="pagesNumber" size="sm" direction-links
                            :max-pages="5" color="grey-6" active-color="light-blue-9"
                            @update:model-value="() => $refs.table.requestServerInteraction()" />
                    </div>
                </template>

                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" @click="sortByColumn(col.name)"
                            :class="{'hidden':col.name=='_id'}" style="font-family:Georgia; font-weight: bold;
                            background-color:rgb(244,246,250) ;
                            color: rgb(116,124,128) ;">
                            {{ col.label }}

                            <span v-if="(col.name!='role'&& col.name!='permissions' && 
                                         col.name!='phone' &&  col.name!='email' && col.name!='action')&& 
                            sortColumn == col.name" class="material-icons cursor-pointer">{{arrowIconName}}</span>
                            <span v-else-if="(col.name!='role'&& col.name!='permissions' && 
                            col.name!='phone' &&  col.name!='email' && col.name!='action')"
                                class="material-icons cursor-pointer">sort</span>
                        </q-th>
                    </q-tr>


                </template>
                <template v-slot:body="props">

                    <q-tr :props="props" class="q-ma-lg text-grey-6 text">
                        <q-td key="_id" :props="props">
                            {{props.row._id}}
                        </q-td>
                        <q-td key="matricule" :props="props">
                            {{props.row.matricule}}
                        </q-td>
                        <q-td key="firstname" :props="props">
                            {{props.row.firstname}}
                        </q-td>
                        <q-td key="lastname" :props="props">
                            {{props.row.lastname}}
                        </q-td>
                        <q-td key="function" :props="props">
                            {{props.row.function[0].name}}
                        </q-td>
                        <q-td key="department" :props="props">
                            {{props.row.department[0].name}}
                        </q-td>
                        <q-td key="phone" :props="props">
                            {{props.row.phone}}
                        </q-td>
                        <q-td key="email" :props="props">
                            {{props.row.email}}
                        </q-td>
                        <q-td key="role" :props="props">
                            {{props.row.role}}
                        </q-td>
                        <q-td key="permissions" :props="props">
                            <q-icon round name="visibility" color="light-blue-10" size="22px">
                                <q-tooltip class="bg-light-blue-10 text-white" id="app">
                                    <strong v-if="props.row.role=='admin'">Toutes les applications <br /> sont
                                        <em>autorisées</em></strong>
                                    <span v-else v-for="p in props.row.permissions" :key="p">
                                        <strong v-if="p=='App1'"> Application de <em>stock</em></strong>
                                        <strong v-else-if="p=='App2'"> Programme de <em>revenus</em></strong>
                                        <strong v-else-if="p=='App3'"> Bureau de <em>contrôle</em></strong>
                                        <strong v-else> Proprieté privé <em>public</em></strong>
                                        <br />
                                    </span>
                                </q-tooltip>
                            </q-icon>
                        </q-td>
                        <q-td key="action" :props="props">

                            <q-btn size="14px" class="q-mt-sm " round flat @click="toUpdate(props.row._id)">
                                <q-icon name="edit" color="grey-5" />
                            </q-btn>
                            <q-btn size="14px" class="q-mt-sm " round flat
                                @click="idOfRow(props.row._id),confirm  = true">
                                <q-icon name="delete" color="grey-5" />
                            </q-btn>

                        </q-td>
                    </q-tr>
                </template>

            </q-table>

        </div>

        <q-dialog v-model="confirm" persistent>
            <q-card class="bg-light-blue-10">
                <q-card-section class="row items-center">
                    <q-avatar icon="info" color="red-2" text-color="red-7" />
                    <span class="q-ml-sm text-white">Vous etes entrien de supprimer un utilisateur.</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn label="Annuler" color="white" outline v-close-popup />
                    <q-btn label="Continuer" color="red-7" v-close-popup @click="deleteRow" />
                </q-card-actions>
            </q-card>
        </q-dialog>





    </q-page>
</template>
<script>

import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { getAll, deleteData } from 'src/util/methods';
import exportFromJSON from 'export-from-json';
import { useRouter } from 'vue-router';
import { useIsAuthenticated } from 'stores/isAuthenticated';

/********************Columns********************** */
const columns = [
    {
        name: '_id',
        classes: 'hidden',

    },

    {
        name: 'matricule',
        label: 'Matricule',
        align: 'left',

    },

    {
        name: 'firstname',
        required: true,
        label: 'Prénom',
        align: 'left',


    },
    {
        name: 'lastname',
        label: 'Nom',
        align: 'left',

    },

    {
        name: 'function',
        label: 'Fonction',
        align: 'left',

    },
    {
        name: 'department',
        label: 'Département',
        align: 'left',


    },

    {
        name: 'phone',
        label: 'Téléphone',
        align: 'left',


    },
    {
        name: 'email',
        label: 'Email',
        align: 'left',


    },

    {
        name: 'role',
        label: 'Role',
        align: 'left',


    },
    {
        name: 'permissions',
        label: 'App',
        align: 'left',

    },
    { name: 'action', },
]
const options = [
    { value: 'matricule', name: 'Matricule' },
    { value: 'firstname', name: 'Prénom' },
    { value: 'lastname', name: 'Nom' },
    { value: 'function', name: 'Fonction' },
    { value: 'department', name: 'Departement' },
    { value: 'role', name: 'role' },

]




export default {

    setup() {
        const $q = useQuasar();
        const $router = useRouter();
        const filterBy = ref({ value: 'matricule', name: 'Matricule' });

        const pagination = ref({

            page: 1,
            rowsPerPage: 10,
            rowsNumber: 14
        });


        const rows = ref([]);
        const loading = ref(true);
        const filter = ref('');
        const sortColumn = ref('_id');
        const sortDirection = ref(1);
        const arrowIconName = ref('arrow_drop_up');
        const id = ref('');
        var sort = undefined;
        var colSort = undefined;
        var data = [];
        const store = useIsAuthenticated();


        /************interaction with db********************* */
        async function fetchData(page) {
            const originalRows = ref([]);
            await getAll('users/get', page, store.id + '/', filterBy.value.value, filter.value, sort, colSort).then(res => {

                if (res.status == 200) {

                    originalRows.value = res.data.docs;
                    pagination.value.rowsNumber = res.data.totalDocs;
                }
                else {
                    $q.notify({
                        message: 'Une erreur a été survenue lors du chargement ',
                        color: 'red-5',
                        icon: 'gpp_bad',
                        position: 'top'
                    });
                }


            })
                .finally(() => {
                    loading.value = false;
                });;

            loading.value = loading.value;
            rows.value.splice(0, rows.value.length);
            rows.value = originalRows.value;


        }




        function deleteRow() {
            deleteData('users', id.value).then((res) => {
                if (res.status == 200) {
                    $q.notify({
                        message: 'Utilisateur supprimé avec succés',
                        color: 'light-blue-10',
                        icon: 'done',
                        position: 'top',
                        badgeClass: ' bg-light-blue-8'
                    });
                    handleRequest();
                }
                else {
                    $q.notify({
                        message: 'Une erreur a été survenue lors de la suppression',
                        color: 'red-5',
                        icon: 'gpp_bad',
                        position: 'top'
                    });
                }
            })
        }

        /************** sorting  ************** */
        const sortByColumn = (columnName) => {

            if (columnName != 'role' &&
                columnName != 'email' && columnName != 'permissions'
                && columnName != 'action' && columnName != 'phone') {
                sortColumn.value = columnName;
                sortDirection.value = -1 * sortDirection.value;

                if (sortDirection.value == 1) {
                    arrowIconName.value = 'arrow_drop_up';

                    sort = 1;
                    colSort = columnName;
                    handleRequest();
                } else {
                    arrowIconName.value = 'arrow_drop_down';
                    sort = -1;
                    colSort = columnName;
                    handleRequest();
                }
            }

        }
        fetchData(1);



        /**************helping functions************************ */
        function idOfRow(v) {
            id.value = v;
        }
        // update rows on pagination

        const handleRequest = () => {
            fetchData(pagination.value.page);
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
                    type: 'warning',
                    position: 'top'
                });
            }
        }
        // Permissions
        function permissionsConvert(value) {
            var array = [];
            value.forEach(v => {
                if (v == 'App1') array.push('  Application de stock ');
                if (v == 'App2') array.push(' Programme de revenus');
                if (v == 'App3') array.push(' Bureau de controle ');
                if (v == 'App4') array.push(' Proprieté privé public');
            });
            return array;
        }

        // to export   
        const excelParser = () => {
            rows.value.forEach((value) => {

                data.push({
                    'matricule': value.matricule,
                    'prénom': value.firstname,
                    'nom': value.lastname,
                    'departement': value.department[0].name,
                    'fonction': value.function[0].name,
                    'téléphone': value.phone,
                    'E-mail': value.email,
                    'role': value.role,
                    'permissions': permissionsConvert(value.permissions)

                })
            });

            exportDataFromJSON(data, null, null)

        };

        // redirect to update page
        function toUpdate(id) {
            $router.push({ path: '/users/update/' + id });
        }

        // return
        return {
            rows, columns, loading, pagination,
            filter, options, filterBy, sortColumn, arrowIconName,
            handleRequest, sortByColumn, deleteRow, excelParser, idOfRow, toUpdate,
            confirm: ref(false),
            pagesNumber: computed(() => Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)),




        }
    }
}
</script>
<style>
.text {
    font-family: Georgia;
}
</style>
   
                           