const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const connectDB = require('./config/db')

const PORT = process.env.PORT||8000;

connectDB();

app.listen(PORT, ()=>{
    console.log(`Auth service running on port ${PORT}`);
});