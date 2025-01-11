const DEBUG = false;

(async () => {
  const utils = require(`./scripts/utils`);
  const Logger = require("@ptkdev/logger");
  const logger = new Logger();

  logger.info("Starting up...");

  const Docker = require("dockerode");
  let docker;
  try {
    docker = new Docker();
  } catch {
    logger.error(
      "Docker is not installed properly, or the node is not being run as root!",
    );
    process.exit(1);
  }

  const Container = require(`./scripts/container.js`);
  const container = new Container(docker);
  let userCanInteract = false;

  logger.info("Init container");
  await container.init("replimg");
  logger.info("Starting container");
  await container.start();

  logger.info(`Starting user session...`);

  let userStream = await container.attach();
  userStream.write(`exec su - you\n`);

  userStream.on("data", (d) => {
    if (
      d.toString().includes("you@") &&
      d.toString().includes(`:~$`) &&
      !userCanInteract
    ) {
      userCanInteract = true;
      logger.info(`You can now interact with the shell!`);
    }

    if (userCanInteract) process.stdout.write(d);
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.on("data", (d) => {
    if (!userCanInteract) return;
    userStream.write(d);
  });

  userStream.on("end", process.exit);
  userStream.on("finish", process.exit);
  userStream.on("close", process.exit);
})();
