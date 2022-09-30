<template>
  <q-page>
    <q-card class="no-border no-box-shadow">
      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="typeTab" label="Type" />
        <q-tab name="deptTab" label="Departement" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- start of type configuration tab -->
        <q-tab-panel class="full-height" name="typeTab">
          <div class="row justify-center q-gutter-md">
            <!-- start of new demand type form -->
            <q-card class="col-xs-12 col col-md-4">
              <q-card-section>
                <h5 class="text-center text-weight-bold">
                  Ajout d'un type de demande
                </h5>
                <q-form @submit="newType" class="q-gutter-md q-pa-lg">
                  <q-input ref="typeRef" filled clearable name="nom" v-model="type" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || 'Requis']" label="Type de demande" />
                  <div>
                    <q-btn class="full-width" label="Ajouter" type="submit" color="primary" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
            <!-- end of new type category form -->

            <!-- start of demand type list -->
            <q-table class="col-xs-12 col col-md-7" title="Les types d'une demande"
              no-data-label="Aucun enregistrements trouvés"
              no-results-label="Aucun enregistrements correspondants trouvés" loading-label="Chargement"
              rows-per-page-label="Element par page" :rows="typeRows" :columns="typeColumns" row-key="name"
              :filter="typeFilter">
              <template v-slot:top-right="props">
                <q-input dense v-model="typeFilter" placeholder="Filtrer">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="props.toggleFullscreen" class="q-ml-md" />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn dense round flat color="red" @click="showTypeDeleteDialog(props.row)" icon="delete"></q-btn>
                </q-td>
              </template>
            </q-table>
            <!-- end of property category list -->
          </div>
        </q-tab-panel>
        <!-- end of type configuration tab -->

        <!-- start of departement configuration tab -->
        <q-tab-panel class="full-height" name="deptTab">
          <div class="row justify-center q-gutter-md">
            <!-- start of new demand type form -->
            <q-card class="col-xs-12 col col-md-4">
              <q-card-section>
                <h5 class="text-center text-weight-bold">
                  Ajout d'un departement de demande
                </h5>
                <q-form @submit="newDept" class="q-gutter-md q-pa-lg">
                  <q-input ref="deptRef" filled clearable name="nom" v-model="dept" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || 'Requis']" label="Departement de demande" />
                  <div>
                    <q-btn class="full-width" label="Ajouter" type="submit" color="primary" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
            <!-- end of new demand departement form -->

            <!-- start of demand type list -->
            <q-table class="col-xs-12 col col-md-7" title="Les departements d'une demande"
              no-data-label="Aucun enregistrements trouvés"
              no-results-label="Aucun enregistrements correspondants trouvés" loading-label="Chargement"
              rows-per-page-label="Element par page" :rows="deptRows" :columns="deptColumns" row-key="name"
              :filter="deptFilter">
              <template v-slot:top-right="props">
                <q-input dense v-model="deptFilter" placeholder="Filtrer">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="props.toggleFullscreen" class="q-ml-md" />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn dense round flat color="red" @click="showDeptDeleteDialog(props.row)" icon="delete"></q-btn>
                </q-td>
              </template>
            </q-table>
            <!-- end of demand departement list -->
          </div>
        </q-tab-panel>
        <!-- end of departement configuration tab -->
      </q-tab-panels>
    </q-card>
  </q-page>

  <!-- start of delete type confirmation dialog -->
  <q-dialog v-model="typeDeleteDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Suppression</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="row items-center">
        <span class="q-mx-sm"> Voulez-vous vraiment supprimer ce type !</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn @click="deleteType" flat label="Confirmer" color="red" v-close-popup />
        <q-btn flat label="Annuler" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- end of delete type confirmation dialog -->

  <!-- start of delete departement confirmation dialog -->
  <q-dialog v-model="deptDeleteDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Suppression</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="row items-center">
        <span class="q-mx-sm">
          Voulez-vous vraiment supprimer ce departement !</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn @click="deleteDept" flat label="Confirmer" color="red" v-close-popup />
        <q-btn flat label="Annuler" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- end of delete departement confirmation dialog -->
</template>

<script>
import { onMounted, ref } from 'vue';
import { axios } from 'boot/axios';
import { useQuasar } from 'quasar';

const typeColumns = [
  {
    name: 'type',
    required: true,
    label: 'Type',
    align: 'left',
    field: 'nom',
    sortable: true,
  },
  {
    name: 'actions',
    required: true,
    align: 'center',
    label: 'Actions',
  },
];

const deptColumns = [
  {
    name: 'departement',
    required: true,
    label: 'Departement',
    align: 'left',
    field: 'nom',
    sortable: true,
  },
  {
    name: 'actions',
    required: true,
    align: 'center',
    label: 'Actions',
  },
];

async function loadTypes() {
  const { data } = await axios.get('demande-type');
  return data;
}

async function loadDepts() {
  const { data } = await axios.get('demande-departement');
  return data;
}

export default {
  name: 'DemandConfig',
  setup() {
    const $q = useQuasar();

    // type configuration
    const type = ref(null);
    const typeRef = ref(null);
    const typeRows = ref([]);
    const typeDeleteDialog = ref(false);
    const updatedType = ref({});

    const newType = async () => {
      const { data } = await axios.post('demande-type', { nom: type.value, });

      if (data) {
        showMessage('Type bien ajouter', 'positive');
        type.value = '';
        typeRef.value.resetValidation();
        typeRows.value = await loadTypes();
      } else showMessage('Type non ajouter', 'negative');
    };

    function showTypeDeleteDialog(item) {
      updatedType.value._id = item._id;

      typeDeleteDialog.value = true;
    }

    // delete property category function
    const deleteType = async () => {
      const { data } = await axios.delete('demande-type/' + updatedType.value._id);

      if (data) {
        typeRows.value = await loadTypes();
        showMessage('Type bien supprimer', 'positive');
      } else showMessage('Type non supprimer', 'negative');
    };

    // departement configuration
    const dept = ref(null);
    const deptRef = ref(null);
    const deptRows = ref([]);
    const deptDeleteDialog = ref(false);
    const updatedDept = ref({});

    const newDept = async () => {
      const { data } = await axios.post('demande-departement', { nom: dept.value, });

      if (data) {
        showMessage('Departement bien ajouter', 'positive');
        dept.value = '';
        deptRef.value.resetValidation();
        deptRows.value = await loadDepts();
      } else showMessage('Departement non ajouter', 'negative');
    };

    function showDeptDeleteDialog(item) {
      updatedDept.value._id = item._id;

      deptDeleteDialog.value = true;
    }

    // delete demand departement function
    const deleteDept = async () => {
      const { data } = await axios.delete('demande-departement/' + updatedDept.value._id);

      if (data) {
        deptRows.value = await loadDepts();
        showMessage('Departement bien supprimer', 'positive');
      } else showMessage('Departement non supprimer', 'negative');
    };

    function showMessage(message, type) {
      $q.notify({
        type: type,
        position: 'bottom-right',
        message: message,
      });
    }

    onMounted(async () => {
      typeRows.value = await loadTypes();
      deptRows.value = await loadDepts();
    });

    return {
      tab: ref('typeTab'),

      // type configuration
      typeFilter: ref(''),
      typeColumns,
      typeRows,
      type,
      typeRef,
      newType,
      typeDeleteDialog,
      showTypeDeleteDialog,
      updatedType,
      deleteType,

      // departement configuration
      deptFilter: ref(''),
      deptColumns,
      deptRows,
      dept,
      deptRef,
      newDept,
      deptDeleteDialog,
      showDeptDeleteDialog,
      updatedDept,
      deleteDept,
    };
  },
};
</script>
