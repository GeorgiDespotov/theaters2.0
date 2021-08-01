const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewears/guards');


router.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

router.post('/register',
    isGuest(),
    body('username').isLength({ min: 3 }).withMessage('ussername must be at least 3 ch long').bail(),
    body('rePass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('password don\'t match!')
        }
        return true
    }),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            if (errors.length > 0) {
                // TODO impruve err message
                throw new Error(Object.values(errors).map(e => e.msg)).join('\n');

            }

            await req.auth.register(req.body.username, req.body.password);
            res.redirect('/'); //TODO change redirect location 
        } catch (err) {
            console.log(err);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username
                }
            }
            res.render('register', ctx)
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);
        res.redirect('/'); //TODO change redirect location 
        ``
    } catch (err) {
        console.log(err);
        if (err.type == 'credential') {
            errors = ['incorect username or password!']
        }
        const ctx = {
            errors,
            userData: {
                username: req.body.username
            }
        };
        res.render('/login', ctx);
    }
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});

module.exports = router;
