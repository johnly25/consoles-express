const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  date_founded: { type: Date },
  headquarters: { type: Array, required: true },
});

// Virtual for company's URL
CompanySchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/company/${this._id}`;
});

CompanySchema.virtual("date_founded_formatted").get(function () {
  return DateTime.fromJSDate(this.date_founded).toLocaleString(DateTime.DATE_MED);
});

CompanySchema.virtual("headquarters_formatted").get(function () {
  return this.headquarters.join('|');
});

CompanySchema.virtual('date_founded_form_formatted').get(function () {
  let yourDate = this.date_founded;
  const offset = yourDate.getTimezoneOffset()
  yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))
  return yourDate.toISOString().split('T')[0]
});

// Export model
module.exports = mongoose.model("Company", CompanySchema);
