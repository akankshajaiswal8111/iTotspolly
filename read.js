var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com/"
});
var docClient = new AWS.DynamoDB.DocumentClient()
var table = "pollyCourse";
var id = Aditi_Phrase2;
var params = {
    TableName: table,
    Key:{
        "id": id
    }
};
docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
});
