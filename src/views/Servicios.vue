<template>
    <div id="reserva" class="home">
      <div class="container">
        <b-breadcrumb align="is-left" size="is-large">
          <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item>
          <b-breadcrumb-item tag='router-link' to="/documentation" active>Servicios</b-breadcrumb-item>
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
                :loading="false" :focusable="true" :mobile-cards="false" :searchable="true" :paginated="true"
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
              <b-input v-model="inputNombre" type="date"></b-input>
            </b-field>
            <b-field label="Descripción">
              <b-input v-model="inputDescripcion" type="date"></b-input>
            </b-field>
            <b-field label="Precio">
              <b-numberinput v-model="inputPrecio" type="date"></b-numberinput>
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
      prefixRuta: "reserva",
      inputNombre:'',
      inputDescripcion:'',
      inputPrecio:0,
      inputTipo:1,

      tablaDatos: [],
      columns: [
        {
          field: "inputNombre",
          label: "Nombre",
          searchable: true,
        },
        {
          field: "inputDescripcion",
          label: "Descripcion",
          searchable: true,
        },
        {
          field: "inputPrecio",
          label: "Precio",
          searchable: true,
        },
        
      ],
      tablaEstados: [
        { id: 1, descripcion: "Pendiente" },
        { id: 2, descripcion: "Confirmada" },
        { id: 3, descripcion: "Cancelada" }
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

            for (let i = 0; i < this.tablaDatos.length; i++) {
              this.tablaDatos[i]["estadoDesc"] = this.tablaEstados.find(x => x.id === this.tablaDatos[i]["estado"]).descripcion;
            }
          }
        });
    },

    submit() {
      let request = {
        fechaCreacion: this.inputFechaCreacion,
        fechaLlegada: this.inputFechaLlegada,
        fechaSalida: this.inputFechaSalida,
        horaLlegada: this.inputHoraLlegada,
        horaSalida: this.inputHoraSalida,
        estado: this.inputEstado,
        numeroPersonas: this.inputNumeroPersonas,
        detalles: this.inputDetalles,
        total: this.inputTotal
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

    deleteFunction(reserva) {
      fetch(process.env.VUE_APP_TITLE + ":3000/"  + this.prefixRuta + "/" + reserva.id, {
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

    editFunction(reserva) {
      this.isAdd = false;
      this.isEdit = true;
      this.currentId = reserva.id;
      this.inputFechaCreacion = reserva.fechaCreacion;
      this.inputFechaLlegada = reserva.fechaLlegada;
      this.inputFechaSalida = reserva.fechaSalida;
      this.inputHoraLlegada = reserva.horaLlegada;
      this.inputHoraSalida = reserva.horaSalida;
      this.inputEstado = reserva.estado;
      this.inputNumeroPersonas = reserva.numeroPersonas;
      this.inputDetalles = reserva.detalles;
      this.inputTotal = reserva.total;
      this.showModalCreateEdit = true;
    },
  },
};
</script>