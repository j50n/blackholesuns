#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parse_1 = require("csv-parse");
const event_stream_1 = __importDefault(require("event-stream"));
// function handler(
//   data: string[],
//   callback: (error: any, data: string | null) => void
// ): void {
//   try {
//     console.error(data[1]);
//     const line = `${JSON.stringify(data)}\n`;
//     callback(null, line);
//   } catch (e) {
//     callback(e, null);
//   }
// }
process.stdin.setEncoding("utf8");
const p = new csv_parse_1.Parser({ delimiter: "," });
const bhData = new Promise((resolve, reject) => {
    process.stdin.pipe(p).pipe(event_stream_1.default.writeArray((err, array) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(array);
        }
    }));
});
async function generate() {
    const rows = await bhData;
    console.info("/*");
    console.info(" * This code is generated by parse-bhs.ts; changes will be overwritten.");
    console.info(` * There are a total of ${rows.length -
        1} black hole data rows (before checks).`);
    console.info(" */");
    console.info("export const blackHoleData: string[][] = [");
    for (const row of rows.slice(1)) {
        console.info(`  ${JSON.stringify(row, null, "  ")
            .split("\n")
            .join("\n    ")},`);
    }
    console.info("];");
}
generate().catch((error) => {
    console.error(`[ERROR] ${error.message}`);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtYmhzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BhcnNlLWJocy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSx5Q0FBbUM7QUFDbkMsZ0VBQThCO0FBRTlCLG9CQUFvQjtBQUNwQixvQkFBb0I7QUFDcEIsd0RBQXdEO0FBQ3hELFlBQVk7QUFDWixVQUFVO0FBQ1YsOEJBQThCO0FBQzlCLGdEQUFnRDtBQUNoRCw0QkFBNEI7QUFDNUIsa0JBQWtCO0FBQ2xCLHlCQUF5QjtBQUN6QixNQUFNO0FBQ04sSUFBSTtBQUVKLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRWxDLE1BQU0sQ0FBQyxHQUFHLElBQUksa0JBQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRXpDLE1BQU0sTUFBTSxHQUFHLElBQUksT0FBTyxDQUN4QixDQUFDLE9BQW1DLEVBQUUsTUFBNEIsRUFBRSxFQUFFO0lBQ3BFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDeEIsc0JBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFRLEVBQUUsS0FBaUIsRUFBRSxFQUFFO1FBQzVDLElBQUksR0FBRyxFQUFFO1lBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2I7YUFBTTtZQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQjtJQUNILENBQUMsQ0FBQyxDQUNILENBQUM7QUFDSixDQUFDLENBQ0YsQ0FBQztBQUVGLEtBQUssVUFBVSxRQUFRO0lBQ3JCLE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDO0lBRTFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FDVix5RUFBeUUsQ0FDMUUsQ0FBQztJQUNGLE9BQU8sQ0FBQyxJQUFJLENBQ1YsMkJBQTJCLElBQUksQ0FBQyxNQUFNO1FBQ3BDLENBQUMsd0NBQXdDLENBQzVDLENBQUM7SUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsNENBQTRDLENBQUMsQ0FBQztJQUMzRCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDL0IsT0FBTyxDQUFDLElBQUksQ0FDVixLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7YUFDakMsS0FBSyxDQUFDLElBQUksQ0FBQzthQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNyQixDQUFDO0tBQ0g7SUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRTtJQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDMUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcImNzdi1wYXJzZVwiO1xuaW1wb3J0IGVzIGZyb20gXCJldmVudC1zdHJlYW1cIjtcblxuLy8gZnVuY3Rpb24gaGFuZGxlcihcbi8vICAgZGF0YTogc3RyaW5nW10sXG4vLyAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogc3RyaW5nIHwgbnVsbCkgPT4gdm9pZFxuLy8gKTogdm9pZCB7XG4vLyAgIHRyeSB7XG4vLyAgICAgY29uc29sZS5lcnJvcihkYXRhWzFdKTtcbi8vICAgICBjb25zdCBsaW5lID0gYCR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9XFxuYDtcbi8vICAgICBjYWxsYmFjayhudWxsLCBsaW5lKTtcbi8vICAgfSBjYXRjaCAoZSkge1xuLy8gICAgIGNhbGxiYWNrKGUsIG51bGwpO1xuLy8gICB9XG4vLyB9XG5cbnByb2Nlc3Muc3RkaW4uc2V0RW5jb2RpbmcoXCJ1dGY4XCIpO1xuXG5jb25zdCBwID0gbmV3IFBhcnNlcih7IGRlbGltaXRlcjogXCIsXCIgfSk7XG5cbmNvbnN0IGJoRGF0YSA9IG5ldyBQcm9taXNlKFxuICAocmVzb2x2ZTogKHJvd3M6IHN0cmluZ1tdW10pID0+IHZvaWQsIHJlamVjdDogKGVycm9yOiBhbnkpID0+IHZvaWQpID0+IHtcbiAgICBwcm9jZXNzLnN0ZGluLnBpcGUocCkucGlwZShcbiAgICAgIGVzLndyaXRlQXJyYXkoKGVycjogYW55LCBhcnJheTogc3RyaW5nW11bXSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShhcnJheSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuKTtcblxuYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJvd3MgPSBhd2FpdCBiaERhdGE7XG5cbiAgY29uc29sZS5pbmZvKFwiLypcIik7XG4gIGNvbnNvbGUuaW5mbyhcbiAgICBcIiAqIFRoaXMgY29kZSBpcyBnZW5lcmF0ZWQgYnkgcGFyc2UtYmhzLnRzOyBjaGFuZ2VzIHdpbGwgYmUgb3ZlcndyaXR0ZW4uXCJcbiAgKTtcbiAgY29uc29sZS5pbmZvKFxuICAgIGAgKiBUaGVyZSBhcmUgYSB0b3RhbCBvZiAke3Jvd3MubGVuZ3RoIC1cbiAgICAgIDF9IGJsYWNrIGhvbGUgZGF0YSByb3dzIChiZWZvcmUgY2hlY2tzKS5gXG4gICk7XG4gIGNvbnNvbGUuaW5mbyhcIiAqL1wiKTtcbiAgY29uc29sZS5pbmZvKFwiZXhwb3J0IGNvbnN0IGJsYWNrSG9sZURhdGE6IHN0cmluZ1tdW10gPSBbXCIpO1xuICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzLnNsaWNlKDEpKSB7XG4gICAgY29uc29sZS5pbmZvKFxuICAgICAgYCAgJHtKU09OLnN0cmluZ2lmeShyb3csIG51bGwsIFwiICBcIilcbiAgICAgICAgLnNwbGl0KFwiXFxuXCIpXG4gICAgICAgIC5qb2luKFwiXFxuICAgIFwiKX0sYFxuICAgICk7XG4gIH1cbiAgY29uc29sZS5pbmZvKFwiXTtcIik7XG59XG5cbmdlbmVyYXRlKCkuY2F0Y2goKGVycm9yOiBFcnJvcikgPT4ge1xuICBjb25zb2xlLmVycm9yKGBbRVJST1JdICR7ZXJyb3IubWVzc2FnZX1gKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufSk7XG4iXX0=