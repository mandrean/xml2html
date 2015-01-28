var parser = require('../index.js');

parser({
  input: __dirname + '/test-data.xml',
  output: __dirname + '/test-html.html'
});
