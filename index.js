'use strict';

const Typetalk = require('typetalk');
const repositoryUrl = "https://github.com/is2ei/serverless-plugin-typetalk-example";

function hasRequiredProperties(service) {
  if (!service.custom) {
    return false;
  }
  if (!service.custom.typetalk) {
    return false;
  }
  if (!service.custom.typetalk.topicId) {
    return false;
  }
  if (!service.custom.typetalk.token) {
    return false;
  }
  return true;
}


class TypetalkServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    if (!hasRequiredProperties(this.serverless.service)) {
      throw new Error(`ServerlessTypetalkPlugin requires options. see ${repositoryUrl}`);
    }

    this.typetalk = new Typetalk.Client({
      token: this.serverless.service.custom.typetalk.token
    });

    this.hooks = {
      'before:deploy:deploy': this.beforeDeployDeploy.bind(this),
      'deploy:deploy': this.deployDeploy.bind(this),
      'remove:remove': this.remove.bind(this),
    };
  }

  beforeDeployDeploy() {
    const message = `:airplane_departure: Start deploying \`${this.serverless.service.service}\`...`
    if (this.serverless.service.custom.typetalk.message) {
      message += "\n";
      message += this.serverless.service.custom.typetalk.message;
    }
    const id = this.serverless.service.custom.typetalk.topicId
    return this.typetalk.postMessage({message}, {id})
      .then(() => this.serverless.cli.log('Typetalk notification has been sent.'))
      .catch((err) => this.serverless.cli.log(`Typetalk notification failed. error: ${JSON.stringify(err)}`));
  }

  deployDeploy() {
    const message = `:confetti_ball: Deployed \`${this.serverless.service.service}\``
    if (this.serverless.service.custom.typetalk.message) {
      message += "\n";
      message += this.serverless.service.custom.typetalk.message;
    }
    const id = this.serverless.service.custom.typetalk.topicId
    return this.typetalk.postMessage({message}, {id})
      .then(() => this.serverless.cli.log('Typetalk notification has been sent.'))
      .catch((err) => this.serverless.cli.log(`Typetalk notification failed. error: ${JSON.stringify(err)}`));
  }

  remove() {
    const message = `:bomb: Removed \`${this.serverless.service.service}\``
    if (this.serverless.service.custom.typetalk.message) {
      message += "\n";
      message += this.serverless.service.custom.typetalk.message;
    }
    const id = this.serverless.service.custom.typetalk.topicId
    return this.typetalk.postMessage({message}, {id})
      .then(() => this.serverless.cli.log('Typetalk notification has been sent.'))
      .catch((err) => this.serverless.cli.log(`Typetalk notification failed. error: ${JSON.stringify(err)}`));
  }
}

module.exports = TypetalkServerlessPlugin;
