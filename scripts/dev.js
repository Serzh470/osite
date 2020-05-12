const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const pug = require("pug");
const chalk = require("chalk");
const getInstagram = require("./instagram");

/** Clear dists folder */
function clearDists() {
  fs.readdirSync("dists").forEach((file) =>
    fs.unlinkSync(path.join("dists", file))
  );
}

/** Process css */
function processCss() {
  var css = fs.readFileSync("src/index.scss", "utf8");
  postcss([require("autoprefixer"), require("precss")]) // [ require('autoprefixer') ], require('cssnano')
    .process(css, { from: "src/index.scss", to: "dists/index.css" })
    .then(function (result) {
      fs.writeFileSync("dists/index.css", result.css);
    })
    .catch((err) => console.error(err));
}

/** Process pug templates */
async function processHtml() {
  // get last instagram photos
  const media = await getInstagram();
  const html = pug.renderFile("src/index.pug", {
    pretty: true,
    media: media,
  });
  fs.writeFileSync("dists/index.html", html);
}

// copy static assets to dist folder
function processStatic() {
  process.stdout.write(
    chalk.green("Copy static assets to dists folder...") + "\n"
  );
  const static = [/\.png/i, /\.jpg/i, /\.webp/i, /\.svg/i, /\.ttf/i];
  /**
   * Get all files in src
   * @param {string} dir path
   */
  const readFileTree = (dir) =>
    fs
      .readdirSync(dir)
      .reduce(
        (files, file) =>
          fs.statSync(path.join(dir, file)).isDirectory()
            ? files.concat(readFileTree(path.join(dir, file)))
            : files.concat(path.join(dir, file)),
        []
      )
      .filter((file) => static.find((ext) => ext.test(file)));

  const files = readFileTree("src");
  files.forEach((file) => {
    const name = path.basename(file);
    if (!fs.existsSync(path.join("dists", name))) {
      fs.copyFile(file, path.join("dists", name), (err) => {
        if (err) throw err;
        console.log(`${name} was copied to ./dists`);
      });
    }
  });
}

const start = Date.now();
process.stdout.write(
  chalk.green("Start building") + " " + chalk.gray(start) + "\n"
);

clearDists();
processCss();
processHtml();
processStatic();

const end = Date.now();
process.stdout.write(
  chalk.green("Finish building!") + " " + chalk.gray(end) + "\n"
);
