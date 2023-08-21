const {Router} = require('express');
const {PanicController, AuthController} = require('./controller');
const {reqBodyValidator} = require('./middlewares');
const {createPanicSchema, createOfficialSchema, loginOfficialSchema} = require('./requestSchemas');
const {requestProtector} = require('./utils')

const panicRouter = Router();
const authRouter = Router();

const authController = new AuthController();
const panicController = new PanicController();

panicRouter.route("/").get(panicController.getPanics).post(reqBodyValidator(createPanicSchema), panicController.makePanic);
panicRouter.get("/filter", panicController.getPanicByAtrr);
panicRouter.get("/:id", panicController.getPanicById);
panicRouter.patch("/:id/toggle", requestProtector(), panicController.togglePanic);

authRouter.post("/", reqBodyValidator(createOfficialSchema), authController.createOfficial);
authRouter.post("/login", reqBodyValidator(loginOfficialSchema), authController.login);


module.exports = {
    panicRouter,
    authRouter
};
