const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const habitmodel = require('./models/habitSchema');

const app = express();
port =4400;

app.use(bodyParser.urlencoded({extended : true}));

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('./assets'));



// auto added every dat status
//'*/1 * * * *' => This is work every minutes, i was tested. but '0 0 * * *' => This is work every mid night i can't test
var task = cron.schedule('0 0 * * *', async () =>  {  
    // console.log('will execute every minute until stopped');
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    try{
        // var id = '64c2497ddd10f7758bbadbef';
        var result = await habitmodel.find();
        for(let i=0;i<result.length;i++){
            let id = result[i]._id;
            var totalDay = result[i].totalDay+1;
            let workDay = result[i].workDay;
            if(await result[i].oneweek[result[i].oneweek.length-1].status == true){
                workDay +=1;
            }
            // console.log(totalDay);
            await habitmodel.findByIdAndUpdate(id,{
                totalDay : totalDay,
                workDay : workDay
            });
            var updateData = await habitmodel.findByIdAndUpdate(id,{
                $push : {
                    // totalDay : totalDay,
                    oneweek : {
                        date : day,
                        month : month,
                        year : year,
                        status : "false"
                    }
                }
            });
            // console.log(updateData.oneweek.length);
            if(updateData.oneweek.length>6){
                let deleteDateId = updateData.oneweek[0]._id;
                // console.log(result[0]._id," / ",deleteDateId);
                let deleteDate = await habitmodel.findByIdAndUpdate(id,{
                    $pull : {
                        oneweek :{
                            _id : deleteDateId
                        }
                    }
                });
            }
        }
    }catch(err){
        console.log(err);
        return;
    }
  });

app.get('/',async (req,res)=>{
    try{
        let habits = await habitmodel.find();
            return res.render('main',{
                habits : habits
            });
    }catch(err){
        console.log(err);
    }
    res.send("Server data problem !");
});


//   add habits
app.post('/add-habits',async (req,res)=>{
    try{
        let result = await habitmodel.findOne({habitName : req.body.habit});
        if(result)
        {
            res.send("data is already inserted");
            return;
        }
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();
        // console.log(day,"/",month,"/",year);
        date = `${day}/${month}/${year}`;

        var newHabits = new habitmodel({
            habitName : req.body.habit,
            addDate : date,
            oneweek : {
                date : day,
                month : month,
                year : year,
                status : "false"
            }
        });
        result = await newHabits.save();
        // console.log(result);
        return res.redirect('/');
    }catch(err){
        console.log(err);
        res.send("somthing went wrong! please try again....");
    }
    // res.send("data not inserted");
});


// change status
app.put('/:id/status',async (req,res)=>{
    try{
        let id = req.params.id;
        let result = await habitmodel.findOne({_id : id});
        let len = result.oneweek.length-1;
        if(len<0){return;}
        let parDayId = result.oneweek[len]._id;
        let status = result.oneweek[len].status;
        // console.log(parDayId,"& ",status);
        if(status == false){
            status = true;
        }else if(status == true){
            status = false
        }
        // console.log("status = ",status);
        result = await habitmodel.findByIdAndUpdate(id,{
            $set : {
                // 'oneweek._id' : parDayId
                'oneweek.$[u].status' : status
            }},
            {
                arrayFilters : [{
                    'u._id' : parDayId
                }] 
            }
        );
    }catch(e){
        console.log(e);
    }
});



// delete Habits
app.delete('/:id/delete',async (req,res)=>{
    try{
        var id = req.params.id;
        // console.log(id);
        await habitmodel.findByIdAndDelete({_id : id});
        return res.redirect('/');
    }catch(e){
        console.log(e);
        return;
    }
});


// creating server 
app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }
    console.log(`Server is running on port : ${port}`);
});