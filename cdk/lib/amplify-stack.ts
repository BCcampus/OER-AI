import * as cdk from "aws-cdk-lib";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as codeconnections from "aws-cdk-lib/aws-codeconnections";
import { Construct } from "constructs";
import * as yaml from "yaml";
import { ApiGatewayStack } from "./api-stack";

interface AmplifyStackProps extends cdk.StackProps {
  githubRepo: string;
  githubBranch?: string;
}

export class AmplifyStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    apiStack: ApiGatewayStack,
    props: AmplifyStackProps
  ) {
    super(scope, id, props);

    const githubRepoName = props.githubRepo;

    const amplifyYaml = yaml.stringify({
      version: 1,
      applications: [
        {
          appRoot: "frontend",
          frontend: {
            phases: {
              preBuild: {
                commands: ["pwd", "npm ci"],
              },
              build: {
                commands: ["npm run build"],
              },
            },
            artifacts: {
              baseDirectory: "dist",
              files: ["**/*"],
            },
            cache: {
              paths: ["node_modules/**/*"],
            },
          },
        },
      ],
    });

    const username = cdk.aws_ssm.StringParameter.valueForStringParameter(
      this,
      "oer-owner-name"
    );

    // Create GitHub connection using CodeStar Connections (GitHub App)
    // This connection must be authorized in the AWS Console after deployment
    const githubConnection = new codeconnections.CfnConnection(
      this,
      "AmplifyGitHubConnection",
      {
        connectionName: `${id}-amplify-github-connection`,
        providerType: "GitHub",
      }
    );

    // Create Amplify app without repository - user connects via console after authorizing connection
    // This approach uses GitHub Apps instead of Personal Access Tokens for better security
    const amplifyApp = new amplify.CfnApp(this, "AmplifyApp", {
      name: `${id}-amplify`,
      platform: "WEB",
      buildSpec: amplifyYaml,
      environmentVariables: [
        { name: "VITE_AWS_REGION", value: this.region },
        { name: "VITE_COGNITO_USER_POOL_ID", value: apiStack.getUserPoolId() },
        {
          name: "VITE_COGNITO_USER_POOL_CLIENT_ID",
          value: apiStack.getUserPoolClientId(),
        },
        { name: "VITE_API_ENDPOINT", value: apiStack.getEndpointUrl() },
        { name: "VITE_IDENTITY_POOL_ID", value: apiStack.getIdentityPoolId() },
        {
          name: "VITE_WEBSOCKET_URL",
          value: `${apiStack.getWebSocketUrl()}/${apiStack.getStageName() ?? ""}`,
        },
      ],
      customRules: [
        {
          source: "/<*>",
          target: "/index.html",
          status: "404-200",
        },
      ],
    });

    // Add main branch
    const mainBranch = new amplify.CfnBranch(this, "MainBranch", {
      appId: amplifyApp.attrAppId,
      branchName: "main",
      enableAutoBuild: true,
      stage: "PRODUCTION",
    });

    // Add feature branch if specified and not main
    const branch = props.githubBranch ?? "main";
    if (branch !== "main") {
      new amplify.CfnBranch(this, "FeatureBranch", {
        appId: amplifyApp.attrAppId,
        branchName: branch,
        enableAutoBuild: true,
        stage: "DEVELOPMENT",
      });
    }

    amplifyApp.node.addDependency(githubConnection);

    // Outputs for post-deployment configuration
    new cdk.CfnOutput(this, "AmplifyAppId", {
      value: amplifyApp.attrAppId,
      description: "Amplify App ID",
    });

    new cdk.CfnOutput(this, "GitHubConnectionArn", {
      value: githubConnection.attrConnectionArn,
      description:
        "GitHub Connection ARN - authorize this in AWS Console > Developer Tools > Connections",
    });

    new cdk.CfnOutput(this, "AmplifyConsoleUrl", {
      value: `https://${this.region}.console.aws.amazon.com/amplify/home?region=${this.region}#/${amplifyApp.attrAppId}`,
      description: "Link to Amplify Console to connect repository",
    });
  }
}
