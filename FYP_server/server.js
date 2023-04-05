const express = require('express');
const path = require('path');
const app = express();
var monk = require('monk');
var db = monk('localhost:27017/fitnessAppdb');
const internal = require('stream');

// fetches root files from client/build
//app.use(express.static(path.join(__dirname, 'client', 'build')));

// May only be exist once in app
app.use(express.json());



app.post('/api/login', async (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        var col = db.get('accounts')
        var userInfo = await col.findOne({username: username});
        if (userInfo){
            if (userInfo.password === password){
                console.log(`user:${username} password:${password} login success`);
                res.json({success:true});
            }
            else{
                console.log(`user:${username} password:${password} login unsuccess`);
                res.json({success:false});
            }
        }
        else{
            console.log("no this user");
            res.json({success:false})
        }
    }
    catch(e){
        console.log(e)
        res.json({success:false})
    }
    
})

app.post('/api/newaccount',async (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        var col = db.get('accounts')
        var userInfo = await col.findOne({username: username});
        if (userInfo){
            console.log("user existed")
            res.json({success:false})
            
        }
        else{
            await col.insert({username: username, password:password});
            console.log(`user:${username} password:${password} create account`)
            res.json({success:true})
        }
    }
    catch(e){
        console.log(e)
        res.json({success:false})
    }
})

app.post('/api/workout', async (req, res) => {
    try{
        const username = req.body.username;
        const data = req.body.data;
        const workoutName = req.body.workoutName;
        var col = db.get('workouts');
        var date = Date.now();
        await col.insert({username: username, data:data, date:date, workoutName:workoutName});
        console.log(`new data added username:${username}, data:${data}, date:${date}, workoutName:${workoutName}`)
        res.json({success:true})
    }
    catch(e){
        res.json({success:false})
        console.log(e)
    }

})
app.get('/api/workout', async (req, res) => {
    try{
        const username = req.query.username;
        const workoutName = req.query.workoutName;
        var col = db.get('workouts');
        var result = await col.find({username:username, workoutName:workoutName}, {sort: {date: -1}});
        console.log(`resule found: ${result}`)
        res.json({success:true, result:result})
    }
    catch(e){
        console.log(e)
        res.json({success:false})
    }

})
var server = app.listen(8000)