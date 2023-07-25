<template>
    <div id="users" class="home">
      <div class="container">
        <b-breadcrumb align="is-left" size="is-large">
          <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item>
          <b-breadcrumb-item tag='router-link' to="/documentation" active>Registros Restaurante</b-breadcrumb-item>
        </b-breadcrumb>
        <div class="block">
          <!-- <div class="columns">
            <div class="column is-narrow">
              <h1>Usuarios</h1>
            </div>
          </div> -->
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
                        {{ props.row[column.field] }}
                      </div>
                    </template>
                  </b-table-column>
                </template>
                <b-table-column field="actions" label="Acciones" v-slot="props">
                  <div class="buttons">
                    <slot name="addButtons"></slot>
                    <b-button rounded type="is-link" icon-left="lock-open" @click="desbloquearUsuario(props.row)">
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
                  <!-- @todo cambiar2 -->
                  <b-field label="Nombre">
                    <b-input v-model="inputNombre"></b-input>
                  </b-field>
  
                </div>
              </div>
  
              <div class="columns">
                <div class="column">
                  <b-field label="Descripción">
                    <b-input v-model="inputDescripcion"></b-input>
                  </b-field>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <b-field label="Precio">
                    <b-numberinput v-model="inputPrecio"></b-numberinput>
                  </b-field>
                </div>
              </div>
              
              <div class="columns">
                <div class="column">
                  <b-field label="Foto">
                    <b-upload v-model="inputFile" class="file-label" accept=".jpg">
                        <span class="file-cta">
                            <b-icon class="file-icon" icon="upload"></b-icon>
                            <span class="file-label">Subir Foto</span>
                        </span>
                        <span class="file-name" v-if="inputFile">
                            {{ inputFile.name }}
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
        //prefijo ruta @todo cambiar3
        prefixRuta: "registro-restaurante",
        //nombres campos @todo cambiar4
        inputNombre: '',
        inputDescripcion: '',
        inputPrecio: 0,
        inputFile:null,
  
  
        //info entidad @todo cambiar5
        //nombreEntidad: "Caracteristicas",
  
        //tablas Datos @todo cambiar6
        tablaDatos: [],
        //columnas tabla Datos @todo cambiar7
        columns: [
          {
            field: "Nombre",
            label: "Nombre",
            searchable: true,
          },
          {
            field: "Descripcion",
            label: "Descripcion",
            searchable: true,
          },
          {
            field: "Precio",
            label: "Precio",
            searchable: true
          }
  
        ],
        //tablas auxiliares @todo cambiar8
        tablaTiposUsuario: [
          { id: 1, descripcion: "Administrador" },
          { id: 2, descripcion: "Usuario" }
        ],
        tablaTiposCaracteristica: [],
        //auxiliares modal
        isAdd: false,
        isEdit: false,
  
        showModalCreateEdit: false,
        showModalDelete: false,
  
        //control errores validacion
        nombreNotAvailable: false,
        nombreHasErrors: false,
        nombreTooShort: false,
      };
    },
    mounted() {
      //llamados fetch @todo cambiar9
  
      this.fetchDatos()
    },
    methods: {
      fetchDatos() {
        try {
          fetch(process.env.VUE_APP_API   + this.prefixRuta, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              var resp = data;
  
              if (data) {
                this.tablaDatos = data["resultado"];
                for (var i = 0; i < this.tablaDatos.length; i++) {
                  console.log("sadadsasd")
                  this.tablaDatos[i]['tipoUsuarioDesc'] = this.tablaTiposUsuario[this.tablaDatos[i]['tipoUsuario'] - 1]['descripcion']
                }
              } else {
                //this.$router.push("/login")
                this.tablaDatos = [];
              }
            });
        } catch (e) {
          //this.$store.dispatch("setAuth", false);
        }
      },
  
      //Fetchs adicionales @todo cambiar10
  
  
      createFunction() {
        this.showModalCreateEdit = true;
        this.isAdd = true;
      },
      submit() {
        if (this.isAdd) {
          fetch(process.env.VUE_APP_API   + this.prefixRuta, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              //agregar campos a crear @todo cambiar11
              nombre: this.inputNombre,
              correo: this.inputCorreo,
              tipoUsuario: this.inputTipoUsuario,
              contrasenia: "",
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              var resp = data.message;
              console.log(resp);
  
              //encerar valores @todo cambiar12
              this.inputNombre = null
              this.inputNombre = null
              this.inputCorreo = null
              this.inputTipoUsuario = null
  
              //cerrar modal
              this.isAdd = false;
              this.isEdit = false;
  
              this.showModalCreateEdit = false;
              this.$buefy.dialog.alert("Usuario agregado correctamente"); //@todo cambiar13
  
              this.fetchDatos();
            });
        } else if (this.isEdit) {
          fetch(
            process.env.VUE_APP_API   + this.prefixRuta + "/" + this.idSeleccionado.toString(),
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                //agregar campos editados @todo cambiar14
                nombre: this.inputNombre,
                correo: this.inputCorreo,
                tipoUsuario: this.inputTipoUsuario,
  
              }),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              var resp = data.message;
              //encerar valores @todo cambiar15
              this.inputNombre = null
              this.inputNombre = null
              this.inputCorreo = null
              this.inputTipoUsuario = null
  
              this.showModalCreateEdit = false;
              this.$buefy.dialog.alert("Usuario editado correctamente");
              //llamar fetch
              this.fetchDatos();
            });
        }
      },
      desbloquearUsuario(row) {
        console.log("Recccc")
        console.log(row)
        try {
          console.log(process.env.VUE_APP_API  + "api/usuarios/recover/" + row.id)
          console.log("Recccc2")
  
          fetch(process.env.VUE_APP_API  + "api/usuarios/recover/" + row.id, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Recover")
              var resp = data.resultado;
              if (resp == 1) {
                this.$buefy.dialog.alert("Desbloqueo de usuario exitoso");
              }
  
            });
        } catch (e) {
          //this.$store.dispatch("setAuth", false);
        }
  
  
      },
      editFunction(row) {
        //obtener valores para editar en form @todo cambiar16
        this.inputNombre = row.nombre
        this.inputCorreo = row.correo
        this.inputTipoUsuario = row.tipoUsuario
        //id Editar @todo cambiar17
        this.idSeleccionado = row.id;
        //mostrar modal
        this.showModalCreateEdit = true;
        this.isAdd = false;
        this.isEdit = true;
      },
      deleteFunction(row) {
        const idDel = row.id;
        fetch(process.env.VUE_APP_API   + this.prefixRuta + "/" + idDel.toString(), {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            //limpiar campos form @todo cambiar18
            this.inputNombre = null
            this.inputNombre = null
            this.inputCorreo = null
            this.inputTipoUsuario = null
            //cerrar form
            this.isAdd = false;
            this.isEdit = false;
  
            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Usuario eliminado correctamente"); //@todo cambiar19
            //llamar fetch
            this.fetchDatos();
          });
      },
    },
  };
  </script>
  
  <style></style>