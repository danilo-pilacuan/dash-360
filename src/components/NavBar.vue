<template>
    <div id="navvv">
        <b-navbar class="is-dark mb-2">
        <template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
            <img style="width: 40px; height:40px; max-height:40px !important;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQmsh7M9h1120h1geLe5C4abe10DIt3TKOm-CRdAAok2jgwDTKwDexDpV6_TMoKplQrMo&usqp=CAU">
            <h1><b>Hotel Las Cascadas</b></h1>
            </b-navbar-item>
        </template>
        <template #start>
            <b-navbar-item tag="router-link" :to="{ path: '/Inicio' }" >
                Inicio
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/Usuarios' }" v-if="user && user.tipo==1">
                Usuarios
            </b-navbar-item>
            <!-- <b-navbar-item tag="router-link" :to="{ path: '/CaracteristicaHabitacion' }" v-if="user && user.tipo==1">
                CaracteristicaHabitacion
            </b-navbar-item> -->
            <b-navbar-item tag="router-link" :to="{ path: '/Habitaciones' }" v-if="user && user.tipo==1">
                Habitaciones
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/Menu' }" v-if="user && user.tipo==1">
                Restaurante
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/Servicios' }" v-if="user && user.tipo==1">
                Servicios
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/Tarifas' }" v-if="user && user.tipo==1">
                Tarifas
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/Clientes' }" v-if="user && user.tipo==1">
                Clientes
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/Reservas' }" v-if="user && user.tipo==1">
                Reservas
            </b-navbar-item>

            
        </template>

        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-success" :href="urlApk">
                        <strong>Descarga nuestra APP</strong>
                    </a>
                    <b-button class="button is-danger"  v-if="user" @click="logout">
                        <strong>Cerrar Sesión</strong>
                    </b-button>
                    <a class="button is-primary" href="/login" v-else>
                        <strong>Iniciar Sesión</strong>
                    </a>
                    
                    <!-- <a class="button is-light">
                        Log in
                    </a> -->
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
  
    </div>
  </template>
  
  <script>
  
  export default {
    components: {

    },
    data() {
      return {
        //prefijo ruta @todo cambiar3
        prefixRuta: "usuarios",
        urlApk: process.env.VUE_APP_API+'images/app-debug.apk'
  
  
        //info entidad @todo cambiar5
        //nombreEntidad: "Caracteristicas",
  
        //tablas Datos @todo cambiar6
        
        
      };
    },
    mounted() {
      //llamados fetch @todo cambiar9
  
      
    },
    computed: {
        authenticated() {
        return this.$store.state.authenticated;
        },
        userType() {
        return this.$store.state.userType;
        },
        user(){
            return this.$store.state.user;
        }
    },
    methods: {
      logout(){
        this.$store.dispatch("setUser", null);
        this.$router.push("/Inicio")
      }
      
  
      //Fetchs adicionales @todo cambiar10
  
    },
  };
  </script>
  
  <style></style>