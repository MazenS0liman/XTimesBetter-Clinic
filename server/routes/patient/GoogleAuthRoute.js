var router = require('express').Router();
const { AuthenticateGoogle,CallBack } = require('../../controllers/patient/GoogleAuthController');
// { sendGoogleMeetLinkByEmail } = require('../../controllers/patient/GoogleAuthController');
const { authenticateToken } = require('../../middleware/authenticateToken');

//router.get('/',authenticateToken, generateGoogleMeetLink);
router.get('/callback', CallBack);
router.get('/google', AuthenticateGoogle);
//router.post('/',sendGoogleMeetLinkByEmail);

module.exports = router;