// require("dotenv/config");
const test = require("ava");
const keyvTestSuite = require("@keyv/test-suite").default;
const Keyv = require("Keyv");
const KeyvCosmos = require("../dist/index");
// import "dotenv/config";
// import test from "ava";
// import keyvTestSuite from "@keyv/test-suite";
// import Keyv from "keyv";
// import KeyvCosmos from "../src/index";

// const connectionString = process.env.connectionString || "AccountEndpoint=https://coffeecode-database.documents.azure.com:443/;AccountKey=tHh7pSDQrUXCr4UNc10UI1X3O8j2bLBlc7fxyjPkPWSWvghwL9gqW9xBgM3z8a3DMCITowoDDRhJTT4uONWY5w==;";
// const databaseId = process.env.databaseId || "Bee";
// const containerId = process.env.containerId || "Ranks1";

const connectionString = process.env.connectionString || "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
const databaseId = process.env.databaseId || "KeyvTest";
const containerId = process.env.containerId || "KeyvTestContainer";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// keyvOfficialTests(test, Keyv, connectionString, "");

const store = () => new KeyvCosmos(connectionString,
	{databaseId: databaseId, containerId: containerId});

keyvTestSuite(test, Keyv, store);








// import * as Keyv from "keyv";
// import kvc from "./index";

// const cnns = "AccountEndpoint=https://coffeecode-database.documents.azure.com:443/;AccountKey=tHh7pSDQrUXCr4UNc10UI1X3O8j2bLBlc7fxyjPkPWSWvghwL9gqW9xBgM3z8a3DMCITowoDDRhJTT4uONWY5w==;";

// // One of the following
// const kvci = new kvc(cnns, "Bee", "Ranks1");
// const keyv = new Keyv({store: kvci, uri: cnns, namespace});

// keyv.on("error", err => console.log("Connection Error", err));

// keyv.set("287204567236739073", {abc: 123}).then(() =>
// 	keyv.get("287204567236739073").then(v => console.log(": " + v)));

// setTimeout(() =>
// {
// 	keyv.clear();
// }, 600);