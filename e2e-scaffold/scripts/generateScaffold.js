const { generateScaffoldProject } = require("../setup/helpers/generateScaffoldProject");

generateScaffoldProject()
  .then(() => console.log("Generate successfull"))
  .catch(err => console.log(err));
