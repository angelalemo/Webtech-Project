const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/register', require('./routes/register'));
app.use('/api/checklogin', require('./routes/login'));

app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+ PORT);
});
