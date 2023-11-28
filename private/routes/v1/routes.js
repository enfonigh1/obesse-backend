const router = require('express').Router();

// Auth ROUTES
router.use("/", require("./Users/auth.controller"));

module.exports = router;