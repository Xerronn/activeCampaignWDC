schema = function(){
    //schema for summary function
    var cols = [{
            id: "contactID",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "contactEmail",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "contactCreationDate",
            dataType: tableau.dataTypeEnum.datetime
        }
    ];
    
    var tableSchema = {
        id: "numContacts",
        alias: "Number of Contacts",
        columns: cols
    };
    return cols;
};