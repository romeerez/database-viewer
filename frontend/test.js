const parser = require('./gethue/parse/sql/generic/genericAutocompleteParser');

const before = '';
const after = '';
const dialect = 'generic';
const debug = false;

console.log(parser.parseSQL(before, after, dialect, debug));
