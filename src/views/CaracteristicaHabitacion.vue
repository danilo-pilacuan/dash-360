<template>
    <div id="caracteristicaHabitacion" class="home">
      <div class="container">
        <b-breadcrumb size="is-large">
          <!-- <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item> -->
          <b-breadcrumb-item tag='router-link' to="/documentation" active>Característica Habitación</b-breadcrumb-item>
        </b-breadcrumb>
        <div class="block">
          <div class="columns">
            <div class="column">
              <b-button slot="right" type="is-primary" @click="createFunction">Crear</b-button>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-table :data="tablaDatos" :bordered="true" :striped="true" :narrowed="false" :hoverable="false"
                :loading="false" :focusable="false" :mobile-cards="false" :searchable="true" :paginated="true"
                :per-page="20">
                <template v-for="column in columns">
                  <b-table-column v-bind="column" :key="column.id">
                    <template v-if="column.searchable && !column.numeric" #searchable="props">
                      <b-input v-model="props.filters[props.column.field]" placeholder="Buscar..." icon="magnify"
                        size="is-small" />
                    </template>
                    <template v-slot="props">
                      {{ props.row[column.field] }}
                    </template>
                  </b-table-column>
                </template>
                <b-table-column field="actions" label="Acciones" v-slot="props">
                  <div class="buttons">
                    <b-button rounded type="is-warning" icon-left="pencil" @click="editFunction(props.row)">
                    </b-button>
                    <b-button rounded type="is-danger" icon-left="delete" @click="deleteFunction(props.row)">
                    </b-button>
                  </div>
                </b-table-column>
              </b-table>
            </div>
          </div>
        </div>
      </div>
      <b-modal v-model="showModalCreateEdit">
  <form @submit.prevent="submit">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Crear {{ prefixRuta }}</p>
        <button type="button" class="delete" @click="showModalCreateEdit = false" />
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <b-field label="Nombre">
              <b-input v-model="inputNombre"></b-input>
            </b-field>
            <b-field label="Descripción">
              <b-input v-model="inputDescripcion" type="textarea"></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Tipo">
              <b-input v-model="inputTipo"></b-input>
            </b-field>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="columns">
          <div class="column">
            <b-button type="is-primary" v-if="isAdd" @click="submit" label="Crear" />
            <b-button type="is-primary" v-else @click="submit" label="Editar" />
          </div>
          <div class="column">
            <b-button type="is-danger" @click="showModalCreateEdit = false" label="Cancelar" />
          </div>
        </div>
      </footer>
    </div>
  </form>
</b-modal>
</div>
</template>
<script>
import HeroBar from '@/components/HeroBar.vue'

export default {
  components: {
    HeroBar
  },
  data() {
    return {
      prefixRuta: "caracteristicaHabitacion",
      inputNombre: null,
      inputDescripcion: null,
      inputTipo: null,

      tablaDatos: [],
      columns: [
        {
          field: "nombre",
          label: "Nombre",
          searchable: true,
        },
        {
          field: "descripcion",
          label: "Descripción",
          searchable: true,
        },
        {
          field: "tipo",
          label: "Tipo",
          searchable: true,
        }
      ],
      isAdd: false,
      isEdit: false,

      showModalCreateEdit: false,
      currentId: null
    };
  },
  created() {
    this.fetchDatos();
  },
  methods: {
    fetchDatos() {
      fetch(process.env.VUE_APP_TITLE + ":3000/"  + this.prefixRuta, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.tablaDatos = data;
          }
        });
    },

    submit() {
      let request = {
        nombre: this.inputNombre,
        descripcion: this.inputDescripcion,
        tipo: this.inputTipo,
      };

      let url = process.env.VUE_APP_TITLE + ":3000/"  + this.prefixRuta;
      let method = this.isAdd ? "POST" : "PUT";
      if (this.isEdit) url += "/" + this.currentId;

      fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(request)
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.fetchDatos();
            this.showModalCreateEdit = false;
          }
        });
    },

    deleteFunction(caracteristicaHabitacion) {
      fetch(process.env.VUE_APP_TITLE + ":3000/"  + this.prefixRuta + "/" + caracteristicaHabitacion.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.fetchDatos();
          }
        });
    },

    createFunction() {
      this.isAdd = true;
      this.isEdit = false;
      this.showModalCreateEdit = true;
    },

    editFunction(caracteristicaHabitacion) {
      this.isAdd = false;
      this.isEdit = true;
      this.currentId = caracteristicaHabitacion.id;
      this.inputNombre = caracteristicaHabitacion.nombre;
      this.inputDescripcion = caracteristicaHabitacion.descripcion;
      this.inputTipo = caracteristicaHabitacion.tipo;
      this.showModalCreateEdit = true;
    },
  },
};
</script>