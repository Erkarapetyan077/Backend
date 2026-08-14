const fsp = require("fs/promises");

const env = process.argv[2];

const basePath = "config.base.json";

const overridePath = `config.${env}.json`;

function deepMerge(base, override) {
  if (typeof override !== "object" || override === null) {
    return override;
  }
  if (Array.isArray(override)) {
    return override;
  }

  const result = { ...base };

  for (const key of Object.keys(override)) {
    if (
      typeof override[key] === "object" &&
      override[key] !== null &&
      !Array.isArray(override[key])
    ) {
      result[key] = deepMerge(result[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

async function main() {
  const baseData = await fsp.readFile(basePath, "utf-8");

  let baseConfig = {};

  try {
    baseConfig = JSON.parse(baseData);
  } catch (error) {
    console.error(`Invalid JSON in ${basePath}`);
    return;
  }

  let overrideConfig = {};

  try {
    const overrideData = await fsp.readFile(overridePath, "utf8");
    overrideConfig = JSON.parse(overrideData);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(`Warning: ${overridePath} not found`);
    } else {
      console.error(`Invalid JSON in ${overridePath}`);
      return;
    }
  }

  const finalConfig = deepMerge(baseConfig, overrideConfig);

  const data = JSON.stringify(finalConfig, null, 2);

  const tempPath = "config.final.json.tmp";
  const finalPath = "config.final.json";

  console.log(finalConfig);

  await fsp.writeFile(tempPath, data);
  await fsp.rename(tempPath, finalPath);

  console.log("Config merged successfully");
}

main();
