const args = ["generateData.js"];
const opts = { stdio: "inherit", cwd: "lib", shell: true };
require("child_process").spawn("node", args, opts);
