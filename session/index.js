const express = require('express');
const viewsRoutes = require('./routes/views');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authenticateSession = require('./util/authenticateSession');

const app = express();
const port = 3000;

// config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authenticateSession);

// routes
app.use('/', viewsRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
