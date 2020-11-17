const { Console } = require('console');
var express = require( 'express' ); //Adding Expess
//var http = require( 'http' ); //Adding http
var jsforce = require('jsforce'); //Adding JsForce
var bodyParser = require('body-parser');
var httpClient = require('request');
const { config } = require('process');


var app = express();
//bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
//app.set( 'port', process.env.PORT || 3000 );

//Common variabbles
//Price Rule
let fieldNameValueMapCPQ1Map = new Map();
let fieldNameValueMapCPQ2Map = new Map();
let fieldNameValueMapCPQ2 = [];
//Missing Keys and Values
let missingKeyValueMapCPQ1 = new Map();
let diffFieldInCPQ1 = new Map();
let diffFieldInCPQ2 = new Map();//For Update
let diffFieldInCPQ2Obj = {};//For Update

//Price Conditions
let priceConditionsCPQ2Map = new Map();
let priceConditionsCPQObj = {};
let priceConditionsCPQObjArr = [];
//Price Actions
let priceActionsCPQ2Map = new Map();

/*******
 * Assumptions: 
 * Source:Full Sandbox
 * Dest : Dev
 * Filter Condition: ID//Production_ID__c in CPQ2 has CPQ1's Record Id
 */
//***************** CPQ 2 - Connn2
var conn2 = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
   //loginUrl : 'https://nteligroup-dev-ed.my.salesforce.com'
   //loginUrl : 'https://alicetraining--n360full.my.salesforce.com/'
   loginUrl:'https://alicetraining--n360full.my.salesforce.com/'//Dev
  });
  var username2 = 'navigate360team@orion-gs.com.n360full';//'anand.kumaraswamy@nteligroup.com.cpqtwo';
  var password2 = '0r!on@AliceBDIutkNcOq4J47JbYj2wRDvtS';//BDIutkNcOq4J47JbYj2wRDvtS;//'cpq12345!872br6x3x3cAcxyRkpYVHjyJ';//872br6x3x3cAcxyRkpYVHjyJ
  /*conn2.login(username2, password2, function(err, userInfo) {
    if (err) { return console.error(err); }
    console.log('Conn2');
  });
*/
//******************CPQ 1 */
var conn1 = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
   loginUrl : 'https://alicetraining--dev2.my.salesforce.com/' //https://nteli-dev-ed.my.salesforce.com',
   //instanceUrl : 'https://nteli-dev-ed.my.salesforce.com'
   
  });
var username = 'navigate360team@orion-gs.com.test';//'anand.kumaraswamy@nteligroup.com.cpqone';
var password = 'NextGenCPQ20BBe7Ip2YNxO0Jm5JYjssY0A2';//'cpq12345!n3OhqOlTqqiMfZso9RdgRDpXR';//n3OhqOlTqqiMfZso9RdgRDpXR
/*conn1.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  console.log('Conn1');*/
  
    conn2.login(username2, password2, function(err, userInfo) {
      if (err) { return console.error(err); }
      console.log('Conn2');
    });
    conn1.login(username, password, function(err, userInfo) {
      if (err) { return console.error(err); }
      console.log('Conn1');
//Login End point
app.get('/api/login',function(req,res){
  conn2.login(username2, password2, function(err, userInfo) {
    if (err) { return console.error(err); }
});
});

app.get('/api/accounts',function(req,res){
  console.log('In Fetch ACCOUNTS');
  // if auth has not been set, redirect to index
  //if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }
  //SOQL query
      let q = 'SELECT id, name FROM Product2 LIMIT 1';//LIMIT 10';
  //instantiate connection
      /*let conn = new jsforce.Connection({
          oauth2 : {oauth2},
          accessToken: req.session.accessToken,
          instanceUrl: req.session.instanceUrl
     });*/
    
  //set records array
      let records = [];
      try{
      let query = conn2.query(q)
         .on("record", function(record) {
           console.log('In ON');
           records.push(record);
           
         })
         .on("end", function() {
           console.log("total in database : " + query.totalSize);
           console.log("total fetched : " + query.totalFetched);
           console.log('Records:',records);
           ////
           
           /* var responseString = res.text();
            if (responseString && typeof responseString === "string"){
             var responseParsed = JSON.parse(responseString);
             if (Api.debug) {
                console.log("RESPONSE(Json)", responseParsed);

             }
             if (Api.debug) {
              console.log("RESPONSE(Txt)", responseString);
            }
            res.send(responseParsed);
            }*/
            res.send(records);
            //res.json(records);
          
         
           /////
           //res.json({accounts:records});
           //res.send(records);
         })
         .on("error", function(err) {
           console.error(err);
         })
         .run({ autoFetch : true, maxFetch : 4000 });
        } catch(error) {
          // text is not a valid json so we will consume as text
        }
         /*conn2.query("SELECT Id, Name FROM Product2 Limit 2", function(err, result) {
          if (err) { return console.error(err); }
          console.log("total : " + result.totalSize);
          console.log("fetched : " + result.records.length);
          records.push(JSON.stringify(result.records));
          console.log('Records:',result.records);
         //res.send({accounts:result.records});
        // res.send(JSON.stringify(result.records));
         //res.json(JSON.stringify(result.records));
          //res.json(JSON.stringify(records));
          //res.send(JSON.stringify(records));
          res.send(records);

          //try{
            console.log(records);
         // var acc = JSON.parse(JSON.stringify(result.records));
         // console.log('Acc:',acc);
         //res.send({accounts:acc});
         // }
          //catch(err)
          //{
          //  console.log(err);
         // }
        });*/
  });
//**** Products */
var srcMap = new Map();
var destMap = new Map();
var srcArr = [];
var destArr = [];
var fieldNameValueSrcMap = new Map();
var fieldNameValueDestMap = new Map();
let diffFieldInSrcObj = {};//For Update
let diffFieldInDestMap = new Map();
let diffFieldInSrcMap = new Map();//For Update
let missingKeyValueMapSrc = new Map();
app.get('/api/deltaProducts1', function (req, res) {
  res.send({accounts:
  [
    { "id": "1001", "type": "Regular" },
    { "id": "1002", "type": "Chocolate" },
    { "id": "1003", "type": "Blueberry" },
    { "id": "1004", "type": "Devil's Food" }
  ]});
});
app.get('/api/deltaProducts', function (req, res) {
  
/*******
 * Assumption: Source:CPQ2
 * Dest : CPQ1
 * Filter Condition: Production_ID__c in CPQ2 has CPQ1's Record Id
 */
//srcArr = [];
//destArr = [];
var srcId = '';
  console.log(conn2.accessToken);
const ProductId = '01ti0000008TcRqAAK';//In Src
conn2.sobject("Product2")
//.find({ Id: {$eq:ProductId }}, '*')
.find({}, '*')
.sort('CreatedDate') //-CreatedDate') 
.limit(2)
.execute(function(err, records2) {
  if (err) { return console.error(err); }
  try
 {
  // console.log('Src Count:',records2.length);
  fieldNameValueSrcMap.clear();
    for(key2 in records2)
    {
      srcId = '';
      let jsonStr ='';
      jsonStr = JSON.stringify(records2[key2]);
      const obj = JSON.parse(jsonStr,function(key,value){
      //console.log(' key',key);
      //console.log(' Value',value);
      if(key != "attributes" && key != 'Dev_Sandbox_ID__c' && key != 'Full_Copy_Sandbox_ID__c')
      {
        if(key == 'Id' && srcId == '')
        {
          srcId = value;
          //console.log('Src id:',srcId);
        }
        fieldNameValueSrcMap.set(key,value);
        
     }
   
     //console.log('srcId:',srcId);
   });
   //console.log('srcId Out:',srcId);
   //let arr = [];
   //arr.push({'key':srcId,'value':fieldNameValueSrcMap});
   srcArr = [...srcArr,{'key':srcId,'value':fieldNameValueSrcMap}];
   //srcArr.push({'key':srcId,'value':fieldNameValueSrcMap});
   //console.log('srcArr :',srcArr);
  }


 }
catch(err) {
  console.error('Error:',err);
}
 // console.log('fieldNameValueSrcMap:',fieldNameValueSrcMap);
 

});
//******************* Dest -  */

console.log(conn1.accessToken);
console.log('Conn1 Instance URL:',conn1.instanceUrl);
// logged in user property
console.log("User ID: " + userInfo.id);
console.log("Org ID: " + userInfo.organizationId);

//Get all field name value pair - CPQ1.
var destId = '';
conn1.sobject("Product2")
  .find({}, '*') // fields in asterisk, means wildcard.
   .sort('CreatedDate') //-CreatedDate') 
  .limit(2)
  .execute(function(err, records1) {
    if (err) { return console.error(err); }
   try
   {
    //console.log('Src Count:',records1.length);
    fieldNameValueDestMap.clear();
      for(key1 in records1)
      {
        destId = '';
        let jsonStr = '';
        
        jsonStr =  JSON.stringify(records1[key1]);
        const obj = JSON.parse(jsonStr,function(key,value){
       //console.log(' key',key);
       // console.log(' Value',value);
        if(key != "attributes" && key != 'Production_id__c' )
        {
          if(key == 'Id' && destId == '')
         {
           destId = value;
           //console.log('Dest id:',destId);
         }
          fieldNameValueDestMap.set(key,value);
          
       }
       //console.log('destId:',destId);
     });
     //console.log('destId Out:',destId);
     //let arr = [];
     //arr.push({'key':destId,'value':fieldNameValueDestMap});
     destArr = [...destArr,destArr.push({'key':destId,'value':fieldNameValueDestMap})];
    
     //console.log('destId destArr:',destArr);
    }
    //console.log('fieldNameValueMapCPQ1Map : ', fieldNameValueMapCPQ1Map );
  }
  catch(err) {
    console.error('Error:',err);
  }
    //console.log('fieldNameValueDestMap:',fieldNameValueDestMap);
  });


//console.log('Outside CPQ1:',srcArr.length);
//console.log('Outside CPQ2:',destArr.length);
//console.log('Src Arr :',srcArr.length);
//console.log('Dest Arr:',destArr);

//this.findDiff(fieldNameValueSrcMap,fieldNameValueDestMap);
//**************Comparison - All records */
console.log('Src Length:',srcArr.length);
console.log('Dest Length:',destArr.length);
if(srcArr.length > 0)
  {
     //If there is no records in Destination - insert it into Destination.
     if(destArr.length > 0)
     {
       try{

       for(var src of srcArr)
       {
          //console.log('Src:',src);
        // console.log('src key:',src.key);
         var finalArrMissingFieldsInDest = [];
         var finalArrFieldValueChangesInDest = [];
         //srcMap.clear();
         //destMap.clear();
         //diffFieldInDestMap.clear();
         //diffFieldInSrcMap.clear();
         //const destKeys = destArr.keys();
         //destArr.forEach(item => item.key === srcKey)
        var temp =  destArr.find(function (element) { 
          if(element.key === src.key){
          //console.log('key:',element.key);
         // console.log('ele Value:',element.value);
          return element; 
        }
      }); 
     // console.log('Src Key Out:',src.key);
     // console.log('Dest Temp key Out:',temp.key);
      
        if(temp !== undefined)
        {
          //console.log('Src Key :',src.key);
          //console.log('Dest Temp key:',temp.key);
          
        srcMap = src.value;
        
        destMap = temp.value;
        //console.log('srcMap entries cnt :',srcMap.size);
        //console.log('DestMap entries cnt :',destMap.size);
          
        for (const [key, value] of srcMap.entries()) 
        {
          //console.log('srcMap.Src Key:',srcMap;
          //console.log('Keys Length:',fieldNameValueMapCPQ1Map.keys.length);
          
          if(destMap.has(key))
         {
            //console.log('Dest Keys:',destMap.keys);
        //Filter for Custom Fields
        //if(key.indexOf('__c') > 0 )
        //{
          
           // console.log('Key found in Dest:',key);
            let keyValueSrc = srcMap.get(key);
            let keyValueDest = destMap.get(key);
            if(keyValueSrc != keyValueDest)
            {
             //console.log('keyValueCPQ1 == keyValueCPQ2',keyValueCPQ1 == keyValueCPQ2);
             if(! diffFieldInDestMap.has('Id'))
             {
              diffFieldInDestMap.set('Id',src.key);
             }
             if(! diffFieldInSrcMap.has('Id'))
             {
              diffFieldInSrcMap.set('Id',src.key);
              diffFieldInSrcObj['Id'] = src.key;
             }
             diffFieldInDestMap.set(key,keyValueDest);
             diffFieldInSrcMap.set(key,keyValueSrc);
             diffFieldInSrcObj[key] = keyValueSrc;
            // if(typeof diffFieldInCPQ1 !== "number")
             //fieldNameValueArrCPQ1.push(key +' : \''+keyValueCPQ2 + '\'');
            // fieldNameValueArrCPQ1.push(key +' : '+keyValueCPQ2 );
             //else fieldNameValueArrCPQ1.push(key + ' : '+keyValueCPQ2 );
            // console.log('diffFieldInSrcMap:',diffFieldInSrcMap );
             }
            
         // }
          
         }
        else
        {
          //console.log('Key NOT found in Dest:',key);
          let keyValue = fieldNameValueDestMap.get(key);//.keys;
          //console.log('In keyValue:',keyValue);
          if(! missingKeyValueMapSrc.has('Id'))
          {
            missingKeyValueMapSrc.set('Id',fieldNameValueDestMap.get('Id'));
          }
          missingKeyValueMapSrc.set(key,keyValue);
        }
        //console.log(' SIZE:',diffFieldInSrcMap.size);
      }
      //console.log('diffFieldInSrcMap:',diffFieldInSrcMap);
     // console.log('diffFieldInDestMap:',diffFieldInDestMap);
      
      finalArrMissingFieldsInDest = [...finalArrMissingFieldsInDest,missingKeyValueMapSrc];
      //finalArrFieldValueChangesInDest=[...finalArrFieldValueChangesInDest,diffFieldInSrcMap];//.push(JSON.stringify(diffFieldInSrcObj));
      finalArrFieldValueChangesInDest.push(diffFieldInSrcObj);
      //console.log(JSON.stringify(finalArrFieldValueChangesInDest));
    }
       }
      }
      catch(err) {
        console.error('Error:',err);
      }
    
       console.log('------------------------------------------------------');
      console.log('-----------------Result--------------')
      console.log('----------------- Missing Fields In Destination --------------')
      console.log(finalArrMissingFieldsInDest);
      console.log('                                                  ');
      console.log('------------------------------------------------------');
      console.log('----------------- Field Values in Destination which is different from Source --------------')
      console.log('Source:',diffFieldInSrcMap);
      //console.log('Destination:',diffFieldInDestMap);
      //console.log('Destination:',finalArrFieldValueChangesInDest);
      
      //arr.push(diffFieldInCPQ2Obj);
     // console.log(JSON.stringify(finalArrFieldValueChangesInDest));



      res.send(JSON.stringify(srcArr));
     // res.json(JSON.stringify(srcArr));
     /*  //Source
       const srcContainer = {};
       const src = srcArr.map(item => {
        srcContainer[item.key] = item.value;
        return srcContainer;
       });
       //console.log('srcArr:',srcArr);
       console.log('src Container length:',srcContainer.length);
       console.log('src container:',src.length);
       //console.log('dest Container :',src);
       //Destination
       const destContainer = {};
       const dest = destArr.map(item => {
        destContainer[item.key] = item.value;
        return destContainer;
       });
       console.log('dest Container length:',destContainer.length);
       console.log('dest Length:',dest.length);
       //console.log('dest Container :',dest);

      /*for(var srcKey of src)
      {
        //Get the Value
        var srcMap = new Map();
        srcMap = src[srcKey];
        //Get the field level 
        if(srcMap.size > 0)
        {

        }
      }*/
      /*for (const [srckey, srcvalue] of srcMap.entries()) 
      {
      console.log(srckey, srckey);
      //console.log('Keys Length:',fieldNameValueMapCPQ1Map.keys.length);
      
       if(destMap.has(srckey))
       {
          
       }
       else
       {
         //Collect the records for insertion
         newRecInSourceMap.set(srckey,srcvalue);
       }
    }
     
    }
    else 
    {
      newRecInSource.push(destMap);
      console.log('******** NEW Records in Source - Needs to be inserted in Destination:*********');
      console.log(newRecInSource);
      console.log('******** End *************');
     //return newRecInSource;
      
    }*/

  }
}
//res.json(JSON.stringify(fieldNameValueMapCPQ2Map));
//************** Field Level and Data Level Comaparison 
/*try{

  if(fieldNameValueDestMap.size >0 && fieldNameValueSrcMap.size > 0) 
  {
    console.log('In fieldNameValueDestMap.size:',fieldNameValueDestMap.size);
    
    for (const [key, value] of fieldNameValueDestMap.entries()) 
    {
      console.log(key, value);
      //console.log('Keys Length:',fieldNameValueMapCPQ1Map.keys.length);
      
     if(fieldNameValueSrcMap.has(key))
      {
        //Foe Update Query - Add the Id
        if(!diffFieldInCPQ1.has('Id'))
          {
           // let idValueCPQ1 = fieldNameValueMapCPQ1Map.get('Id');
            //diffFieldInCPQ1.set('Id',idValueCPQ1);
            //fieldNameValueMapCPQ1.push('Id' +' : \''+idValueCPQ1+'\'');
           // diffFieldInCPQ2.set('Id',Production_ID__c);
           // diffFieldInSrcObj['Id'] = Production_ID__c;
          }
        //Filter for Custom Fields
        if(key.indexOf('__c') > 0 )
        {
          if(key != 'Production_ID__c' )//To DO: Remove this condition
          {
            console.log('Key found in CPQ1:',key);
            let keyValueCPQ1 = fieldNameValueSrcMap.get(key);
            let keyValueCPQ2 = fieldNameValueDestMap.get(key);
            if(keyValueCPQ1 != keyValueCPQ2)
            {
             //console.log('keyValueCPQ1 == keyValueCPQ2',keyValueCPQ1 == keyValueCPQ2);
             diffFieldInDestMap.set(key,keyValueCPQ1);
             diffFieldInSrcMap.set(key,keyValueCPQ2);
             diffFieldInSrcObj[key] = keyValueCPQ2;
            // if(typeof diffFieldInCPQ1 !== "number")
             //fieldNameValueArrCPQ1.push(key +' : \''+keyValueCPQ2 + '\'');
            // fieldNameValueArrCPQ1.push(key +' : '+keyValueCPQ2 );
             //else fieldNameValueArrCPQ1.push(key + ' : '+keyValueCPQ2 );
             //console.log('diffFieldInCPQ1:',diffFieldInCPQ1 );
             }
            }
          }
          
         }
        else
        {
          console.log('Key NOT found in CPQ1:',key);
          let keyValue = fieldNameValueDestMap.get(key);//.keys;
          console.log('In keyValue:',keyValue);
     
          missingKeyValueMapSrc.set(key,keyValue);
        }
      }
    console.log('------------------------------------------------------');
    console.log('-----------------Result--------------')
    console.log('----------------- Missing Fields In Product Destination --------------')
    console.log(missingKeyValueMapSrc);
    console.log('                                                  ');
    console.log('------------------------------------------------------');
    console.log('----------------- Field Values in CPQ1 which is different from CPQ2 --------------')
    console.log('Destination :',diffFieldInDestMap);
    console.log('Source :',diffFieldInSrcMap);
    let arr = [];
    arr.push(diffFieldInSrcObj);
    console.log(JSON.stringify(arr));
    res.json(JSON.stringify(arr));
    
/************** Field Level and Data Level Comaparison ENDS 
/************** Update the records in CPQ1(for now) 
  
  if(diffFieldInCPQ1.size > 0)
  {
    
    console.log('diffFieldInCPQ2Obj :',diffFieldInCPQ2Obj);
    //Update CPQ1 with conn1
   //conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c, record}
    //conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c, record : {$eq:record}}
       //conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c,SBQQ__EvaluationEvent__c : 'Before Calculate;On Calculate' }
       //conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c,$set : setValue}
    //  conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c}, {$set : {diffFieldInCPQ2}}
    //var priceRuleObj = new SObject("SBQQ__PriceRule__c");

  //  priceRuleObj.Id = Production_ID__c;  
   // priceRuleObj. = "Closed Won";
//update the opp
//esult = sforce.connection.update([opp]);
    //conn1.sobject("SBQQ__PriceRule__c").update(fieldNameValueArrCPQ1
    
    conn1.sobject("SBQQ__PriceRule__c").update(diffFieldInCPQ2Obj
      ,function(err,rets)
      {
        if(err)
        return console.error(err);
        for(var i = 0; i<= rets.size;i++)
        {
          if(rets[i].success)
          {
            console.log('Updated Successfully : ' + rets[i].id);
          }
        }
      });
    
  }
  /************** Update the records in CPQ1(for now)  ENDS *******/
  /************** Price Condition and Price Actions ************ */
  //Get the Price Condition and Price Action for CPQ2
  
  //Insert it into CPQ 1
  /*console.log('if(priceConditionsCPQObjArr.length >0):',priceConditionsCPQObjArr.length);
  if(priceConditionsCPQObjArr.length >0)
  {
    try{
    console.log('In Price Condition Insert ........')
    conn1.sobject("SBQQ__PriceCondition__c")
    .create(priceConditionsCPQObjArr,
    function(err, rets) {
    if (err) { return console.error(err); }
    for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("Created record id : " + rets[i].id);
    }
  }
  // ...
});
    }
    catch(err) {
      console.error('Error:',err);
    }
  }
  
  //************** Price Condition and Price Actions ENDS ************ 
  }*/



});
app.get('/api/deltaPR', function (req, res) {
  
  /*******
   * Assumption: Source:CPQ2
   * Dest : CPQ1
   * Filter Condition: Production_ID__c in CPQ2 has CPQ1's Record Id
   */
  //***************** CPQ 2 - Connn2
  //var conn2 = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
   //  loginUrl : 'https://nteligroup-dev-ed.my.salesforce.com'
   // });
    //var username2 = 'anand.kumaraswamy@nteligroup.com.cpqtwo';
    //var password2 = 'cpq12345!872br6x3x3cAcxyRkpYVHjyJ';//872br6x3x3cAcxyRkpYVHjyJ
    
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn2.accessToken);
    //console.log('Conn1 Instance URL:',conn2.instanceUrl);
  //Get the CPQ 2 data
  const Production_ID__c = 'a3z0H000000EiDiQAK';//In CPQ2
  let PriceRuleIdCPQ2 = '';
  conn2.sobject("SBQQ__PriceRule__c")
  .find({ Id: {$eq:Production_ID__c }}, '*')
  //.find({ }, '*')
  .limit(1)
  .execute(function(err, records2) {
    if (err) { return console.error(err); }
    try
   {
      for(key2 in records2)
      {
        let jsonStr = JSON.stringify(records2[key2]);
        const obj = JSON.parse(jsonStr,function(key,value){
        //console.log(' key',key);
        //console.log(' Value',value);
        if(key != "attributes")
        {
          if(key == 'Id')
          {
          PriceRuleIdCPQ2 = value;
  
          }
          fieldNameValueMapCPQ2Map.set(key,value);
          
       }
  
     });
    
    }
   // console.log('fieldNameValueMapCPQ1Map : ', fieldNameValueMapCPQ2Map );
  
   }
  catch(err) {
    console.error('Error:',err);
  }
    console.log('fieldNameValueMapCPQ2Map:',fieldNameValueMapCPQ2Map);
    console.log('PriceRuleIdCPQ2:',PriceRuleIdCPQ2);
  
  });
  //*******************CPQ2 - Get Price Conditions */
  console.log('PriceRuleIdCPQ2.length:',PriceRuleIdCPQ2.length);
  console.log('PriceRuleIdCPQ2.size:',PriceRuleIdCPQ2.size);
  //if(PriceRuleIdCPQ2 !=  '')
  //{
    /*console.log('In Price Condition .....');
    conn2.sobject("SBQQ__PriceCondition__c")
   // .find({ SBQQ__Rule__c:'a0Y4W00000GxX21UAF'}, '*')
   .find({ SBQQ__Rule__c: {$eq:this.PriceRuleIdCPQ2}}, '*')
    //.select('*') // asterisk means all fields in specified level are target.
   // .where("SBQQ__Rule__c = \'"+ PriceRuleIdCPQ2+"\'") // conditions in raw SOQL 
   //.where("SBQQ__Rule__c = \'a0Y4W00000GxX21UAF\'")
   // .limit(10)
    //.find({ SBQQ__Rule__c : {$eq:PriceRuleIdCPQ2 }},'*')
    //.orderby("CreatedDate", "DESC")
    .limit(2)
    .execute(function(err, recordsPC) {
        if (err) { return console.error(err); }
        try
       {
         console.log('Price Condition count:',recordsPC.length);
        for(keyPC in recordsPC)
        {
          let jsonStrPC = JSON.stringify(recordsPC[keyPC]);
          const objPC = JSON.parse(jsonStrPC,function(key,value){
          if(key != "attributes")
          {
            //console.log('PC Key:',key);
            //console.log('PC Value:',value);
            fieldNameValueMapCPQ2Map.set(key,value);
            if(key != 'Id' && key.indexOf('__c') > 0 )
            priceConditionsCPQObj[key] = value;
            
         }
        });
        priceConditionsCPQObjArr.push(priceConditionsCPQObj);
      }
      
             console.log('priceConditionsCPQObj  :',priceConditionsCPQObj);
            console.log('priceConditionsCPQObj Size:',priceConditionsCPQObj.length);
            console.log('priceConditionsCPQObjArr Size:',priceConditionsCPQObjArr.length);
            console.log('priceConditionsCPQObjArr :',priceConditionsCPQObjArr);
            //console.log('recordsPC.PriceAction records priceConditionsCPQObj:',priceConditionsCPQObj);//.records2.length);
          /*  let priceConditionsArr = [];
            priceConditionsArr.push(record.SBQQ__PriceConditions__r.records);
            console.log('record.SBQQ__PriceConditions__r.records:',record.SBQQ__PriceConditions__r.records);
            console.log('priceConditions Arr count:',priceConditionsArr.length);
            //priceConditionsCPQ2Map = priceConditionsArr.map(i => [i.key, i.val]);
            priceConditionsCPQ2Map = priceConditionsArr.reduce(function(map, obj) {
              map[obj.key] = obj.val;
              priceConditionsCPQObj[obj.key] = obj.val;
              return map;
          }, {});
              console.log('Price Conditions CPQ2Map count:',priceConditionsCPQ2Map.size);
              console.log('Price Conditions CPQ2Map count:',priceConditionsCPQ2Map);
              console.log('Price Conditions priceConditionsCPQObj:',priceConditionsCPQObj);*/
          
          /*if (record.SBQQ__PriceActions__r) {
            
            console.log('records2.PriceAction Fetch :',record.SBQQ__PriceActions__r);
            console.log('records2.PriceAction Total Size :',record.SBQQ__PriceActions__r.totalSize);
            console.log('records2.PriceAction Records count:',record.SBQQ__PriceActions__r.records.length);//.records2.length);
            let priceActionsArr = [];
            priceActionsArr.push(record.SBQQ__PriceActions__r.records);
            console.log('priceActionsCPQ2Map count:',priceActionsArr.length);
            console.log('priceActions Array:',priceActionsArr);
            //priceActionsCPQ2Map = priceActionsArr.map(j => [j.key, j.val]);
            var mapResult = priceActionsArr.reduce(function(map, obj) {
              map[obj.key] = obj.val;
              return map;
          }, {});
              console.log('PriceActions CPQ2 Array count:',mapResult.size);
              console.log('PriceActions CPQ2 Array count:',mapResult);
          
          }
        //}//Need to add end comment
        //Insert Price Condition
      
        }
       
      catch(err) {
        console.error('Error:',err);
      }
        console.log('fieldNameValueMapCPQ2Map:',fieldNameValueMapCPQ2Map);
      
      });
      */
      //}
  //***************** CPQ 2 - Connn2 ENDS */
  /****************** CPQ 1 - Conn1 STARTS */
  
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  
  console.log(conn1.accessToken);
  console.log('Conn1 Instance URL:',conn1.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  
  //Get all field name value pair - CPQ1.
  var Id = 'a3zR0000000LIe7IAG';
  conn1.sobject("SBQQ__PriceRule__c")
    .find({ Id: {$eq:Id} }, '*') // fields in asterisk, means wildcard.
   //.find({}, '*') 
    .limit(1)
    .execute(function(err, records1) {
      if (err) { return console.error(err); }
     try
     {
        for(key1 in records1)
        {
          let jsonStr = JSON.stringify(records1[key1]);
          const obj = JSON.parse(jsonStr,function(key,value){
         // console.log(' key',key);
          //console.log(' Value',value);
          if(key != "attributes" )
          {
  
            fieldNameValueMapCPQ1Map.set(key,value);
            
         }
  
       });
      
      }
      //console.log('fieldNameValueMapCPQ1Map : ', fieldNameValueMapCPQ1Map );
    }
    catch(err) {
      console.error('Error:',err);
    }
      //console.log('fieldNameValueMapCPQ1:',fieldNameValueMapCPQ1);
    });
  
  
  console.log('Outside CPQ1:',fieldNameValueMapCPQ1Map.size);
  console.log('Outside CPQ2:',fieldNameValueMapCPQ2Map.size);
  //res.json(JSON.stringify(fieldNameValueMapCPQ2Map));
  //************** Field Level and Data Level Comaparison 
  try{
  
    if(fieldNameValueMapCPQ2Map.size >0 && fieldNameValueMapCPQ1Map.size > 0) 
    {
      console.log('In fieldNameValueMapCPQ2Map.size:',fieldNameValueMapCPQ2Map.size);
      
      for (const [key, value] of fieldNameValueMapCPQ2Map.entries()) 
      {
        console.log(key, value);
        //console.log('Keys Length:',fieldNameValueMapCPQ1Map.keys.length);
        
       if(fieldNameValueMapCPQ1Map.has(key))
        {
          //Foe Update Query - Add the Id
          if(!diffFieldInCPQ1.has('Id'))
            {
             // let idValueCPQ1 = fieldNameValueMapCPQ1Map.get('Id');
              //diffFieldInCPQ1.set('Id',idValueCPQ1);
              //fieldNameValueMapCPQ1.push('Id' +' : \''+idValueCPQ1+'\'');
              diffFieldInCPQ2.set('Id',Production_ID__c);
              diffFieldInCPQ2Obj['Id'] = Production_ID__c;
            }
          //Filter for Custom Fields
          if(key.indexOf('__c') > 0 )
          {
            if(key != 'Production_ID__c' )//To DO: Remove this condition
            {
              console.log('Key found in CPQ1:',key);
              let keyValueCPQ1 = fieldNameValueMapCPQ1Map.get(key);
              let keyValueCPQ2 = fieldNameValueMapCPQ2Map.get(key);
              if(keyValueCPQ1 != keyValueCPQ2)
              {
               //console.log('keyValueCPQ1 == keyValueCPQ2',keyValueCPQ1 == keyValueCPQ2);
               diffFieldInCPQ1.set(key,keyValueCPQ1);
               diffFieldInCPQ2.set(key,keyValueCPQ2);
               diffFieldInCPQ2Obj[key] = keyValueCPQ2;
              // if(typeof diffFieldInCPQ1 !== "number")
               //fieldNameValueArrCPQ1.push(key +' : \''+keyValueCPQ2 + '\'');
              // fieldNameValueArrCPQ1.push(key +' : '+keyValueCPQ2 );
               //else fieldNameValueArrCPQ1.push(key + ' : '+keyValueCPQ2 );
               //console.log('diffFieldInCPQ1:',diffFieldInCPQ1 );
               }
              }
            }
            
           }
          else
          {
            console.log('Key NOT found in CPQ1:',key);
            let keyValue = fieldNameValueMapCPQ2Map.get(key);//.keys;
            console.log('In keyValue:',keyValue);
       
            missingKeyValueMapCPQ1.set(key,keyValue);
          }
        }
      console.log('------------------------------------------------------');
      console.log('-----------------Result--------------')
      console.log('----------------- Missing Fields In CPQ1 --------------')
      console.log(missingKeyValueMapCPQ1);
      console.log('                                                  ');
      console.log('------------------------------------------------------');
      console.log('----------------- Field Values in CPQ1 which is different from CPQ2 --------------')
      console.log('CPQ1:',diffFieldInCPQ1);
      console.log('CPQ2:',diffFieldInCPQ2);
      let arr = [];
      arr.push(diffFieldInCPQ2Obj);
      console.log(JSON.stringify(arr));
      res.json(JSON.stringify(arr));
      
  /************** Field Level and Data Level Comaparison ENDS 
  /************** Update the records in CPQ1(for now) 
    
    if(diffFieldInCPQ1.size > 0)
    {
      
      console.log('diffFieldInCPQ2Obj :',diffFieldInCPQ2Obj);
      //Update CPQ1 with conn1
     //conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c, record}
      //conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c, record : {$eq:record}}
         //conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c,SBQQ__EvaluationEvent__c : 'Before Calculate;On Calculate' }
         //conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c,$set : setValue}
      //  conn1.sobject("SBQQ__PriceRule__c").update({Id : Production_ID__c}, {$set : {diffFieldInCPQ2}}
      //var priceRuleObj = new SObject("SBQQ__PriceRule__c");
  
    //  priceRuleObj.Id = Production_ID__c;  
     // priceRuleObj. = "Closed Won";
  //update the opp
  //esult = sforce.connection.update([opp]);
      //conn1.sobject("SBQQ__PriceRule__c").update(fieldNameValueArrCPQ1
      
      conn1.sobject("SBQQ__PriceRule__c").update(diffFieldInCPQ2Obj
        ,function(err,rets)
        {
          if(err)
          return console.error(err);
          for(var i = 0; i<= rets.size;i++)
          {
            if(rets[i].success)
            {
              console.log('Updated Successfully : ' + rets[i].id);
            }
          }
        });
      
    }
    /************** Update the records in CPQ1(for now)  ENDS *******/
    /************** Price Condition and Price Actions ************ */
    //Get the Price Condition and Price Action for CPQ2
    
    //Insert it into CPQ 1
    /*console.log('if(priceConditionsCPQObjArr.length >0):',priceConditionsCPQObjArr.length);
    if(priceConditionsCPQObjArr.length >0)
    {
      try{
      console.log('In Price Condition Insert ........')
      conn1.sobject("SBQQ__PriceCondition__c")
      .create(priceConditionsCPQObjArr,
      function(err, rets) {
      if (err) { return console.error(err); }
      for (var i=0; i < rets.length; i++) {
      if (rets[i].success) {
        console.log("Created record id : " + rets[i].id);
      }
    }
    // ...
  });
      }
      catch(err) {
        console.error('Error:',err);
      }
    }*/
    
    //************** Price Condition and Price Actions ENDS ************ 
    }
  }
    catch(err) {
      console.error('Error:',err);
    }
  
  
  
  });

});
//conn1.timeout = 6000; 
//conn2.timeout = 6000; 


/*http.createServer( app ).listen( app.get( 'port' ), function (){
console.log( 'Express server listening on port ' + app.get( 'port' ));*/


module.exports = app;
