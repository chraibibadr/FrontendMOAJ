<template>
  <q-page>
    <q-tabs
      v-model="tab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="newDemand" label="Nouvelle demande" />
      <q-tab @click="refreshDemandsTable" name="demands" label="Les demandes" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <!-- start of new demand section -->
      <q-tab-panel class="full-height" name="newDemand">
        <q-card bordered>
          <q-card-section>
            <h5 class="text-center text-weight-bold">
              Ajout d'une nouvelle demande
            </h5>
            <q-form @submit="submitDemand" class="q-gutter-md" ref="formDemand">
              <div class="row justify-center">
                <q-input
                  class="col-xs-12 col-sm-6 col-md-6 q-px-sm"
                  filled
                  clearable
                  v-model="titre"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']"
                  label="Titre de la demande"
                />
                <q-select
                  class="col-xs-12 col-sm-6 col-md-6 q-px-sm"
                  filled
                  transition-show="jump-up"
                  transition-hide="scale"
                  v-model="selectType"
                  :options="optionsType"
                  @filter="filterType"
                  lazy-rules
                  :rules="[(val) => !!val || 'Requis']"
                  label="Type de la demande"
                />
              </div>
              <div class="row justify-center">
                <q-select
                  class="col-xs-12 col-sm-6 col-md-6 q-px-sm"
                  filled
                  transition-show="jump-up"
                  transition-hide="scale"
                  v-model="selectStatut"
                  :options="optionsStatut"
                  lazy-rules
                  :rules="[(val) => !!val || 'Requis']"
                  label="Statut de la demande"
                />
                <q-select
                  class="col-xs-12 col-sm-6 col-md-6 q-px-sm"
                  filled
                  transition-show="jump-up"
                  transition-hide="scale"
                  v-model="selectDept"
                  :options="optionsDept"
                  @filter="filterDept"
                  label="Departement de la demande"
                />
              </div>
              <div class="row justify-center">
                <q-input
                  clearable
                  class="col-12 q-px-sm"
                  v-model="description"
                  label="Description"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']"
                  filled
                  autogrow
                />
              </div>
              <div class="row justify-start q-px-sm">
                <q-btn label="Ajouter" type="submit" color="primary" />
                <q-btn
                  @click="resetForm"
                  label="Réinitialiser"
                  type="reset"
                  color="primary"
                  flat
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-tab-panel>
      <!-- end of new demand section -->

      <!-- start of demands list section -->
      <q-tab-panel class="full-height" name="demands">
        <q-table
          ref="demandTableRef"
          title="Les demandes"
          no-data-label="Aucun enregistrements trouvés"
          no-results-label="Aucun enregistrements correspondants trouvés"
          loading-label="Chargement"
          rows-per-page-label="Element par page"
          :dense="$q.screen.lt.md"
          :rows="rows"
          bordered
          table-header-class="text-blue"
          :columns="columns"
          row-key="_id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="filter"
          binary-state-sort
          :visible-columns="visibleColumns"
          @request="onRequest"
        >
          <template v-slot:top-right="props">
            <q-input
              dense
              debounce="1000"
              v-model="filter"
              placeholder="Filtrer"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md"
            />
          </template>
          <template v-slot:body-cell-statut="props">
            <q-td :props="props">
              <div v-if="props.value == 'Cloturé'">
                <q-badge color="green" :label="props.value" />
              </div>
              <div v-if="props.value == 'En attente'">
                <q-badge color="orange" :label="props.value" />
              </div>
              <div v-if="props.value == 'En cours'">
                <q-badge color="blue" :label="props.value" />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-departement="props">
            <q-td :props="props">
              <div v-if="!props.value"><strong>Sans</strong></div>
              <div v-if="props.value">{{ props.value }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                dense
                round
                flat
                color="green"
                @click="showEditDialog(props.row)"
                icon="edit"
              ></q-btn>
              <q-btn
                dense
                round
                flat
                color="red"
                @click="showDeleteDialog(props.row)"
                icon="delete"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <!-- end of demands list section -->
    </q-tab-panels>
  </q-page>

  <!-- start of edit dialog -->
  <q-dialog v-model="editDialog">
    <q-card class="fit">
      <q-card-section class="bg-grey-3">
        <q-btn
          round
          flat
          dense
          icon="close"
          class="float-right"
          color="grey-8"
          v-close-popup
        />
        <div class="text-h6">Modifier la demande</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section>
        <q-form>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Titre </q-item-label>
                <q-input
                  v-model="updatedDemand.titre"
                  dense
                  outlined
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Type </q-item-label>
                <q-select
                  :options="optionsType"
                  transition-show="jump-up"
                  transition-hide="scale"
                  dense
                  outlined
                  @filter="filterType"
                  v-model="updatedDemand.type"
                  lazy-rules
                  :rules="[(val) => !!val || 'Requis']"
                ></q-select>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Statut </q-item-label>
                <q-select
                  :options="optionsStatut"
                  transition-show="jump-up"
                  transition-hide="scale"
                  dense
                  outlined
                  v-model="updatedDemand.statut"
                  lazy-rules
                  :rules="[(val) => !!val || 'Requis']"
                ></q-select>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Departement </q-item-label>
                <q-select
                  :options="optionsDept"
                  transition-show="jump-up"
                  transition-hide="scale"
                  dense
                  outlined
                  @filter="filterDept"
                  v-model="updatedDemand.departement"
                ></q-select>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Description </q-item-label>
                <q-input
                  v-model="updatedDemand.description"
                  autogrow
                  dense
                  outlined
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Modifier"
            color="primary"
            dense
            v-close-popup
            @click="editDemand"
          ></q-btn>
          <q-btn
            flat
            label="Annuler"
            color="orange"
            dense
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- end of edit dialog -->

  <!-- start of delete confirmation dialog -->
  <q-dialog v-model="deleteDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Suppression</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="row items-center">
        <span class="q-mx-sm">
          Voulez-vous vraiment supprimer cette demande !</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          @click="deleteDemand"
          flat
          label="Confirmer"
          color="red"
          v-close-popup
        />
        <q-btn flat label="Annuler" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- end of delete confirmation dialog -->
</template>

<script>
import { axios } from 'boot/axios';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';

// demands table columns
const columns = [
  {
    name: '_id',
    required: false,
    field: '_id',
    label: 'ID',
    align: 'left',
    sortable: true,
  },
  {
    name: 'titre',
    required: true,
    field: 'titre',
    label: 'Titre',
    align: 'left',
  },
  {
    name: 'type',
    required: true,
    field: 'type',
    label: 'Type',
    align: 'left',
    sortable: true,
  },
  {
    name: 'statut',
    required: true,
    field: 'statut',
    label: 'Statut',
    align: 'center',
    sortable: true,
  },
  {
    name: 'departement',
    required: true,
    field: 'departement',
    label: 'Departement',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    required: true,
    field: 'description',
    label: 'Description',
    align: 'left',
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    align: 'center',
  },
];

export default {
  name: 'DemandsList',
  setup() {
    const $q = useQuasar();
    const tab = ref('demands');

    // new demand form
    const formDemand = ref(null);
    const types = [];
    const depts = [];
    const titre = ref(null);
    const selectType = ref(null);
    const optionsType = ref(null);
    const selectStatut = ref(null);
    const selectDept = ref(null);
    const optionsDept = ref(null);
    const description = ref(null);

    // new demand form functions
    // form reset
    function resetForm() {
      titre.value =
        selectType.value =
        selectStatut.value =
        selectDept.value =
        description.value =
        optionsDept.value =
        optionsType.value =
          null;
      formDemand.value.resetValidation();
    }

    // submit function
    const submitDemand = async () => {
      const { data } = await axios.post('demande', {
        titre: titre.value,
        type: selectType.value,
        statut: selectStatut.value,
        ...(selectDept.value ? { departement: selectDept.value } : {}),
        description: description.value,
      });

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Demande non ajouter.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Demande bien ajouter',
        });
        resetForm();
      }
    };

    // demands table
    const demandTableRef = ref();
    const rows = ref([]);
    const filter = ref('');
    const loading = ref(false);
    const pagination = ref({
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 5,
    });

    // demands table functions
    //loading data function
    async function loadDemands(page, limit, filter, sortBy, sort) {
      const { data } = await axios.get('demande', {
        params: {
          page: page,
          sort: sort,
          filter: filter,
          sortBy: sortBy,
          limit: limit,
        },
      });
      return data;
    }

    // triggered when data needs to be fetched from the server
    function onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      // turning on loading indicator
      loading.value = true;

      setTimeout(async () => {
        // loading data from "server"
        const returnedData = await loadDemands(
          page,
          rowsPerPage,
          filter,
          sortBy,
          descending
        );

        if (returnedData !== undefined) {
          // clear out existing data and add new
          rows.value.splice(0, rows.value.length, ...returnedData['data']);

          //updating local pagination object
          pagination.value.page = page;
          pagination.value.rowsPerPage = rowsPerPage;
          pagination.value.sortBy = sortBy;
          pagination.value.descending = descending;
          //updating total rows for pagination
          pagination.value.rowsNumber = returnedData['total'];
        } else {
          $q.notify({
            type: 'warning',
            position: 'bottom-right',
            message:
              'Une erreur est survenue lors du chargement des données, réessayer ultérieurement',
          });
        }

        // turning off loading indicator
        loading.value = false;
      }, 1500);
    }

    //load data from "server" page 1
    onMounted(() => {
      demandTableRef.value.requestServerInteraction();
    });

    // refresh demands table
    function refreshDemandsTable() {
      setTimeout(() => {
        demandTableRef.value.requestServerInteraction();
      }, 500);
    }

    // edit & delete demand
    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const updatedDemand = ref({});

    // edit & delete demand functions
    // show edit dialog function
    function showEditDialog(item) {
      // updatedDemand.value = item;
      updatedDemand.value._id = item._id;
      updatedDemand.value.titre = item.titre;
      updatedDemand.value.type = item.type;
      updatedDemand.value.statut = item.statut;
      updatedDemand.value.departement = item.departement;
      updatedDemand.value.description = item.description;
      editDialog.value = true;
    }

    // show delete dialog function
    function showDeleteDialog(item) {
      updatedDemand.value._id = item._id;
      deleteDialog.value = true;
    }

    // edit demand function
    const editDemand = async () => {
      const { data } = await axios.patch('demande/' + updatedDemand.value._id, {
        titre: updatedDemand.value.titre,
        type: updatedDemand.value.type,
        statut: updatedDemand.value.statut,
        ...(updatedDemand.value.departement
          ? { departement: updatedDemand.value.departement }
          : {}),
        description: updatedDemand.value.description,
      });

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Demande non modifier.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Demande bien modifier',
        });
        refreshDemandsTable();
      }
    };

    // delete demand function
    const deleteDemand = async () => {
      const { data } = await axios.delete('demande/' + updatedDemand.value._id);

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Demande non supprimer.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Demande bien supprimer',
        });
        refreshDemandsTable();
      }
    };

    return {
      tab,
      // new demand form
      formDemand,
      titre,
      selectType,
      optionsType,
      //select of type load fuction
      filterType(val, update, abort) {
        if (optionsType.value !== null) {
          update();
          return;
        }

        setTimeout(() => {
          update(async () => {
            const { data } = await axios.get('demande-type');
            types.splice(0, types.length);
            data.forEach((element) => {
              types.push(element.nom);
            });
            optionsType.value = types;
          });
        }, 500);
      },
      selectDept,
      optionsDept,
      //select of department load function
      filterDept(val, update, abort) {
        if (optionsDept.value !== null) {
          update();
          return;
        }

        setTimeout(() => {
          update(async () => {
            const { data } = await axios.get('demande-departement');
            depts.splice(0, depts.length);
            data.forEach((element) => {
              depts.push(element.nom);
            });
            optionsDept.value = depts;
          });
        }, 500);
      },
      selectStatut,
      optionsStatut: ['En attente', 'En cours', 'Cloturé'],
      description,
      submitDemand,

      //demands table
      demandTableRef,
      visibleColumns: ref([
        'titre',
        'type',
        'statut',
        'departement',
        'description',
        'actions',
      ]),
      filter,
      loading,
      pagination,
      columns,
      rows,
      onRequest,
      refreshDemandsTable,
      resetForm,

      //edit & delete demand
      editDialog,
      deleteDialog,
      showEditDialog,
      showDeleteDialog,
      updatedDemand,
      editDemand,
      deleteDemand,
    };
  },
};
</script>
