import { ComprehendLanguagesTranslator } from "../scripts/lib/ComprehendLanguagesTranslator.js";
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
//   expect(result.translations[0].text).toBe("Hallo Welt");
// });

test("deconstructs HTML properly", async () => {
  const input_HTML = "<a>Hello</a><p>World</p>";
  let output_HTML = await ComprehendLanguagesTranslator.split_html(input_HTML);
  expect(output_HTML).toStrictEqual([
    "<a>",
    "Hello",
    "</a>",
    "<p>",
    "World",
    "</p>",
  ]);
});

test("deconstructs simple HTML", async () => {
  const input_HTML = "<p>World</p>";
  let output_HTML = await ComprehendLanguagesTranslator.split_html(input_HTML);
  expect(output_HTML).toStrictEqual(["<p>", "World", "</p>"]);
});

test("deconstructs empty string", async () => {
  const input_HTML = "";
  let output_HTML = await ComprehendLanguagesTranslator.split_html(input_HTML);
  expect(output_HTML).toStrictEqual([]);
});

test("deconstructs nested HTML", async () => {
  const input_HTML = "<a><p>Hello World</p></a>";
  let output_HTML = await ComprehendLanguagesTranslator.split_html(input_HTML);
  expect(output_HTML).toStrictEqual([
    "<a>",
    "<p>",
    "Hello World",
    "</p>",
    "</a>",
  ]);
});
