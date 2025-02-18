import {
  parseLogLines,
  generateUniqueIPMap,
  getUniqueIpCount,
  getMostVisitedUrls,
  getMostActiveIPs,
} from "./utils";

const testData = `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"
168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
168.41.191.41 - - [11/Jul/2018:17:41:30 +0200] "GET /this/page/does/not/exist/ HTTP/1.1" 404 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"`;

describe("parseLogLines", () => {
  it("should parse log lines", () => {
    const result = parseLogLines(testData);
    expect(result).toHaveLength(3);
  });
});

describe("generateUniqueIPMap", () => {
  it("should generate unique IP map", () => {
    const result = generateUniqueIPMap(parseLogLines(testData));
    expect(result).toEqual({
      "168.41.191.40": 1,
      "168.41.191.41": 1,
      "177.71.128.21": 1,
    });
  });
});

describe("getUniqueIpCount", () => {
  it("should return count of ips", () => {
    const result = getUniqueIpCount({
      "1.1.1.1": 1,
      "2.2.2.2": 3,
      "3.3.3.3": 2,
    });
    expect(result).toBe(3);
  });

  it("should return 0 for no ips", () => {
    const result = getUniqueIpCount({});
    expect(result).toBe(0);
  });
});

describe("getMostVisitedUrls", () => {
  it("should most visited urls", () => {
    const testUrls = `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"
168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
168.41.191.41 - - [11/Jul/2018:17:41:30 +0200] "GET https://examples.net/faq/ HTTP/1.1" 404 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
168.41.191.42 - - [11/Jul/2018:17:41:30 +0200] "GET /faq/ HTTP/1.1" 404 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"`;

    const result = getMostVisitedUrls(parseLogLines(testUrls));
    expect(result).toEqual([
      "http://example.net/faq/",
      "https://examples.net/faq/",
    ]);
  });
});

describe("getMostActiveIPs", () => {
  it("should most active ips", () => {
    const testUrls = `168.41.191.1 - - [10/Jul/2018:22:21:28 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"
168.41.191.1 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
168.41.191.2 - - [11/Jul/2018:17:41:30 +0200] "GET https://examples.net/faq/ HTTP/1.1" 404 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
168.41.191.3 - - [11/Jul/2018:17:41:30 +0200] "GET https://abc.net/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"`;

    const result = getMostActiveIPs(parseLogLines(testUrls));
    expect(result).toEqual(["168.41.191.1", "168.41.191.3"]);
  });
});
