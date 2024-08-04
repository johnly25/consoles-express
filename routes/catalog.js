const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController")
const company_controller = require("../controllers/companyController")
const consoleinstance_controller = require("../controllers/consoleinstanceController")
const console_controller = require("../controllers/consoleController")


/// console ROUTES ///

// GET catalog home page.
router.get("/", console_controller.index);

// GET request for creating a console. NOTE This must come before routes that display console (uses id).
router.get("/console/create", console_controller.console_create_get);

// POST request for creating console.
router.post("/console/create", console_controller.console_create_post);

// GET request to delete console.
router.get("/console/:id/delete", console_controller.console_delete_get);

// POST request to delete console.
router.post("/console/:id/delete", console_controller.console_delete_post);

// GET request to update console.
router.get("/console/:id/update", console_controller.console_update_get);

// POST request to update console.
router.post("/console/:id/update", console_controller.console_update_post);

// GET request for one console.
router.get("/console/:id", console_controller.console_detail);

// GET request for list of all console items.
router.get("/consoles", console_controller.console_list);

/// company ROUTES ///

// GET request for creating company. NOTE This must come before route for id (i.e. display company).
router.get("/company/create", company_controller.company_create_get);

// POST request for creating company.
router.post("/company/create", company_controller.company_create_post);

// GET request to delete company.
router.get("/company/:id/delete", company_controller.company_delete_get);

// POST request to delete company.
router.post("/company/:id/delete", company_controller.company_delete_post);

// GET request to update company.
router.get("/company/:id/update", company_controller.company_update_get);

// POST request to update company.
router.post("/company/:id/update", company_controller.company_update_post);

// GET request for one company.
router.get("/company/:id", company_controller.company_detail);

// GET request for list of all companys.
router.get("/companies", company_controller.company_list);

/// category ROUTES ///

// GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all category.
router.get("/categories", category_controller.category_list);

/// consoleINSTANCE ROUTES ///

// GET request for creating a consoleInstance. NOTE This must come before route that displays consoleInstance (uses id).
router.get(
  "/consoleinstance/create",
  consoleinstance_controller.consoleinstance_create_get,
);

// POST request for creating consoleInstance.
router.post(
  "/consoleinstance/create",
  consoleinstance_controller.consoleinstance_create_post,
);

// GET request to delete consoleInstance.
router.get(
  "/consoleinstance/:id/delete",
  consoleinstance_controller.consoleinstance_delete_get,
);

// POST request to delete consoleInstance.
router.post(
  "/consoleinstance/:id/delete",
  consoleinstance_controller.consoleinstance_delete_post,
);

// GET request to update consoleInstance.
router.get(
  "/consoleinstance/:id/update",
  consoleinstance_controller.consoleinstance_update_get,
);

// POST request to update consoleInstance.
router.post(
  "/consoleinstance/:id/update",
  consoleinstance_controller.consoleinstance_update_post,
);

// GET request for one consoleInstance.
router.get("/consoleinstance/:id", consoleinstance_controller.consoleinstance_detail);

// GET request for list of all consoleInstance.
router.get("/consoleinstances", consoleinstance_controller.consoleinstance_list);

module.exports = router;
