
var express = require('express');
var router = express.Router();

// Load route handlers (doubling as rudimentary MVC controllers)
var uploadHandler = require('./upload.js');

// Remember, in Express 4, '/' is the root under which this route is mounted, so does not
// necessarily correspond to the absolute root of the domain. See index.js for routing code.
//
// This function assumes the connect-busboy middleware has been initialized in app.js
//
router.get('/', function(req, res) {
  res.render('index', { title: 'File upload with Express 4 and Busboy' });
});


router.post('/fileupload', uploadHandler);


module.exports = router;
