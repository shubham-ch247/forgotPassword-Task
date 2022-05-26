const userModelSchema = require("../model/user");
const jwt = require("jsonwebtoken");
const { Email } = require("../utils/Email");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await userModelSchema.findOne({ email: email });
    if (user) {
      throw new Error("Email already exist", 422);
    }
    const newUser = await userModelSchema.create({
      firstName,
      lastName,
      email,
      password,
    });
    return res.status(200).json({
      registerUser: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'User already exist!',
    });
  }
};

// forgot password page action
const forgotPasswordAction = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModelSchema.findOne({ email: email });

    // set the secret with jwt token + password
    const secret = process.env.JWT_SECRET + user.password;
    const payLoad = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payLoad, secret);
    const link = `http://localhost:8080/user/newpassword/${user._id}/${token}`;

    // send email to set the new password
    const emailClient = new Email();
    emailClient.setBody(link);
    emailClient.setSubject("Verify your email");
    emailClient.send(email);
    console.log(email);

    return res.status(200).json({
      link: link,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Email not found!',
    });
  }
};

const newPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const user = await userModelSchema.findOne({ id });

  // check if this id exist in database
  if (id !== user.id) {
    return res.send("Invalid User Id...");
  }

  // we have a valid id, and we have a valid user with this id
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payLoad = jwt.verify(token, secret);

    return res.status(200).json({
      verify: "link verification successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Invalid link, Try again later !!",
    });
  }
};

const newPasswordAction = async (req, res, next) => {
  const { id, token } = req.params;
  const { password, cpassword } = req.body;
  const user = await userModelSchema.findOne({ id });
  // check if this id exist in database
  if (id !== user.id) {
    return res.send("Invalid User Id...");
  }

  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payLoad = jwt.verify(token, secret);
    // validate password and confirm password should match

    // we can simply find the user with the payLoad email and id and finally update with new password
    if (password == cpassword) {
      await userModelSchema.findOneAndUpdate(
        { _id: id },
        { $set: { password: password } },
        { new: true }
      );
      return res.status(200).json({
        success: "Successfully changed your password !!",
      });
    } else {
      return res.status(500).json({
        error: "Password not matched !!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};

module.exports = {
  signup,
  forgotPasswordAction,
  newPassword,
  newPasswordAction,
};
