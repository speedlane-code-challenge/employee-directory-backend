const getHandler = (handlerPath: string, method: string, routePath: string) => {
  return {
    handler: handlerPath,
    vpc: {
      securityGroupIds: ["sg-087f59d3d7216e4a0"],
      subnetIds: ["subnet-00a9ecbd043b919fe"],
    },
    events: [
      {
        http: {
          method: method,
          path: routePath,
          cors: true,
        },
      },
    ],
  };
}

export { getHandler };