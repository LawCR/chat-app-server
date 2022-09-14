/*
    Path: /api/messages
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { getChat } = require("../controllers/messages");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.get('/:from', [
    check('from', 'El id del usuario no es valido').isMongoId(),
    validateFields,
    validateJWT
], getChat)

module.exports = router;