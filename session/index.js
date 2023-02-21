const express = require('express');
const viewsRoutes = require('./routes/views');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const authenticateUser = require('./util/authenticateUser');

const app = express();
const port = 3000;

// config
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authenticateUser);

// routes
app.use('/', viewsRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
