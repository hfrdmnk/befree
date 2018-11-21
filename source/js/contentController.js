// Vue Instance
var controller = new Vue({
    el: '#app',
    data: {
        // Airtable Config Data
        airtable: {
            url: 'https://api.airtable.com/v0/',
            key: 'keyO54NEvmY5VwVOO',
            id: 'appJfav4dlJdonWhY'
        },

        // Fetched Data
        festivalInfo: [],
        headliner: [],
        mediumActs: [],
        smallActs: [],
        
        
        // Current City (from Localstorage)
        currentCity: 'Barcelona',

        // UI State
        loading: true
    },
    computed: {
        
    },
    methods: {
        // Enable / Disable Menu
        toggleMenu: function() {
            document.querySelector('body').classList.toggle('openMenu')
        },

        // Fetch Data
        fetchData: function(base, target, filter, sort) {
            var self = this

            axios({
                url: self.airtable.url + self.airtable.id + '/' + base,
                headers: {
                    'Authorization': 'Bearer ' + self.airtable.key
                },
                params: {
                    filterByFormula: filter || '',
                    sort: sort || ''
                }
            }).then(function(res) {
                self[target] = res.data.records
            })
        }, 

        // Get Data about Festival and Acts
        getData: function() {
            // Filters
            var city = this.currentCity
            var festivalInfoFilter = 'IF(place = "' + city + '", TRUE(), FALSE())'
            var headlinerFilter = 'IF(category = "Headliner", TRUE(), FALSE())'
            var mediumActFilter = 'IF(category = "Medium Act", TRUE(), FALSE())'
            var smallActFilter = 'IF(category = "Small Act", TRUE(), FALSE())'
            var sortByIndex = '' // '[{field: "index", direction: "asc"}]'

            this.fetchData('festivalInfo', 'festivalInfo', festivalInfoFilter)
            this.fetchData('acts', 'headliner', headlinerFilter, sortByIndex)
            this.fetchData('acts', 'mediumActs', mediumActFilter, sortByIndex)
            this.fetchData('acts', 'smallActs', smallActFilter, sortByIndex)
        }
    },
    mounted: function() {
        this.getData()
    }
})

// // Airtable Api Infos
// // Link to Airtable Base: https://airtable.com/tbl58E8pNAC0c1l6I/viwjqHvJWB0I6z7Pm
// var airtableKey = "keyO54NEvmY5VwVOO";
// var airtableID = "appJfav4dlJdonWhY";

// // Vue Instance
// var app = new Vue({
//     el: '#app',
//     data: {

//         // Infos about all locations
//         festivalInfo: [],
//         // All acts
//         acts: [],
//         // Current city
//         currentCity: 'Barcelona' // localStorage.getItem('befree_city')

//     },
//     computed: {

//         // Get only relevant info for this location from festivalInfo
//         cityInfo: function() {
//             var dataObj = this.festivalInfo

//             for(var i = 0; i < dataObj.length; i++) {
//                 var place = dataObj[i].fields.place.toLowerCase();
//                 if(place == this.currentCity) {
//                     return dataObj[i]
//                 }
//             }
//         },

//         // Group artists based on category
//         groupedActs: function() {
//             var dataObj = this.acts
//             var tempActs = {
//                 headliner: [],
//                 mediumActs: [],
//                 smallActs: []
//             }

//             for(var i = 0; i < dataObj.length; i++) {
//                 if(dataObj[i].fields.category == 'Headliner') {
//                     tempActs.headliner.push(dataObj[i])
//                 }
//                 if(dataObj[i].fields.category == 'Medium Acts') {
//                     tempActs.mediumActs.push(dataObj[i])
//                 }
//                 if(dataObj[i].fields.category == 'Small Acts') {
//                     tempActs.smallActs.push(dataObj[i])
//                 }
//             }

//             return tempActs
//         }

//     },
//     mounted: function() {

//         // Load data
//         this.loadInfos();
//         this.loadActs();

//     },
//     methods: {
//         // Enable / Disable Menu
//         toggleMenu: function() {
//             document.querySelector('body').classList.toggle('openMenu')
//         },

//         // Load contant of table Festival Info
//         loadInfos: function() {
//             var self = this
//             var app_id = airtableID
//             var app_key = airtableKey
//             this.festivalInfo = []
//             axios.get("https://api.airtable.com/v0/" + app_id + "/festivalInfo?view=Grid%20view", {
//                     headers: {
//                         Authorization: "Bearer " + app_key
//                     }
//                 }
//             ).then(function(response) {
//                 self.festivalInfo = response.data.records
//             }).catch(function(error) {
//                 console.log(error)
//             })
//         },

//         // Load content of table Acts
//         loadActs: function() {
//             var self = this
//             var app_id = airtableID
//             var app_key = airtableKey
//             this.acts = []
//             axios.get("https://api.airtable.com/v0/" + app_id + "/acts?view=Grid%20view", {
//                     headers: {
//                         Authorization: "Bearer " + app_key
//                     }
//                 }
//             ).then(function(response) {
//                 self.acts = response.data.records
//             }).catch(function(error) {
//                 console.log(error)
//             })
//         }
//     }
// })
