<template>
    <div id="reserva" class="home">
      <div class="container-fluid m-3">
        <b-breadcrumb size="is-large">
          <!-- <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item> -->
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
              <h2 class="subtitle">Reservas Activas</h2>
              <b-table :data="tablaDatosActivas" :bordered="true" :striped="true" :narrowed="true" :hoverable="false"
                :loading="false" :focusable="false" :mobile-cards="false" :searchable="false" :paginated="false">
                <template v-for="column in columns">
                  <b-table-column v-bind="column" :key="column.id">
                    <template v-if="column.searchable && !column.numeric" #searchable="props">
                      <b-input v-model="props.filters[props.column.field.subField]" placeholder="Buscar..." icon="magnify"
                        size="is-small" />
                    </template>
                    <template v-slot="props">
                      <div v-if="typeof props.row[column.field] === 'object'">
                      {{ props.row[column.field][column.subField] }}
                    </div>
                    <div v-else-if="column.field=='fechaCreacion' || column.field=='fechaLlegada' || column.field=='fechaSalida'">
                      <!-- <b-datetimepicker :value="new Date(props.row[column.field])" disabled></b-datetimepicker> -->
                      {{ new Date(props.row[column.field]).toLocaleString('en-GB', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) }}
                    </div>
                    <div v-else>
                      {{ column.field=='estado'?(props.row[column.field]==1?"Pendiente":(props.row[column.field]==2?"Confirmada":"Cancelada")):props.row[column.field] }}
                    </div>
                    </template>
                  </b-table-column>
                </template>
                <b-table-column field="actions" label="Acciones" v-slot="props">
                  <div class="buttons">
                    <!-- <b-button rounded type="is-link" size="is-small" icon-left="printer" @click="editFunction(props.row)">
                      Imprimir Factura
                    </b-button> -->
                    <b-button rounded type="is-warning" size="is-small" icon-left="pencil" @click="editFunction(props.row)">
                      Editar
                    </b-button>
                    <b-button rounded type="is-danger" size="is-small" icon-left="delete" @click="deleteFunction(props.row)">
                      Eliminar
                    </b-button>
                  </div>
                </b-table-column>
              </b-table>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <h2 class="subtitle">Reservas Finalizadas</h2>
              <b-table :data="tablaDatosInactivas" :bordered="true" :striped="true" :narrowed="true" :hoverable="false"
                :loading="false" :focusable="false" :mobile-cards="false" :searchable="false" :paginated="false">
                <template v-for="column in columns">
                  <b-table-column v-bind="column" :key="column.id">
                    <template v-if="column.searchable && !column.numeric" #searchable="props">
                      <b-input v-model="props.filters[props.column.field.subField]" placeholder="Buscar..." icon="magnify"
                        size="is-small" />
                    </template>
                    <template v-slot="props">
                      <div v-if="typeof props.row[column.field] === 'object'">
                      {{ props.row[column.field][column.subField] }}
                    </div>
                    <div v-else-if="column.field=='fechaCreacion' || column.field=='fechaLlegada' || column.field=='fechaSalida'">
                      <!-- <b-datetimepicker :value="new Date(props.row[column.field])" disabled></b-datetimepicker> -->
                      {{ new Date(props.row[column.field]).toLocaleString('en-GB', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) }}
                    </div>
                    <div v-else>
                      {{ column.field=='estado'?(props.row[column.field]==1?"Pendiente":(props.row[column.field]==2?"Confirmada":(props.row[column.field]==3?"Cancelada":"Finalizada"))):props.row[column.field] }}
                    </div>
                    </template>
                  </b-table-column>
                </template>
                <b-table-column field="actions" label="Acciones" v-slot="props">
                  <div class="buttons">
                    <!-- <b-button rounded type="is-link" size="is-small" icon-left="printer" @click="editFunction(props.row)">
                      Imprimir Factura
                    </b-button> -->
                    <b-button rounded type="is-warning" size="is-small" icon-left="pencil" @click="editFunction(props.row)">
                      Editar
                    </b-button>
                    <b-button rounded type="is-danger" size="is-small" icon-left="delete" @click="deleteFunction(props.row)">
                      Eliminar
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
        <p class="modal-card-title">{{ isEdit?"Editar":"Crear" }} {{ prefixRuta }}</p>
        <button type="button" class="delete" @click="showModalCreateEdit = false"></button>
      </header>
      <section class="modal-card-body">

        
        <div class="columns">
          <div class="column is-6">
            <b-field label="Habitación">
              <b-select placeholder="Seleccionar habitacion" v-model="inputHabitacion">
                <option v-for="option in tablaHabitaciones" :value="option.id" :key="option.id">
                  Número: {{ option.numero }} - Piso: {{ option.pido }} - Tarifa: {{ option.tarifa.descripcion }} - Pax: {{ option.tarifa.pax }} - Valor: ${{ option.tarifa.valor }}
                </option>
              </b-select>
            </b-field>
            <b-field label="Cliente">
              <b-select placeholder="Seleccionar cliente" v-model="inputCliente">
                <option v-for="option in tablaClientes" :value="option.cedula" :key="option.id">
                  Cédula: {{ option.cedula }} - Nombre: {{ option.nombres }} {{ option.apellidos }}
                </option>
              </b-select>
            </b-field>
            <b-field label="Fecha de Creación">
              <b-datetimepicker
                v-model="inputFechaCreacion"
                placeholder="Escoger Fecha..."
                icon="calendar-today"
                disabled>
            </b-datetimepicker>

            </b-field>
            <b-field label="Fecha de Llegada">
              <b-datetimepicker v-model="inputFechaLlegada"  size="is-small" inline></b-datetimepicker>
            </b-field>
            <b-field label="Fecha de Salida">
              <b-datetimepicker v-model="inputFechaSalida" size="is-small" inline></b-datetimepicker>
            </b-field>
          </div>
          <div class="column is-6">       
            

            <b-field label="Seleccionar imagen comprobante">
                <b-field class="file is-primary"  :class="{'has-name': !!inputComprobante}">
                    <b-upload v-model="inputComprobante" class="file-label" rounded @input="setImg">
                        <span class="file-cta">
                            <b-icon class="file-icon" icon="upload"></b-icon>
                            <span class="file-label">Click to upload</span>
                        </span>
                        <span class="file-name" v-if="inputComprobante">
                            {{ inputComprobante.name }}
                        </span>
                    </b-upload>
                </b-field> 
            </b-field>

            <b-field label="Imagen Comprobante">
                
              <b-image
                  :src="urlComprobante"
                  ratio="4by7"
                  :rounded="false"
                  
              ></b-image>
            </b-field>

            <b-field label="Estado">
              <b-select placeholder="Seleccionar estado" v-model="inputEstado">
                <option v-for="option in tablaEstados" :value="option.id" :key="option.id">
                  {{ option.descripcion }}
                </option>
              </b-select>
            </b-field>
            
            <b-field label="Detalles">
              <b-input v-model="inputDetalles" type="textarea"></b-input>
            </b-field>

            

          
          </div>
          
            
          
        </div>
     
        <div class="columns" v-if="isEdit">
          <div class="column is-12">
            <b-field label="Agregar Servicio">
              <b-autocomplete
                v-model="inputBuscarServicio"
                :data="filterServicios"
                placeholder="Ingresar nombre"
                field="nombre"
                :open-on-focus="true"
                :loading="false"
                @select="option => servicioSeleccionado(option)">

                <template slot-scope="props">
                    <div class="media">
                        <div class="media-left">
                            <img width="64" :src="apiUrl+props.option.urlFotoNormal">
                        </div>
                        <div class="media-content">
                            <b>{{ props.option.nombre }}</b>
                            <br>
                            <small>
                                Descripcion: {{ props.option.descripcion }},
                                <br>
                                Precio: $ <b>{{ props.option.precio }}</b>
                            </small>
                        </div>
                    </div>
                </template>
            </b-autocomplete>

            </b-field>
            <b-field label="Servicios solicitados" v-if="tablaReservaServicios">
              <b-table :data="tablaReservaServicios"  :bordered="true" :striped="true" :narrowed="true" :hoverable="false"
                :loading="false" :focusable="false" :mobile-cards="false" :searchable="false" :paginated="true"
                            :per-page="20">
                            <template v-for="column in columnsServicios">
                                <b-table-column v-bind="column" :key="column.id">
                                    <template v-slot="props">
                                        <div v-if="typeof props.row[column.field] === 'object'">
                                          <img :src="apiUrl+props.row[column.field][column.subField]" v-if="column.subField == 'urlFotoNormal'"
                                                style="max-width: 170px;" />

                                          {{ column.subField != "urlFotoNormal"?props.row[column.field][column.subField]:"" }}
                                        </div>
                                        <div v-else>
                                            
                                            {{ column.field != "urlFotoNormal" ? props.row[column.field] : "" }}
                                        </div>
                                    </template>
                                </b-table-column>
                            </template>
                            <b-table-column field="actions" label="Acciones" v-slot="props">
                                <div class="buttons">
                                    <!-- <b-button rounded type="is-warning" icon-left="pencil" @click="editRestaurante(props.row)">
                                    </b-button> -->
                                    <b-button rounded type="is-danger" icon-left="delete"
                                        @click="deleteServicio(props.row)">
                                    </b-button>
                                </div>
                            </b-table-column>
                        </b-table>
            </b-field>
            
          </div>
        </div>
        <div class="columns" v-if="isEdit">
          <div class="column is-12">
            <b-field label="Agregar Plato">
              <b-autocomplete
                v-model="inputBuscarPlato"
                :data="filterPlatos"
                placeholder="Ingresar nombre"
                field="nombre"
                :open-on-focus="true"
                :loading="false"
                @select="option => platoSeleccionado(option)">

                <template slot-scope="props">
                    <div class="media">
                        <div class="media-left">
                            <img width="64" :src="apiUrl+props.option.urlFoto">
                        </div>
                        <div class="media-content">
                            <b>{{ props.option.nombre }}</b>
                            <br>
                            <small>
                                Descripcion: {{ props.option.descripcion }},
                                <br>
                                Precio: $ <b>{{ props.option.precio }}</b>
                            </small>
                        </div>
                    </div>
                </template>
            </b-autocomplete>

            </b-field>
            <b-field label="Pedidos Restaurante" v-if="tablaReservaPlatos">
              <b-table :data="tablaReservaPlatos"  :bordered="true" :striped="true" :narrowed="true" :hoverable="false"
                :loading="false" :focusable="false" :mobile-cards="false" :searchable="false" :paginated="true"
                            :per-page="20">
                            <template v-for="column in columnsPlatos">
                                <b-table-column v-bind="column" :key="column.id">
                                    <template v-slot="props">
                                        <div v-if="typeof props.row[column.field] === 'object'">
                                          <img :src="apiUrl+props.row[column.field][column.subField]" v-if="column.subField == 'urlFoto'"
                                                style="max-width: 170px;" />

                                          {{ column.subField != "urlFoto"?props.row[column.field][column.subField]:"" }}
                                        </div>
                                        <div v-else>
                                            
                                            {{ column.field != "urlFoto" ? props.row[column.field] : "" }}
                                        </div>
                                    </template>
                                </b-table-column>
                            </template>
                            <b-table-column field="actions" label="Acciones" v-slot="props">
                                <div class="buttons">
                                    <!-- <b-button rounded type="is-warning" icon-left="pencil" @click="editRestaurante(props.row)">
                                    </b-button> -->
                                    <b-button rounded type="is-danger" icon-left="delete"
                                        @click="deleteRestaurante(props.row)">
                                    </b-button>
                                </div>
                            </b-table-column>
                        </b-table>
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
      inputFechaCreacion: new Date(),
      inputFechaLlegada: new Date(),
      inputFechaSalida: new Date(),
      inputEstado: 1,
      inputDetalles: "",
      inputTotal: null,
      inputHabitacion:0,
      inputComprobante:null,
      inputCliente:0,

      inputPlatoSelected:null,
      inputBuscarPlato:"",

      tablaHabitaciones:[],
      tablaClientes:[],
      apiUrl:process.env.VUE_APP_API,
      urlComprobante:process.env.VUE_APP_API+'images/assets/no-img.jpg',

      tablaDatos: [],
      tablaDatosActivas: [],
      tablaDatosInactivas: [],
      tablaReservaPlatos:null,
      tablaServicios:null,
      tablaReservaServicios:null,

      inputServicioSelected:null,
      inputBuscarServicio:"",
      

      columnsPlatos: [
        {
            field: "plato",
            subField: "nombre",
            label: "Nombre",
            searchable: false
        },
        {
            field: "plato",
            subField: "descripcion",
            label: "Descripcion",
            searchable: false
        },
        {
            field: "plato",
            subField: "precio",
            label: "Precio",
            searchable: false
        },
        {
            field: "cantidad",
            label: "Cantidad",
            searchable: false
        },
        {
            field: "plato",
            subField: "urlFoto",
            label: "Foto",
            searchable: false
        },

    ],
      columnsServicios: [
        {
          field: "servicio",
          subField: "nombre",
          label: "Nombre",
          searchable: false,
        },
        {
          field: "servicio",
          subField: "descripcion",
          label: "Descripcion",
          searchable: false,
        },
        {
          field: "servicio",
          subField: "precio",
          label: "Precio",
          searchable: false,
        },

      ],

      columns: [
        {
          field: "fechaCreacion",
          label: "Fecha de Creación",
          searchable: false,
        },
        {
          field: "fechaLlegada",
          label: "Fecha de Llegada",
          searchable: false,
        },
        {
          field: "fechaSalida",
          label: "Fecha de Salida",
          searchable: false,
        },
        // {
        //   field: "horaLlegada",
        //   label: "Hora de Llegada",
        //   searchable: true,
        // },
        // {
        //   field: "horaSalida",
        //   label: "Hora de Salida",
        //   searchable: true,
        // },
        {
          field: "estado",
          label: "Estado Pago",
          searchable: false
        },
        // {
        //   field: "numeroPersonas",
        //   label: "Número de Personas",
        //   searchable: true
        // },
        {
          field: "detalles",
          label: "Detalles",
          searchable: false
        },
        {
          field: "cliente",
          subField: "cedula",
          label: "Cédula Cliente",
          searchable: false
        },
        {
          field: "habitacion",
          subField: "numero",
          label: "N° Habitación",
          searchable: false
        },
      ],
      tablaEstados: [
        { id: 1, descripcion: "Pendiente" },
        { id: 2, descripcion: "Confirmada" },
        { id: 3, descripcion: "Cancelada" },
        { id: 4, descripcion: "Finalizada" }
      ],
      isAdd: false,
      isEdit: false,

      showModalCreateEdit: false,
      currentReservaId: null
    };
  },
  computed:{
    filterPlatos(){
      
      return this.tablaRestaurante.filter((option) => {
                    return option.nombre
                        .toString()
                        .toLowerCase()
                        .indexOf(this.inputBuscarPlato.toLowerCase()) >= 0
                })
    },
    filterServicios(){
      return this.tablaServicios.filter((option) => {
                    return option.nombre
                        .toString()
                        .toLowerCase()
                        .indexOf(this.inputBuscarServicio.toLowerCase()) >= 0
                })
    }
  },
  mounted() {
    this.fetchClientes();
    this.fetchHabitaciones();
    this.fetchDatosActivas();
    this.fetchDatosInactivas();
    this.fetchPlatos();
    this.fetchServicios();
  },
  methods: {
    servicioSeleccionado(servicio)
    {
      console.log("servicio sellll")
      //console.log("plato")
      //console.log(plato)
      if(servicio)
      {
        this.$buefy.dialog.confirm({
                    message: 'Agregar servicio a la reserva?',
                    onConfirm: () => {this.submitServicio(servicio)}
                })
      }
    },
    platoSeleccionado(plato)
    {
      console.log("platoooo sellll")
      //console.log("plato")
      //console.log(plato)
      if(plato)
      {
        this.$buefy.dialog.prompt({
                message: `Ingrese la cantidad`,
                inputAttrs: {
                    type: 'number',
                    placeholder: 'Ingrese el número de unidades',
                    value: '1',
                    min: 0,
                    max: 99
                },
                trapFocus: true,
                closeOnConfirm: true,
                onConfirm: (value) => {this.submitPlato(plato,value)}
            })
      }

    },
    submitPlato(plato,cantidad)
    {
      // console.log("Plato escogido a enviar is")
      // console.log(plato)
      // console.log(cantidad)
      //this.$buefy.toast.open(`Your age is: ${cantidad}`)

      
      fetch(process.env.VUE_APP_API   + 'reservaPlatos', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            //agregar campos a crear @todo cambiar11
            cantidad: cantidad,
            reservaId: this.currentReservaId,
            platoId: plato.id,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data;
            console.log(resp);
            
            this.$buefy.dialog.alert("Plato agregado a la reserva correctamente"); //@todo cambiar13

            this.inputBuscarPlato=""
            this.fetchReservaPlatos(this.currentReservaId)

          });

    },
    submitServicio(servicio)
    {
      fetch(process.env.VUE_APP_API   + 'reservaServicios', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            //agregar campos a crear @todo cambiar11
            reservaId: this.currentReservaId,
            servicioId: servicio.id,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data;
            console.log(resp);
            
            this.$buefy.dialog.alert("Servicio agregado a la reserva correctamente"); //@todo cambiar13

            this.inputBuscarServicio=""
            this.fetchReservaServicios(this.currentReservaId)

          });

    },
    async fileToDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    },
    async setImg(){

      this.urlComprobante= await this.fileToDataURL(this.inputComprobante)

      console.log("--------------")
      console.log(this.inputComprobante)
    },
    resetForm(){

      this.inputFechaCreacion=new Date();
      this.inputFechaLlegada=new Date();
      this.inputFechaSalida=new Date();
      this.inputEstado=1;
      this.inputDetalles="";
      this.inputComprobante=null;
      this.inputHabitacion=this.tablaHabitaciones[0].id;
      this.inputCliente=this.tablaClientes[0].cedula;
      this.urlComprobante=process.env.VUE_APP_API+'images/assets/no-img.jpg',

      this.isAdd = false;
      this.isEdit = false;
      this.showModalCreateEdit = false;
      this.fetchDatosActivas();
      this.fetchDatosInactivas();
      //this.fetchDatos();
      
    },
    // fetchDatos() {
    //   fetch(process.env.VUE_APP_API + this.prefixRuta, {
    //     method: "GET",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include"
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       if (data) {
    //         this.tablaDatos = data["resultado"];
            
    //       }
    //     });
    // },
    fetchDatosActivas() {
      fetch(process.env.VUE_APP_API + this.prefixRuta+"/getByActivas", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.tablaDatosActivas = data["resultado"];
            
          }
        });
    },
    fetchDatosInactivas() {
      fetch(process.env.VUE_APP_API + this.prefixRuta+"/getByInactivas", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.tablaDatosInactivas = data["resultado"];
            
          }
        });
    },
    fetchHabitaciones() {
      fetch(process.env.VUE_APP_API + "habitaciones", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.tablaHabitaciones = data["resultado"];
            this.inputHabitacion=this.tablaHabitaciones[0].id
          }
        });
    },
    fetchClientes() {
      fetch(process.env.VUE_APP_API + "cliente", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.tablaClientes = data["resultado"];
            this.inputCliente=this.tablaClientes[0].cedula
          }
        });
    },

    fetchPlatos() {
      fetch(process.env.VUE_APP_API + "plato", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.tablaRestaurante = data["resultado"];
          }
        });
    },
    fetchServicios() {
      fetch(process.env.VUE_APP_API + "servicio", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.tablaServicios = data["resultado"];
          }
        });
    },

    fetchReservaPlatos(idReserva) {
      fetch(process.env.VUE_APP_API + "reservaPlatos/byReserva/"+idReserva, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            //this.tablaRestaurante = data["resultado"];
            this.tablaReservaPlatos=data["resultado"];
          }
        });
    },
    fetchReservaServicios(idReserva) {
      fetch(process.env.VUE_APP_API + "reservaServicios/byReserva/"+idReserva, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            //this.tablaRestaurante = data["resultado"];
            this.tablaReservaServicios=data["resultado"];
          }
        });
    },

    submit() {
      // let request = {
      //   fechaCreacion: this.inputFechaCreacion,
      //   fechaLlegada: this.inputFechaLlegada,
      //   fechaSalida: this.inputFechaSalida,
      //   estado: this.inputEstado,
      //   numeroPersonas: this.inputNumeroPersonas,
      //   detalles: this.inputDetalles,
      //   total: this.inputTotal
      // };

      let formData = new FormData();
      formData.append( 'fechaCreacion', this.inputFechaCreacion);
      formData.append( 'fechaLlegada', this.inputFechaLlegada);
      formData.append( 'fechaSalida', this.inputFechaSalida);
      formData.append( 'estado',  this.inputEstado);
      formData.append( 'numeroPersonas',  this.inputNumeroPersonas);
      formData.append( 'detalles',  this.inputDetalles);
      formData.append( 'fotoComprobanteFile',  this.inputComprobante);
      formData.append( 'habitacionId',  this.inputHabitacion);
      formData.append( 'clienteCedula',  this.inputCliente);
      

      let url = process.env.VUE_APP_API + this.prefixRuta+"/uploadReserva";
      let method = this.isAdd ? "POST" : "PUT";
      if (this.isEdit) formData.append( 'id',  this.currentReservaId);

      fetch(url, {
        method: method,
        headers: { "Accept": "application/json", },
        credentials: "include",
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.resetForm();
            //this.showModalCreateEdit = false;
          }
        });
    },

    deleteFunction(reserva) {
      fetch(process.env.VUE_APP_API + this.prefixRuta + "/" + reserva.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.resetForm();
          }
        });
    },
    deleteRestaurante(reservaPlato) {
      fetch(process.env.VUE_APP_API + "reservaPlatos/" + reservaPlato.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.fetchReservaPlatos(this.currentReservaId)
          }
        });
    },
    deleteServicio(reservaServicio) {
      fetch(process.env.VUE_APP_API + "reservaServicios/" + reservaServicio.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.fetchReservaServicios(this.currentReservaId)
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
      this.currentReservaId = reserva.id;
      this.inputFechaCreacion = new Date(reserva.fechaCreacion);
      this.inputFechaLlegada = new Date(reserva.fechaLlegada);
      this.inputFechaSalida = new Date(reserva.fechaSalida);
      
      this.inputEstado = reserva.estado;
      this.inputNumeroPersonas = reserva.numeroPersonas;
      this.inputDetalles = reserva.detalles;
      
      this.inputComprobante=null;
      this.inputHabitacion=reserva.habitacion.id;
      this.inputCliente=reserva.cliente.cedula;
      this.urlComprobante=process.env.VUE_APP_API+reserva.urlFotoComprobante;

      this.fetchReservaPlatos(this.currentReservaId)
      this.fetchReservaServicios(this.currentReservaId)
      

      this.showModalCreateEdit = true;
    },
  },
};
</script>

<style>
.dropdown.is-disabled 
{
  cursor: default !important;
}
</style>