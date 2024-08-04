const Console = require("../models/console");
const ConsoleInstance = require("../models/consoleinstance")
const Company = require("../models/company")
const Category = require("../models/category")
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const category = require("../models/category");
const company = require("../models/company");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [
    numConsoles,
    numConsoleInstances,
    numNewConsoleInstances,
    numUsedConsoleIntances,
    numCompanies,
    numCategories,
  ] = await Promise.all([
    Console.countDocuments({}).exec(),
    ConsoleInstance.countDocuments({}).exec(),
    ConsoleInstance.countDocuments({ condition: "New" }).exec(),
    ConsoleInstance.countDocuments({ condition: "Used" }).exec(),
    Company.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Consoles",
    console_count: numConsoles,
    console_instance_count: numConsoleInstances,
    console_instance_new_count: numNewConsoleInstances,
    console_instance_old_count: numUsedConsoleIntances,
    company_count: numCompanies,
    category_count: numCategories,
  });
});


// Display list of all consoles.
exports.console_list = asyncHandler(async (req, res, next) => {
  const allConsoles = await Console.find({})
    .sort({ name: 1 })
    .populate('company category')
    .exec();
  res.render("console_list", { title: "Console List", console_list: allConsoles });
});

// Display detail page for a specific console.
exports.console_detail = asyncHandler(async (req, res, next) => {
  // Get details of console, console instances for specific console
  const [_console, consoleInstances] = await Promise.all([
    Console.findById(req.params.id)
      .populate('company category')
      .exec(),
    ConsoleInstance.find({ console: req.params.id })
      .exec(),
  ]);

  if (_console === null) {
    // No results.
    const err = new Error("Console not found");
    err.status = 404;
    return next(err);
  }

  res.render("console_detail", {
    _console: _console,
    console_instances: consoleInstances,
    test: req.params.id
  });
});

// Display console create form on GET.
exports.console_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const [allCompanies, allCategories] = await Promise.all([
    Company.find().sort({ name: 1 }).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  res.render("console_form", {
    title: "Create console",
    companies: allCompanies,
    categories: allCategories,
  });
});

// Handle console create on POST.
exports.console_create_post = [
  body("name", "name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("company", "Company must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("categories.*").escape()
  .isLength({min:1}),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Console object with escaped and trimmed data.
    const _console = new Console({
      name: req.body.name,
      description: req.body.description,
      company: req.body.company,
      category: req.body.categories,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const [allCompanies, allCategories] = await Promise.all([
        Company.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1 }).exec(),
      ]);

      res.render("console_form", {
        title: "Create Cook",
        companies: allCompanies,
        categories: allCategories,
        _console: console,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await _console.save();
      res.redirect(_console.url);
    }
  }),
];


// Display console delete form on GET.
exports.console_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [_console, allConsoleInstancesbyConsole] = await Promise.all([
    Console.findById(req.params.id).exec(),
    ConsoleInstance.find({ console: req.params.id }).exec(),
  ]);

  if (_console === null) {
    // No results.
    res.redirect("/catalog/consoles");
  }

  res.render("console_delete", {
    title: "Delete Console",
    console: _console,
    console_consoleinstances: allConsoleInstancesbyConsole,
  });
});


// Handle console delete on POST.
exports.console_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [_console, allConsoleInstancesbyConsole] = await Promise.all([
    Console.findById(req.params.id).exec(),
    ConsoleInstance.find({ console: req.params.id }).exec(),
  ]);

  if (allConsoleInstancesbyConsole.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.render("console_delete", {
      title: "Delete Console",
      console: _console,
      console_consoleinstances: allConsoleInstancesbyConsole,
    });
    
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Console.findByIdAndDelete(req.body.consoleid);
    res.redirect("/catalog/consoles");
  }
});

// Display book update form on GET.
exports.console_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.
  const [_console, allCompanies, allCategories] = await Promise.all([
    Console.findById(req.params.id).populate("company category").exec(),
    Company.find().sort({ name: 1 }).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (_console === null) {
    // No results.
    const err = new Error("Console not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected genres as checked.
  // allCategories.forEach((category) => {
  //   if (_console.category.includes(category._id)) category.checked = "true";
  // });

  res.render("console_form", {
    title: "Update Console",
    companies: allCompanies,
    categories: allCategories,
    _console: _console,
  });
});


// Handle console update on POST.
exports.console_update_post = [
  // Convert the genre to an array.
  // (req, res, next) => {
  //   if (!Array.isArray(req.body.genre)) {
  //     req.body.genre =
  //       typeof req.body.genre === "undefined" ? [] : [req.body.genre];
  //   }
  //   next();
  // },

  // Validate and sanitize fields.
  body("name", "name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("company", "Company must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("categories.*")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Console object with escaped and trimmed data.
    const _console = new Console({
      name: req.body.name,
      description: req.body.description,
      company: req.body.company,
      category: req.body.categories,
      _id: req.params.id, // This is required, or a new ID will be assigned!

    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form
      const [allCompanies, allCategories] = await Promise.all([
        Company.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1 }).exec(),
      ]);

      // Mark our selected genres as checked.
      for (const cateogory of allCategories) {
        if (console.category.indexOf(genre._id) > -1) {
          category.checked = "true";
        }
      }
      res.render("console_form", {
        title: "Update Console",
        companies: allCompanies,
        categories: allCategories,
        console: _console,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedConsole = await Console.findByIdAndUpdate(req.params.id, _console, {});
      // Redirect to book detail page.
      res.redirect(updatedConsole.url);
    }
  }),
];
