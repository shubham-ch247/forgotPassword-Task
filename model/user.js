const mongoose = require("mongoose");
const { Schema } = mongoose;
const userModelSchema = new Schema({
  firstName: { type: Schema.Types.String, required: true },
  lastName: { type: Schema.Types.String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
userModelSchema.pre("update", function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});
userModelSchema.pre("findOneAndUpdate", function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});
module.exports = mongoose.model("user", userModelSchema);