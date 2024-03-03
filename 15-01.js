const express = require('express');
const app = express();
const fs = require('fs');
const url = require('url');
const qs = require('qs');
const handlebars = require('express-handlebars');
const publicPath = __dirname;
const port = 3000;

const hb = handlebars.create({  
	defaultLayout: 'layout', 
	extname: 'hbs',
  helpers:{
    Back: 'document.location=\'http://localhost:3000\''
  }
    
});
app.engine('hbs', hb.engine);
app.set('view engine', 'hbs');
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`);
});

app.get('/', (req, res) => {
  fs.readFile('Book.json',(eer,data)=>{
    var contacts = JSON.parse(data);
    res.render('home.hbs',{contacts: contacts, block:false})
  });
  
});

app.get('/Update',(req, res) => {
  fs.readFile('Book.json',(eer,data)=>{
    var contacts = JSON.parse(data);
    var person = contacts.find((elem)=> elem.Id == req.query.Id);
    res.render('updateContact.hbs',{
      contacts: contacts,
      contact:  person,
      block: true
    })
  });
});

app.get('/Add',(req, res) => {
  fs.readFile('Book.json',(err,data)=>{
    var contacts = JSON.parse(data);
    res.render('addContact.hbs',{contacts: contacts, block: true})
  });
});

app.post('/Add',(req, res) => {
  var data = ''
  var attr = ''
  req.on('data', function (chunk) {
   data += chunk;
    attr = qs.parse(data)
   
  });
  fs.readFile('Book.json',(err,data)=>{    
    if(JSON.parse(data).length != 0){
      var id = JSON.parse(data).pop().Id;
    }
    else{
      var id = 0;
    }
    
    var contacts = JSON.parse(data);
    var newContact ={
      Id: +id+1,
      Name:attr['name'],
      Phone:attr['phone']
    }
    var elem = JSON.stringify(newContact);
    contacts.push(newContact);
    var db = JSON.stringify(contacts);
    fs.writeFile('Book.json',db,'utf8',(err)=>{});
  });
  res.writeHead(302, {
    'Location': '/' 
  });
  res.end();
});


app.post('/Delete',(req, res) => {
  var data = ''
  var attr = ''
  req.on('data', function (chunk) {
   data += chunk;
   attr = JSON.parse(data)
   console.log(data)
  });
  fs.readFile('Book.json',(err,data)=>{
    var contacts = JSON.parse(data);
  
    console.log(attr['Id'])
    contacts = contacts.filter(elem => elem.Id != attr['Id'])
    console.log(contacts)
    var db = JSON.stringify(contacts);
    fs.writeFile('Book.json',db,'utf8',(err)=>{});
    res.writeHead(302, {
      'Location': '/' 
    });
    res.end()
  });
});

app.post('/Update',(req, res) => {
  var data = ''
  var attr = ''

  req.on('data', function (chunk) {
   data += chunk;
    attr = qs.parse(data)
  });

  fs.readFile('Book.json',(err,data)=>{    
    var contacts = JSON.parse(data);
    var newContact ={
      Id:attr['id'],
      Name:attr['name'],
      Phone:attr['phone']
    }
    var index = contacts.findIndex(elem => elem.Id == attr['id'])
    contacts[index] = newContact;
    var db = JSON.stringify(contacts);
    fs.writeFile('Book.json',db,'utf8',(err)=>{});
  });
  res.writeHead(302, {
    'Location': '/' 
  });
  res.end();
});