require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { json } = require("express/lib/response");
const https = require("https");
const { options } = require("request");

const app = express();
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signUp.html");
})

app.post("/", function (req, res) {

    var FirstName = req.body.fName;
    var lastname = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_field: {
                    FNAME: FirstName,
                    LNAME: lastname,
                }

            }
        ]
    };
    const url = process.env.URL_LINK;
    const options = {
        method: "POST",
        auth: process.env.AUTH_LINK
    };
    var jsonData = JSON.stringify(data);
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");

        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })

    });
    request.write(jsonData);
    request.end();

})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3007, function () {
    console.log("The Server is running in 3007 port");
});
