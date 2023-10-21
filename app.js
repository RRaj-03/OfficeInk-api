require("dotenv").config();
const express = require("express");
const app = express();
// const cookieSession = require("cookie-session");
const cors = require("cors");
const port = 5000;
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const strat = require("./auth/passport_linkedin");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: "SESSION_SECRET",
		resave: false,
		saveUninitialized: true,
		maxAge: 24 * 60 * 60 * 1000,
	})
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// app.use(
//   cookieSession({ name: "session", keys: ["secret_ketasd"], maxAge: 24 * 60 * 60 * 100 })
// );
// Set up a whitelist and check against it:
var whitelist = ["https://www.linkedin.com/", "http://localhost:3000"];
var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};
app.use(
	cors(
		{
			origin: ["https://www.linkedin.com", "http://localhost:3000"],
			methods: ["GET", "POST", "PUT", "DELETE"],
			credentials: true,
		},
		{
			origin: "https://www.officeink.live",
			methods: ["GET", "POST", "PUT", "DELETE"],
			credentials: true,
		}
	)
);

app.use("/api/openai", require("./routes/openai"));

app.use("/auth", require("./routes/linkedin"));

app.use("/api/prompt", require("./routes/prompt"));

app.use("/api/postprompt", require("./routes/postPrompts"));

app.get("/", (req, res) => {
	console.log("hello from backend");
	res.send("hello from backend");
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
	// console.log(`Example app listening at https://nochat-server.onrender.com/`);
});
