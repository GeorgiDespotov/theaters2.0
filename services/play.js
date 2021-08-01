const Play = require('../modews/Play');


async function getAllPlays() {
    return Play.find({ isPublic: true }).lean();
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


module.exports = {
    getAllPlays,
    createPlay
}