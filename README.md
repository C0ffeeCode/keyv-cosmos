# keyv-cosmos

> Cosmos DB storage adapter for Keyv

[![npm](https://github.com/C0ffeeCode/keyv-cosmos/workflows/Node.js%20Package/badge.svg)](https://www.npmjs.com/package/keyv-cosmos)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/56217f5c7ba0417381e4ce76a059b62e)](https://www.codacy.com/manual/C0ffeeCode/keyv-cosmos?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=C0ffeeCode/keyv-cosmos&amp;utm_campaign=Badge_Grade)

CosmosDB Core (SQL) storage adapter for [Keyv](https://github.com/lukechilds/keyv).

TTL functionality is supported.

Typings included.

## Install

```shell
npm install --save keyv keyv-cosmos
```

## Usage

```js
const Keyv = require("keyv");
const KeyvCosmos = require("keyv-cosmos");

const store = new KeyvCosmos(connectionString,
	{databaseId: databaseId, containerId: containerId});

const keyv = new Keyv(connectionString, {store: store});

keyv.on("error", handleConnectionError);
