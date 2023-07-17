<template>
    <div id="habitacion" class="home">
      <div class="container">
        <b-breadcrumb align="is-left" size="is-large">
          <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item>
          <b-breadcrumb-item tag='router-link' to="/documentation" active>Tarifas</b-breadcrumb-item>
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
            <b-field label="Descipción">
              <b-input v-model="inputDescripcion"></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Pax">
              <b-input v-model="inputPax"></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Valor">
              <b-input v-model="inputValor"></b-input>
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
      prefixRuta: "tarifas",
      inputDescripcion: '',
      inputPax: 0,
      inputValor: 0,

      tablaDatos: [],
      columns: [
        {
          field: "descripcion",
          label: "Descripción",
          searchable: true,
        },
        {
          field: "pax",
          label: "Pax",
          searchable: true,
        },
        {
          field: "valor",
          label: "Valor",
          searchable: true
        }
      ],
      isAdd: false,
      isEdit: false,

      showModalCreateEdit: false,
      showModalDelete: false,
    };
  },
  mounted() {
    this.resetModal()
  },
  methods: {
    resetModal(){
      this.inputDescripcion= ''
      this.inputPax= 0
      this.inputValor= 0

      this.showModalCreateEdit=false
      this.isAdd=false
      this.isEdit=false

      this.fetchDatos()
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
      let request = {
        descripcion: this.inputDescripcion,
        pax: this.inputPax,
        valor: this.inputValor
      };
      let url = process.env.VUE_APP_API   + this.prefixRuta;
      let method = this.isAdd ? "POST" : "PUT";
      if (this.isEdit)
      {
        request.id=this.currentId
        url += "/" + this.currentId;
      } 

      fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(request)
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            
            
            if (this.isAdd) this.$buefy.dialog.alert("Tarifa agregada correctamente"); //@todo cambiar13
            else this.$buefy.dialog.alert("Tarifa editada correctamente"); //@todo cambiar13
            this.resetModal();
          }
        })
    },

    deleteFunction(tarifa) {
        console.log(process.env.VUE_APP_API  + this.prefixRuta + "/" + tarifa.id)
      fetch(process.env.VUE_APP_API  + this.prefixRuta + "/" + tarifa.id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.$buefy.dialog.alert("Tarifa eliminada correctamente"); //@todo cambiar13
            this.resetModal()
          }
        });
    },

    createFunction() {
      this.isAdd = true;
      this.isEdit = false;
      this.showModalCreateEdit = true;
    },

    editFunction(tarifa) {
      this.isAdd = false;
      this.isEdit = true;
      this.inputDescripcion = tarifa.descripcion;
      this.inputPax = tarifa.pax;
      this.inputValor = tarifa.valor;
      this.currentId = tarifa.id;
      this.showModalCreateEdit = true;
    },
  },
};
</script>