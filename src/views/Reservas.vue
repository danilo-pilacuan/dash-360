<template>
    <div id="reserva" class="home">
      <div class="container">
        <b-breadcrumb align="is-left" size="is-large">
          <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item>
          <b-breadcrumb-item tag='router-link' to="/documentation" active>Reserva</b-breadcrumb-item>
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
                      <div v-if="typeof props.row[column.field] === 'object'">
                      {{ props.row[column.field][column.subField] }}
                    </div>
                    <div v-else>
                      {{ column.field=='estado'?(props.row[column.field]==1?"Pendiente":(props.row[column.field]==2?"Confirmada":"Cancelada")):props.row[column.field] }}
                    </div>
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
            <b-field label="Fecha de Creación">
              <b-input v-model="inputFechaCreacion" type="date"></b-input>
            </b-field>
            <b-field label="Fecha de Llegada">
              <b-input v-model="inputFechaLlegada" type="date"></b-input>
            </b-field>
            <b-field label="Fecha de Salida">
              <b-input v-model="inputFechaSalida" type="date"></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Hora de Llegada">
              <b-timepicker v-model="inputHoraLlegada" format="is24"></b-timepicker>
            </b-field>
            <b-field label="Hora de Salida">
              <b-timepicker v-model="inputHoraSalida" format="is24"></b-timepicker>
            </b-field>
            <b-field label="Estado">
              <b-select placeholder="Seleccionar estado" v-model="inputEstado">
                <option v-for="option in tablaEstados" :value="option.id" :key="option.id">
                  {{ option.descripcion }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Número de Personas">
              <b-input v-model="inputNumeroPersonas" type="number"></b-input>
            </b-field>
            <b-field label="Detalles">
              <b-input v-model="inputDetalles" type="textarea"></b-input>
            </b-field>
            <b-field label="Total">
              <b-input v-model="inputTotal" type="number"></b-input>
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
      inputFechaCreacion: null,
      inputFechaLlegada: null,
      inputFechaSalida: null,
      inputHoraLlegada: null,
      inputHoraSalida: null,
      inputEstado: null,
      inputNumeroPersonas: null,
      inputDetalles: "",
      inputTotal: null,

      tablaDatos: [],
      columns: [
        {
          field: "fechaCreacion",
          label: "Fecha de Creación",
          searchable: true,
        },
        {
          field: "fechaLlegada",
          label: "Fecha de Llegada",
          searchable: true,
        },
        {
          field: "fechaSalida",
          label: "Fecha de Salida",
          searchable: true,
        },
        {
          field: "horaLlegada",
          label: "Hora de Llegada",
          searchable: true,
        },
        {
          field: "horaSalida",
          label: "Hora de Salida",
          searchable: true,
        },
        {
          field: "estado",
          label: "Estado Pago",
          searchable: true
        },
        {
          field: "numeroPersonas",
          label: "Número de Personas",
          searchable: true
        },
        {
          field: "detalles",
          label: "Detalles",
          searchable: true
        },
        {
          field: "total",
          label: "Total",
          searchable: true
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
      fetch(process.env.VUE_APP_API + this.prefixRuta, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.tablaDatos = data["resultado"];

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

      let url = process.env.VUE_APP_API + this.prefixRuta;
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