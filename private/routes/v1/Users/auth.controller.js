const bcrypt = require("bcrypt");
const { registerValidation } = require('./validation/validate');
const AdminUser = require("../../../schema/AdminUser");
const encrpted = require('../../../helpers/encrpted');
const { generateTokens } = require('../../../helpers/token');
const router = require('express').Router();


// Register Admin User
router.post('/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  // Validate Request
  const { error } = registerValidation(req.body);
  if (error) {
    return res.json({
      status: 400,
      data: error.details[0].message.replace(/"/g, ""),
    });
  }

  // Check if Email Exist
  const emailExists = await AdminUser.findOne({ email: email });
  if (emailExists)
    return res.json({ status: 400, message: "User already exists" });

  // Create New Admin User
  const user = new AdminUser({
    username: username,
    email: email,
    password: encrpted(password),
  });

  // Genereate Tokens
  const { accessToken, refreshToken } = await generateTokens(user);
  try {

    // Save User
    const savedUser = await user.save();

    // Send Response
    res.json({ token: accessToken, message: "success", user: { email: savedUser?.email, password: savedUser?.password } });
  } catch (err) {
    res.json({ status: 400, message: err });
  }
});


// LOGIN ADMIN USER
router.post("/auth/login", async (req, res) => {
  const { email, password } = req?.body;

  //check if email exists & comparing passwords
  const user = await AdminUser.findOne({ email: email });

  if (!user) return res.json({ status: 400, message: "incorrect email" });

  // Decrypt Password
  const validPass = await bcrypt.compareSync(password, user?.password);

  if (!validPass) return res.json({ status: 400, message: "incorrect password" });

  const { accessToken, refreshToken } = await generateTokens(user);

  res.header("Authorization", accessToken).json({
    message: "success",
    token: accessToken,
    user: { _id: user?._id, first_name: "", last_name: "", email: user?.email, password: user?.password },
  });

});

module.exports = router;