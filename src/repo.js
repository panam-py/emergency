const {Panic, Auth} = require('./models');
const {NotFoundError} = require('./exceptions');

class Repo {
    async getAllPanics(limit, offset) {
        const panics = await Panic.find().limit(limit).skip(offset);
        return panics;
    }

    async getPanicById(uid) {
        const panic = await Panic.findById(uid);
        if (!panic) throw new NotFoundError(`No panic found with the id ${uid}`);
        return panic;
    }

    async getPanicByAttr(filterObj, limit, offset) {
        const panics = await Panic.find(filterObj).limit(limit).skip(offset);
        return panics;
    }

    async createPanic(panic) {
        const newPanic = await Panic.create(panic);
        return newPanic;
    }

    async createOfficial(official) {
        const newOfficial = await Auth.create(official);
        return newOfficial;
    }

    async getOfficial(username) {
        const official = await Auth.findOne({username});
        console.log("OFFICIAL HERE", official);
        return official;
    }
}

module.exports = {
    Repo
};