const { createApp } = Vue

createApp({
    data() {
        return {
        urlApi : 'https://mindhub-xj03.onrender.com/api/amazing',
        datos : [],
        backupData : [],
        category : [],
        categorySelected: [],
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
                    this.datos = data.events
                    this.backupData = this.datos
                    this.getCategory(this.datos)
                })
                .catch(error => console.log(error.message))
        },
        getCategory(array){
            array.forEach(element => {
                if(!this.category.includes(element.category)){
                    this.category.push(element.category)
                }
            });
            console.log(this.category)
        }
    },
    computed:{
        filterDouble(){
            let primerFiltro= this.backupData.filter
            (events => events.name.toLowerCase().includes(this.texto.toLowerCase()) 
            || 
            events.description.toLowerCase().includes(this.texto.toLowerCase()))
            
            if(this.categorySelected.length > 0){
                this.datos = primerFiltro.filter
                (element => this.categorySelected.includes(element.category))
            }else{
                this.datos = primerFiltro
            }
        }
    }
}).mount('#app')