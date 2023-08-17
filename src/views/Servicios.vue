<template>
    <div id="servicio" class="home">
      <div class="container">
        <b-breadcrumb size="is-large">
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
                :loading="false" :focusable="false" :mobile-cards="false" :searchable="true" :paginated="true"
                :per-page="20">
                <template v-for="column in columns">
                  <b-table-column v-bind="column" :key="column.id">
                    <template v-if="column.searchable && !column.numeric" #searchable="props">
                      <b-input v-model="props.filters[props.column.field]" placeholder="Buscar..." icon="magnify"
                        size="is-small" />
                    </template>
                    <template v-slot="props">
                      {{ column.field!="tipo"?props.row[column.field]:"" }}
                      {{ column.field=="tipo"?(props.row[column.field]==1?"Reservable":"No Reservable"):"" }}
                    </template>
                  </b-table-column>
                </template>
                <b-table-column field="actions" label="Acciones" v-slot="props">
                  <div class="buttons">
                    <b-button rounded type="is-link" icon-left="eye" @click="viewFunction(props.row)">
                  </b-button>
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
              <b-input v-model="inputDescripcion"></b-input>
            </b-field>
            <b-field label="Precio">
              <b-numberinput v-model="inputPrecio" step="0.01"></b-numberinput>
            </b-field>
            <b-field label="Tipo">
              <b-select placeholder="Seleccionar tipo" v-model="inputTipo">
                <option v-for="option in tablaEstados" :value="option.id" :key="option.id">
                  {{ option.descripcion }}
                </option>
              </b-select>
            </b-field>
          </div>


        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Foto Normal">
              <b-upload v-model="fotoNormal" class="file-label" rounded>
                  <span class="file-cta">
                      <b-icon class="file-icon" icon="upload"></b-icon>
                      <span class="file-label">Click to upload</span>
                  </span>
                  <span class="file-name" v-if="fotoNormal">
                      {{ fotoNormal.name }}
                  </span>
              </b-upload>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Foto 360">
              <b-upload v-model="foto360" class="file-label" rounded>
                  <span class="file-cta">
                      <b-icon class="file-icon" icon="upload"></b-icon>
                      <span class="file-label">Click to upload</span>
                  </span>
                  <span class="file-name" v-if="foto360">
                      {{ foto360.name }}
                  </span>
              </b-upload>
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
<b-modal v-model="showServicio">
      <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Vista Servicio</p>
      <button type="button" class="delete" @click="showServicio=!showServicio"> </button>
    </header>
    <section class="modal-card-body">

      <div class="columns">
          <div class="column">
          <b-field label="Foto Normal">
            <b-image
            :src="urlFotoNormal"
            
            ratio="16by9"
            
        ></b-image>
          </b-field>
        </div>
      </div>

      <div class="columns">
          <div class="column">
          <b-field label="Foto 360">
            <Pano class="panoContainer" :source="urlFoto360"></Pano>
          </b-field>
        </div>
      </div>


      
      
      <!-- <br><br>
      <Pano class="panoContainer" source="http://localhost:3000/images/1689761153134-617068.jpg"></Pano> -->
    </section>
    <footer class="modal-card-foot">
      <div class="columns">
        
        <div class="column">
          <b-button type="is-danger" @click="showServicio=!showServicio" label="Cerrar" />
        </div>
      </div>
    </footer>
      </div>

    </b-modal>
</div>
</template>
<script>
import HeroBar from '@/components/HeroBar.vue'
import { Pano } from 'vuejs-vr'

export default {
  components: {
    HeroBar,
    Pano
  },
  data() {
    return {
      prefixRuta: "servicio",
      inputNombre:'',
      inputDescripcion:'',
      inputPrecio:0,
      urlFotoNormal:"",
      urlFoto360:"",
      fotoNormal:null,
      foto360:null,
      inputTipo:1,
      showServicio:false,
      tablaDatos: [],
      columns: [
        {
          field: "nombre",
          label: "Nombre",
          searchable: true,
        },
        {
          field: "descripcion",
          label: "Descripcion",
          searchable: true,
        },
        {
          field: "precio",
          label: "Precio",
          searchable: true,
        },
        {
          field: "tipo",
          label: "Tipo",
          searchable: true,
        },
        
      ],
      tablaEstados: [
        { id: 1, descripcion: "Reservable" },
        { id: 2, descripcion: "No reservable" }
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

      let formData = new FormData();
      formData.append( 'fotoNormal', this.fotoNormal );
      formData.append( 'foto360', this.foto360 );
      formData.append( 'nombre',  this.inputNombre);
      formData.append( 'descripcion',  this.inputDescripcion);
      formData.append( 'tipo',  this.inputTipo);
      formData.append( 'precio',  this.inputPrecio);

      // let request = {
      //   fechaCreacion: this.inputFechaCreacion,
      //   fechaLlegada: this.inputFechaLlegada,
      //   fechaSalida: this.inputFechaSalida,
      //   horaLlegada: this.inputHoraLlegada,
      //   horaSalida: this.inputHoraSalida,
      //   estado: this.inputEstado,
      //   numeroPersonas: this.inputNumeroPersonas,
      //   detalles: this.inputDetalles,
      //   total: this.inputTotal
      // };

      let url = process.env.VUE_APP_API + this.prefixRuta+"/uploadimages";
      let method = this.isAdd ? "POST" : "PUT";
      if (this.isEdit) formData.append( 'id',  this.currentId);

      fetch(url, {
        method: method,
        headers: { "Accept": "application/json", },
        credentials: "include",
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.fetchDatos();
            this.showModalCreateEdit = false;
          }
        });
    },

    deleteFunction(servicio) {
      fetch(process.env.VUE_APP_API + this.prefixRuta + "/" + servicio.id, {
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

    editFunction(servicio) {
      console.log(servicio)
      this.isAdd = false;
      this.isEdit = true;
      this.currentId = servicio.id;

      // formData.append( 'fotoNormal', this.fotoNormal );
      // formData.append( 'foto360', this.foto360 );
      // formData.append( 'nombre',  this.inputNombre);
      // formData.append( 'descripcion',  this.inputDescripcion);
      // formData.append( 'tipo',  this.inputTipo);
      // formData.append( 'precio',  this.inputPrecio);

      this.inputNombre = servicio.nombre;
      this.inputDescripcion = servicio.descripcion;
      this.inputTipo = servicio.tipo;
      this.inputPrecio = servicio.precio;
      this.foto360=null;
      this.fotoNormal=null;
      this.showModalCreateEdit = true;
    },
    viewFunction(servicio) {
    console.log(servicio)
    this.showServicio=true;
    this.urlFotoNormal=process.env.VUE_APP_API+servicio.urlFotoNormal;
    this.urlFoto360=process.env.VUE_APP_API+servicio.urlFoto360;
  },
  },
};
</script>
<style>
.panoContainer
{
  height: 450px;
}
</style>