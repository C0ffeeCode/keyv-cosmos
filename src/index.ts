import { CosmosClient, Container, OperationInput } from "@azure/cosmos";
import { EventEmitter } from "events";
import { Store, Options } from "keyv";

interface KeyvCosmosDbOptions extends Options<null>
{
	databaseId: string;
	containerId: string;
}

class KeyvCosmos extends EventEmitter implements Store<any>
{
	public ttlSupport: boolean;
	private namespace: string;
	private container: Container;

	constructor(url: string, opts: KeyvCosmosDbOptions)
	{
		super();

		this.ttlSupport = true;
		this.namespace = opts.namespace ?? "keyv";

		const client = new CosmosClient(url ?? opts.uri);
		this.container = client
			.database(opts.databaseId)
			.container(opts.containerId);
	}

	public async get(key: string): Promise<any>
	{
		try
		{
			const item = await this.container.item(key, this.namespace).read();
			return item.resource.value;
		}
		catch
		{
			return;
		}
	}

	public async set(key: string, value: any, ttl?: number): Promise<any>
	{
		if (typeof value == "undefined")
			return Promise.resolve();

		// ttl in Cosmos is in seconds, in Keyv it is milliseconds
		// undefined ttl means default, -1 means forever
		if (typeof ttl == "number" && ttl > 0)
			ttl /= 60;
		if (ttl && ttl < 0)
			ttl = -1;
		if (ttl)
			ttl = Math.round(ttl);

		return this.container.items.upsert(
			{ id: key, ttl, value, namespace: this.namespace });
	}

	public async delete(key: string): Promise<boolean>
	{
		if (typeof key != "string")
			return false;

		try
		{
			await this.container.item(key, this.namespace).delete();
			return true;
		}
		catch
		{
			return false;
		}
	}

	public async clear(): Promise<void>
	{
		const ops: OperationInput[] = [];

		for await (const ii of
			this.container.items.readAll().getAsyncIterator())
		{
			ii.resources.forEach(async i =>
			{
				ops.push(
					{
						operationType: "Delete",
						partitionKey: this.namespace,
						id: i.id ?? "" // I just want to remove a warning ༼ つ ◕_◕ ༽つ
					});
			});
		}

		await this.container.items.bulk(ops);
	}
}

export { KeyvCosmos };
export default KeyvCosmos;
module.exports = KeyvCosmos;
