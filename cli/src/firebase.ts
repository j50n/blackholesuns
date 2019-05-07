import firebase from "firebase";
import process from "process";
import { List } from "immutable";
import { Platform, galaxies, coordinates, HOP } from "common";

const WheresWaldo = "stars4";

function env(variable: string): string {
    return (
        process.env[variable] ||
        (() => {
            throw new Error(`environment missing ${variable}`);
        })()
    );
}

const fbconfig = {
    apiKey: env("FIREBASE_API"),
    authDomain: "nms-bhs.firebaseapp.com",
    databaseURL: "https://nms-bhs.firebaseio.com",
    projectId: "nms-bhs",
    storageBucket: "nms-bhs.appspot.com",
    messagingSenderId: env("FIREBASE_MSGID"),
};

async function main(): Promise<void> {
    const app = firebase.initializeApp(fbconfig);
    try {
        await firebase.auth().signInAnonymously();

        const db = firebase.firestore();

        for (const [galaxyIndex, galaxy] of galaxies.entries()) {
            for (const platform of [Platform.PC, Platform.PS4]) {
                function translatePlatform(plat: Platform): string {
                    if (plat === Platform.PC) {
                        return "PC-XBox";
                    } else {
                        return "PS4";
                    }
                }
                const coll = `${WheresWaldo}/${galaxy}/${translatePlatform(platform)}`;

                const exits = await db
                    .collection(coll)
                    //.where("exit", "==", true)
                    .get();

                const exitsMap = new Map<String, firebase.firestore.QueryDocumentSnapshot>();
                exits.forEach(ex => {
                    exitsMap.set(ex.data().addr, ex);
                });

                const blackholes = await db
                    .collection(coll)
                    .where("blackhole", "==", true)
                    .get();

                function check(c: string): boolean {
                    try {
                        coordinates(c);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }

                const jumps: HOP[] = [];

                blackholes.forEach(bh => {
                    const data = bh.data();

                    if (!check(data.addr) || !check(data.connection)) {
                        console.error(`invalid coordinates: ${data.addr} -> ${data.connection}`);
                    } else if (!exitsMap.has(data.connection)) {
                        if (data.addr === data.connection || data.connection === "0000:0000:0000:0000") {
                            const coords = coordinates(data.addr);
                            if (coords.dist2Center() * 400 > 15000 || coords.dist2Center() * 400 < 10000) {
                                console.error(`DEAD ZONE: ${coordinates(data.addr).dist2Center() * 400}`);
                            }
                        } else {
                            console.error(`missing exit: ${galaxy} ${platform} BH-[${data.reg}] ${data.sys} ${data.addr}: missing ${data.connection}`);
                        }
                    } else {
                        const a = coordinates(data.addr);
                        const b = coordinates(data.connection);

                        const dist = 400 * (a.dist2Center() - b.dist2Center());

                        const desc = `bh2center=${a.dist2Center() * 400}, ${platform} ${galaxyIndex}:${galaxy} travel=${dist} addr=${data.addr} to=${
                            data.connection
                        }`;

                        if (a.dist2Center() * 400 < 3200 || b.dist2Center() * 400 < 3200) {
                            console.error(`star in center void: ${desc}`);
                        } else if (a.dist2Center() * 400 > 3500 && dist < 0) {
                            console.error(`negative distance error #1:  ${desc}`);
                        } else if (a.dist2Center() * 400 <= 3500 && dist < -400) {
                            console.error(`negative distance error #2: ${desc}`);
                        } else if (dist > 21000 && a.dist2Center() * 400 <= 819200) {
                            console.error(`positive distance error: ${desc}`);
                        } else {
                            const ex = exitsMap.get(data.connection)!.data();
                            jumps.push([galaxyIndex, platform, data.addr, data.reg, data.sys, ex.addr, ex.reg, ex.sys]);
                        }
                    }
                });

                List<HOP>(jumps)
                    .sortBy(j => `${j[2]}|${j[1]}|${j[0]}`)
                    .forEach(j => console.log(JSON.stringify(j)));
            }
        }
    } finally {
        app.delete();
    }
}

main().catch(e => {
    console.error(e);
});
