import { ComprehendLanguagesTranslator } from "../src/scripts/lib/ComprehendLanguagesTranslator";
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

test("deconstructs HTML properly", async () => {
  const input_HTML:string = "<a>Hello</a><p>World</p>";
  let output_HTML: Array<string> = await ComprehendLanguagesTranslator._split_html(input_HTML);
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
  const input_HTML:string = "<p>World</p>";
  let output_HTML: Array<string> = await ComprehendLanguagesTranslator._split_html(input_HTML);
  expect(output_HTML).toStrictEqual(["<p>", "World", "</p>"]);
});

test("deconstructs empty string", async () => {
  const input_HTML:string = "";
  let output_HTML: Array<string> = await ComprehendLanguagesTranslator._split_html(input_HTML);
  expect(output_HTML).toStrictEqual([]);
});

test("deconstructs nested HTML", async () => {
  const input_HTML:string = "<a><p>Hello World</p></a>";
  let output_HTML: Array<string>  = await ComprehendLanguagesTranslator._split_html(input_HTML);
  expect(output_HTML).toStrictEqual([
    "<a>",
    "<p>",
    "Hello World",
    "</p>",
    "</a>",
  ]);
});
