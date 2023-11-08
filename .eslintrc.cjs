/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  },
  plugins: ['@typescript-eslint', 'tailwindcss', 'unused-imports'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
    'plugin:tailwindcss/recommended'
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',

    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports'
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }
    ],
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: { attributes: false }
      }
    ],
    'tailwindcss/no-custom-classname': 'off'
    // warn import from specific source
    // 'no-restricted-imports': [
    //   'warn',
    //   {
    //     paths: [
    //       {
    //         name: 'ai',
    //         importNames: ['Message'],
    //         message: 'We override default ai Message type in src/types/ai.d.ts'
    //       },
    //       {
    //         name: 'ai/react',
    //         importNames: ['Message'],
    //         message: 'We override default ai Message type in src/types/ai.d.ts'
    //       }
    //     ]
    //   }
    // ]
  },
  settings: {
    tailwindcss: {
      callees: ['cn', 'cva'],
      config: 'tailwind.config.ts'
    }
  }
}

module.exports = config
