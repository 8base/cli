
const snapshot = require("jest-snapshot");
const utils = require("./utils");

utils.createLoginedConfig();

function toMatchSnapshot(received, customName) {
  const replacedData = typeof received === "string"
    ? received
      .replace(/\x1B\[[0-9;]*[JKmsu]/g, "")
      .replace(/Time: [0-9]*\,?[0-9]* ms\./, "Time: 100 ms.")
    : received;

  return snapshot.toMatchSnapshot.call(
    this,
    replacedData,
    customName,
  );
}

(jest as any).setTimeout(30000);

expect.extend({
  toMatchSnapshot
});
