<template>
    <div id="users" class="home">
        <div class="container">
            <b-breadcrumb size="is-large">
                <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item>
                <b-breadcrumb-item tag='router-link' to="/documentation" active>Menú Restaurante</b-breadcrumb-item>
            </b-breadcrumb>
            <div class="block">
                <!-- <div class="columns">
            <div class="column is-narrow">
              <h1>Restaurantes</h1>
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
                                        <b-input v-model="props.filters[props.column.field]" placeholder="Buscar..."
                                            icon="magnify" size="is-small" />
                                    </template>
                                    <template v-slot="props">
                                        <div v-if="typeof props.row[column.field] === 'object'">
                                            {{ props.row[column.field][column.subField] }}
                                        </div>
                                        <div v-else>
                                            <img :src="apiUrl+props.row[column.field]" v-if="column.field == 'urlFoto'"
                                                style="max-width: 170px;" />
                                            {{ column.field != "urlFoto" ? props.row[column.field] : "" }}
                                        </div>
                                    </template>
                                </b-table-column>
                            </template>
                            <b-table-column field="actions" label="Acciones" v-slot="props">
                                <div class="buttons">
                                    <slot name="addButtons"></slot>
                                    <b-button rounded type="is-warning" icon-left="pencil" @click="editFunction(props.row)">
                                    </b-button>
                                    <b-button rounded type="is-danger" icon-left="delete"
                                        @click="deleteFunction(props.row)">
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
                                    <b-numberinput v-model="inputPrecio" step="0.01"></b-numberinput>
                                </b-field>
                            </div>
                        </div>

                        <div class="columns">
                            <div class="column">
                                <b-field label="Foto">
                                    <b-upload v-model="inputFoto" class="file-label" accept=".jpg,.png,.webp">
                                        <span class="file-cta">
                                            <b-icon class="file-icon" icon="upload"></b-icon>
                                            <span class="file-label">Subir Foto</span>
                                        </span>
                                        <span class="file-name" v-if="inputFoto">
                                            {{ inputFoto.name }}
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
            prefixRuta: "plato",
            //nombres campos @todo cambiar4
            inputNombre: '',
            inputDescripcion: '',
            inputPrecio: 0,
            inputFoto: null,
            apiUrl:process.env.VUE_APP_API,


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
                    field: "descripcion",
                    label: "Descripcion",
                    searchable: true,
                },
                {
                    field: "precio",
                    label: "Precio",
                    searchable: true
                },
                {
                    field: "urlFoto",
                    label: "Foto",
                    searchable: true
                },

            ],
            //tablas auxiliares @todo cambiar8

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
                fetch(process.env.VUE_APP_API + this.prefixRuta, {
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

            let formData = new FormData();
            formData.append('foto', this.inputFoto);
            formData.append('nombre', this.inputNombre);
            formData.append('descripcion', this.inputDescripcion);
            formData.append('precio', this.inputPrecio);
            formData.append('urlFoto', "");

            let url = process.env.VUE_APP_API + this.prefixRuta + "/uploadimages";
            let method = this.isAdd ? "POST" : "PUT";
            if (this.isEdit) formData.append('urlFoto', this.idSeleccionado);

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
                        this.inputNombre = ""
                        this.inputDescripcion = ""
                        this.inputPrecio=0
                        this.inputFoto=null
                        if(isEdit)
                        {
                            this.$buefy.dialog.alert("Plato actualizado correctamente");
                        }
                        else
                        {
                            this.$buefy.dialog.alert("Plato creado correctamente"); 
                        }
                    }
                });
        },
        editFunction(row) {
            //obtener valores para editar en form @todo cambiar16
            this.inputNombre = row.nombre
            this.inputDescripcion = row.descripcion
            this.inputPrecio=parseFloat(row.precio)
            //id Editar @todo cambiar17
            this.idSeleccionado = row.id;
            //mostrar modal
            this.showModalCreateEdit = true;
            this.isAdd = false;
            this.isEdit = true;
        },
        deleteFunction(row) {
            const idDel = row.id;
            fetch(process.env.VUE_APP_API + this.prefixRuta + "/" + idDel.toString(), {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => {
                    var resp = data.message;
                    //limpiar campos form @todo cambiar18
                    this.inputNombre = ""
                    this.inputDescripcion = ""
                    this.inputPrecio=0
                    this.inputFoto=null
                    //cerrar form
                    this.isAdd = false;
                    this.isEdit = false;

                    this.showModalCreateEdit = false;
                    this.$buefy.dialog.alert("Plato eliminado correctamente"); //@todo cambiar19
                    //llamar fetch
                    this.fetchDatos();
                });
        },
    },
};
</script>
  
<style></style>