const dotenv = require('dotenv'); 
const app = require('./app');

dotenv.config({ path: './config.env' }); // config.env is the file that contains the environment variables

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});