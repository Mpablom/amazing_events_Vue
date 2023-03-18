const { createApp } = Vue

createApp({
    data() {
        return {
        urlApi : 'https://mindhub-xj03.onrender.com/api/amazing',
        readEvents : [],
        backupData : [],
        currentDate : [],
        category : [],
        categorySelected: [],
        upcoming : [],
        texto : '',
        }
    },
    created(){
        this.traerData()
    },
    mounted(){

    },
    methods:{
        traerData(){
            fetch(this.urlApi)
                .then(response => response.json())
                .then(data => {
                    this.currentDate = data.currentDate
                    this.readEvents = data.events
                    this.backupData = this.upcoming
                    this.getUpcoming(this.readEvents)
                    this.getCategory(this.upcoming)
                })
                .catch(error => console.log(error.message))
        },
        getCategory(array){
            array.forEach(element => {
                if(!this.category.includes(element.category)){
                    this.category.push(element.category)
                }
            });
        },
        getUpcoming(array){
            array.forEach(events =>{
                if(events.date >= this.currentDate){
                    this.upcoming.push(events)
                    console.log(this.upcoming)
                }
            })
        }
    },
    computed:{
        filterDouble(){
            let primerFiltro= this.backupData.filter
            (events => events.name.toLowerCase().includes(this.texto.toLowerCase()) 
            || 
            events.description.toLowerCase().includes(this.texto.toLowerCase()))
            
            if(this.categorySelected.length > 0){
                this.upcoming = primerFiltro.filter
                (element => this.categorySelected.includes(element.category))
            }else{
                this.upcoming = primerFiltro
            }
        }
    }
}).mount('#app')