<template>
  <div id="app">
    <b-navbar class="is-dark mb-2">
        <template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
            <img style="width: 40px; height:40px; max-height:40px !important;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQmsh7M9h1120h1geLe5C4abe10DIt3TKOm-CRdAAok2jgwDTKwDexDpV6_TMoKplQrMo&usqp=CAU">
            <h1><b>Hotel Las Cascadas</b></h1>
            </b-navbar-item>
        </template>
        <template #start>
            <b-navbar-item href="/Inicio">
                Inicio
            </b-navbar-item>
            <b-navbar-item href="/Usuarios">
                Usuarios
            </b-navbar-item>
            <b-navbar-item href="/CaracteristicaHabitacion">
                CaracteristicaHabitacion
            </b-navbar-item>
            <b-navbar-item href="/Habitaciones">
                Habitaciones
            </b-navbar-item>
            <b-navbar-item href="/RegistroRestaurante">
                Restaurante
            </b-navbar-item>
            <b-navbar-item href="/Servicios">
                Servicios
            </b-navbar-item>
            <b-navbar-item href="/Tarifas">
                Tarifas
            </b-navbar-item>
            <!-- <b-navbar-item href="/Clientes">
                Clientes
            </b-navbar-item> -->
            <b-navbar-item href="/Reservas">
                Reservas
            </b-navbar-item>
            <!-- <b-navbar-item href="/Mediciones">
                Mediciones
            </b-navbar-item> -->
            <!-- <b-navbar-item href="/Configuracion">
                Configuración
            </b-navbar-item> -->
            
        </template>

        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Iniciar Sesión</strong>
                    </a>
                    <!-- <a class="button is-light">
                        Log in
                    </a> -->
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {},
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
