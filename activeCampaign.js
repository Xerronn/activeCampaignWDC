(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
    // // Init function for connector, called during every phase
    // myConnector.init = function(initCallback) {
    // tableau.authType = tableau.authTypeEnum.custom;
    // initCallback();
    // }

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
    myConnector.getData = function(table, doneCallback) {
        //variable declarations
        var arg = JSON.parse(tableau.connectionData);
        let url = "https://mysterious-journey-98112.herokuapp.com/https://getkion.api-us1.com/api/3/contacts"
        let options = {
            method: 'GET', 
            headers: new Headers({
                "Api-Token": arg.key
            }),
            qs: {status: '-1', 'orders[email]': 'ASC'} //-1 means any status
        };

        fetch(url, options)
        .then(res => res.json())
        .then(function(data) {
            console.log(data);
            tableData = [];
            tableData.push({
                "totalCount": data.contacts.length
            });
            table.appendRows(tableData);
            doneCallback();
        })
        .catch(err => tableau.log('error:' + err));

        
    };

    tableau.registerConnector(myConnector);

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
