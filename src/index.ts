import { CosmosClient, Container } from "@azure/cosmos";
import { EventEmitter } from "events";
import { Store, Options } from "keyv";

class KeyvCosmos extends EventEmitter implements Store<any>
{
	public ttlSupport: boolean;
	private namespace: string;
	private client: CosmosClient;
	private container: Container;

	constructor(url: string, opts: Options<any>)
	{
		super();

		this.ttlSupport = true;
		this.namespace = opts.namespace ?? "keyv";

		this.client = new CosmosClient(url);
		this.container = this.client.database(opts.databaseId).container(opts.containerId);
	}

	public async get(key: string)
	{
		try
		{
			return (await this.container.item(key, this.namespace).read())
				.resource!.value;
		}
		catch
		{
			return;
		}
	}

	public async set(key: string, value: any, ttl?: number)
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

		return this.container.items.upsert({ id: key, ttl, value, namespace: this.namespace });
	}

	public async delete(key: string)
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

	public async clear()
	{
		for (let a = 0; a <= 4; a++)
			for await (const ii of this.container.items.readAll().getAsyncIterator())
				ii.resources.forEach(async i =>
				{
					try
					{
						if (i.id!.startsWith(this.namespace + ":") &&
							i.namespace == this.namespace)
							await this.container.item(i.id!, this.namespace).delete();
					}
					catch
					{}
				});
		return Promise.resolve();
	}
}

export { KeyvCosmos };
module.exports = KeyvCosmos;
