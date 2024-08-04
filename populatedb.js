#! /usr/bin/env node
const dev_db_url = require("./dev_db_url");

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);
const Company = require("./models/company");
const Category = require("./models/category");
const Console = require("./models/console");
const ConsoleInstance = require("./models/consoleinstance");

const companies = [];
const categories = [];
const consoles = [];
const consoleinstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = dev_db_url;

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  mongoose.connection.dropDatabase();
  await createCategories();
  await createCompanies();
  await createConsoles();
  await createConsoleInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createCompanies() {
  console.log("Adding companies");
  await Promise.all([
    companyCreate("Sony Group Corporation", "1946-05-07", ['Konan, Japan', 'Minato, Japan', 'Tokyo, Japan']),
    companyCreate("Nintendo Co., Ltd.", "1889-09-23", ['11–1 Kamitoba Hokodatecho, Japan', '	11–1 Kamitoba Hokodatecho, Minami-ku, Japan', 'Kyoto, Japan']),
    companyCreate("Microsoft Corporation", "1975-04-04", ['One Microsoft Way, US', 'Redmond, Washington, U.S.']),

  ]);
}

async function companyCreate(name, date_founded, headquarters) {
  const companydetail = { name: name, date_founded: date_founded, headquarters: headquarters };
  const company = new Company(companydetail);
  await company.save();
  companies.push(company);
  console.log(`Added company: ${name}`);
}

async function categoryCreate(name) {
  const categorydetail = { name: name };
  const category = new Category(categorydetail);
  await category.save()
  categories.push(category);
  console.log(`Added category ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate("Home Console"),
    categoryCreate("Handheld Console"),
    categoryCreate("Hybrid Console"),
  ]);
}

async function consoleCreate(name, description, company, category) {
  const consoledetail = { name: name, description: description, company: company, category: category }
  const _console = new Console(consoledetail);
  await _console.save();
  consoles.push(_console);
  console.log(`Added console: ${name}`);
}

async function consoleInstanceCreate(_console, condition) {
  const consoleinstancedetail = {
    console: _console
  };
  if (condition != false) consoleinstancedetail.condition = condition;
  const consoleinstance = new ConsoleInstance(consoleinstancedetail);
  await consoleinstance.save();
  consoleinstances.push(consoleinstance)
  console.log(`Added consoleinstance: ${_console.name}`);
}

async function createConsoles() {
  console.log("Adding Consoles");
  await Promise.all([
    consoleCreate("Play Station 1", "Summary", find(companies, 'Sony'), find(categories, 'Home Console')),
    consoleCreate("Play Station 2", "Summary", find(companies, 'Sony'), find(categories, 'Home Console')),
    consoleCreate("Play Station 3", "Summary", find(companies, 'Sony'), find(categories, 'Home Console')),
    consoleCreate("Play Station 4", "Summary", find(companies, 'Sony Group Corporation'), find(categories, 'Home Console')),
    consoleCreate("Play Station 5", "Summary", find(companies, 'Sony Group Corporation'), find(categories, 'Home Console')),
    consoleCreate("Play Station Portable", "Summary", find(companies, 'Sony Group Corporation'), find(categories, 'Handheld Console')),
    consoleCreate("Nintendo DS", "Summary", find(companies, 'Nintendo'), find(categories, 'Handheld Console')),
    consoleCreate("Nintendo Wii", "Summary", find(companies, 'Nintendo'), find(categories, 'Home Console')),
    consoleCreate("Nintendo Switch", "Summary", find(companies, 'Nintendo'), find(categories, 'Hybrid Console')),
    consoleCreate("Xbox 360", "Summary", find(companies, 'Microsoft'), find(categories, 'Home Console')),
    consoleCreate("Xbox Series X", "Summary", find(companies, 'Microsoft'), find(categories, 'Home Console')),

  ]);
}

async function createConsoleInstances() {
  console.log("Adding authors");
  await Promise.all([
    consoleInstanceCreate(find(consoles,'Play Station 1'), "New"),
    consoleInstanceCreate(find(consoles,'Play Station 1'), "Used"),
    consoleInstanceCreate(find(consoles,'Play Station 1'), false),
    consoleInstanceCreate(find(consoles,'Play Station 2'), "New"),
    consoleInstanceCreate(find(consoles,'Play Station 2'), "Used"),
    consoleInstanceCreate(find(consoles,'Play Station 2'), false),
    consoleInstanceCreate(find(consoles,'Play Station 3'), "New"),
    consoleInstanceCreate(find(consoles,'Play Station 3'), "Used"),
    consoleInstanceCreate(find(consoles,'Play Station 3'), false),
    consoleInstanceCreate(find(consoles,'Play Station 4'), "New"),
    consoleInstanceCreate(find(consoles,'Play Station 4'), "Used"),
    consoleInstanceCreate(find(consoles,'Play Station 4'), false),
    consoleInstanceCreate(find(consoles,'Play Station 5'), "New"),
    consoleInstanceCreate(find(consoles,'Play Station 5'), "Used"),
    consoleInstanceCreate(find(consoles,'Play Station Portable'), "New"),
    consoleInstanceCreate(find(consoles,'Play Station Portable'), "Used"),
    consoleInstanceCreate(find(consoles,'Play Station Portable'), false),
    consoleInstanceCreate(find(consoles,'Nintendo DS'), "New"),
    consoleInstanceCreate(find(consoles,'Nintendo DS'), "Used"),
    consoleInstanceCreate(find(consoles,'Nintendo DS'), false),
    consoleInstanceCreate(find(consoles,'Nintendo Wii'), "New"),
    consoleInstanceCreate(find(consoles,'Nintendo Wii'), "Used"),
    consoleInstanceCreate(find(consoles,'Nintendo Wii'), false),
    consoleInstanceCreate(find(consoles,'Nintendo Switch'), "New"),
    consoleInstanceCreate(find(consoles,'Nintendo Switch'), "Used"),
    consoleInstanceCreate(find(consoles,'Nintendo Switch'), false),
    consoleInstanceCreate(find(consoles,'Xbox 360'), "New"),
    consoleInstanceCreate(find(consoles,'Xbox 360'), "Used"),
    consoleInstanceCreate(find(consoles,'Xbox 360'), false),
    consoleInstanceCreate(find(consoles,'Xbox Series X'), "New"),
    consoleInstanceCreate(find(consoles,'Xbox Series X'), "Used"),
    consoleInstanceCreate(find(consoles,'Xbox Series X'), false),
    consoleInstanceCreate(find(consoles,'Play Station 5'), false),

    
  ]);
}

const find = (array, search) => array.find(({name}) => name.includes(search));
