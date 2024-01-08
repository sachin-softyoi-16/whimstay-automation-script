require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3080;
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.get('/', (req,res)=>{
    return res.status(200).send(`Automation running`)
});

app.listen(PORT, ()=>{
console.log(`Server running with http://localhost:${PORT}`)
})