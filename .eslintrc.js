module.exports = {
  "env": {
      "browser": true,
      "es6": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended"
  ],
  "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "@typescript-eslint"
  ],
  "rules": {
      "semi": ["error", "always"],   // 세미콜론을 반드시 붙일 것
      "quotes": ["error", "double"], //문자열을 반드시 쌍따옴표로 감쌀 것
      "no-unused-vars": "off"
  }
};