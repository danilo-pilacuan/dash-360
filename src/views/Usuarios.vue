<template>
  <div id="users" class="home">
    <div class="container">
      <b-breadcrumb align="is-left" size="is-large">
        <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item>
        <b-breadcrumb-item tag='router-link' to="/documentation" active>Usuarios</b-breadcrumb-item>
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
                      {{ column.field=='tipo'?(props.row[column.field]==1?"Administrador":(props.row[column.field]==1?"Empleado":"Cliente")):props.row[column.field] }}
                    </div>
                  </template>
                </b-table-column>
              </template>
              <b-table-column field="actions" label="Acciones" v-slot="props">
                <div class="buttons">
                  <slot name="addButtons"></slot>
                  <b-button rounded type="is-warning" icon-left="pencil" @click="editFunction(props.row)"/>
                  <b-button rounded type="is-danger" icon-left="delete" @click="deleteFunction(props.row)"/>
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
                <b-field label="Nombre" :type="{ 'is-danger': nombreHasErrors }" :message="[
                  { 'Username is not available': nombreNotAvailable },
                  { 'Username is too short': nombreTooShort },
                ]">
                  <b-input v-model="inputNombre"></b-input>
                </b-field>

              </div>
            </div>

            <div class="columns">
              <div class="column">
                <b-field label="Correo">
                  <b-input v-model="inputCorreo"></b-input>
                </b-field>
              </div>
            </div>
            
            <div class="columns">
              <div class="column">
                <b-field label="Clave">
                  <b-input v-model="inputClave" type="password" password-reveal></b-input>
                </b-field>
              </div>
            </div>


            <div class="columns">
              <div class="column">
                <b-field label="Tipo Usuario">
                  <b-select placeholder="Seleccionar Tipo de Usuario" v-model="inputTipo">
                    <option v-for="option in tablaTiposUsuario" :value="option.id" :key="option.id">
                      {{ option.descripcion }}
                    </option>
                  </b-select>
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
      prefixRuta: "usuarios",
      //nombres campos @todo cambiar4
      inputNombre: "",
      inputCorreo: "",
      inputTipo: 0,
      inputClave:"",


      //info entidad @todo cambiar5
      //nombreEntidad: "Caracteristicas",

      //tablas Datos @todo cambiar6
      tablaDatos: [],
      //columnas tabla Datos @todo cambiar7
      columns: [
        {
          field: "nombre",
          label: "Nombre",
          searchable: true,
        },
        {
          field: "correo",
          label: "Correo",
          searchable: true,
        },
        {
          field: "tipo",
          label: "Tipo Usuario",
          searchable: true
        }
        

      ],
      //tablas auxiliares @todo cambiar8
      tablaTiposUsuario: [
        { id: 1, descripcion: "Administrador" },
        { id: 2, descripcion: "Empleado" }
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

    this.resetModal();
  },
  methods: {
    resetModal(){
      this.inputNombre = ""
      this.inputCorreo = ""
      this.inputTipo = 0
      this.inputClave=""

      this.isAdd = false;
      this.isEdit = false;
      

      this.showModalCreateEdit = false;
      this.fetchDatos();
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
            var resp = data;

            if (data) {
              this.tablaDatos = data["resultado"];
              
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
            tipo: this.inputTipo,
            clave: "123456",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            console.log(resp);

            //encerar valores @todo cambiar12
            

            //cerrar modal
            
            this.$buefy.dialog.alert("Usuario agregado correctamente"); //@todo cambiar13

            this.resetModal();
          });
      } else if (this.isEdit) {
        fetch(
          process.env.VUE_APP_API   + this.prefixRuta,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              //agregar campos editados @todo cambiar14
              id:this.idSeleccionado,
              nombre: this.inputNombre,
              correo: this.inputCorreo,
              tipo: this.inputTipo,

            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            
            this.$buefy.dialog.alert("Usuario editado correctamente");
            //llamar fetch
            this.resetModal();
          });
      }
    },
    editFunction(row) {
      //obtener valores para editar en form @todo cambiar16
      this.inputNombre = row.nombre
      this.inputCorreo = row.correo
      this.inputTipo = row.tipo
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
          


          this.showModalCreateEdit = false;
          this.$buefy.dialog.alert("Usuario eliminado correctamente"); //@todo cambiar19
          //llamar fetch
          this.resetModal();
        });
    },
  },
};
</script>

<style></style>