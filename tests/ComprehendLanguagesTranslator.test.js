import { ComprehendLanguagesTranslator } from "../scripts/lib/ComprehendLanguagesTranslator.js";
import fetch from "node-fetch";
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}
require("dotenv").config();
test("translates text via API", async () => {
  let token = process.env.API_KEY;
  const result = await ComprehendLanguagesTranslator.translate_text(
    "Hello World",
    token,
    "DE"
  );
  expect(result.translations[0].text).toBe("Hallo Welt");
});
