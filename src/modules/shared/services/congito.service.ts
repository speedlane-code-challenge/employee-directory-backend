import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  GetUserCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

export class CognitoService {
  public async getUser(accessToken: string) {
    try {
      const cognitoIdentityProviderClient: CognitoIdentityProviderClient =
        new CognitoIdentityProviderClient({
          region: process.env.REGION,
        });

      const getUserCommandInput: GetUserCommandInput = {
        AccessToken: accessToken,
      };
      const getUserCommand: GetUserCommand = new GetUserCommand(
        getUserCommandInput
      );
      const response = await cognitoIdentityProviderClient.send(getUserCommand);

      return response.UserAttributes;
    } catch (e) {
      console.error("Cognito get user error:", e);
      throw e;
    }
  }
}
