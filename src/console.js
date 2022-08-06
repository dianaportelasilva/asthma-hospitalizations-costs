const Cryptr = require('cryptr');
const fs = require('fs');

class Console {
  // npm run encrypt key
  async encrypt(args) {
    const [key] = args;

    const cryptr = new Cryptr(key);

    this.regressionModels(cryptr);
    this.associationRules(cryptr);
    this.decisionTrees(cryptr);
  }

  regressionModels(cryptr) {
    const input = fs.readFileSync('data/regression-models.csv', 'utf8');

    // parse input to json
    const table = input
      .split('\n')
      .map(row => row
        .split('\t')
        .map((col, i) => ((i === 3) ? col : Number(col))));

    // write file
    fs.writeFileSync('data/regression-models.dat', cryptr.encrypt(JSON.stringify(table)));
  }

  associationRules(cryptr) {
    const input = fs.readFileSync('data/association-rules.csv', 'utf8');

    // parse input to json
    const table = input
      .split('\n')
      .map(row => row
        .split('\t')
        .map((col, i) => ((i === 3) ? col : Number(col))));

    // write file
    fs.writeFileSync('data/association-rules.dat', cryptr.encrypt(JSON.stringify(table)));
  }

  decisionTrees(cryptr) {
    const input = fs.readFileSync('data/decision-trees.csv', 'utf8');

    // parse input to json
    const table = input
      .split('\n')
      .map(row => row
        .split('\t')
        .map((col, i) => ((i === 3) ? col : Number(col))));

    // write file
    fs.writeFileSync('data/decision-trees.dat', cryptr.encrypt(JSON.stringify(table)));
  }
}

const [method, ...args] = process.argv.slice(2);
const cmd = new Console();
cmd[method](args);
