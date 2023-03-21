const { createApp } = Vue

createApp({
    data() {
        return {
            urlApi: 'https://mindhub-xj03.onrender.com/api/amazing',
            readEvents: [],
            eventsPercentaje: [],
            currentDate: [],
            upcoming: [],
            past: [],
        }
    },
    created() {
        this.traerData()
    },
    methods: {
        traerData() {
            fetch(this.urlApi)
                .then(response => response.json())
                .then(data => {
                    this.currentDate = data.currentDate
                    this.readEvents = data.events
                    this.getUpcoming()
                    this.getPast()
                    this.eventsPercentaje = this.past.map(event => ({
                        ...event,
                        porcentajeAsistencia: event.assistance ? parseFloat((event.assistance / event.capacity) * 100).toFixed(2) : null
                    }))
                })
                .catch(error => console.log(error.message))
        },
        getUpcoming() {
            this.upcoming = this.readEvents.filter(event => event.date >= this.currentDate)
        },
        getPast() {
            this.past = this.readEvents.filter(event => event.date < this.currentDate)
        },
    },
    computed: {
        eventosDestacadosMayor() {
            return this.eventsPercentaje.sort((a, b) => b.porcentajeAsistencia - a.porcentajeAsistencia)[0]
        },
        eventosDestacadosMenor() {
            return this.eventsPercentaje.sort((a, b) => a.porcentajeAsistencia - b.porcentajeAsistencia)[0]
        },
        destacadosPorCapacidadTexto() {
            let eventos
            return this.destacadosPorCapacidad.map((event) =>
                eventos = event.nombre + " : " + event.capacity).join(" , ");
        },
        destacadosPorCapacidad() {
            const mayorCapacidad = this.readEvents.map((event) => {
                return {
                    nombre: event.name,
                    capacity: event.capacity,
                };
            });
            return mayorCapacidad.sort((a, b) => b.capacity - a.capacity).slice(0, 2);
        },
        upcomingCategories() {
            return [...new Set(this.upcoming.map(event => event.category))]
        },
        upcomingCategoriesProfitPercentage() {
            return this.upcomingCategories.map(category => {
                const categoryEvents = this.upcoming.filter(event => event.category === category)
                const capacity = categoryEvents.reduce((total, events) => total + events.capacity, 0);
                const gananciasPorEvento = categoryEvents.map(evento => evento.price * evento.estimate);
                const sumaEstimate = categoryEvents.reduce((total, events) => total + events.estimate, 0);
                const ganancia = gananciasPorEvento.reduce((total, ganancia) => total + ganancia, 0);
                const percentage = parseFloat((sumaEstimate / capacity) * 100).toFixed(2);
                return { category, ganancia, percentage }
            })
        },
        pastCategories() {
            return [...new Set(this.past.map(event => event.category))]
        },
        pastCategoriesProfitPercentage() {
            return this.pastCategories.map(category => {
                const categoryEvents = this.past.filter(event => event.category === category)
                const capacity = categoryEvents.reduce((total, event) => total + event.capacity, 0);
                const gananciasPorEvento = categoryEvents.map(evento => evento.price * evento.assistance);
                const sumaAssistance = categoryEvents.reduce((total, events) => total + events.assistance, 0);
                const ganancia = gananciasPorEvento.reduce((total, ganancia) => total + ganancia, 0);
                const percentage = parseFloat((sumaAssistance / capacity) * 100).toFixed(2);
                return { category, ganancia, percentage }
            })
        },
    }
}).mount('#app')