require("dotenv").config();
const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const connection = require("../db_connection/db");
var jwt = require("jsonwebtoken");

const DPFComment = require("../db_connection/defaultPromptforcomment");
const DPprompt = require("../db_connection/defaultPostPrompt");

const client_id = process.env.LINKEDIN_CLIENT_ID;
const client_secret = process.env.LINKEDIN_CLIENT_SECRET;
// const  redirect_uri= 'http://localhost:3000/dashboard';

// request of linkedin login intialize
router.get("/linkedin", (req, res) => {
	const response = passport.authenticate("linkedin", { state: req.query.id });
	res.send(response);
});

// router.get("/linkedin",async(res,req)=>{
//     const redirect_uri="http://localhost:5000/auth/linkedin/callback";
//     const scope="profile%20email%20openid";
//     const state="123456789";
//     const response_type="code";

//     const result= await axios.get(`https://www.linkedin.com/oauth/v2/authorization?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`)
//     // res.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`);
//     // const data=result.data;
//     // console.log("result-->",result);
// } // request of linkedin login intialize
// );

// router.get('/linkedin/callback', passport.authenticate('linkedin', {  //this is the endpoint which redirects after linkedin login
//     successRedirect: 'http://localhost:3000/dashboard',
//     failureRedirect: 'http://localhost:3000/login',
// })
// );

var user_info1;
var token;

router.get("/linkedin/callback", async (req, res) => {
	// console.log("req", req);
	console.log("first", req.query);
	const code = req.query.code;
	console.log("code--> ", code);
	console.log("hello");
	const redirect_uri = "http://backend.officeink.live/auth/linkedin/callback";
	var access_token;
	const access_token_url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&client_id=${client_id}&client_secret=${client_secret}`;
	const res_token = await axios
		.post(access_token_url)
		.then((res) => {
			access_token = res.data.access_token;
			// console.log("access_token--> ",access_token);
			// res.send(res.data);
		})
		.catch((err) => {
			console.log(err);
		});

	console.log("access_token--> ", access_token);
	var user_info;

	const user_info_url = `https://api.linkedin.com/v2/userinfo`;
	if (access_token) {
		const res_user_info = await axios
			.get(user_info_url, {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			})
			.then((response) => {
				// console.log("user_info--> ",response.data);
				user_info = response.data;
				// res.send(res.data);
			})
			.catch((err) => {
				console.log("ERROR: ", err);
			});
	} else {
		console.log("access_token not found");
	}

	if (user_info) {
		// req.session.user_info=user_info;
		console.log("session-->");

		user_info1 = user_info;

		const LinkedinID = user_info.sub;
		const name = user_info.name;
		const email = user_info.email;
		const picture = user_info.picture;

		connection.query(
			"select * from officeinksch.users where LinkedinID=?",
			[LinkedinID],
			function (err, results, fields) {
				if (err) throw err;
				console.log("Inserted into api_data table.");
				console.log("results-->", results);

				if (results.length == 0) {
					console.log("user not found");
					//inserting data into database
					connection.query(
						"INSERT INTO officeinksch.users (LinkedinID,name,email,picture) VALUES (?, ?,?,?)",
						[LinkedinID, name, email, picture],
						function (err, results, fields) {
							if (err) throw err;
							console.log("Inserted into api_data table.");
						}
					);

					connection.query(
						"delete from officeinksch.prompt where LinkedinID=?",
						[LinkedinID],
						function (err, results, fields) {
							if (err) throw err;
							console.log("Deleted from prompts table.");
						}
					);

					connection.query(
						"delete from officeinksch.postprompt where LinkedinID=?",
						[LinkedinID],
						function (err, results, fields) {
							if (err) throw err;
							console.log("Deleted from post prompts table.");
						}
					);

					DPFComment.forEach((element) => {
						connection.query(
							"INSERT INTO officeinksch.prompt (tone,prompt,LinkedinID) VALUES (?, ?,?)",
							[element.tone, element.prompt, LinkedinID],
							function (err, results, fields) {
								if (err) throw err;
								console.log("Inserted into DPFComment table.");
							}
						);
					});

					console.log("DPFComment-->    testing console  ------>>>>>>>");
					DPprompt.forEach((element) => {
						connection.query(
							"INSERT INTO officeinksch.postprompt (Example,prompt,LinkedinID) VALUES (?, ?,?)",
							[element.example, element.prompt, LinkedinID],
							function (err, results, fields) {
								if (err) throw err;
								console.log("Inserted into DPprompt table.");
							}
						);
					});
				} else {
					user_info1 = results[0];
					// console.log("user found",user_info1);
				}
			}
		);

		res.redirect(`https://www.officeink.live/dashboard`);
	}
});

router.get("/linkedin/login/success", (req, res) => {
	try {
		connection.query(
			"select * from officeinksch.users where LinkedinID=?",
			[user_info1.LinkedinID],
			function (err, results, fields) {
				if (err) throw err;
				if (results.length == 0) {
					return res.status(401).json({ error: "Invalid credentials" });
				}

				user = results[0];
				// console.log("user-->",user);

				const payload = { LinkedinID: user.LinkedinID };
				// console.log("payload-->",payload);
				const token = jwt.sign(payload, process.env.JWT_SECRET, {
					expiresIn: "1h",
				});
				// console.log("token after success login -->",token);
				// req.session.user=user;
				res.status(200).json({
					success: true,
					message: "user has successfully authenticated",
					token: token,
					user: user_info1,
				});
			}
		);
	} catch (err) {
		res.json({
			error: err.message,
			success: false,
			message: "user failed to authenticate.",
		});
	}
});

router.get("/linkedin/login/failed", (req, res) => {
	console.log("login failed");
	res.status(401).json({
		success: false,
		message: "user failed to authenticate.",
	});
});

router.get("/logout", (req, res) => {
	res.status(200).json({
		success: true,
		message: "user has successfully logout.",
	});
	// res.redirect("/");
});

module.exports = router;
