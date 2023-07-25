<template>
    <div id="users" class="home background">
      
        <div class="hero is-fullheight">
            <div class="hero-body is-justify-content-center is-align-items-center">
                <div class="columns is-flex is-flex-direction-column box">
                    <div class="column">
                        <label for="email">Email</label>
                        <input class="input is-primary" type="text" placeholder="Email address" v-model="inputCorreo">
                    </div>
                    <div class="column">
                        <label for="Name">Password</label>
                        <input class="input is-primary" type="password" placeholder="Password" v-model="inputClave">
                        <a href="forget.html" class="is-size-7 has-text-primary">forget password?</a>
                    </div>
                    <div class="column">
                        <b-button class="button is-primary is-fullwidth" @click="submit">Login</b-button>
                    </div>
                    <div class="has-text-centered">
                        <p class="is-size-7"> Don't have an account? <a href="#" class="has-text-primary">Sign up</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import HeroBar from '@/components/HeroBar.vue'
  import axios from "axios";
  export default {
    components: {
      HeroBar
    },
    data() {
      return {
        //prefijo ruta @todo cambiar3
        prefixRuta: "usuarios",
        //nombres campos @todo cambiar4
        inputClave: "",
        inputCorreo: "",
  
  
        //info entidad @todo cambiar5
        //nombreEntidad: "Caracteristicas",
  
        //tablas Datos @todo cambiar6
        tablaDatos: [],
        //columnas tabla Datos @todo cambiar7

      };
    },
    mounted() {
      //llamados fetch @todo cambiar9
  
      
    },
    methods: {
        submit(){
            axios.post(process.env.VUE_APP_API   + "usuarios/login", {
            correo: this.inputCorreo,
            clave: this.inputClave
        })
        .then((response)=> {
            console.log(response.data);
            if(response.data)
            {
                console.log("ok")
                this.$router.push("/Inicio")
                this.$store.dispatch("setUser", response.data["usuario"]);
            }
            else
            {
                console.log("not")
            }
        })
        .catch(function (error) {
            console.log(error);
        });

        }
    },
  };
  </script>
  
<style>
.background{
    background-image: url("../assets/fondo2.jpg");
    -webkit-background-size: contain;
  -moz-background-size: contain;
  -o-background-size: contain;
  background-size: contain;
}
</style>