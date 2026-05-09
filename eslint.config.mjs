import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];


export default config;
