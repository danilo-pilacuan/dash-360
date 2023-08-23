<template>
    <div id="users" class="home">
      <div class="container">
        <b-breadcrumb size="is-large">
          <!-- <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item> -->
          <b-breadcrumb-item tag='router-link' to="/documentation" active>Clientes</b-breadcrumb-item>
        </b-breadcrumb>
        <div class="block">
          <!-- <div class="columns">
            <div class="column is-narrow">
              <h1>Clientes</h1>
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
                  <b-field label="Cédula"
                  :type="{ 'is-danger': !isCedulaValid }"
                  :message="{ 'Cédula no válida': !isCedulaValid }">
                    <b-input v-model="inputCedula"></b-input>
                  </b-field>
  
                </div>
              </div>
  
              <div class="columns">
                <div class="column">
                  <b-field label="Nombres"
                  :type="{ 'is-danger': !isNombresValid }"
                  :message="{ 'Nombres no válidos': !isNombresValid }">
                    <b-input v-model="inputNombres"></b-input>
                  </b-field>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <b-field label="Apellidos"
                  :type="{ 'is-danger': !isApellidosValid }"
                  :message="{ 'Apellidos no válidos': !isApellidosValid }">
                    <b-input v-model="inputApellidos"></b-input>
                  </b-field>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <b-field label="Dirección"
                  :type="{ 'is-danger': !isDireccionValid }"
                  :message="{ 'Dirección no válida': !isDireccionValid }">
                    <b-input v-model="inputDireccion"></b-input>
                  </b-field>
                </div>
              </div>
              
              <div class="columns">
                <div class="column">
                  <b-field label="Teléfono"
                  :type="{ 'is-danger': !isTelefonoValid }"
                  :message="{ 'Teléfono no válido': !isTelefonoValid }">
                    <b-input v-model="inputTelefono"></b-input>
                  </b-field>
                </div>
              </div>
              
              <div class="columns">
                <div class="column">
                  <b-field label="Correo"
                  :type="{ 'is-danger': !isCorreoValid }"
                  :message="{ 'Correo no válido': !isCorreoValid }">
                    <b-input v-model="inputCorreo"></b-input>
                  </b-field>
                </div>
              </div>
  
            </section>
            <footer class="modal-card-foot">
              <div class="columns">
                <div class="column">
                  <b-button type="is-primary" v-if="isAdd" @click="submit" label="Crear" :disabled="!formValidado"/>
                  <b-button type="is-primary" v-else @click="submit" label="Editar" :disabled="!formValidado"/>
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
    watch: {
      inputCorreo: function(newVal) {
          this.validateCorreo(newVal);
      },
      inputTelefono: function(newVal) {
          this.validateTelefono(newVal);
      },
      inputCedula: function(newVal) {
          this.validateCedula(newVal);
      },
      inputNombres: function(newVal) {
          this.validateNombres(newVal);
      },
      inputApellidos: function(newVal) {
          this.validateApellidos(newVal);
      },
      inputDireccion: function(newVal) {
          this.validateDireccion(newVal);
      }
    },
    computed: {
    formValidado() {
            return this.isTelefonoValid &&
            this.isCedulaValid &&
            this.isNombresValid &&
            this.isApellidosValid &&
            this.isDireccionValid;
        }
    },
    data() {
      return {
        isTelefonoValid:false,
        isCedulaValid:false,
        isNombresValid:false,
        isApellidosValid:false,
        isDireccionValid:false,
        isCorreoValid:false,
        //prefijo ruta @todo cambiar3
        prefixRuta: "cliente",
        //nombres campos @todo cambiar4
        inputCedula:"",
        inputNombres:"",
        inputApellidos:"",
        inputDireccion:"",
        inputTelefono:"",
        inputCorreo:"",
  
        
  
        //info entidad @todo cambiar5
        //nombreEntidad: "Caracteristicas",
  
        //tablas Datos @todo cambiar6
        tablaDatos: [],
        //columnas tabla Datos @todo cambiar7
        columns: [
          {
            field: "cedula",
            label: "Cédula",
            searchable: true,
          },
          {
            field: "nombres",
            label: "Nombres",
            searchable: true,
          },
          {
            field: "apellidos",
            label: "Apellidos",
            searchable: true
          },
          {
            field: "direccion",
            label: "Dirección",
            searchable: true
          },
          {
            field: "telefono",
            label: "Teléfono",
            searchable: true
          },
          {
            field: "correo",
            label: "Correo",
            searchable: true
          },
        ],
        //tablas auxiliares @todo cambiar8
        tablaTiposCliente: [
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
        validateCedula(input) {
            // const regex = /^[0-9]+$/;
            // this.isCedulaValid = regex.test(input);
            //console.log('validate ced')
            if (input.length !== 10 || isNaN(input)) {
                //this.resultado = 'La cédula ingresada no es válida';
                //console.log('La cédula ingresada no es válida')
                this.isCedulaValid=false;
            }


            // console.log("cedulaArray")
            // console.log(cedulaArray)
            const cedulaArray = input.split('').map(Number);
            const impares = [];
            const pares = [];

            for (let i = 0; i < cedulaArray.length-1; i++) {
                if (i % 2 === 0) {
                    impares.push(cedulaArray[i] * 2 > 9 ? cedulaArray[i] * 2 - 9 : cedulaArray[i] * 2);
                } else {
                    pares.push(cedulaArray[i]);
                }
            }

            const sumaImpares = impares.reduce((acc, val) => acc + val, 0);
            const sumaPares = pares.reduce((acc, val) => acc + val, 0);
            const sumaTotal = sumaImpares + sumaPares;

            // console.log("sumaImpares")
            // console.log(sumaImpares)
            // console.log("sumaPares")
            // console.log(sumaPares)
            // console.log("sumaTotal")
            // console.log(sumaTotal)

            const digitoVerificador = sumaTotal % 10 === 0 ? 0 : 10 - (sumaTotal % 10);
            // console.log("digitoVerificador")
            // console.log(digitoVerificador)
            // console.log("cedulaArray[9]")
            // console.log(cedulaArray[9])

            if(digitoVerificador===cedulaArray[9])
            {
              //console.log("ok")
              this.isCedulaValid=true;
              return;
            }
            //console.log("false")
            this.isCedulaValid=false;
            // // console.log("impares")
            // // console.log(impares)
            

        },
        validateNombres(input) {
            const regex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+(\s[a-zA-ZáéíóúñÁÉÍÓÚÑ]+)?$/;
            this.isNombresValid = regex.test(input);
        },
        validateApellidos(input) {
            const regex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+(\s[a-zA-ZáéíóúñÁÉÍÓÚÑ]+)?$/;
            this.isApellidosValid = regex.test(input);
        },
        validateDireccion(input) {
            const regex =  /^(?!.*\s{3,})[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-][0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
            this.isDireccionValid = regex.test(input);
        },
        validateTelefono(input) {
            const regex = /^\d{10}$/;
            this.isTelefonoValid = regex.test(input);
        },
        validateCorreo(input) {
              
              const regex =/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
              this.isCorreoValid = regex.test(input);
  
          },
      resetModal(){
        
        this.inputCedula=""
        this.inputNombres=""
        this.inputApellidos=""
        this.inputDireccion=""
        this.inputTelefono=""
  
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
              cedula:this.inputCedula,
              nombres:this.inputNombres,
              apellidos:this.inputApellidos,
              direccion:this.inputDireccion,
              telefono:this.inputTelefono,
              correo:this.inputCorreo
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              var resp = data.message;
              console.log(resp);
  
              //encerar valores @todo cambiar12
              
  
              //cerrar modal
              
              this.$buefy.dialog.alert("Cliente agregado correctamente"); //@todo cambiar13
  
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
                cedula:this.inputCedula,
                nombres:this.inputNombres,
                apellidos:this.inputApellidos,
                direccion:this.inputDireccion,
                telefono:this.inputTelefono,
                correo:this.inputCorreo
              }),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              var resp = data.message;
              
              this.$buefy.dialog.alert("Cliente editado correctamente");
              //llamar fetch
              this.resetModal();
            });
        }
      },
      editFunction(row) {
        //obtener valores para editar en form @todo cambiar16
        this.inputCedula=row.cedula
        this.inputNombres=row.nombres
        this.inputApellidos=row.apellidos
        this.inputDireccion=row.direccion
        this.inputTelefono=row.telefono
        //id Editar @todo cambiar17
        this.cedulaSeleccionada = row.cedula;
        //mostrar modal
        this.showModalCreateEdit = true;
        this.isAdd = false;
        this.isEdit = true;
      },
      deleteFunction(row) {
        const cedulaDel = row.cedula;
        fetch(process.env.VUE_APP_API   + this.prefixRuta + "/" + cedulaDel, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            
  
  
            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Cliente eliminado correctamente"); //@todo cambiar19
            //llamar fetch
            this.resetModal();
          });
      },
    },
  };
  </script>
  
  <style></style>