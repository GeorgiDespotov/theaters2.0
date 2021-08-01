const router = require('express').Router();

router.get('/', async (req, res) => {
    const plays = await req.storage.getAllPlays();

    res.render('home', { plays });
});

module.exports = router;