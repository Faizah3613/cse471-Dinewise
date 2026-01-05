import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'customer'}
});
  


// Sattic method for signing up a user
userSchema.statics.signup = async function(email, password, role = 'customer') {


  // Validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }
   
  const exsists = await this.findOne({email});
  if (exsists) {
    throw Error("Email already in use");
  }

  // Hash the password

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, role });

  return user;
}

// Static method for logging in a user
userSchema.statics.login = async function(email, password) {

  // Validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }


  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
}

const User = mongoose.model("User", userSchema);

export default User;
