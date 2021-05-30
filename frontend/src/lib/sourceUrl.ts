export const getSourceUrlAndDatabaseNameFromUrl = (url: string) => {
  const match = url.match(/\w+:\/\/[^/]+/);
  if (match)
    return {
      sourceUrl: match[0],
      databaseName: url.slice(match[0].length + 1),
    };
  else return {};
};
