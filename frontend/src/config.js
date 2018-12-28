const aws_exports = {
  Auth: {
    region: "ap-southeast-2",
    userPoolId: "USER_POOL_ID",
    userPoolWebClientId: "APP_CLIENT_ID",
    mandatorySignIn: false,
    authenticationFlowType: "USER_SRP_AUTH"
  }
};

export default aws_exports;
