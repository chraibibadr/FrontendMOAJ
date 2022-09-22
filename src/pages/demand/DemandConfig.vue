<template>
  <q-page>
    <q-card class="no-border no-box-shadow">
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="typeTab" label="Type" />
        <q-tab name="departementTab" label="Departement" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="full-height" name="typeTab">
          <h5 class="text-center text-weight-bold">Configuration des types</h5>
          <div class="row justify-center">
            <q-form @submit="submitType" class="q-gutter-md col-6">
              <q-input
                ref="typeRef"
                filled
                clearable
                name="nom"
                v-model="type"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Requis']"
                label="Type de demande"
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
          </div>
        </q-tab-panel>

        <q-tab-panel class="full-height" name="departementTab">
          <h5 class="text-center text-weight-bold">
            Configuration des departements
          </h5>
          <div class="row justify-center">
            <q-form @submit="submitDept" class="q-gutter-md col-6">
              <q-input
                ref="deptRef"
                filled
                clearable
                name="dept"
                v-model="dept"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Requis']"
                label="Departement de demande"
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
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { axios } from 'boot/axios';
import { useQuasar } from 'quasar';

export default {
  name: 'DemandConfig',
  setup() {
    const $q = useQuasar();
    const type = ref(null);
    const typeRef = ref(null);
    const dept = ref(null);
    const deptRef = ref(null);

    function check(type, data) {
      if (!data) {
        $q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: type + ' non ajouter.',
        });
        return null;
      } else {
        $q.notify({
          type: 'positive',
          position: 'bottom-right',
          message: type + ' "' + data.nom + '" bien ajouter',
        });
        return data.value;
      }
    }

    const submitType = async () => {
      const { data } = await axios.post(
        'demande-type',
        { nom: type.value },
        { withCredentials: true }
      );
      type.value = check('Type', data);
      typeRef.value.resetValidation();
    };

    const submitDept = async () => {
      const { data } = await axios.post(
        'demande-departement',
        { nom: dept.value },
        { withCredentials: true }
      );
      dept.value = check('Departement', data);
      deptRef.value.resetValidation();
    };

    return {
      tab: ref('typeTab'),
      type,
      typeRef,
      dept,
      deptRef,
      submitType,
      submitDept,
    };
  },
};
</script>
