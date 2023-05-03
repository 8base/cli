const { generateScaffoldProject } = require("../setup/helpers/generateScaffoldProject");

generateScaffoldProject()
  .then(() => console.log("Generate successful"))
  .catch(err => console.log(err));
