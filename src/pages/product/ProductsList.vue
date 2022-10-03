<template>
  <q-page>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
      narrow-indicator>
      <q-tab name="newProduct" label="Nouveau produit" />
      <q-tab @click="refreshProductTable" name="product" label="Les produits" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <!-- start of new product section -->
      <q-tab-panel class="full-height" name="newProduct">
        <q-card bordered>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6 text-center">Nouveau produit</div>
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
            <q-form @submit="submitProduct" class="q-gutter-md" ref="formProduct">
              <div class="row justify-center">
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model="libelle" lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" label="Libelle" />
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model.number="prix"
                  type="number" lazy-rules :rules="[val => !!val || 'Requis']" label="Prix" />
              </div>
              <div class="row justify-center">
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model.number="qte" type="number"
                  lazy-rules :rules="[val => !!val || 'Requis']" label="Quantité" />
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model.number="qteMin"
                  type="number" lazy-rules :rules="[val => !!val || 'Requis']" label="Quntité Min" />
              </div>
              <div class="row justify-center ">
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model.number="poids"
                  type="number" label="Poids" />
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled clearable v-model="dimension"
                  label="Dimension" />
              </div>
              <div class="row justify-center">
                <q-select class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled v-model="tags" use-input use-chips multiple
                  hide-dropdown-icon input-debounce="0" new-value-mode="add-unique" lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" label="Tags" />
                <q-select class="col-xs-12 col-sm-6 col-md-6 q-px-sm" :options="optionsCategorie"
                  transition-show="jump-up" transition-hide="scale" filled @filter="filterCategorie"
                  v-model="selectCategorie" lazy-rules :rules="[(val) => !!val || 'Requis']" label="Catégorie" />
              </div>
              <div class="row justify-center">
                <q-select class="col-xs-12 col-sm-6 col-md-6 q-px-sm" :options="optionsStatut" transition-show="jump-up"
                  transition-hide="scale" filled v-model="selectStatut" lazy-rules :rules="[(val) => !!val || 'Requis']"
                  label="Statut" />
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled autogrow clearable v-model="description"
                  lazy-rules :rules="[(val) => (val && val.length > 0) || 'Requis']" label="Description" />
              </div>
              <div class="row justify-center">
                <q-input class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled autogrow clearable v-model="commentaire"
                  lazy-rules :rules="[(val) => (val && val.length > 0) || 'Requis']" label="Commentaire" />
                <q-file class="col-xs-12 col-sm-6 col-md-6 q-px-sm" filled bottom-slots v-model="image" label="Image"
                  counter>
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" @click.stop.prevent />
                  </template>
                  <template v-slot:append>
                    <q-icon name="close" @click.stop.prevent="image = null" class="cursor-pointer" />
                  </template>
                </q-file>
              </div>
              <div class="row justify-start q-px-sm">
                <q-btn label="Ajouter" type="submit" color="primary" />
                <q-btn @click="resetForm" label="Réinitialiser" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-tab-panel>
      <!-- end of new product section -->

      <!-- start of product list section -->
      <q-tab-panel class="full-height" name="product">
        <q-table ref="productTableRef" title="Les produits" no-data-label="Aucun enregistrements trouvés"
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
          <template v-slot:body-cell-statut="props">
            <q-td :props="props">
              <div v-if="props.value == 'En rupture'">
                <q-badge color="red" :label="props.value" />
              </div>
              <div v-if="props.value == 'En attente'">
                <q-badge color="orange" :label="props.value" />
              </div>
              <div v-if="props.value == 'En stock'">
                <q-badge color="green" :label="props.value" />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-poids="props">
            <q-td :props="props">
              <div v-if="!props.value"><strong>Sans</strong></div>
              <div v-if="props.value">{{ props.value }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-dimension="props">
            <q-td :props="props">
              <div v-if="!props.value"><strong>Sans</strong></div>
              <div v-if="props.value">{{ props.value }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <div v-if="props.value">
                <q-btn @click="previewImg(props.value)" push round>
                  <q-avatar>
                    <img :src="'http://localhost:3000/' + props.value" />
                  </q-avatar>
                </q-btn>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-tags="props">
            <q-td :props="props">
              <template v-bind:key="p" v-for="p in props.value">
                <q-badge class="q-mx-xs" color="blue" :label="p" />
              </template>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn dense round flat color="green" @click="showEditDialog(props.row)" icon="edit" />
              <q-btn dense round flat color="red" @click="showDeleteDialog(props.row)" icon="delete" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <!-- end of product list section -->
    </q-tab-panels>
  </q-page>

  <!-- start of edit dialog -->
  <q-dialog v-model="editDialog">
    <q-card class="fit">
      <q-card-section class="bg-grey-3">
        <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup />
        <div class="text-h6">Modifier le produit</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section>
        <q-form>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Libelle </q-item-label>
                <q-input v-model="updatedProduct.libelle" dense outlined lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Prix Unitaire </q-item-label>
                <q-input v-model="updatedProduct.prix" dense outlined lazy-rules :rules="[val => !!val || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Qunatité </q-item-label>
                <q-input v-model="updatedProduct.qte" dense outlined lazy-rules :rules="[val => !!val || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Quantité Min </q-item-label>
                <q-input v-model="updatedProduct.qteMin" dense outlined lazy-rules
                  :rules="[val => !!val || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Poids </q-item-label>
                <q-input dense outlined clearable v-model.number="updatedProduct.poids" type="number" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Dimension </q-item-label>
                <q-input dense outlined clearable v-model="updatedProduct.dimension" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Tags </q-item-label>
                <q-select dense outlined v-model="updatedProduct.tags" use-input use-chips multiple hide-dropdown-icon
                  input-debounce="0" new-value-mode="add-unique" lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Catégorie </q-item-label>
                <q-select :options="optionsCategorie" transition-show="jump-up" transition-hide="scale" dense outlined
                  @filter="filterCategorie" v-model="updatedProduct.categorie" lazy-rules
                  :rules="[(val) => !!val || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class=" q-pb-xs"> Statut </q-item-label>
                <q-select :options="optionsStatut" transition-show="jump-up" transition-hide="scale" dense outlined
                  v-model="updatedProduct.statut" lazy-rules :rules="[(val) => !!val || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Description </q-item-label>
                <q-input v-model="updatedProduct.description" autogrow dense outlined lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Commentaire </q-item-label>
                <q-input v-model="updatedProduct.commentaire" autogrow dense outlined lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Requis']" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs"> Image </q-item-label>
                <q-file dense outlined bottom-slots v-model="updatedProduct.image" counter>
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" @click.stop.prevent />
                  </template>
                  <template v-slot:append>
                    <q-icon name="close" @click.stop.prevent="updatedProduct.image = null" class="cursor-pointer" />
                  </template>
                </q-file>
              </q-item-section>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Modifier" color="primary" dense v-close-popup @click="editProduct"></q-btn>
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
          Voulez-vous vraiment supprimer ce produit !</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="deleteProduct" flat label="Confirmer" color="red" v-close-popup />
        <q-btn flat label="Annuler" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- end of delete confirmation dialog -->

  <!-- start of image preview dialog-->
  <q-dialog v-model="imageDialog">
    <q-img :src="'http://localhost:3000/' + imgUrl" />
  </q-dialog>
  <!-- end of image preview dialog-->
</template>

<script>
import { axios } from 'boot/axios';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';

// product table columns
const columns = [
  {
    name: '_id',
    required: false,
    field: '_id',
    label: 'ID',
    align: 'center',
    sortable: true,
  },
  {
    name: 'image',
    required: true,
    field: 'image',
    label: 'Image',
    align: 'center',
  },
  {
    name: 'prix',
    required: true,
    field: 'prix',
    label: 'Prix Unitaire',
    align: 'center',
  },
  {
    name: 'quantite',
    required: true,
    field: 'quantite',
    label: 'Quantité',
    align: 'center',
    sortable: true,
  },
  {
    name: 'quantiteMin',
    required: true,
    field: 'quantiteMin',
    label: 'Quantité Min',
    align: 'center',
    sortable: true,
  },
  {
    name: 'poids',
    required: true,
    field: 'poids',
    label: 'Poids',
    align: 'center',
  },
  {
    name: 'dimension',
    required: true,
    field: 'dimension',
    label: 'Dimension',
    align: 'center',
    sortable: true,
  },
  {
    name: 'tags',
    required: true,
    field: 'tags',
    label: 'Tags',
    align: 'center',
  },
  {
    name: 'categorie',
    required: true,
    field: 'categorie',
    label: 'Catégorie',
    align: 'center',
  },
  {
    name: 'statut',
    required: true,
    field: 'statut',
    label: 'Statut',
    align: 'center',
  },
  {
    name: 'description',
    required: true,
    field: 'description',
    label: 'Description',
    align: 'center',
  },
  {
    name: 'commentaire',
    required: true,
    field: 'commentaire',
    label: 'Commentaire',
    align: 'center',
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    align: 'center',
  },
];

export default {
  name: 'ProductList',
  setup() {
    const $q = useQuasar();
    const tab = ref('product');

    // new product form
    const formProduct = ref(null);
    const categories = [];
    const libelle = ref(null);
    const prix = ref(null);
    const qte = ref(null);
    const qteMin = ref(null);
    const poids = ref(null);
    const dimension = ref(null);
    const tags = ref(null);
    const selectCategorie = ref(null);
    const optionsCategorie = ref(null);
    const selectStatut = ref(null);
    const description = ref(null);
    const commentaire = ref(null);
    const image = ref(null);

    // new product form functions
    function resetForm() {
      libelle.value =
        prix.value =
        qte.value =
        qteMin.value =
        poids.value =
        dimension.value =
        tags.value =
        selectCategorie.value =
        selectStatut.value =
        description.value =
        commentaire.value =
        image.value =
        optionsCategorie.value =
        null;
      formProduct.value.resetValidation();
    }

    // submit function
    const submitProduct = async () => {
      let formData = new FormData();

      formData.append('libelle', libelle.value);
      formData.append('prix', prix.value);
      formData.append('quantite', qte.value);
      formData.append('quantiteMin', qteMin.value);
      if (poids.value) formData.append('poids', poids.value);
      if (dimension.value) formData.append('dimension', dimension.value);
      Object.values(tags.value).forEach(tag => {
        formData.append('tags[]', tag);
      });
      formData.append('categorie', selectCategorie.value);
      formData.append('statut', selectStatut.value);
      formData.append('description', description.value);
      formData.append('commentaire', commentaire.value);
      if (image.value) formData.append('image', image.value);

      const { data } = await axios.post('product', formData);

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Produit non ajouter.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Produit bien ajouter',
        });
        resetForm();
      }
    };

    // product table
    const productTableRef = ref();
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

    // product table functions
    //loading data function
    async function loadProduct(page, limit, filter, sortBy, sort) {
      const { data } = await axios.get('product', {
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
        const returnedData = await loadProduct(
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
      productTableRef.value.requestServerInteraction();
    });

    // refresh product table
    function refreshProductTable() {
      setTimeout(() => {
        productTableRef.value.requestServerInteraction();
      }, 500);
    }

    // edit & delete product
    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const updatedProduct = ref({});

    // edit & delete demand functions
    // show edit dialog function
    function showEditDialog(item) {
      // updatedDemand.value = item;
      updatedProduct.value._id = item._id;
      updatedProduct.value.libelle = item.libelle;
      updatedProduct.value.prix = item.prix;
      updatedProduct.value.qte = item.quantite;
      updatedProduct.value.qteMin = item.quantiteMin;
      updatedProduct.value.poids = item.poids;
      updatedProduct.value.dimension = item.dimension;
      updatedProduct.value.tags = item.tags;
      updatedProduct.value.categorie = item.categorie;
      updatedProduct.value.statut = item.statut;
      updatedProduct.value.description = item.description;
      updatedProduct.value.commentaire = item.commentaire;

      editDialog.value = true;
    }

    // show delete dialog function
    function showDeleteDialog(item) {
      updatedProduct.value._id = item._id;
      deleteDialog.value = true;
    }

    // edit product function
    const editProduct = async () => {
      let formData = new FormData();

      formData.append('libelle', updatedProduct.value.libelle);
      formData.append('prix', updatedProduct.value.prix);
      formData.append('quantite', updatedProduct.value.qte);
      formData.append('quantiteMin', updatedProduct.value.qteMin);
      if (updatedProduct.value.poids) formData.append('poids', updatedProduct.value.poids);
      if (updatedProduct.value.dimension) formData.append('dimension', updatedProduct.value.dimension);
      Object.values(updatedProduct.value.tags).forEach(tag => {
        formData.append('tags[]', tag);
      });
      formData.append('categorie', updatedProduct.value.categorie);
      formData.append('statut', updatedProduct.value.statut);
      formData.append('description', updatedProduct.value.description);
      formData.append('commentaire', updatedProduct.value.commentaire);
      if (updatedProduct.value.image) formData.append('image', updatedProduct.value.image);

      const { data } = await axios.patch('product/' + updatedProduct.value._id, formData);

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Produit non modifier.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Produit bien modifier',
        });
        refreshProductTable();
      }
    };

    // delete product function
    const deleteProduct = async () => {
      const { data } = await axios.delete('product/' + updatedProduct.value._id);

      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'Produit non supprimer.',
        });
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: 'Produit bien supprimer',
        });
        refreshProductTable();
      }
    };

    return {
      tab,
      // new product form
      formProduct,
      libelle,
      prix,
      qte,
      qteMin,
      poids, dimension,
      tags,
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
            const { data } = await axios.get('product-category');
            categories.splice(0, categories.length);
            data.forEach((element) => {
              categories.push(element.nom);
            });
            optionsCategorie.value = categories;
          });
        }, 500);
      },
      selectStatut,
      optionsStatut: ['En stock', 'En attente', 'En rupture'],
      description,
      commentaire,
      image,
      submitProduct,

      //product table
      productTableRef,
      visibleColumns: ref([]),
      filter,
      loading,
      pagination,
      columns,
      rows,
      onRequest,
      refreshProductTable,
      resetForm,

      //edit & delete product
      editDialog,
      deleteDialog,
      showEditDialog,
      showDeleteDialog,
      updatedProduct,
      editProduct,
      deleteProduct,
      imageDialog,
      imgUrl,
      previewImg,
    };
  },
};
</script>
