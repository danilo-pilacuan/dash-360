<template>
  <div id="app">
    <NavBar v-if="showNav"/>
    <router-view/>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {

  name: 'App',
  components: {
    NavBar
  },
  data(){
    return {
        showNav:true,
        
    }
  },
  mounted(){
    
    
  },
  watch:{
    $route (to, from){
        // this.show = false;
        // console.log("to")
        // console.log(to)
        // console.log("routeee")
        // console.log(this.$router.currentRoute)
        // if(this.$router.currentRoute.fullPath=="/login")
        // {
        //     this.showNav=false
        // }
        if(to.fullPath!="/login")
        {
            this.showNav=true
        }
        else
        {
          this.showNav=false
        }
    }
  } 
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
