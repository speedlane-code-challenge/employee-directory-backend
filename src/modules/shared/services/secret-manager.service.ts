import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
} from "@aws-sdk/client-secrets-manager";
import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const { REGION } = process.env;

export class SecretManagerService {
  private secretsManager: SecretsManagerClient;

  public constructor() {
    this.secretsManager = new SecretsManagerClient({
      region: REGION,
    });
  }

  public async getSecretValue(secretId: string) {
    try {
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
    } catch (e) {
      console.error("Secrets Manager error:", e);
      throw e;
    }
  }
}
