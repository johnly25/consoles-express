const Company = require("../models/company");
const Console = require("../models/console");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all companys.
exports.company_list = asyncHandler(async (req, res, next) => {
  const allCompanies = await Company.find().sort({ name: 1 }).exec();
  res.render("company_list", {
    title: "Company List",
    company_list: allCompanies,
  });
});


// Display detail page for a specific company.
exports.company_detail = asyncHandler(async (req, res, next) => {
  const [company, allConsolesByCompany] = await Promise.all([
    Company.findById(req.params.id).exec(),
    Console.find({ company: req.params.id }).exec()
  ]);

  if (company === null) {
    const err = new Error("Company not found");
    err.status = 404;
    return next(err);
  }

  res.render("company_detail", {
    title: "Company Detail",
    company: company,
    company_consoles: allConsolesByCompany
  })
});

// Display company create form on GET.
exports.company_create_get = asyncHandler(async (req, res, next) => {
  res.render("company_form", {
    title: "Create Company"
  });
});

// Handle Author create on POST.
exports.company_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Company name must be specified."),
  body("date_founded", "Invalid date founded")
    .isISO8601()
    .toDate(),
  body("headquarters")
    .trim()
    .notEmpty()
    .withMessage("Headquarters must be specified"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const hq = req.body.headquarters.split('|');
    // Create Author object with escaped and trimmed data
    const company = new Company({
      name: req.body.name,
      date_founded: req.body.date_founded,
      headquarters: hq
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("company_form", {
        title: "Create Company",
        company: company,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Save author.
      await company.save();
      // Redirect to new author record.
      res.redirect(company.url);
    }
  }),
];

// Display company delete form on GET.
exports.company_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [company, allConsolesByCompany] = await Promise.all([
    Company.findById(req.params.id).exec(),
    Console.find({ company: req.params.id }).exec(),
  ]);

  if (company === null) {
    // No results.
    res.redirect("/catalog/companies");
  }

  res.render("company_delete", {
    title: "Delete Company",
    company: company,
    company_consoles: allConsolesByCompany,
  });
});


// Handle company delete on POST.
exports.company_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [company, allConsolesByCompany] = await Promise.all([
    Company.findById(req.params.id).exec(),
    Console.find({ company: req.params.id }).exec(),
  ]);

  if (allConsolesByCompany.length > 0) {
    // Author has books. Render in same way as for GET route.

    res.render("company_delete", {
      title: "Delete Company",
      company: company,
      company_consoles: allConsolesByCompany,
    });

    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Company.findByIdAndDelete(req.body.companyid);
    res.redirect("/catalog/authors");
  }
});


// Display company update form on GET.
exports.company_update_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const company = await Company.findById(req.params.id);

  res.render("company_form", {
    title: "Create Company",
    company: company,
  });
});

// Handle company update on POST.
exports.company_update_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Company name must be specified."),
  body("date_founded", "Invalid date founded")
    .isISO8601()
    .toDate(),
  body("headquarters")
    .trim()
    .notEmpty()
    .withMessage("Headquarters must be specified"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Console object with escaped and trimmed data.
    const company = new Company({
      name: req.body.name,
      date_founded: req.body.date_founded,
      headquarters: req.body.headquarters,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("company_form", {
        title: "Create Company",
        company: company,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedCompany = await Company.findByIdAndUpdate(req.params.id, company, {});
      // Redirect to book detail page.
      res.redirect(updatedCompany.url);
    }
  }),
];
