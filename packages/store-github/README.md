# @indiekit/store-github

Store IndieWeb content on GitHub.

## Installation

`npm i @indiekit/store-github`

## Usage

```js
const GithubStore = require("@indiekit/store-github");

const github = new GithubStore({
  // config options here
});
```

## Options

### `branch`

The branch files will be saved to.

Type: `string`\
_Optional_, defaults to `master`

### `repo`

The name of your GitHub repository.

Type: `string`\
_Required_

### `token`

A GitHub access token.

Type: `string`\
_Required_

### `user`

Your GitHub username.

Type: `string`\
_Required_
