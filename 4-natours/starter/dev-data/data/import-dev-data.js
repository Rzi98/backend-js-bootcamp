const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); 
const Tour = require('../../models/tourModel'); 

dotenv.config({ path: './config.env' }); 

const DB = process.env.DATABASE.replace(  
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => console.log('DB connection successful!'));

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));  // read the file and convert string to a JavaScript object (array of objects)

const importData = async () => {
    try{
        await Tour.create(tours);  // create documents in the database
        console.log('Data successfully loaded!');
    }
    catch(err){
        console.log(err);
    }
    process.exit(); 
}

// Delete all data from the database
const deleteData = async () => {
    try{
        await Tour.deleteMany();  // delete all documents in the database
        console.log('Data successfully deleted!');
    }
    catch(err){
        console.log(err);
    }
    process.exit(); 
}

// ARGPARSER //
// node dev-data/data/import-dev-data.js --import
if(process.argv[2] === '--import'){
    importData();
}
// node dev-data/data/import-dev-data.js --delete
else if(process.argv[2] === '--delete'){
    deleteData();
}

// console.log(process.argv); // array of args