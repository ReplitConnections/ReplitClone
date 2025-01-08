class container {
  constructor(docker) {
    this.docker = docker;
  }
  init(image) {
    return new Promise((res, rej) => {
      this.docker
        .createContainer({
          Image: image,
          Tty: true, // Allocate a TTY
          Cmd: ["/bin/bash"], // Command to run (Bash shell)
          OpenStdin: true, // Keep stdin open
          StdinOnce: false, // Allow multiple stdin inputs
        })
        .then((c) => {
          this.container = c;
          res();
        })
        .catch(rej);
    });
  }
  start() {
    return this.container.start();
  }
  attach() {
    return this.container.attach({
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true,
    });
  }
}

module.exports = container;
