import process from 'node:process';
import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {Indiekit} from './packages/indiekit/index.js';
import {JekyllPreset} from './packages/preset-jekyll/index.js';
import {GithubStore} from './packages/store-github/index.js';

// New indiekit instance
const indiekit = new Indiekit();

// Configure publication preset
const jekyll = new JekyllPreset();

// Configure content store
const github = new GithubStore({
  user: process.env.GITHUB_USER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH,
  token: process.env.GITHUB_TOKEN
});

// Override preset post type
indiekit.set('publication.postTypes', [{
  type: 'note',
  name: 'Note',
  post: {
    path: '_notes/{t}.md',
    url: 'notes/{t}'
  },
}, {
  type: 'photo',
  name: 'Photo',
  post: {
    path: '_notes/{t}.md',
    url: 'notes/{t}'
  },
  media: {
    path: 'images/{originalname}',
  }
}]);

indiekit.set('publication.postTemplate', properties => {
  const frontmatter = '---\n---\n';
  const photos = (properties.photo || []).map(image => `{% imagesize ${image.url}:img alt='${image.alt}' %}`).join('\n');
  let content;

  if (properties.content) {
    content = properties.content.text || properties.content.html || properties.content;
  } else {
    content = '';
  }

  return frontmatter + content + photos + '\n';
});

const capitilize = text => { return text.charAt(0).toUpperCase() + text.slice(1) };

indiekit.set('publication.storeMessageTemplate', metaData => {
  const {action, postType, fileType} = metaData;
  return `${capitilize(action)} ${postType} ${fileType}.`;
});

// Publication settings
indiekit.set('publication.me', process.env.PUBLICATION_URL);
indiekit.set('publication.preset', jekyll);
indiekit.set('publication.store', github);
indiekit.set('publication.timeZone', process.env.TZ ? process.env.TZ : 'UTC');

// Server
const server = indiekit.server();

export default server;
