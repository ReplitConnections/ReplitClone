const DEBUG = true;

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
      "Docker is not installed properly, or the node is not being run as root!"
    );
    process.exit(1);
  }

  const Container = require(`./scripts/container.js`);
  const container = new Container(docker);

  logger.info("Init container");
  await container.init("ubuntu");
  logger.info("Starting container");
  await container.start();
  logger.info("Attaching to container (secret)");

  const secretStream = await container.attach();
  let doneSetup = false,
    rootPwd = utils.makeid(100),
    failOver = false;

  logger.info('Updating the system and adding the "you" user. Please wait...');

  secretStream.write(
    [
      `export DEBIAN_FRONTEND=noninteractive`,

      // Set up users
      `useradd -m -s /bin/bash you`,
      `chown you:you /home/you`,
      `chmod u+rwx /home/you`,
      `userdel -r ubuntu`,
      `echo "root:${rootPwd}" | chpasswd`,

      // Apt update
      `apt update`,
      `apt upgrade`,
      `apt install software-properties-common -y`,
      `add-apt-repository ppa:deadsnakes/ppa -y`,
      `apt update`,

      // Install some stuf
      `apt install build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev curl git \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev python3.7 python3.8 python3.9 python3.10 python3.11 python3.12 python3-pip -y`,

      // Configure timezones
      `ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime`,
      `dpkg-reconfigure --frontend noninteractive tzdata`,

      // Install nvm
      `su -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash" you`,

      // Continues below...
    ].join(" && ") + "\n"
  );

  secretStream.on("error", (e) => {
    logger.error(e);
    failOver = true;
  });

  secretStream.on("data", async (d) => {
    // "dir /" gives a list of directories, including bin, dev, home and lib64. If all of those are present in the output, it must have succeeded.

    if (d.toString().includes(`This loads nvm`)) {
      secretStream.write(`su you\n`);
      setTimeout(() => {
        secretStream.write(
          [
            'export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"',
            `[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`,
            `nvm install --lts`,

            // Finish up
            `dir /`,
            `exit`
          ].join(" && ") + "\n"
        );
      }, 500);
      return;
    }

    if (
      ["bin", "dev", "home", "lib64"]
        .map((a) => d.toString().includes(a))
        .filter((a) => !a).length == 0 &&
      !doneSetup &&
      !failOver
    ) {
      doneSetup = true;

      logger.info(
        `Setup has completed. Root password is ${rootPwd}. Creating the image...`
      );

      container.container.commit(
        {
          comment: "base image",
          repo: "replimg",
        },
        console.log
      );
    } else if (DEBUG) console.log(d.toString());
  });

  secretStream.on("end", process.exit);
  secretStream.on("finish", process.exit);
  secretStream.on("close", process.exit);
})();
