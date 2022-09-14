/*
    path: api/auth
*/

const { Router } = require('express');
const { createUser, login, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();

// Crear nuevos usuarios
router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
    validateFields
], createUser)

// Login
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
    validateFields
], login)

// Revalidar token
router.get('/renew', validateJWT ,renewToken)

module.exports = router;