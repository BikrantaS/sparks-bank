const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');
const { request, response } = require('express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//create
app.post('/insert', (request, response) => {
    // console.log(request.body);
    const { name, initialBalance } = request.body;

    const db = dbService.getDbServiceInstance();
    const result = db.insertNewName(name, initialBalance);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));

});


//read
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    // console.log(result);

    result.then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

//search
app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name);

    result.then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});


//update
app.patch('/update', (request, response) => {
    // console.log(request.params);
    const { id, name } = request.body;
    const db = dbService.getDbServiceInstance();
    console.log("appjs patch:", request.body);
    const result = db.updateNameById(id, name);
    result.then(data => response.json({ success: data }))
        .catch(err => console.log(err));


})



//delete
app.delete('/delete/:id', (request, response) => {
    // console.log(request.params);
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);
    result.then(data => response.json({ success: data }))
        .catch(err => console.log(err));


})



app.listen(process.env.PORT, () => console.log('app running'));

// process.env.PORT