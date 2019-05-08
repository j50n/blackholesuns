import process from "process";
import { galaxies } from "common";
import { readHops } from "./utility";

async function main(): Promise<void> {
    const hops = await readHops(process.stdin);

    const selectableGalaxies = hops
        .map(hop => hop[0])
        .toSet()
        .toList()
        .sortBy(a => a)
        .map(a => [a, galaxies[a]])
        .toArray();

    let source = [`/* Generated code. Do not edit. */`, `type GalaxyTuple = [number, string];`, `const inputGalaxies: GalaxyTuple[] = [`];

    source = source.concat(selectableGalaxies.map(g => JSON.stringify(g).replace(/,/g, ", ")).map(g => `    ${g},`));
    source.push("];");
    source.push("export { inputGalaxies, GalaxyTuple };");

    console.log(source.join("\n"));
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
