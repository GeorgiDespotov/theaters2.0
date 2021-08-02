const Play = require('../modews/Play');


async function getAllPlays(sortBy) {
    let sort = { likes: 1 };
    if (sortBy != 'likes') {
        sort = { createdAt: -1 };
    }
    return Play.find({ isPublic: true }).sort(sort).lean();
}

async function createPlay(playData) {
    const pattern = new RegExp(`^${playData.title}$`, 'i');
    const existing = await Play.findOne({ title: { $regex: pattern } });

    if (existing) {
        throw new Error('A play with this name allready exist!')
    }

    const play = new Play(playData);

    await play.save();

    return play;
}

async function getPlayById(id) {
    return Play.findById(id).populate('likes').lean();
}

async function likePlay(playId, userId) {
    const play = await Play.findById(playId);
    play.likes.push(userId);

    return play.save();
}

async function deletePlay(id) {
    return Play.findByIdAndDelete(id);
}

async function editPlay(id, playData) {
    const play = await Play.findById(id);

    play.title = playData.title
    play.description = playData.description
    play.imageUrl = playData.imageUrl
    play.isPublic = Boolean(playData.isPublic)

    return play.save();
}

module.exports = {
    getAllPlays,
    createPlay,
    getPlayById,
    likePlay,
    deletePlay,
    editPlay
}