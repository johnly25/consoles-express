const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConsoleSchema = new Schema({
  name: { type: String, required: true },
  description: {type: String, required: true},
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category"},
});

// Virtual for book's URL
ConsoleSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/console/${this._id}`;
});

// Export model
module.exports = mongoose.model("Console", ConsoleSchema);
