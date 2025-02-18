export const parseLogLines = (logs) => {
  // https://stackoverflow.com/questions/12544510/parsing-apache-log-files
  // Inspired by this solution for parse apache logs
  const apacheLogRegex =
    /^([\d.]+) [^ ]* [^ ]* \[([^\]]*)\] "([^"]*)" (\d+) [^ ]* "([^"]*)" "([^"]*)"/;

  return logs.split("\n").map((logLine) => logLine.match(apacheLogRegex));
};

export const generateUniqueIPMap = (logLines) => {
  const uniqueIPs = {};

  for (let i = 0; i < logLines.length; i++) {
    const parsedLog = logLines[i];
    if (parsedLog) {
      const ip = parsedLog[1];

      if (uniqueIPs[ip] !== undefined) {
        uniqueIPs[ip]++;
      } else {
        uniqueIPs[ip] = 1;
      }
    }
  }

  return uniqueIPs;
};

export const getUniqueIpCount = (ipMap) => {
  return Object.keys(ipMap).length;
};

export const getMostVisitedUrls = (logLines) => {
  const uniqueURLs = {};

  for (let i = 0; i < logLines.length; i++) {
    const parsedLog = logLines[i];
    if (parsedLog) {
      const urlRequest = parsedLog[3];
      const url = urlRequest.split(" ")?.[1];

      if (url?.startsWith("http") || url?.startsWith("https")) {
        if (uniqueURLs[url] !== undefined) {
          uniqueURLs[url]++;
        } else {
          uniqueURLs[url] = 1;
        }
      }
    }
  }

  const sortedUrls = Object.keys(uniqueURLs).sort((urlA, urlB) => {
    const urlCountA = uniqueURLs[urlA];
    const urlCountB = uniqueURLs[urlB];
    return urlCountB - urlCountA;
  });

  return sortedUrls.slice(0, 3);
};

export const getMostActiveIPs = (logLines) => {
  const uniqueIPs = {};

  for (let i = 0; i < logLines.length; i++) {
    const parsedLog = logLines[i];
    if (parsedLog) {
      const ip = parsedLog[1];
      const status = parsedLog[4];

      if (parseInt(status) >= 200 && parseInt(status) <= 299)
        if (uniqueIPs[ip] !== undefined) {
          uniqueIPs[ip]++;
        } else {
          uniqueIPs[ip] = 1;
        }
    }
  }

  const sortedIps = Object.keys(uniqueIPs).sort((ipA, ipB) => {
    const ipCountA = uniqueIPs[ipA];
    const ipCountB = uniqueIPs[ipB];
    return ipCountB - ipCountA;
  });

  return sortedIps.slice(0, 3);
};
