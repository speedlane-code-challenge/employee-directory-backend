import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
} from "@aws-sdk/client-secrets-manager";

const { REGION } = process.env;

export class SecretManagerService {
  private secretsManager: SecretsManagerClient;

  public constructor() {
    this.secretsManager = new SecretsManagerClient({
      region: REGION,
    });
  }

  public async getSecretValue(secretId: string) {
    const getSecretValueCommandInput: GetSecretValueCommandInput = {
      SecretId: secretId,
    };

    const getSecretValueCommand = new GetSecretValueCommand(
      getSecretValueCommandInput
    );
    const secretValue = JSON.parse(
      (await this.secretsManager.send(getSecretValueCommand)).SecretString
    );

    return secretValue;
  }
}
