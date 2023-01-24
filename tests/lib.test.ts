import {
  translate_text,
  _split_at_p,
  _split_html,
  DeepLTranslation,
  translate_html,
} from "../src/scripts/lib";
import { enableFetchMocks } from "jest-fetch-mock";
import fetchMock from "jest-fetch-mock";
enableFetchMocks();

const globalAny: any = global;

class DialogMock {
  render() {}
}

test("deconstructs HTML properly", async () => {
  const input_HTML: string = "<a>Hello</a><p>World</p>";
  let output_HTML: Array<string> = await _split_html(input_HTML);
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
  const input_HTML: string = "<p>World</p>";
  let output_HTML: Array<string> = await _split_html(input_HTML);
  expect(output_HTML).toStrictEqual(["<p>", "World", "</p>"]);
});

test("deconstructs empty string", async () => {
  const input_HTML: string = "";
  let output_HTML: Array<string> = await _split_html(input_HTML);
  expect(output_HTML).toStrictEqual([]);
});

test("deconstructs nested HTML", async () => {
  const input_HTML: string = "<a><p>Hello World</p></a>";
  let output_HTML: Array<string> = await _split_html(input_HTML);
  expect(output_HTML).toStrictEqual([
    "<a>",
    "<p>",
    "Hello World",
    "</p>",
    "</a>",
  ]);
});

test("splits text at </p> tag", async () => {
  const input_HTML = "<p>Hello World</p><p>I am inevitable</p>";
  let output_HTML = _split_at_p(input_HTML);
  expect(output_HTML).toStrictEqual([
    "<p>Hello World</p>",
    "<p>I am inevitable</p>",
  ]);
});

test("splits text at </p> tag with dangling text", async () => {
  const input_HTML = "<p>Hello World</p><p>I am inevitable</p>Dangle";
  let output_HTML = _split_at_p(input_HTML);
  expect(output_HTML).toStrictEqual([
    "<p>Hello World</p>",
    "<p>I am inevitable</p>",
    "Dangle",
  ]);
});

test("returns mock response", async () => {
  const output: DeepLTranslation = { translations: [{ text: "Test" }] };
  fetchMock.mockResponseOnce(JSON.stringify(output), { status: 200 });
  const result = await translate_text(" ", "sdqd", "de_DE");
  expect(result).toBe("Test");
});

test("returns Error 'API Quota Exceeded' error when status code 456", async () => {
  fetchMock.mockResponseOnce("", { status: 456 });
  try {
    const result = await translate_text(JSON.stringify(" "), "sdqd", "de_DE");
  } catch (e) {
    if (e instanceof Error) {
      expect(e.message).toMatch(
        "You have exceeded your monthly DeepL API quota. You will be able to continue translating next month. For more information, check your account on the DeepL website."
      );
    }
  }
});
test("Unauthorized error for 401", async () => {
  fetchMock.mockResponseOnce("", { status: 401 });
  try {
    const result = await translate_text(JSON.stringify(" "), "sdqd", "de_DE");
  } catch (e) {
    if (e instanceof Error) {
      expect(e.message).toMatch(
        "Your token is invalid. Please check your DeepL Token."
      );
    }
  }
});

test("Unauthorized error for 403", async () => {
  fetchMock.mockResponseOnce("", { status: 403 });
  try {
    const result = await translate_text(JSON.stringify(" "), "sdqd", "de_DE");
  } catch (e) {
    if (e instanceof Error) {
      expect(e.message).toMatch(
        "Your token is invalid. Please check your DeepL Token."
      );
    }
  }
});

test("unknown error for other status code", async () => {
  fetchMock.mockResponseOnce("", { status: 503 });
  try {
    const result = await translate_text(JSON.stringify(" "), "sdqd", "de_DE");
  } catch (e) {
    if (e instanceof Error) {
      expect(e.message).toMatch("Unknown Error");
    }
  }
});

// test("Dialog render on 503 status", async () => {
//   fetchMock.mockResponseOnce("", { status: 503 });
//   const renderMock = jest
//     .spyOn(DialogMock.prototype, "render")
//     .mockImplementation(() => {
//       console.log("Mock");
//     });
//   globalAny.Dialog = DialogMock;
//   await translate_html(JSON.stringify(" "), "sdqd", "de_DE");
//   expect(renderMock).toHaveBeenCalledTimes(1);
// });
