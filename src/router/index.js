import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home.vue'
import About from '/src/views/About.vue'
import Contact from '/src/views/Contact.vue'
import Help from '/src/views/Help.vue'
import Donate from '/src/views/Donate.vue'
const routes = [
     {
        path:"/",
        name:"Home",
        component:Home
    },
    {
        path:"/about",
        name:"About",
        component:About
    },
    {
        path:"/contact",
        name:"Contact",
        component:Contact  
    },
    {
        path:"/help",
        name:"Help",
        component:Help 
    },
    {
        path:"/donate",
        name:"Donate",
        component:Donate 
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router