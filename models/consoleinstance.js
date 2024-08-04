const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConsoleInstanceSchema = new Schema({
  console: { type: Schema.Types.ObjectId, ref: "Console", required: true }, // reference to the associated book
  condition: {
    type: String,
    required: true,
    enum: ["New", "Used"],
    default: "New",
  },
});

// Virtual for bookinstance's URL
ConsoleInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/consoleinstance/${this._id}`;
});

// Export model
module.exports = mongoose.model("ConsoleInstance", ConsoleInstanceSchema);
