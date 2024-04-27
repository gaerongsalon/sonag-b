const fs = require("node:fs");

const jsdomPatch = {
  name: "jsdom-patch",
  setup(build) {
    build.onLoad({ filter: /XMLHttpRequest-impl\.js$/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, "utf8");
      contents = contents.replace(
        'const syncWorkerFile = require.resolve ? require.resolve("./xhr-sync-worker.js") : null;',
        `const syncWorkerFile = "${require.resolve(
          "jsdom/lib/jsdom/living/xhr/xhr-sync-worker.js"
        )}";`.replaceAll("\\", process.platform === "win32" ? "\\\\" : "\\")
      );
      return { contents, loader: "js" };
    });
  },
};

module.exports = (serverless) => ({
  bundle: true,
  minify: false,
  sourcemap: true,
  exclude: ["aws-sdk"],
  plugins: [jsdomPatch],
  target: "node20",
  // define: { "require.resolve": undefined },
  platform: "node",
  concurrency: 10,
});
