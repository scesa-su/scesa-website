import { test } from "node:test";
import assert from "node:assert/strict";
import { serialize } from "next-mdx-remote/serialize";
import { allowOnly } from "./mdx.ts";

const compile = async (source: string) =>
  (await serialize(source, { mdxOptions: { remarkPlugins: [allowOnly(["PullQuote", "a"])] } })).compiledSource;

test("allowOnly keeps mapped components and markdown", async () => {
  const out = await compile('Hello **there** [link](https://scesa.co.ke)\n\n<PullQuote quote="Ship it" />\n\nInline <a href="https://x.dev">a</a>.');
  assert.match(out, /PullQuote/);
  assert.match(out, /Ship it/);
  assert.match(out, /there/);
  assert.match(out, /x\.dev/);
});

test("allowOnly drops raw HTML that could run script", async () => {
  const out = await compile(
    [
      "<script>alert(1)</script>",
      '<iframe srcdoc="<script>parent.alert(document.cookie)</script>"></iframe>',
      '<meta httpEquiv="refresh" content="0;url=https://evil.example" />',
      '<PullQuote quote="ok"><object data="data:text/html,x"></object></PullQuote>',
      "<><script>alert(2)</script></>",
      "Text with <img src=\"x\" onerror=\"alert(3)\" /> inline.",
    ].join("\n\n"),
  );
  assert.doesNotMatch(out, /\("(script|iframe|meta|object|img)"/);
  assert.doesNotMatch(out, /srcdoc|alert|evil\.example/);
  assert.match(out, /Text with/);
});
