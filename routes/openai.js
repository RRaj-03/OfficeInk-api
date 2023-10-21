require('dotenv').config()
const express = require("express");
const router = express.Router();
const mysql = require('mysql2');
const { sendToOpenAI} = require('../Services/openai_service');
const connection = require('../db_connection/db');

//sending userdata to open ai  using POST Method,  "api/openai/sendingToAi"
router.post("/sendingToOpenAIForComment", async (req, res) => {
    var ud= req.body;

    console.log(typeof ud);
    console.log(ud);
    ud["purpose"]="comment";
    ud["LinkedinID"]="12313ss13s"
    
    console.log(ud);

    var data= await sendToOpenAI(ud);
    console.log("Data-->",data);
    
         //inserting data into database
        //   connection.query('INSERT INTO undefined.comments (Commentscol,authorName,authorBio,LinkedinID) VALUES (?, ?,?,?)', [data,ud.username,ud.userbio,ud.LinkedinID], function (err, results, fields) {
        //     if (err) throw err;
        //     console.log('Inserted into api_data table.');
        //   });
      res.send(data);    
});

router.post("/sendingToOpenAIForReply", async (req, res) => {
    var ud= req.body;

    console.log(typeof ud);
    console.log(ud);
    ud["purpose"]="reply";
    ud["LinkedinID"]="12313ss13s"

    var data= await sendToOpenAI(ud);
    console.log(data);      

       //inserting data into database
    //    connection.query('INSERT INTO undefined.reply (Replycol,authorName,authorBio,LinkedinID) VALUES (?, ?,?,?)', [data,ud.auhtorname,ud.authorbio,ud.LinkedinID], function (err, results, fields) {
    //     if (err) throw err;
    //     console.log('Inserted into api_data table.');
    //     }
    //     );
    res.send(data);
});



router.post("/sendingToOpenAIForPost", async (req, res) => {
        const ud= req.body;
        console.log(typeof ud);
        ud["purpose"]="post";
        ud["LinkedinID"]="12313ss13s"

        console.log(ud);
        var data= await sendToOpenAI(ud)
        console.log("Data-->",data);
            
          //inserting data into database
        // connection.query('INSERT INTO undefined.posts (userPosts,LinkedinID) VALUES (?, ?)', [data,ud.LinkedinID], function (err, results, fields) {
        //             if (err) throw err;
        //             console.log('Inserted into api_data table.');
        //         }
        // );
         res.send(data);
    }
);


router.post("/sendingToOpenAIForRePost", async (req, res) => {
    var ud= req.body;
    console.log(typeof ud);
    ud["purpose"]="rePost";
    ud["LinkedinID"]="12313ss13s"

    console.log(ud);

    var data= await sendToOpenAI(ud);
    console.log("Data-->",data);
    
//inserting data into database
        //   connection.query('INSERT INTO undefined.reposts (authorName,authorBio,rePostscol,LinkedinID) VALUES (?, ?,?,?)', [ud.authorName,ud.authorBio,data,ud.LinkedinID], function (err, results, fields) {
        //     if (err) throw err;
        //     console.log('Inserted into api_data table.');
        // }
// );
    res.send(data);
}
);



module.exports = router;