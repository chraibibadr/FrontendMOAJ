<template>
  <q-page padding>
    <div class="row justify-center q-gutter-md">
      <!-- start of new property category form -->
      <q-card class="col-xs-12 col col-md-4">
        <q-card-section>
          <h5 class="text-center text-weight-bold">
            Ajout d'une catégorie de propriété
          </h5>
          <q-form @submit="newCategory" class="q-gutter-md q-pa-lg">
            <q-input
              ref="categorieRef"
              filled
              clearable
              name="nom"
              v-model="category"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Requis']"
              label="Catégorie de propriété"
            />
            <div>
              <q-btn
                class="full-width"
                label="Ajouter"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      <!-- end of new property category form -->

      <!-- start of property category list -->
      <q-table
        class="col-xs-12 col col-md-7"
        title="Les catégories d'une propriété"
        no-data-label="Aucun enregistrements trouvés"
        no-results-label="Aucun enregistrements correspondants trouvés"
        loading-label="Chargement"
        rows-per-page-label="Element par page"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :filter="filter"
      >
        <template v-slot:top-right="props">
          <q-input dense v-model="filter" placeholder="Filtrer">
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

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
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
      <!-- end of property category list -->
    </div>
  </q-page>

  <!-- start of delete confirmation dialog -->
  <q-dialog v-model="deleteDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Suppression</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="row items-center">
        <span class="q-mx-sm">
          Voulez-vous vraiment supprimer cette catégorie !</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          @click="deleteCategory"
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

const columns = [
  {
    name: 'category',
    required: true,
    label: 'Catégorie',
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

async function loadCategory() {
  const { data } = await axios.get('property-category');
  return data;
}

export default {
  name: 'PropertyConfig',
  setup() {
    const $q = useQuasar();
    const category = ref(null);
    const categorieRef = ref(null);
    const rows = ref([]);
    const deleteDialog = ref(false);
    const updatedCategory = ref({});

    function showMessage(message, type) {
      $q.notify({
        type: type,
        position: 'bottom-right',
        message: message,
      });
    }

    const newCategory = async () => {
      const { data } = await axios.post('property-category', {
        nom: category.value,
      });

      if (data) {
        showMessage('Catégorie bien ajouter', 'positive');
        category.value = '';
        categorieRef.value.resetValidation();
        rows.value = await loadCategory();
      } else showMessage('Catégorie non ajouter', 'negative');
    };

    function showDeleteDialog(item) {
      updatedCategory.value._id = item._id;

      deleteDialog.value = true;
    }

    // delete property category function
    const deleteCategory = async () => {
      const { data } = await axios.delete(
        'property-category/' + updatedCategory.value._id
      );

      if (data) {
        rows.value = await loadCategory();
        showMessage('Catégorie bien supprimer', 'positive');
      } else {
        showMessage('Catégorie bien supprimer', 'negative');
      }
    };

    onMounted(async () => {
      rows.value = await loadCategory();
    });

    return {
      filter: ref(''),
      columns,
      rows,
      category,
      categorieRef,
      newCategory,
      deleteDialog,
      showDeleteDialog,
      updatedCategory,
      deleteCategory,
    };
  },
};
</script>
