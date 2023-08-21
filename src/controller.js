const {Repo} = require('./repo')
const {BadRequestError, ConflictError} = require('./exceptions')
const {Types} = require('mongoose')
const {PanicService} = require('./service')
const {hashPassword, comparePassword} = require('./utils')
const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET} = require('./config')


const repo = new Repo();
const panicService = new PanicService();

class PanicController {
    async getPanics(req, res, next) {
        try {
            const {limit, offset} = req.query;
            const panics = await repo.getAllPanics(limit, offset);
            return res.status(200).json({status: "success", data: panics});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async getPanicById(req, res, next) {
        try {
            const {id} = req.params
            if (!id) throw new BadRequestError("No id passed in request parameters");
            if (!Types.ObjectId.isValid(id)) throw new BadRequestError("Malformed id passed");
            const panic = await repo.getPanicById(id);
            return res.status(200).json({status: "success", data: panic});
        } catch(err) {
            console.log(err);
            next(err);
        }
    }

    async makePanic(req, res, next) {
        try{
            console.log("HERE", req.body)
            const panic = await repo.createPanic(req.body);
            return res.status(201).json({status: "success", data: panic});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }


    async getPanicByAtrr(req, res, next) {
        try {
            const {limit, offset} = req.query;
            const panics = await panicService.getPanicByAttr({...req.query}, limit, offset);
            return res.status(200).json({status: "success", data: panics});
        } catch(err) {
            console.log(err);
            next(err);
        }
    }

    async togglePanic(req, res, next) {
        try {
            const {id} = req.params
            if (!id) throw new BadRequestError("No id passed in request parameters");
            if (!Types.ObjectId.isValid(id)) throw new BadRequestError("Malformed id passed");
            const panic = await panicService.togglePanic(id, req.official);
            return res.status(200).json({status: "success", data: panic});
        } catch(err) {
            next(err);
        }
    }

}

class AuthController {
    async createOfficial(req, res, next) {
        try {
            const foundUser = await repo.getOfficial(req.body.username);
            if (foundUser) throw new ConflictError(`Username already in use`);
            const hashedPassword = await hashPassword(req.body.password);
            const {password, ...restOfUser} = (await repo.createOfficial({username: req.body.username, password: hashedPassword, role: req.body.role}))._doc;
            return res.status(201).json({status: "success", data: restOfUser});
        } catch(err) {
            console.log(err);
            next(err);
        }
    }

    async login(req, res, next) {
        try {
          const {
            username,
            password
          } = req.body
    
          const foundUser = await repo.getOfficial(username);
    
          if (!foundUser)
            throw new UnauthorizedError(`Invalid credentials`)
    
          // compare decrypted password with sent password
          if (!(await comparePassword(foundUser.password, password)))
            throw new UnauthorizedError(`Invalid credentials`)
    
          const officialToSign = {
            username,
            _id: foundUser._id
          }
    
          // create JWTs
          const accessToken = jwt.sign(officialToSign, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
          });

    
          return res
            .status(200)
            .json({
              status: 'success',
              data: { username, role: foundUser.role, accessToken },
            });
        } catch (error) {
          next(error)
        }
      }
}


module.exports = {
    PanicController,
    AuthController
};