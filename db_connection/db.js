// const { DefaultAzureCredential,ClientSecretCredential } = require("@azure/identity");
require('dotenv').config();
const mysql = require('mysql2');

// for system assigned managed identity
// const credential = new DefaultAzureCredential();

// for user assigned managed identity
// const clientId = process.env.AZURE_MYSQL_CLIENTID;
// const credential = new DefaultAzureCredential({
//    managedIdentityClientId: clientId
// });

// for service principal
// const tenantId = process.env.AZURE_MYSQL_TENANTID;
// const clientId = process.env.AZURE_MYSQL_CLIENTID;
// const clientSecret = process.env.AZURE_MYSQL_CLIENTSECRET;

// const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

// acquire token
// var accessToken;
// const getToken= async () => {
//        accessToken = await credential.getToken('https://ossrdbms-aad.database.windows.net/.default');
//         console.log("accessToken--> ",accessToken);
// }
// const connection = mysql.createConnection({
//   host: process.env.AZURE_MYSQL_HOST,
//   user: process.env.AZURE_MYSQL_USER,
//   password: process.env.AZURE_MYSQL_PASSWORD,
//   database: process.env.AZURE_MYSQL_DATABASE,
//   port: process.env.AZURE_MYSQL_PORT,
// //   ssl: process.env.AZURE_MYSQL_SSL
// });

const connection = mysql.createConnection({
  host: process.env.AZURE_MYSQL_HOST ,    
  user: process.env.AZURE_MYSQL_USER,
  password: process.env.AZURE_MYSQL_PASSWORD,
  database: process.env.AZURE_MYSQL_DATABASE,
  port: 3306,
//   ssl: process.env.AZURE_MYSQL_SSL
});

// connection.query('CREATE DATABASE IF NOT EXISTS ' + process.env.MYSQL_DATABASE, function (err, results, fields) {
//     if (err) throw err;
//     console.log('Created database.');
//     }   
// );

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});



module.exports = connection;
