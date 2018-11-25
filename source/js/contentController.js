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

        // Current City (from LocalStorage)
        currentCity: '',

        // Buy Form
        form: {
            gender: '',
            prename: '',
            name: '',
            email: '',
            address: '',
            zip: '',
            city: '',
            location: '',
            package: ''
        },

        // Helpers
        date: null,
        now: Math.trunc((new Date()).getTime() / 1000),
        loading: false,
        selectCityOverlay: false
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
        },

        // Select City
        selectCity: function(city) {
            localStorage.setItem('selectedCity', city);
            this.currentCity = city;
            this.getData();
            this.selectCityOverlay = false;
        },

        // Get Data
        getData: function() {
            var self = this;
            self.loading = true;

            // Get Data from current Location
            axios.get(self.airtable.url + self.airtable.id + "/festivalInfo",
                { 
                    headers: { Authorization: "Bearer " + self.airtable.key },
                    params: { filterByFormula: "IF(place = '" + self.currentCity + "', TRUE(), FALSE())" }
                }).then(function(res) { 
                    self.festivalInfo = res.data.records
    
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

                                // Init stuff
                                baguetteBox.run('.gallery');

                                // Some nice ASCII Art
                                console.log("%c  ____        __                 _                          _       ", "color: #54F");
                                console.log("%c | __ )  ___ / _|_ __ ___  ___  (_)___   _ __ ___  __ _  __| |_   _ ", "color: #54F");
                                console.log("%c |  _ \\ / _ \\ |_| '__/ _ \\/ _ \\ | / __| | '__/ _ \\/ _` |/ _` | | | |", "color: #54F");
                                console.log("%c | |_) |  __/  _| | |  __/  __/ | \\__ \\ | | |  __/ (_| | (_| | |_| |", "color: #54F");
                                console.log("%c |____/ \\___|_| |_|  \\___|\\___| |_|___/ |_|  \\___|\\__,_|\\__,_|\\__, |", "color: #54F");
                                console.log("%c                                                              |___/ ", "color: #54F");

                                // Loading complete!
                                setTimeout(function() {
                                    self.loading = false;
                                }, 100);

                            }).catch(function(err) { console.log(err); })

                        }).catch(function(err) { console.log(err); })

                    }).catch(function(err) { console.log(err); })
                    
                }).catch(function(err) { console.log(err); })
        },

        // Get only Locations (for 'Choose your Location' overlay)
        getLocations: function() {
            var self = this;

            axios.get(self.airtable.url + self.airtable.id + "/festivalInfo",
                {
                    headers: { Authorization: "Bearer " + self.airtable.key }
                }).then(function(res) {
                    self.locations = res.data.records;
                }).catch(function(err) { console.log(err); })
        }
    },
    mounted: function() {
        this.loading = true;
        this.getLocations();

        if(localStorage.getItem('selectedCity')) {
            this.currentCity = localStorage.getItem('selectedCity');
            this.loading = false;
            this.getData();
        } else {
            this.selectCityOverlay = true;
            this.loading = false;
        }
    }
});