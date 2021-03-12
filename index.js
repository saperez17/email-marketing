const express = require("express")
const app = express()
const read = require("read-css")
const https = require("https")
require('dotenv').config()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname+"/static"));
app.use(express.static(__dirname+"/images"));
app.use(express.static(__dirname+"/templates"));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/templates/index.html");
});

app.get("failure", function(req, res){
    res.redirect("/");
});

app.post("/", function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.SecondName;
    var email = req.body.email;
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const dataJson = JSON.stringify(data)

    var url = "https://us1.api.mailchimp.com/3.0/lists/9c7b824019";
    var options = {
        method: "POST",
        auth: "santiagobn1:"+process.env.API_KEY
    }
    var request = https.request(url, options, function(response){
        if (response.statusCode==200){
            // response.on("data", function(data){
            //     console.log(JSON.parse(data));
            // })
            res.sendFile(__dirname +  "/templates/success.html");
        }else{
            res.sendFile(__dirname +  "/templates/failure.html");
        }
        
    })
    request.write(dataJson);
    request.end();

});

app.listen("3000", function(){
    console.log("Server fired up");  
})

// For Heroku deployment
app.listen(process.env.PORT || 3000, function(){
    console.log("Server fired up");  
})
