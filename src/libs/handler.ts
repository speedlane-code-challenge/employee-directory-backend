const getHandler = (handlerPath: string, method: string, routePath: string) => {
  return {
    handler: handlerPath,
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