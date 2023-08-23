<template>
  <div id="habitacion" class="home">
    <div class="container">
      <b-breadcrumb size="is-large">
        <!-- <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item> -->
        <b-breadcrumb-item tag='router-link' to="/documentation" active>Habitaciones y Servicios</b-breadcrumb-item>
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
                    <div v-else-if="column.field == 'estado'">
                      {{ props.row[column.field]==1?"Disponible":"Ocupada" }}
                    </div>
                    <div v-else-if="column.field == 'tipo'">
                      {{ props.row[column.field]==1?"Habitación":"Servicio" }}
                    </div>
                    <div v-else>
                      {{props.row[column.field] }}
                    </div>
                  </template>
                </b-table-column>
              </template>
              <b-table-column field="actions" label="Acciones" v-slot="props">
                <div class="buttons">
                  <slot name="addButtons"></slot>
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
    <b-modal v-model="showHabitacion">
      <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Vista Habitación</p>
      <button type="button" class="delete" @click="showHabitacion=!showHabitacion"> </button>
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
          <b-button type="is-danger" @click="showHabitacion=!showHabitacion" label="Cerrar" />
        </div>
      </div>
    </footer>
      </div>

    </b-modal>
    <b-modal v-model="showModalCreateEdit">
<form @submit.prevent="submit">
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Crear {{ prefixRuta }}</p>
      <button type="button" class="delete" @click="resetModal"> </button>
    </header>
    <section class="modal-card-body">
      <div class="columns">
        <div class="column">
          <b-field label="Descripción">
            <b-input v-model="inputNumero"></b-input>
          </b-field>
        </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Piso">
              <b-numberinput v-model="inputPiso"></b-numberinput>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Estado">
              <b-select placeholder="Seleccionar estado" v-model="inputEstado">
                <option v-for="option in tablaEstados" :value="option.id" :key="option.id">
                  {{ option.descripcion }}
                </option>
              </b-select>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Tarifa">
              <b-select placeholder="Seleccionar tarifa" v-model="inputTarifa">
                <option v-for="option in tablaTarifas" :value="option.id" :key="option.id">
                  {{ option.descripcion }}
                </option>
              </b-select>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Tipo">
              <b-select placeholder="Seleccionar tipo" v-model="inputTipo">
                <option v-for="option in tablaTipos" :value="option.id" :key="option.id">
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
          <b-button type="is-danger" @click="resetModal" label="Cancelar" />
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
import { Pano } from 'vuejs-vr'

export default {
components: {
  HeroBar,
  Pano 
},
data() {
  return {
    prefixRuta: "habitaciones",
    inputNumero: 0,
    inputPiso: 0,
    inputEstado: 1,
    inputTarifa:1,
    inputTipo:1,
    fotoNormal:null,
    foto360:null,
    urlFotoNormal:"",
    urlFoto360:"",

    tablaDatos: [],
    columns: [
      {
        field: "numero",
        label: "Numero",
        searchable: true,
      },
      {
        field: "piso",
        label: "Piso",
        searchable: true,
      },
      {
        field: "estado",
        label: "Estado",
        searchable: true
      },
      {
        field: "tipo",
        label: "Tipo",
        searchable: true
      },
      {
        field: "tarifa",
        subField: "descripcion",
        label: "Tarifa Tipo",
        searchable: true
      },
      {
        field: "tarifa",
        subField: "valor",
        label: "Tarifa Precio",
        searchable: true
      },
    ],
    tablaTarifas: [],
    tablaTipos: [
        { id: 1, descripcion: "Habitación" },
        { id: 2, descripcion: "Servicio" }
      ],
    isAdd: false,
    isEdit: false,
    tablaEstados: [
      { id: 1, descripcion: "Disponible" },
      { id: 2, descripcion: "Ocupado" }
    ],
    showModalCreateEdit: false,
    showModalDelete: false,
    showHabitacion:false,
  };
},
mounted() {
  this.resetModal()
  this.fetchTarifas()
},
methods: {
  resetModal(){
    
    this.inputNumero = 0;
    this.inputPiso = 0;
    this.inputEstado = 1;

    this.showModalCreateEdit=false
    this.isAdd=false
    this.isEdit=false
    this.fetchDatos()
  },
  fetchTarifas() {
    try {
      fetch(process.env.VUE_APP_API   + "tarifas", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            this.tablaTarifas = data["resultado"];
          }
        });
    } catch (error) {
      console.error("Error:", error);
    }
  },
  fetchDatos() {
    try {
      fetch(process.env.VUE_APP_API   + this.prefixRuta, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            this.tablaDatos = data["resultado"];

          }
        });
    } catch (error) {
      console.error("Error:", error);
    }
  },

  submit() {

    let formData = new FormData();
    formData.append( 'fotoNormal', this.fotoNormal );
    formData.append( 'foto360', this.foto360 );
    formData.append( 'numero',  this.inputNumero);
    formData.append( 'piso',  this.inputPiso);
    formData.append( 'estado',  this.inputEstado);
    formData.append( 'tarifaId',  this.inputTarifa);
    formData.append( 'tipo',  this.inputTipo);
    

    // let request = {
    //   numero: this.inputNumero,
    //   piso: this.inputPiso,
    //   estado: this.inputEstado,
    //   tarifaId:this.inputTarifa
    // };

    let url = process.env.VUE_APP_API   + this.prefixRuta;
    let method = this.isAdd ? "POST" : "PUT";
    if (this.isEdit) formData.append( 'id',  this.currentId);

    fetch(url+"/uploadImages", {
      method: method,
      headers: { "Accept": "application/json", },
      credentials: "include",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          this.resetModal();
          //this.showModalCreateEdit = false;
        }
      })
  },

  deleteFunction(habitacion) {
    fetch(process.env.VUE_APP_API  + this.prefixRuta + "/" + habitacion.id, {
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

  editFunction(habitacion) {
    this.isAdd = false;
    this.isEdit = true;
    this.currentId = habitacion.id;
    this.inputNumero = parseInt(habitacion.numero);
    this.inputPiso = parseInt(habitacion.piso);
    this.inputEstado = habitacion.estado;
    this.showModalCreateEdit = true;
  },
  viewFunction(habitacion) {
    console.log(habitacion)
    this.showHabitacion=true;
    this.urlFotoNormal=process.env.VUE_APP_API+habitacion.urlFotoNormal;
    this.urlFoto360=process.env.VUE_APP_API+habitacion.urlFoto360;
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