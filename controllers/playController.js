const router = require('express').Router();
const { isUser } = require('../middlewears/guards');
const { body, validationResult } = require('express-validator');
const { parseErrors } = require('../util/parsers');


router.get('/create', isUser(), (req, res) => {
    res.render('play/create');
});

router.post('/create', isUser(),
    body('title').notEmpty().withMessage('Title is required!').bail(),
    body('description').notEmpty().withMessage('Description is required!')
        .isLength({ max: 50 }).withMessage('Max length of the description is 50 symbols!').bail(),
    body('imageUrl').isLength({ min: 5 }).withMessage('image URL is required!'),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            const playData = {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                isPublic: Boolean(req.body.isPublic),
                author: req.user._id
            }
            if (errors.length > 0) {
                throw new Error(errors.map(er => er.msg).join('\n'));

            }

            await req.storage.createPlay(playData);
            res.redirect('/');
        } catch (err) {
            console.log(err.message.split('\n'));

            const ctx = {
                errors: err.message.split('\n'),
                playData: {
                    title: req.body.title,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                    isPublic: Boolean(req.body.isPublic)
                }
            }

            res.render('play/create', ctx);
        }
    });

router.get('/details/:id', async (req, res) => {
    try {
        const play = await req.storage.getPlayById(req.params.id);
        play.hasUser = Boolean(req.user);
        play.isAuthor = req.user && req.user._id == play.author;
        play.alreadyLiked = req.user && play.likes.find(like => like._id == req.user._id);
        res.render('play/details', { play })
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/like/:id', isUser(), async (req, res) => {

    try {
        const play = await req.storage.getPlayById(req.params.id);

        if (play.author == req.user._id) {
            throw new Error('You can\'t like you\'re own Play!')
        }

        await req.storage.likePlay(req.params.id, req.user._id);
        res.redirect(`/play/details/${req.params.id}`);
    } catch (err) {
        console.log(err.message);
        res.redirect(`/play/details/${req.params.id}`);
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getPlayById(req.params.id);

        if (play.author != req.user._id) {
            throw new Error('Only the Author can delete this Play!');
        }

        await req.storage.deletePlay(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.redirect(`/play/details/${req.params.id}`);
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getPlayById(req.params.id);

        if (play.author != req.user._id) {
            throw new Error('Only the author can edit this Play!');
        }

        res.render('play/edit', { play });
    } catch (err) {
        console.log(err.message);
        res.redirect(`/details/${req.params.id}`);
    }
});

router.post('/edit/:id', isUser(),
    body('title').notEmpty().withMessage('Title is required!').bail(),
    body('description').notEmpty().withMessage('Description is required!')
        .isLength({ max: 50 }).withMessage('Max length of the description is 50 symbols!').bail(),
    body('imageUrl').isLength({ min: 5 }).withMessage('image URL is required!'),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            const play = await req.storage.getPlayById(req.params.id);
            if (errors.length > 0) {
                throw new Error(errors.map(er => er.msg).join('\n'));

            }
            if (play.author != req.user._id) {
                throw new Error('Only the author can edit this Play!');
            }
            console.log(req.body);
            await req.storage.editPlay(req.params.id, req.body);
            res.redirect(`/play/details/${req.params.id}`);
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                play: {
                    _id: req.params.id,
                    title: req.body.title,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                    isPublic: Boolean(req.body.isPublic)
                }
            }
            res.render('play/edit', ctx);
        }
    });



module.exports = router;