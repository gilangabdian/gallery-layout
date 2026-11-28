# Contributing

Thank you for your interest in contributing to this project. All your contributions are very valuable and will make this project better, more developed and reliable. I truly appreciate your ideas and effort 😄🎉

You can contribute in the following ways:

### Reporting bugs

You can report bugs via issues. Please keep the following in mind when reporting a bug:

- Check existing issues first to see if a similar one has already been reported; if so, it is better to support that issue (e.g., by commenting or adding a reaction) rather than creating a duplicate
- Try to convey the bug in clear language, you can also insert photos, videos, or gifs to support the issue
- If possible, provide instructions on how to reproduce the issue
- If possible, provide steps to fix the issue

### Pull Requests

You are welcome to submit Pull Requests. For instance, if you have an idea you would like to see implemented in the project, you can submit a PR. You can also submit a PR to fix typos or address incomplete explanations in this `README.md`. Before submitting a PR, please note the following:

#### Project Structure

This project uses a monorepo structure; all project code logic resides in the `/packages` folder. Inside, you will find a `core/` folder containing the core library logic and a `tiptap/` folder containing the Tiptap integration logic

#### Compatibility Rules

When changing logic or adding new features to the **Tiptap Extension**, you must ensure that your changes remain fully compatible with **Tiptap v2.0.0**. Do not introduce APIs or methods that are only available in experimental/newer versions unless absolutely necessary, to prevent breaking changes for existing users

#### Testing

This project uses Vitest for testing. After editing or adding a feature, I highly recommend updating existing unit tests or creating new ones related to your changes to ensure no errors arise during usage.
The `test` folders located within `core/` and `tiptap/` are where the respective test files for each library are stored.
To run the test, run this command in the root folder

```bash
pnpm test:run
```

#### Linting

We use <a href="https://prettier.io/">Prettier</a> to format all code. To lint all your code, you can run in the root folder:

```bash
pnpm lint
```

If you encounter errors, you can run the Prettier auto-fix using:

```bash
pnpm lint-fix
```

> **Note**: Not all rules can be auto-fixed, some require manual changes. A pre-commit hook (Husky + `lint-staged`) also runs Prettier and type checking automatically on `git commit`.

#### Type Checking

We use TypeScript for the entire codebase; therefore, you need to ensure the code is free of type errors by running this command in the root folder

```bash
pnpm typecheck
```

### Development Setup

1. Fork this repository
1. Clone your fork repository

   ```bash
   git clone https://github.com/YOUR_USERNAME/gallery-layout.git
   ```

1. Create a new branch by running

   ```bash
   git checkout -b your-branch-name
   ```

1. Install dependencies in the root folder

   ```bash
   pnpm install
   ```

1. To run the demo playground, run `pnpm dev` in the root folder, it automatically runs `pnpm dev` in `/playground` folder too.

   > **Note**: Leave this terminal running and open a new terminal tab for the next steps

1. Make your desired changes, and don't forget to edit or add tests. Refer to the [Testing](#testing) section for instructions on how to run tests

1. Before opening a PR, run `pnpm verify` in the root folder, it automatically runs formatting (`pnpm lint`), type checking (`pnpm typecheck`), and tests (`pnpm test:run`) for you:

   ```bash
   pnpm verify
   ```

1. Once you are satisfied with your changes, commit them to the branch you created:

   ```bash
   git add .
   git commit -m "DESCRIBE_YOUR_CHANGES_HERE"
   ```

1. Push to the remote and create a PR:

   ```bash
   git push origin HEAD
   ```

On your GitHub page, click the "Compare & Pull Request" button (usually available immediately), target the project's `main` branch, and click "Create Pull Request"

Once again, thank you for your contribution
