import { _split_at_p, _split_html } from "../src/scripts/lib";

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
