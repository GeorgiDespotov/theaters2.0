const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const authMiddlewear = require('../middlewears/auth');
const storageMidlewear = require('../middlewears/storage');


module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: 'hbs'
    }));
    app.set('view engine', 'hbs');

    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(authMiddlewear());
    
    app.use((req, res, next) => {
        if (!req.url.includes('favicon')) {
            console.log('>>>', req.method, req.url);
            
            if (req.user) {
                console.log('Known user: ', req.user.username);
            }
        }
        
        
        next();
    })
    
    app.use(storageMidlewear());
    //TODO add storage and auth middlewears...
};