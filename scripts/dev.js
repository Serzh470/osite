var fs = require('fs');
var postcss = require('postcss');
var pug = require('pug');
var chalk = require('chalk');


var time = Date.now();
process.stdout.write(
  chalk.green('Start building') + ' ' + chalk.gray(time) + '\n'
);

// fs.writeFileSync("dists/index.css", css.css.toString());
var css = fs.readFileSync("src/index.scss", "utf8")
postcss([ require('autoprefixer'), require("precss") ]) // [ require('autoprefixer') ], require('cssnano')
  .process(css, { from: 'src/index.scss', to: 'dists/index.css' })
  .then(function (result) {
      fs.writeFileSync('dists/index.css', result.css);
  })
  .catch((err) => console.error(err));


// process pug templates
var html = pug.renderFile('src/index.pug', {pretty: true});
fs.writeFileSync("dists/index.html", html);

time = Date.now();
process.stdout.write(
  chalk.green('Finish building!') + ' ' + chalk.gray(time) + '\n'
);