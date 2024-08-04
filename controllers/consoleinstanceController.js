const ConsoleInstance = require("../models/consoleinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Console = require("../models/console");

// Display list of all consoleinstances.
exports.consoleinstance_list = asyncHandler(async (req, res, next) => {
  const allConsoleInstances = await ConsoleInstance.find({}, {}, { sort: { 'console': 1 } })
    .populate({
      path: 'console',
      populate: { path: 'company' }
    })
    .exec();

  // const allConsoleInstances = await ConsoleInstance.aggregate([
  //   { $sort: { 'condition': 1 } },
  // ])
  // .exec();
  // const test = await ConsoleInstance.populate(allConsoleInstances, {path:'console', populate: {path: 'company'}})
  // console.log((test));
  res.render('consoleinstance_list', { title: 'Console Instance List', consoleinstance_list: allConsoleInstances });
});

// Display detail page for a specific consoleinstance.
exports.consoleinstance_detail = asyncHandler(async (req, res, next) => {
  const consoleInstance = await ConsoleInstance.findById(req.params.id)
    .populate('console')
    .exec();

  if (consoleInstance === null) {
    // No results.
    const err = new Error("Console Instance copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("consoleinstance_detail", {
    title: "Console:",
    consoleinstance: consoleInstance,
  });
});


// Display consoleinstance create form on GET.
exports.consoleinstance_create_get = asyncHandler(async (req, res, next) => {
  const allConsoles = await Console.find({}, "name").sort({ name: 1 }).exec();
  res.render("consoleinstance_form", {
    title: "Create ConsoleInstance",
    console_list: allConsoles,
  });
});

// Handle ConsoleInstance create on POST.
exports.consoleinstance_create_post = [
  // Validate and sanitize fields.
  body("console", "name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("condition")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const consoleInstance = new ConsoleInstance({
      console: req.body.console,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allConsoles = await Console.find({}, "name").sort({ name: 1 }).exec();

      res.render("consoleinstance_form", {
        title: "Create ConsoleInstance",
        console_list: allConsoles,
        selected_Console: consoleInstance.console._id,
        errors: errors.array(),
        consoleinstance: consoleInstance,
      });

      return;
    } else {
      // Data from form is valid
      await consoleInstance.save();
      res.redirect(consoleInstance.url);
    }
  }),
];

// Display consoleinstance delete form on GET.
exports.consoleinstance_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const consoleinstance = await ConsoleInstance.findById(req.params.id).exec()

  if (consoleinstance === null) {
    // No results.
    res.redirect("/catalog/consoleinstances");
  }

  res.render("consoleinstance_delete", {
    title: "Delete Console Instance",
    consoleinstance: consoleinstance,
  });
});

// Handle consoleinstance delete on POST.
exports.consoleinstance_delete_post = asyncHandler(async (req, res, next) => {
  const consoleinstance = await ConsoleInstance.findById(req.params.id).exec()
  await ConsoleInstance.findByIdAndDelete(req.body.consoleinstanceid);
  res.redirect("/catalog/consoleinstances");
});

// Display consoleinstance update form on GET.
exports.consoleinstance_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.
  const allConsoles = await Console.find({}, "name").sort({ name: 1 }).exec();
  const consoleinstance = await ConsoleInstance.findById(req.params.id);

  if (consoleinstance === null) {
    // No results.
    const err = new Error("Console Instance not found");
    err.status = 404;
    return next(err);
  }

  res.render("consoleinstance_form", {
    title: "Update ConsoleInstance",
    console_list: allConsoles,
    consoleinstance: consoleinstance,
    selected_console: consoleinstance.console._id,
  });});

// Handle consoleinstance update on POST.
exports.consoleinstance_update_post  = [
  body("console", "name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("condition", "Condition must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Console object with escaped and trimmed data.
    const consoleinstance = new ConsoleInstance({
      console: req.body.console,
      condition: req.body.condition,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      const allConsoles = await Console.find({}, "name").sort({ name: 1 }).exec();
      res.render("consoleinstance_form", {
        title: "Update ConsoleInstance",
        console_list: allConsoles,
        selected_Console: consoleinstance.console._id,
        errors: errors.array(),
        consoleinstance: consoleInstance,
      });

    } else {
      // Data from form is valid. Update the record.
      const updatedConsoleInstance = await ConsoleInstance.findByIdAndUpdate(req.params.id, consoleinstance, {});
      // Redirect to book detail page.
      res.redirect(updatedConsoleInstance.url);
    }
  }),
];