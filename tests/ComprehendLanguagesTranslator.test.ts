import {
  ComprehendLanguagesTranslator,
  JournalEntryTranslator,
} from "../src/scripts/ComprehendLanguagesTranslator";
import fetch from "node-fetch";
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}
require("dotenv").config();

// test("translates text via API", async () => {
//   let token = process.env.API_KEY;
//   const result = await ComprehendLanguagesTranslator.translate_text(
//     "Hello World",
//     token,
//     "DE"
//   );
//   expect(result).toBe("Hallo Welt");
// });

// test("translates html via API", async () => {
//   let token:string = process.env.API_KEY;
//   const result = await ComprehendLanguagesTranslator.translate_html(
//     "<p>Hello</p> <p>World</p>",
//     token,
//     "DE"
//   );
//   expect(result).toBe("<p>Hallo</p> <p>Welt</p>");
// });

test("True", () => {
  expect(true);
});
