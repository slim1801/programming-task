import fs from "fs/promises";
import {
  parseLogLines,
  generateUniqueIPMap,
  getUniqueIpCount,
  getMostVisitedUrls,
  getMostActiveIPs,
} from "./utils.js";

const execute = async () => {
  try {
    const result = await fs.readFile("./programming-task-example-data.log", {
      encoding: "utf8",
    });

    const logLines = parseLogLines(result);

    const uniqueIps = generateUniqueIPMap(logLines);

    // Output to console
    console.log(
      `Number of unique IP addresses: ${getUniqueIpCount(uniqueIps)}`
    );
    console.log(
      `Top 3 visited URLs: ${getMostVisitedUrls(logLines).join(", ")}`
    );
    console.log(
      `Top 3 most active IP addresses: ${getMostActiveIPs(logLines).join(", ")}`
    );
  } catch (err) {
    console.log(err);
  }
};

execute();
