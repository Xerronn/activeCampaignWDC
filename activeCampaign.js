(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var arg = JSON.parse(tableau.connectionData);
        cols = schema()
        var tableSchema = {
            id: "activeCampaignSchema",
            alias: "Active Campaign Schema",
            columns: cols
        };
        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = async function(table, doneCallback) {
        //connection data from the html page
        var arg = JSON.parse(tableau.connectionData);

        //check if api key is correct. mostly proof of concept
        var authenticated = await authKey(arg);

        if (authenticated) {
            //add the data into the tableData array
            var tableData = await apiCall(arg);

            //push the data to tableau in chunks of 250 rows and then end the function call
            var row_index = 0;
            var size = 250;
            while (row_index < tableData.length) {
                table.appendRows(tableData.slice(row_index, size + row_index));
                row_index += size;
                tableau.reportProgress("Getting row: " + row_index);
            }
        }
        doneCallback();
    };

    //final step for the WDC
    tableau.registerConnector(myConnector);


    //function to limit the requests below the rate limit of the api of 5/s
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const apiCall = async (arg) => {
        let tableData = [];
        let numContacts = 1000; //start at 1000 but it gets set to the true number on the first iteration
        for (var i = 0; i < numContacts; i = i + 100) {
            
            //increment url offset by our counter. max is 100 per call so we increment by 100
            let url = "https://mysterious-journey-98112.herokuapp.com/https://getkion.api-us1.com/api/3/contacts?status=-1&orders%5Bemail%5D=ASC&limit=100&offset=" + i;
            let options = {
                method: 'GET', 
                headers: new Headers({
                    "Api-Token": arg.key
                })
            };

            //fetch the json data from the url
            await fetch(url, options)
            .then(res => res.json())
            .then(function(data) {
                console.log(i);
                console.log(data);
                for (var contact of data.contacts) {
                    tableData.push({
                        "contactID": contact.id,
                        "contactEmail": contact.email,
                        "contactCreationDate" : contact.cdate
                    });
                }

                //only on the first iteration, set numContacts to the total
                if (i == 0) {
                    numContacts = parseInt(data.meta.total);
                    console.log(numContacts);
                }
            })
            .catch(err => tableau.log('error:' + err));

            //wait 205ms
            //turns out the await on the fetch is long enough of a delay
            //await delay(205);
        }
        return tableData;
    };


    //function to test if the api key provided is authorized
    async function authKey(arg) {
        let authUrl = "https://mysterious-journey-98112.herokuapp.com/https://getkion.api-us1.com/api/3/contacts?limit=2";
        let authOptions = {
            method: 'GET', 
            headers: new Headers({
                "Api-Token": arg.key
            })
        };
        //if there is an error, the API key is incorrect
        let response = await fetch(authUrl, authOptions);

        //if it returns failed to auth error, then the key is invalid
        if (response.status === 403) {
            tableau.abortWithError("API key failed to authenticate");
            return false
        }

        //otherwise it should be fine
        return true;
    }

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            var arg = {
                key: $('#key').val().trim(),
            };
            tableau.connectionData = JSON.stringify(arg);
            tableau.connectionName = "Active Campaign contacts count";
            tableau.submit();
        })
    });

})();
