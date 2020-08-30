require("dotenv/config");
const test = require("ava");
const keyvTestSuite = require("@keyv/test-suite").default;
const Keyv = require("Keyv");
const KeyvCosmos = require("../dist/index");

const connectionString = process.env.connectionString || "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
const databaseId = process.env.databaseId || "KeyvTest";
const containerId = process.env.containerId || "KeyvTestContainer";
const isLocal = process.env.connectionString == undefined;

if (isLocal === true)
	process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// keyvOfficialTests(test, Keyv, connectionString, "");

const store = () => new KeyvCosmos(connectionString,
	{databaseId, containerId});

keyvTestSuite(test, Keyv, store);
