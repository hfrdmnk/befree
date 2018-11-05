// Handle Data
function handleData() {
    var airtableKey = "keyO54NEvmY5VwVOO";
    var airtableID = "appJfav4dlJdonWhY";

    var app = new Vue({
        el: '#app',
        data: {
            festivalInfo: [],
            acts: [],
            currentCity: localStorage.getItem('befree_city')
        },
        computed: {
            cityInfo: function() {
                var dataObj = this.festivalInfo;
                for(var i = 0; i < dataObj.length; i++) {
                    if(dataObj[i].fields.Place == this.currentCity) {
                        return dataObj[i];
                    }
                }
            }
        },
        mounted: function() {
            this.loadInfos();
            this.loadActs();
        },
        methods: {
            loadInfos: function() {
                var self = this
                var app_id = airtableID;
                var app_key = airtableKey;
                this.festivalInfo = []
                axios.get(
                    "https://api.airtable.com/v0/" + app_id + "/Festival%20Info?view=Grid%20view", {
                        headers: {
                            Authorization: "Bearer " + app_key
                        }
                    }
                ).then(function(response) {
                    self.festivalInfo = response.data.records
                }).catch(function(error) {
                    console.log(error)
                })
            },
            loadActs: function() {
                var self = this
                var app_id = airtableID;
                var app_key = airtableKey;
                this.acts = []
                axios.get(
                    "https://api.airtable.com/v0/" + app_id + "/Acts?view=Grid%20view", {
                        headers: {
                            Authorization: "Bearer " + app_key
                        }
                    }
                ).then(function(response) {
                    self.acts = response.data.records
                }).catch(function(error) {
                    console.log(error)
                })
            }
        }
    })
}
