<template>
    <div>
    <div class="container">
      <!-- <b-breadcrumb
            size="is-large"
        >
            <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item>
            <b-breadcrumb-item tag='router-link' to="/documentation" active>Inicio</b-breadcrumb-item>
        </b-breadcrumb> -->
      <div class="hero-body">
        
        <div class="columns">
          <div class="column is-1">
            
          </div>
          <div class="column is-10">
            <p class="title">
          Sistema de Reservas Hotel Las Cascadas - La Maná
        </p>
            <p class="subtitle">
          
        </p>    
          </div>
          <div class="column is-2">
            
          </div>
        </div>
        
      </div>
      <div class="block">
        <div class="columns is-multiline">
          <div class="column is-4">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title is-justify-content-center is-size-4	">
                  Huéspedes
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <div class="columns">
                    <div class="column is-2">
                      <b-icon
                          icon="account"
                          size="is-large"
                          type="is-success">
                      </b-icon>
                    </div>
                    <div class="column is-9">
                      <p class="is-size-5"><b>Registrados:</b> {{numUsuarios}}</p>
                      <p class="is-size-5">&nbsp;</p>
                    </div>
                  </div>

                </div>
              </div>
          
            </div>
          </div>

          <div class="column is-4">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title is-justify-content-center is-size-4	">
                  Habitaciones
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <div class="columns">
                    <div class="column is-2">
                      <b-icon
                          icon="bed"
                          size="is-large"
                          type="is-link">
                      </b-icon>
                    </div>
                    <div class="column is-9">
                      <p class="is-size-5"><b>Ocupadas:</b> {{numHabitacionesLibres}}</p>
                      <p class="is-size-5"><b>Libres:</b> {{numHabitacionesOcupadas}}</p>
                    </div>
                  </div>

                </div>
              </div>
          
            </div>
          </div>

          <div class="column is-4">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title is-justify-content-center is-size-4	">
                  Reservas
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <div class="columns">
                    <div class="column is-2">
                      <b-icon
                          icon="chart-box"
                          size="is-large"
                          type="is-info">
                      </b-icon>
                    </div>
                    <div class="column is-9">
                      <p class="is-size-5"><b>Registradas:</b> {{numMediciones}}</p>
                      <p class="is-size-5">&nbsp;</p>
                    </div>
                  </div>

                </div>
              </div>
          
            </div>
          </div>
          <div class="column is-12">
            <!-- <LineChart /> -->
            <!-- <img src="https://www.supermegaventas.com/202-large_default/tensiometro-digital-de-muneca-aspen-ye8900a.jpg" alt=""> -->
            <img src="https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/153680191.jpg?k=0f1a90eea45d24a32e47e7e9244e90f0476c9db3ea8dab0c9dd424a4be73938e&o=">
          </div>
         
        </div>
      </div>
    </div>


    </div>
</template>

<script>
import LineChart from '@/components/Line.vue'

export default 
{
  components:{
    LineChart
  },
  sockets: {
    connection() {
      // Fired when the socket connects.
      this.isConnected = true;
      console.log("Medicion Connected")
    },

    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data
    },

    lecturaOk(data){
      console.log(data)
      console.log("Medicion correcta socketio")
      this.$buefy.toast.open({message:"<p>Presion Sistólica: "+data.valorSistolica+"</p> <p>Presion Diastólica: "+data.valorDiastolica+"</p> <p>Frecuencia Cardiaca: "+data.valorFrecuencia+"</p> <p>Fecha: "+data.fecha+"</p>",
                              duration:5000,
                              type: 'is-success'})
      
      this.fetchUsuarios()
      this.fetchPacientes()
      this.fetchLecturas()
    }
  },
  mounted(){
    this.fetchUsuarios()
    this.fetchHabitacionesLibres()
    this.fetchHabitacionesOcupadas()
    this.fetchReservas()
  },
  data(){
    return{
      numUsuarios:0,
      numHabitacionesLibres:0,
      numHabitacionesOcupadas:0,
      numMediciones:0
    }
  },
  methods:{
    fetchUsuarios() {
      try {
        fetch(
          process.env.VUE_APP_API +
            "cliente",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data;

            if (data) {
              
              this.numUsuarios=data["resultado"].length;
              
            } else {
              this.datosPaciente = [];
            }
          });
      } catch (e) {
      }
    },
    fetchHabitacionesOcupadas() {
      try {
        fetch(
          process.env.VUE_APP_API +
            "habitaciones/ocupadas",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data;

            if (data) {
              
              this.numHabitacionesOcupadas=data["resultado"].length;
              
            } else {
              this.datosPaciente = [];
            }
          });
      } catch (e) {
      }
    },
    fetchHabitacionesLibres() {
      try {
        fetch(
          process.env.VUE_APP_API +
            "habitaciones/libres",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data;

            if (data) {
              
              this.numHabitacionesLibres=data["resultado"].length;
              
            } else {
              this.datosPaciente = [];
            }
          });
      } catch (e) {
      }
    },
    fetchReservas() {
      try {
        fetch(
          process.env.VUE_APP_API +
            "reserva",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data;

            if (data) {
              
              this.numMediciones=data["resultado"].length;
              
            } else {
              this.datosPaciente = [];
            }
          });
      } catch (e) {
      }
    },
  }
}
</script>
