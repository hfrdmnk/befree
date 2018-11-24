Vue.config.devtools = true;

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
        locations: [],
        headliner: [],
        mediumActs: [],
        smallActs: [],
        
        // Current City (from Localstorage)
        currentCity: 'Barcelona',

        // Helpers
        date: null,
        now: Math.trunc((new Date()).getTime() / 1000),
        loading: true
    },
    computed: {
        // Countdown Elements
        countdownSeconds: function() {
            return (this.date - this.now) % 60;
        },

        countdownMinutes: function() {
            return Math.trunc((this.date - this.now) / 60) % 60;
        },

        countdownHours: function() {
            return Math.trunc((this.date - this.now) / 60 / 60) % 24;
        },

        countdownDays: function() {
            return Math.trunc((this.date - this.now) / 60 / 60 / 24);
        },

        countdownExpired: function() {
            if(this.date - this.now < 0) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        // Enable / Disable Menu
        toggleMenu: function() {
            document.querySelector('body').classList.toggle('openMenu');
        }
    },
    mounted: function() {
        var self = this;

        // Get Data from current Location
        axios.get(self.airtable.url + self.airtable.id + "/festivalInfo",
            { 
                headers: { Authorization: "Bearer " + self.airtable.key },
                params: { filterByFormula: "IF(place = '" + self.currentCity + "', TRUE(), FALSE())" }
            }).then(function(res) { 
                self.festivalInfo = res.data.records
                
                // Get Data From all Location
                axios.get(self.airtable.url + self.airtable.id + "/festivalInfo",
                    {
                        headers: { Authorization: "Bearer " + self.airtable.key }
                    }).then(function(res) {
                        self.locations = res.data.records;

                        // Get Headliner
                        axios.get(self.airtable.url + self.airtable.id + "/acts",
                        {
                            headers: { Authorization: "Bearer " + self.airtable.key },
                            params: { filterByFormula: "IF(category = 'Headliner', TRUE(), FALSE())" }
                        }).then(function(res) {
                            self.headliner = res.data.records;

                            // Get Medium Acts
                            axios.get(self.airtable.url + self.airtable.id + "/acts",
                            {
                                headers: { Authorization: "Bearer " + self.airtable.key },
                                params: { filterByFormula: "IF(category = 'Medium Acts', TRUE(), FALSE())" }
                            }).then(function(res) {
                                self.mediumActs = res.data.records;

                                // Get Small Acts
                                axios.get(self.airtable.url + self.airtable.id + "/acts",
                                {
                                    headers: { Authorization: "Bearer " + self.airtable.key },
                                    params: { filterByFormula: "IF(category = 'Small Acts', TRUE(), FALSE())" }
                                }).then(function(res) {
                                    self.smallActs = res.data.records;

                                    // All Data fetched!
                                    // Countdown Prep
                                    self.date = Math.trunc(Date.parse(self.festivalInfo[0].fields.startTimestamp) / 1000);
                                    window.setInterval(function() {
                                        self.now = Math.trunc((new Date()).getTime() / 1000);
                                    }, 1000);

                                }).catch(function(err) { console.log(err); })

                            }).catch(function(err) { console.log(err); })

                        }).catch(function(err) { console.log(err); })

                    }).catch(function(err) { console.log(err); })
                
            }).catch(function(err) { console.log(err); })      
    }
});