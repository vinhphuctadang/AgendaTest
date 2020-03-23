const express = require('express')
const app = express()
const port = 80
const bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

function should(){
    return async (req,res,next)=>{
        if(!req.body.int){
            res.send('Require "int"')
            return
        };
        next()
    }
}
app.post('/',
    should(), 
    async(req,res)=>{
        res.send(req.body)
    }
)

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}!`)
})