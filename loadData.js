// * loadData.js : Load your data and put it in data.json

import fetch from "node-fetch";
import * as fs from "fs/promises";

// ! IMPORTANT: Change this if you wanna use on your own account
// ! Only works on public repos
const Username = "CarelessDev";

const allReposUrl = `https://api.github.com/users/${Username}/repos?per_page=100`;
const allReposResponse = await fetch(allReposUrl);
if (allReposResponse.status >= 400) {
    throw new Error("Bad response from server");
}

const allReposText = await allReposResponse.text();
const allRepos = JSON.parse(allReposText);

console.log(`There are total of ${allRepos.length} public repositories`);

let outObject = {};

for (const repo of allRepos) {
    const repoUrl = repo.full_name;

    if (repo.fork)
        continue;

    const langRepoUrl = `https://api.github.com/repos/${repoUrl}/languages`;
    const langResponse = await fetch(langRepoUrl);

    if (langResponse.status >= 400) {
        throw new Error("Bad response from server");
    }

    const langText = await langResponse.text();

    outObject[repoUrl] = JSON.parse(langText);

    console.log(repoUrl);
    console.log(langText);
    console.log();
}

await fs.writeFile("data.json", JSON.stringify(outObject, null, 4));
console.log("Write Success");
