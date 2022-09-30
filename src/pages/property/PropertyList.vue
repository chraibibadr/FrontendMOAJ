<template>
  <q-page>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
      narrow-indicator>
      <q-tab name="newProperty" label="Nouvelle propriété" />
      <q-tab @click="refreshPropertyTable" name="property" label="Les propriétés" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <!-- start of new property section -->
      <q-tab-panel class="full-height" name="newProperty">
        <q-card bordered>
          <q-card-section>
            <h5 class="text-center text-weight-bold">
              Ajout d'une nouvelle propriété
            </h5>
            <q-form @submit="submitProperty" class="q-gutter-md" ref="formProperty">
              <div class="row justify-center">
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model="libelle" lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" label="Libelle" />
                <q-select class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled transition-show="jump-up"
                  transition-hide="scale" v-model="selectType" :options="optionsType" lazy-rules
                  :rules="[(val) => !!val || 'Requis']" label="Type de la propriété" />
              </div>
              <div class="row justify-center">
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled v-model="date" mask="date" :rules="['date']"
                  error-message="Requis">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Fermer" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model.number="surface"
                  type="number" label="Surface" />
              </div>
              <div class="row justify-center">
                <q-select class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled transition-show="jump-up"
                  transition-hide="scale" v-model="selectCategorie" :options="optionsCategorie"
                  @filter="filterCategorie" lazy-rules :rules="[(val) => !!val || 'Requis']"
                  label="Categorie de la propriété" />
                <q-input clearable class="col-xs-12 col-sm-6 col-md-6 q-px-sm" v-model="description" label="Description"
                  lazy-rules :rules="[(val) => (val && val.length > 0) || 'Requis']" filled autogrow />
              </div>
              <div class="row justify-center">
                <q-file class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled bottom-slots v-model="image" label="Image"
                  counter>
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" @click.stop.prevent />
                  </template>
                  <template v-slot:append>
                    <q-icon name="close" @click.stop.prevent="image = null" class="cursor-pointer" />
                  </template>
                </q-file>
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model="localisation"
                  label="Localisation" />
              </div>
              <div class="row justify-start q-px-sm">
                <q-btn label="Ajouter" type="submit" color="primary" />
                <q-btn @click="resetForm" label="Réinitialiser" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-tab-panel>
      <!-- end of new property section -->

      <!-- start of property list section -->
      <q-tab-panel class="full-height" name="property">
        <q-table ref="propertyTableRef" title="Les propriétés" no-data-label="Aucun enregistrements trouvés"
          no-results-label="Aucun enregistrements correspondants trouvés" loading-label="Chargement"
          rows-per-page-label="Element par page" :dense="$q.screen.lt.md" :rows="rows" bordered
          table-header-class="text-blue" :columns="columns" row-key="_id" v-model:pagination="pagination"
          :loading="loading" :filter="filter" binary-state-sort :visible-columns="visibleColumns" @request="onRequest">
          <template v-slot:top-right="props">
            <q-input dense debounce="1000" v-model="filter" placeholder="Filtrer">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen" class="q-ml-md" />
          </template>
          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <div v-if="props.value == 'Privée'">
                <q-badge color="red" :label="props.value" />
              </div>
              <div v-if="props.value == 'Publique'">
                <q-badge color="green" :label="props.value" />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-date="props">
            <q-td :props="props">
              <div>{{ props.value.substring(0, 10) }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-surface="props">
            <q-td :props="props">
              <div v-if="!props.value"><strong>Sans</strong></div>
              <div v-if="props.value">{{ props.value }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <div v-if="!props.value"><strong>Sans</strong></div>
              <div v-if="props.value">
                <q-btn @click="previewImg(props.value)" push round>
                  <q-avatar>
                    <img draggable="false" :src="'http://localhost:3000/' + props.value" />
                  </q-avatar>
                </q-btn>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-localisation="props">
            <q-td :props="props">
              <div v-if="!props.value"><strong>Sans</strong></div>
              <div v-if="props.value">{{ props.value }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn dense round flat color="green" @click="showEditDialog(props.row)" icon="edit"></q-btn>
              <q-btn dense round flat color="red" @click="showDeleteDialog(props.row)" icon="delete"></q-btn>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <!-- end of property list section -->
    </q-tab-panels>
  </q-page>

  <!-- start of edit dialog -->
  <q-dialog v-model="editDialog">
    <q-card class="fit">
      <q-card-section class="bg-grey-3">
        <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup />
        <div class="text-h6">Modifier la propriété</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section>
        <q-form>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Libelle </q-item-label>
                <q-input v-model="updatedProperty.libelle" dense outlined lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Type </q-item-label>
                <q-select :options="optionsType" transition-show="jump-up" transition-hide="scale" dense outlined
                  v-model="updatedProperty.type" lazy-rules :rules="[(val) => !!val || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Date </q-item-label>
                <q-input dense outlined v-model="updatedProperty.date" mask="date" :rules="['date']"
                  error-message="Requis">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Fermer" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Surface </q-item-label>
                <q-input dense outlined clearable v-model.number="updatedProperty.surface" type="number" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Catégorie </q-item-label>
                <q-select :options="optionsCategorie" transition-show="jump-up" transition-hide="scale" dense outlined
                  @filter="filterCategorie" v-model="updatedProperty.categorie" lazy-rules
                  :rules="[(val) => !!val || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Description </q-item-label>
                <q-input v-model="updatedProperty.description" autogrow dense outlined lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Image </q-item-label>
                <q-file dense outlined bottom-slots v-model="updatedProperty.image" counter>
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" @click.stop.prevent />
                  </template>
                  <template v-slot:append>
                    <q-icon name="close" @click.stop.prevent="updatedProperty.image = null" class="cursor-pointer" />
                  </template>
                </q-file>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Localisation </q-item-label>
                <q-input v-model="updatedProperty.localisation" autogrow dense outlined />
              </q-item-section>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Modifier" color="primary" dense v-close-popup @click="editProperty"></q-btn>
          <q-btn flat label="Annuler" color="orange" dense v-close-popup></q-btn>
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
          Voulez-vous vraiment supprimer cette propriété !</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn @click="deleteProperty" flat label="Confirmer" color="red" v-close-popup />
        <q-btn flat label="Annuler" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- end of delete confirmation dialog -->

  <!-- start of image preview dialog-->
  <q-dialog v-model="imageDialog">
    <q-img draggable="false" :src="'http://localhost:3000/' + imgUrl" />
  </q-dialog>
  <!-- end of image preview dialog-->
</template>

<script>
import { axios } from 'boot/axios';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';

// property table columns
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
    name: 'image',
    required: false,
    field: 'image',
    label: 'Image',
    align: 'center',
  },
  {
    name: 'libelle',
    required: true,
    field: 'libelle',
    label: 'Libelle',
    align: 'left',
  },
  {
    name: 'type',
    required: true,
    field: 'type',
    label: 'Type',
    align: 'center',
    sortable: true,
  },
  {
    name: 'date',
    required: true,
    field: 'date',
    label: 'Date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'surface',
    required: true,
    field: 'surface',
    label: 'Surface',
    align: 'left',
  },
  {
    name: 'categorie',
    required: true,
    field: 'categorie',
    label: 'Categorie',
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
    name: 'localisation',
    required: true,
    field: 'localisation',
    label: 'Localisation',
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
  name: 'PropertyList',
  setup() {
    const $q = useQuasar();
    const tab = ref('property');

    // get toady date : yyyy/mm/dd
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '/' + mm + '/' + dd;

    // new property form
    const formProperty = ref(null);
    const categories = [];
    const libelle = ref(null);
    const selectType = ref(null);
    const date = ref(today);
    const surface = ref(null);
    const selectCategorie = ref(null);
    const optionsCategorie = ref(null);
    const description = ref(null);
    const image = ref(null);
    const localisation = ref(null);

    // new property form functions
    //form reset
    function resetForm() {
      libelle.value =
        selectType.value =
        surface.value =
        selectCategorie.value =
        description.value =
        image.value =
        localisation.value =
        optionsCategorie.value =
        null;
      date.value = today;
      formProperty.value.resetValidation();
    }

    // submit function
    const submitProperty = async () => {
      let formData = new FormData();

      formData.append('libelle', libelle.value);
      formData.append('type', selectType.value);
      if (surface.value) formData.append('surface', surface.value);
      formData.append('date', date.value);
      formData.append('categorie', selectCategorie.value);
      formData.append('description', description.value);
      if (image.value) formData.append('image', image.value);
      if (localisation.value)
        formData.append('localisation', localisation.value);

      console.log('IMAGE : ', image.value);

      const { data } = await axios.post('property', formData);

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Propriété non ajouter.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Propriété bien ajouter',
        });
        resetForm();
      }
    };

    // property table
    const propertyTableRef = ref();
    const rows = ref([]);
    const filter = ref('');
    const loading = ref(false);
    const pagination = ref({
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 5,
    });
    const imageDialog = ref(false);
    const imgUrl = ref('');

    function previewImg(url) {
      imageDialog.value = true;
      imgUrl.value = url;
    }

    // property table functions
    //loading data function
    async function loadProperty(page, limit, filter, sortBy, sort) {
      const { data } = await axios.get('property', {
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
        const returnedData = await loadProperty(
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
    function refreshTable() {
      propertyTableRef.value.requestServerInteraction();
    }
    //load data from "server" page 1
    onMounted(() => {
      propertyTableRef.value.requestServerInteraction();
    });

    // refresh property table
    function refreshPropertyTable() {
      setTimeout(() => {
        propertyTableRef.value.requestServerInteraction();
      }, 500);
    }

    // edit & delete property
    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const updatedProperty = ref({});

    // edit & delete demand functions
    // show edit dialog function
    function showEditDialog(item) {
      // updatedDemand.value = item;
      updatedProperty.value._id = item._id;
      updatedProperty.value.libelle = item.libelle;
      updatedProperty.value.type = item.type;
      updatedProperty.value.date = item.date;
      updatedProperty.value.surface = item.surface;
      updatedProperty.value.categorie = item.categorie;
      updatedProperty.value.description = item.description;
      updatedProperty.value.localisation = item.localisation;
      editDialog.value = true;
    }

    // show delete dialog function
    function showDeleteDialog(item) {
      updatedProperty.value._id = item._id;
      deleteDialog.value = true;
    }

    // edit property function
    const editProperty = async () => {
      let formData = new FormData();

      formData.append('libelle', updatedProperty.value.libelle);
      formData.append('type', updatedProperty.value.type);
      if (updatedProperty.value.surface)
        formData.append('surface', updatedProperty.value.surface);
      formData.append('date', updatedProperty.value.date);
      formData.append('categorie', updatedProperty.value.categorie);
      formData.append('description', updatedProperty.value.description);
      if (updatedProperty.value.image)
        formData.append('image', updatedProperty.value.image);
      if (updatedProperty.value.localisation)
        formData.append('localisation', updatedProperty.value.localisation);

      const { data } = await axios.patch('property/' + updatedProperty.value._id, formData);

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Propriété non modifier.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Propriété bien modifier',
        });
        refreshPropertyTable();
      }
    };

    // delete property function
    const deleteProperty = async () => {
      const { data } = await axios.delete('property/' + updatedProperty.value._id);

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Propriété non supprimer.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Propriété bien supprimer',
        });
        refreshPropertyTable();
      }
    };

    return {
      tab,
      // new property form
      formProperty,
      libelle,
      selectType,
      optionsType: ['Publique', 'Privée'],
      date,
      surface,
      selectCategorie,
      optionsCategorie,
      //select of categories load function
      filterCategorie(val, update, abort) {
        if (optionsCategorie.value !== null) {
          update();
          return;
        }

        setTimeout(() => {
          update(async () => {
            const { data } = await axios.get('property-category');
            categories.splice(0, categories.length);
            data.forEach((element) => {
              categories.push(element.nom);
            });
            optionsCategorie.value = categories;
          });
        }, 500);
      },
      description,
      image,
      localisation,
      submitProperty,

      //property table
      propertyTableRef,
      refreshTable,
      visibleColumns: ref([
        'libelle',
        'type',
        'date',
        'surface',
        'categorie',
        'description',
        'image',
        'localisation',
        'actions',
      ]),
      filter,
      loading,
      pagination,
      columns,
      rows,
      onRequest,
      refreshPropertyTable,
      resetForm,

      //edit & delete property
      editDialog,
      deleteDialog,
      showEditDialog,
      showDeleteDialog,
      updatedProperty,
      editProperty,
      deleteProperty,

      imageDialog,
      imgUrl,
      previewImg,
    };
  },
};
</script>
