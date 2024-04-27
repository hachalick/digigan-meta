const fs = require("node:fs");
const puppeteer = require("puppeteer");
const readline = require("readline");

const reg =
  /<div class="flex items-center mb-2 lg:mb-1"><span><p class="text-neutral-700 ml-2 text-subtitle">يگانه<\/p><\/span><\/div>/g;

let urls = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function fullUrls() {
  const txt = fs
    .readFileSync("./urls.txt", { encoding: "utf8" })
    .split("\r")
    .join("")
    .split("\n");
  txt.pop();
  urls = txt;
}

async function checkUrl() {
  fullUrls();
  if (!urls.length) return;
  for (let i in urls) {
    const url = urls[i];
    console.log("checking url \x1b[33m" + url + "\x1b[0m");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const code = await page.content();
    const number = code.match(reg).length;
    await browser.close();
    number === 2
      ? console.log("\x1b[32m", "is top", "\x1b[0m\n")
      : console.log("\x1b[31m", "not top", "\x1b[0m\n");
  }
}

function listUrl() {
  const txt = fs
    .readFileSync("./urls.txt", { encoding: "utf8" })
    .split("\r")
    .join("")
    .split("\n");
  txt.pop();
  txt.forEach((url, id) => {
    console.log("id: " + id);
    console.log("url: " + url);
    console.log();
  });
}

function addUrl() {
  rl.question("Enter a url: ", (url) => {
    fs.appendFileSync("./urls.txt", url + "\n");
    rl.close();
  });
}

async function deleteUrl() {
  rl.question("Enter a id: ", (id) => {
    id = parseInt(id);
    if (isNaN(id)) {
      console.log("not a valid id");
      rl.close();
      return;
    }
    const urls = fs
      .readFileSync("./urls.txt", { encoding: "utf8" })
      .split("\r")
      .join("")
      .split("\n");
    urls.pop();
    if (urls.length <= id) {
      console.log("out of range");
      rl.close();
      return;
    }
    urls.splice(id, 1);
    fs.writeFileSync("./urls.txt", "");
    console.log(urls);
    urls.forEach((url) => {
      fs.appendFileSync("./urls.txt", url + "\n");
    });
    rl.close();
  });
}

async function main() {
  console.log("Hi Mahdi");
  console.log(
    "\x1b[33m0. Exit\n1. Check urls\n2. Add url\n3. Delete url (By Id)\n4. List url\x1b[0m"
  );
  rl.question("Enter a number: ", (char) => {
    switch (char) {
      case "0":
        rl.close();
        break;
      case "1":
        checkUrl();
        rl.close();
        break;
      case "2":
        addUrl();
        break;
      case "3":
        deleteUrl();
        break;
      case "4":
        listUrl();
        rl.close();
        break;
    }
  });
}

main();
