require('dotenv').config()
const express = require("express");
const mysql = require('mysql2');
const connection = require('../db_connection/db');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

router.get("/fetchallpromts",fetchuser,async (req, res) => {
    
    const LinkedinID = req.user;
    console.log("LinkedinID__> ",LinkedinID);
    try {
        const sql = `SELECT * FROM prompt where LinkedinID=?`;
        const [rows, fields] = await connection.promise().query(sql,[LinkedinID]);
        if(rows.length===0){
            return res.status(401).json({error:"No prompts found"});
        }
        res.json(rows);
        // console.log(rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.post("/addprompt",fetchuser, async (req, res) => {
    try {
        const {tone,prompt} = req.body;
        console.log(req.body);
        const LinkedinID = req.user;
        const sql = "INSERT INTO prompt (tone,prompt,LinkedinID) VALUES (?,?,?)";
        // const [rows, fields] = await connection.promise().query(sql,[tone,prompt,req.user.LinkedinID]);
        const [rows, fields] = await connection.promise().query(sql,[tone,prompt,LinkedinID]);
        res.json(rows);
        // console.log(rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.put("/updatecomment/:id",fetchuser,async (req, res) => {
    try {
        const {prompt} = req.body;
        const id = req.params.id;
        const LinkedinID=req.user
        console.log(req.body);
        const sql = "UPDATE prompt SET prompt=? WHERE id=? AND LinkedinID=?";
        const [rows, fields] = await connection.promise().query(sql,[prompt,id,LinkedinID]);
        res.json(rows);
        console.log("updated data--> ",rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;

