'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var PageGenerator = module.exports = function PageGenerator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);

  // Command:
  // yo assemble:page
  // yo assemble:page [title] [path]
  // yo assemble:page --title [title] --path [path]
  // yo assemble:page  -t [title] -p [path]
  this.pageTitle = options['title'] || options['t'] || args[0];
  this.pagePath = options['path'] || options['p'] || args[1];
  if(this.pagePath && this.pagePath.indexOf('./') !== -1) {
    this.pagePath = this.pagePath.replace('./', '');
  }
};

util.inherits(PageGenerator, yeoman.generators.Base);

PageGenerator.prototype.askFor = function askFor() {

  var done = this.async();

  var questions = [];

  (!this.pageTitle) && questions.push({
    type    : "input",
    name    : "pageTitle",
    message : "Your page title",
    default : 'index'
  });

  (!this.pagePath) && questions.push({
    type    : "input",
    name    : "pagePath",
    message : "Your page path",
    default : '/src/templates/pages/'
  });

  this.prompt(questions, function (answers) {

    this.pageTitle = this.pageTitle || answers.pageTitle;
    this.pagePath = this.pagePath || answers.pagePath;

    done();
  }.bind(this));
};

PageGenerator.prototype.files = function files() {

  var title = this._.slugify(this.pageTitle);

  var today = new Date();

  var date = today.getUTCFullYear() + '-'
      + ('0'+(today.getMonth()+1)).slice(-2) + '-'
      + ('0'+(today.getDate())).slice(-2) + ' '
      + today.getHours() + ':'
      + today.getMinutes() + ':'
      + today.getSeconds();

  var context = [
    '---',
    'title: ' + title,
    'date: ' + date,
    '---',
    '# ' + title
  ];

  var filename = title + '.hbs';
  this.write(this.pagePath + filename, context.join('\n'));

  // Sometime we get conflict/overwrite notice. Make sure we set log at the last event.
  this.on('end', function () {
    console.log('Done. Just edit this file: ' + this.pagePath);
  });

};
