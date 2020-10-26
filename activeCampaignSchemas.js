schema = function(){
    //schema for summary function
    var cols = [{
        id: "totalCount",
        dataType: tableau.dataTypeEnum.int
    }];
    
    var tableSchema = {
        id: "numContacts",
        alias: "Number of Contacts",
        columns: cols
    };
    return cols;
};