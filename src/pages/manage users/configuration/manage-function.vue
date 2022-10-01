import { util } from 'webpack';

<template>
  <q-page class=" q-pa-lg  ">

    <q-dialog v-model="card">
      <q-card class="bg-light-blue-10"
        style="border:1px transparent ;border-radius: 8px; width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none text-white text ">
          <div class="text-h6">Gestion Des Fonctions</div>

        </q-card-section>
        <q-card-section class=" q-px-none">

          <q-form class="q-pa-md  " @submit.prevent="createOrUpdate">
            <div class="row q-ma-0  justify-between ">
              <q-input class=" col-7 " color="light-blue-9" bg-color="white" filled :class="{'error':v$.name.$error}"
                v-model="state.name" label="Nom">

                <template v-if="v$.name.$error" v-slot:prepend>
                  <q-icon round name="info" color="red">
                    <q-tooltip v-if="v$.name.required.$invalid" class="bg-red-5" :offset="[10, 10]">
                      Ce champ est important veuillez le remplire
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-card-actions align="right">
              <q-btn outline label="Annuler" color="white" v-close-popup />
              <q-btn color="light-blue-9" type="submit">{{action}}</q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>

      </q-card>


    </q-dialog>
    <div class=" row justify-center ">
      <div class="col-10">
        <div class="row q-my-md ">
          <div class="col-6   "></div>
          <div class="col-6 ">
            <q-btn class="float-right" color="light-blue-9" rounded icon="add_circle_outline " label="Nouveau" no-caps
              @click="card = true" />
          </div>
        </div>
        <q-table style="border:1px transparent ;border-radius: 20px;" :rows="rows" :columns="columns" separator='none'
          row-key="_id" v-model:pagination="pagination" :loading="loading" rounded :filter="filter"
          class="q-py-lg  shadow-5 " @request="handleRequest" ref="table" hide-pagination
          no-data-label="rien n'est trouvé" no-results-label="Le filtre n’a révélé aucun résultat "
          loading-label="Chargement...">

          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
          <template v-slot:top>
            <q-input class="col-6" dense densdebounce="300" v-model="filter" placeholder="Recherche" rounded outlined
              color="light-blue-9">
              <template v-slot:prepend>
                <q-icon name="search" color="grey-5" />
              </template>
            </q-input>
            <q-space />


            <div class=" flex flex-center justify-between">

              <q-pagination v-model="pagination.page" :max="pagesNumber" size="sm" direction-links :max-pages="5"
                color="grey-6" active-color="light-blue-9"
                @update:model-value="() => $refs.table.requestServerInteraction()" />
            </div>
          </template>

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" @click="sort(col.name)"
                :class="{'hidden':col.name=='_id'}" style="font-family:Georgia; font-weight: bold;
                            background-color:rgb(244,246,250) ;
                            color: rgb(116,124,128) ;">
                {{ col.label }}

                <span v-if=" col.name!='action' &&  sortColumn == col.name"
                  class="material-icons cursor-pointer">{{arrowIconName}}</span>
                <span v-else-if="col.name!='action'" class="material-icons cursor-pointer">sort</span>
              </q-th>
            </q-tr>


          </template>
          <template v-slot:body="props">

            <q-tr :props="props" class="q-ma-lg text-grey  ">
              <q-td key="_id" :props="props">
                {{props.row._id}}
              </q-td>
              <q-td key="name" :props="props">
                {{props.row.name}}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn size="15px" class="q-mt-sm " round flat
                  @click="toUpdate(props.row.name),idOfRow(props.row._id), card = true ">
                  <q-icon name="edit" color="grey-5" />
                </q-btn>
                <q-btn size="15px" class="q-mt-sm " round flat @click="idOfRow(props.row._id),confirm  = true">
                  <q-icon name="delete" color="grey-5" />
                </q-btn>

              </q-td>
            </q-tr>
          </template>

        </q-table>
      </div>
    </div>



    <q-dialog v-model="confirm" persistent>
      <q-card class="bg-light-blue-10">
        <q-card-section class="row items-center">
          <q-avatar icon="info" color="red-2" text-color="red-7" />
          <span class="q-ml-sm text-white">Attention!La suppresion d'une fonction menera à la suppression <br /> des
            utlisateurs liée à cette derniere..</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Annuler" color="white" outline v-close-popup />
          <q-btn label="Continuer" color="red-7" v-close-popup @click="deleteRow" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>



<style>

</style>
 
<script>
import { computed, ref } from 'vue';
import { getAll, createObject, deleteData, updateObject, } from 'src/util/methods';
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators';
import { useQuasar } from 'quasar';


const columns = [
  {
    name: '_id',
    classes: 'hidden',

  },


  {
    name: 'name',
    label: 'Nom',
    align: 'left',

  },
  { name: 'action', },

]


export default {
  setup() {
    const $q = useQuasar();
    const state = ref({
      name: ''
    });
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 14
    });

    const rows = ref([]);
    const loading = ref(true);
    const filter = ref('');
    const id = ref('');
    const sortColumn = ref('_id');
    const sortDirection = ref(1);
    const arrowIconName = ref('arrow_drop_up');
    const update = ref(false);
    const action = ref('Ajouter');
    /********Interaction with DB******** */


    //get from DB
    async function fetchData(page, sort) {
      const originalRows = ref([]);
      await getAll('functions/get', page + '/', '', 'name', filter.value, sort).then(res => {
        if (res.status == 200) {
          originalRows.value = res.data.docs;
          pagination.value.rowsNumber = res.data.totalDocs;
        }
        else {
          targgetNegative('Une erreur a été survenue lors du chargement ');
        }

      })
        .finally(() => {
          loading.value = false;
        });;
      rows.value.splice(0, rows.value.length);
      rows.value = originalRows.value;


    }
    fetchData(1);




    // create
    const createOrUpdate = function () {
      v$.value.$validate();
      if (!v$.value.$error) {
        if (update.value) {
          updateObject('functions', state.value, id.value).then((res) => {
            if (res.status == 200) {

              reset();
              targgetPositive('Fonction modifiée avec succés');
              action.value = 'Ajouter';
              update.value = false;
              handleRequest();
            }

            else {
              targgetNegative('Une erreur a été survenue lors de la transmition ');
            }
          })


        }
        else {
          createObject('functions', state.value).then((res) => {

            if (res.status == 201) {

              reset();
              targgetPositive('Fonction créée avec succés');
              handleRequest();
            }
            else {
              targgetNegative('Une erreur a été survenue lors de la transmition ');
            }
          })
        }

      }
    }
    // delete
    function deleteRow() {
      deleteData('functions', id.value).then((res) => {
        if (res.status == 200) {
          targgetPositive('Fonction supprimée avec succés');
          handleRequest();
        }
        else {
          targgetNegative('Une erreur a été survenue lors de la suppression ');
        }

      })
    }


    // helping functions
    function idOfRow(v) { id.value = v; }

    const handleRequest = () => { fetchData(pagination.value.page); }

    function toUpdate(name) {
      state.value.name = name;
      action.value = 'Modifier';
      update.value = true;

    }
    //sorting
    const sort = (columnName) => {

      sortColumn.value = columnName;
      sortDirection.value = -1 * sortDirection.value;

      if (sortDirection.value == 1) {
        arrowIconName.value = 'arrow_drop_up';
        fetchData(pagination.value.page, 1);
      } else {
        arrowIconName.value = 'arrow_drop_down';
        fetchData(pagination.value.page, -1);
      }

    }
    //
    function targgetPositive(msg) {
      $q.notify({
        message: msg,
        color: 'light-blue-10',
        icon: 'done',
        position: 'top',
        badgeClass: ' bg-light-blue-8'
      });
    }
    function targgetNegative() {
      $q.notify({
        message: 'Une erreur a été survenue lors de la suppression',
        color: 'red-5',
        icon: 'gpp_bad',
        position: 'top'
      });
    }

    // reset 
    function reset() {
      state.value.name = '';
      v$.value.$reset();


    }
    // validation
    const rules = {
      name: { required },
    }
    const v$ = useVuelidate(rules, state);

    // return
    return {
      v$, state, filter, columns, rows, pagination,
      arrowIconName, sortColumn, loading, action,
      createOrUpdate, handleRequest, sort, deleteRow, idOfRow, toUpdate,
      confirm: ref(false), card: ref(false),
      pagesNumber: computed(() => Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage))


    }
  }


}

</script>
<style>
.error {
  outline: 2px solid red;
  border-radius: 3px;
}

.text {
  font-family: Georgia;

}
</style>