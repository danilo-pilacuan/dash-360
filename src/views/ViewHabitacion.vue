<template>
    <div id="reserva" class="home">
      <div class="container">
        <b-breadcrumb size="is-large">
          <!-- <b-breadcrumb-item tag='router-link' to="/">Dashboard</b-breadcrumb-item> -->
          <b-breadcrumb-item tag='router-link' to="/documentation" active>Habitación</b-breadcrumb-item>
        </b-breadcrumb>
        <div class="block">
          <div class="columns">
            <div class="column">
                <Pano source="http://localhost:3000/images/1689761153134-617068.jpg" class="panoContainer"></Pano>
            </div>
          </div>
        </div>
      </div>

</div>
</template>
<script>
import HeroBar from '@/components/HeroBar.vue'
import { Pano } from 'vuejs-vr'
export default {
  components: {
    HeroBar,
    Pano 
  },
}

</script>
<style>
.panoContainer
{
    height: 600px;
}
</style>