# @indiekit/syndicator-twitter

Syndicate IndieWeb content to Twitter.

## Installation

`npm i @indiekit/syndicator-twitter`

## Usage

```js
const TwitterSyndicator = require("@indiekit/syndicator-twitter");

const twitter = new TwitterSyndicator({
  // config options here
});
```

## Options

You can get your Twitter API keys from <https://developer.twitter.com/>.

### `apiKey`

Your Twitter API key.

Type: `string`\
_Required_

### `apiKeySecret`

Your Twitter API secret key.

Type: `string`\
_Required_

### `accessToken`

Your Twitter access token.

Type: `string`\
_Required_

### `accessTokenSecret`

Your Twitter access token secret.

Type: `string`\
_Required_

### `user`

Your Twitter username (without the `@`).

Type: `string`\
_Required_

### `checked`

Tell a Micropub client whether this syndicator should be enabled by default.

Type: `boolean`\
_Optional_, defaults to `false`
