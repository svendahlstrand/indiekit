# @indiekit/store-gitlab

Store IndieWeb content on GitLab.

## Installation

`npm i @indiekit/store-gitlab`

## Configuration

```js
const GitlabStore = require('@indiekit/store-gitlab');

const gitlab = new GitlabStore({
  // config options here
});
```

## Options

### `branch`

The branch files will be saved to.

Type: `string`\
_Optional_, defaults to `master`

### `host`

GitLab instance URL.

Type: `string`\
_Optional_, defaults to `https://gitlab.com`

### `projectId`

GitLab project ID.

Type: `string`\
_Required (if `user` and `repo` not provided)_

### `repo`

The name of your GitLab repository.

Type: `string`\
_Required (if `projectId` not provided)_

### `token`

A GitLab access token.

Type: `string`\
_Required_

### `user`

Your GitLab username.

Type: `string`\
_Required (if `projectId` not provided)_
