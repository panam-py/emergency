const { NotFoundError, ConflictError } = require('./exceptions');
const {Repo} = require('./repo');

const repo = new Repo();
const FILTER_ATTRS = [
    "panicType",
    "reporterName",
    "reporterNumber",
    "message",
    "coordinates",
    "active"
]

class PanicService {
    async getPanicByAttr(obj, limit, offset) {
        const objKeyArr = Object.keys(obj);
        const newObj = {}
        for (let i = 0; i < objKeyArr.length; i++) {
            if (FILTER_ATTRS.includes(objKeyArr[i])) newObj[objKeyArr[i]] = obj[objKeyArr[i]];
        }
        console.log("new Object here", newObj);
        return await repo.getPanicByAttr(newObj, limit, offset);
    }

    async togglePanic(id, official) {
        const panic = await repo.getPanicById(id);
        if (!panic) return new NotFoundError(`No panic found with id ${id}`);
        if (official.role === "doctor" && panic.panicType !== "health") throw new ConflictError("Doctor cannot handle such tasks!");
        if (official.role === "police" && panic.panicType !== "crime") throw new ConflictError("Police cannot handle such tasks!");
        if (official.role === "fireman" && panic.panicType !== "fire") throw new ConflictError("Fireman cannot handle such tasks!");
        if (!(panic.active)) panic.active = true;
        else panic.active = false;
        await panic.save();
        return panic;
    }
}

module.exports = {
    PanicService
};