const codegen = require('mercurius-codegen');
const { buildSchema } = require('graphql');

codegen.loadSchemaFiles('src/*.gql', {
  prebuild: {
    enabled: false,
  },
  watchOptions: {
    enabled: true,
    onChange(schema) {
      const app = { ready: () => {}, graphql: () => {} };
      app.graphql.schema = buildSchema(schema.join('\n'));

      codegen
        .codegenMercurius(app, {
          targetPath: './src/graphql/generated.ts',
          operationsGlob: './src/graphql/operations/*.gql',
        })
        .catch(console.error);
    },
  },
});
