const { override } = require("customize-cra");

module.exports = override((config) => {
  // Find the rule that handles mjs files
  const rules = config.module.rules.find((rule) => rule.oneOf);
  if (rules) {
    rules.oneOf.unshift({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });
  }
  return config;
});
