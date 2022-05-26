const userModelSchema = require("../model/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { Email } = require("../utils/Email");
//signup user
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModelSchema.findOne({ email: email });
    if (user) {
      throw new Error("email already exist", 422);
    }
    const newUser = await userModelSchema.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    return res.status(200).json({
      registerUser: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: "user already exist!",
    });
  }
};

// forgot password page action
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModelSchema.findOne({ email: email });
    // set the secret with jwt token + password
    const secret = process.env.jwt_secret + user.password;
    const payLoad = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payLoad, secret, { expiresIn: '60m' });
    const link = `http://localhost:8080/user/newpassword/${user._id}/${token}`;
    // send email to set the new password
    const emailClient = new Email();
    emailClient.setBody(link);
    emailClient.setSubject("verify your email");
    emailClient.send(email);
    console.log(email);

    return res.status(200).json({
      link: link,
    });
  } catch (error) {
    return res.status(500).json({
      error: "email not found!",
    });
  }
};

const verifyLink = async (req, res, next) => {
  const { id, token } = req.params;
  const user = await userModelSchema.findOne({ _id: id});
  const secret = process.env.jwt_secret + user.password;
  try {
    const payLoad = jwt.verify(token, secret);

    return res.status(200).json({
      verify: "link verification successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "link expired, Try again later !!",
    });
  }
};

const newPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const { password, cpassword } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModelSchema.findOne({ _id: id });
  const secret = process.env.jwt_secret + user.password;
  try {
    const payLoad = jwt.verify(token, secret);
    // validate password and confirm password should match
    // we can simply find the user with the payLoad email and id and finally update with new password
    if (password == cpassword) {
      await userModelSchema.findOneAndUpdate(
        { _id: id },
        { $set: { password: hashedPassword } },
        { new: true }
      );
      return res.status(200).json({
        success: "successfully changed your password !!",
      });
    } else {
      return res.status(500).json({
        error: "password not matched !!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        "we are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};
module.exports = {
  signup,
  forgotPassword,
  verifyLink,
  newPassword,
};
