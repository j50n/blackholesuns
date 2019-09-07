import { download } from "./download";
import { Hop, galaxies, System, coordinates, HOP } from "common";
import { List } from "immutable";
import { publicPath } from "../../vue.config";

async function blackholes(): Promise<List<Hop>> {
    const data: List<string> = List((await download(`${publicPath}blackholes.txt`)).split(/\n/g));
    const tuples: List<HOP> = data
        .filter((line: string) => !line.match(/^\s*$/g))
        .map((line: string) => {
            try {
                return JSON.parse(line);
            } catch (e) {
                throw new Error(`${e.message}\n'${line}'`);
            }
        });

    return tuples.map((tuple: HOP) => {
        return new Hop(
            tuple[1],
            galaxies[tuple[0]],
            new System(tuple[3], tuple[4], coordinates(tuple[2])),
            new System(tuple[6], tuple[7], coordinates(tuple[5])),
        );
    });
}

export { blackholes };
