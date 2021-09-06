// * analyze.js: Analyze as it name suggests and save to csv

import * as fs from "fs/promises";

let langObj = {};

try {
    const buffer = await fs.readFile("data.json");
    langObj = JSON.parse(buffer.toString());
}
catch (err) {
    console.log("data.json not found");
    process.exit(1);
}

let langCounter = {};

for (const repo in langObj) {
    const langStats = langObj[repo];
    for (const lang in langStats) {
        if (langCounter[lang]) {
            langCounter[lang] += parseInt(langStats[lang]);
        }
        else {
            langCounter[lang] = parseInt(langStats[lang]);
        }
    }
}

const sorted = Object.entries(langCounter)
    .sort(([, a], [, b]) => b - a);

const languages = [];
sorted.map((lang) => {
    languages.push(lang[0]);
});

console.log(langCounter);
console.log(sorted);
console.log(languages);

let CSVWrite = "Repos,";

for (const lang of languages) {
    CSVWrite += `${lang},`;
}
CSVWrite += "Total,\n";

for (const reponame in langObj) {
    let totalThisRepo = 0;
    const repolang = langObj[reponame];
    CSVWrite += `${reponame.split("/")[1]},`;
    for (const lang of languages) {
        if (repolang[lang]) {
            CSVWrite += `${repolang[lang].toString()},`;
            totalThisRepo += repolang[lang];
        }
        else {
            CSVWrite += "0,";
        }
    }
    CSVWrite += `${totalThisRepo},\n`;
}
CSVWrite += "Total,";

let totalポイッ = 0;
for (const lang of sorted) {
    CSVWrite += `${lang[1]},`;
    totalポイッ += lang[1];
}

CSVWrite += `${totalポイッ},\n`;

// console.log(CSVWrite);

await fs.writeFile("lang.csv", CSVWrite);

console.log("Success");
