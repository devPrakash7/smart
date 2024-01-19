const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    sendResponse
} = require('../../services/common.service')
const dateFormat = require('../../helper/dateformat.helper');
const User = require('../../models/user.model')
const Student = require('../../models/studentRegistration.model')
const {
    isValid
} = require('../../services/blackListMail')
const {
    Usersave,
} = require('../services/user.service');

const constants = require('../../config/constants')
const {
    JWT_SECRET
} = require('../../keys/keys');




exports.signUp = async (req, res, next) => {

    try {

        const reqBody = req.body

        reqBody.password = await bcrypt.hash(reqBody.password, 10);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        reqBody.tempTokens = await jwt.sign({
            data: reqBody.email
        }, JWT_SECRET, {
            expiresIn: constants.URL_EXPIRE_TIME
        })

        const user = await Usersave(reqBody);

        sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.signUp_success', user, req.headers.lang);

    } catch (err) {

        console.log("err(SignUp)........", err.message)
        sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}

exports.logout = async (req, res, next) => {

    try {

        const reqBody = req.user
        let UserData = await User.findById(reqBody._id)

        UserData.tokens = null
        UserData.refresh_tokens = null

        await UserData.save()
        sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.logout_success', {}, req.headers.lang);

    } catch (err) {
        console.log(err)
        sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}

exports.login = async (req, res, next) => {

    try {

        const reqBody = req.body

        let user = await User.findByCredentials(reqBody.email, reqBody.password, reqBody.user_type || '2');

        if (user == 1) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.email_not_found', {}, req.headers.lang);
        if (user == 2) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.invalid_password', {}, req.headers.lang);

        if (user.status == 0) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.inactive_account', {}, req.headers.lang);
        if (user.status == 2) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.deactive_account', {}, req.headers.lang);
        if (user.deleted_at != null) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.inactive_account', {}, req.headers.lang);

        let newToken = await user.generateAuthToken();
        let refreshToken = await user.generateRefreshToken()

        await user.save()

        let resData = user
        resData.tokens = '';
        delete resData.reset_password_token;
        delete resData.reset_password_expires;
        delete resData.password;
        resData.tokens = newToken

        sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.login_success', resData, req.headers.lang);

    } catch (err) {

        console.log('err(login)....', err)
        sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


exports.studentRegistration = async (req, res, next) => {

    try {

        const reqBody = req.body
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const students = await Student.create(reqBody)
        sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.add_new_student', students, req.headers.lang);

    } catch (err) {

        console.log("err(studentRegistration)........", err.message)
        sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


exports.reSet_password = async (req, res) => {

    const userId = req.user._id;

    const { old_password, new_password, confirm_password } = req.body;

    try {

       
        const existingUser = await User.findOne({ _id: userId });

        if (!existingUser)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.not_found', {}, req.headers.lang);

        const isPasswordMatch = await bcrypt.compare(old_password, existingUser.password)

        if (!isPasswordMatch)
            return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.FAIL, 'USER.old_password_not_match', {}, req.headers.lang);


        if (new_password !== confirm_password)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.newPassword_and_confirm_password_not_match', {}, req.headers.lang);

        existingUser.password = await bcrypt.hash(new_password, 10);
        await existingUser.save();

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.passwordUpdate_success', {}, req.headers.lang);

    } catch (err) {

        console.log("err( reSet_passord )", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};
