# @indiekit/store-gitea

Store IndieWeb content on Gitea.

## Installation

`npm i @indiekit/store-gitea`

## Configuration

```js
const GiteaStore = require("@indiekit/store-gitea");

const gitea = new GiteaStore({
  // config options here
});
```

## Options

### `branch`

The branch files will be saved to.

Type: `string`\
_Optional_, defaults to `master`

### `host`

Gitea instance URL.

Type: `string`\
_Optional_, defaults to `https://gitea.com`

### `repo`

The name of your Gitea repository.

Type: `string`\
_Required_

### `token`

A Gitea access token.

Type: `string`\
_Required_

### `user`

Your Gitea username.

Type: `string`\
_Required_
