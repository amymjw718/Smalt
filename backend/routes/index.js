var express = require('express');
var users = require('./users');
var search = require('./search');
var join = require('./join');
var host = require('./host');
var play = require('./play');

const router = express.Router();

router.use('/users', users);
router.use('/search', search);
router.use('/join', join);
router.use('/host', host);
router.use('/play', play);


module.exports = router;
