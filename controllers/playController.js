const router = require('express').Router();
const { isUser } = require('../middlewears/guards');
const { parseErrors } = require('../util/parsers');


router.get('/create', isUser(), (req, res) => {
    res.render('play/create');
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const playData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            isPublic: Boolean(req.body.isPublic),
            author: req.user._id
        }

        await req.storage.createPlay(playData);
        res.redirect('/');
    } catch (err) {
        console.log(err);

        const ctx = {
            errors: parseErrors(err),
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

module.exports = router;