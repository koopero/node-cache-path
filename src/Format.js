module.exports = Format;

function Format ( format ) {
  switch ( format ) {
    
    case 'string':
    case String:
      return {
        options: { encoding: 'utf8' }
      }

    case 'json':
    case JSON:
      return {
        options: { encoding: 'utf8' },
        convert: {
          to: JSON.stringify,
          from: JSON.parse
        }
      }

    case 'yaml':
      const yaml = require('js-yaml');
      return {
        options: { encoding: 'utf8' },
        convert: {
          to: yaml.safeDump,
          from: yaml.safeLoad
        }
      }

    case 'buffer':
    case Buffer:
      return {
        options: {}
      }
  }

}
