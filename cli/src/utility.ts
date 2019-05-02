import { HOP } from "common";
import { List } from "immutable";
import es from "event-stream";

/**
 * Read hops data from an input stream.
 * @param stream Read-stream with hops data.
 */
async function readHops(stream: NodeJS.ReadStream): Promise<List<HOP>> {
    const hops = await new Promise<string[]>((resolve, reject) => {
        stream.pipe(es.split()).pipe(
            es.writeArray((err: any, array: string[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(array);
                }
            })
        );
    });

    return List(hops)
        .filter(hop => !hop.match(/^\s*$/))
        .map(hop => {
            return JSON.parse(hop);
        });
}

export { readHops };
