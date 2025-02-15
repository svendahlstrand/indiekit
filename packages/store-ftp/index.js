import path from 'node:path';
import process from 'node:process';
import {Readable} from 'node:stream';
import ftp from 'basic-ftp';

const defaults = {
  password: process.env.FTP_PASSWORD,
  port: 21,
  user: process.env.FTP_USER,
  verbose: true,
};

/**
 * @typedef Response
 * @property {object} response HTTP response
 */
export const FtpStore = class {
  constructor(options = {}) {
    this.id = 'ftp';
    this.name = 'FTP store';
    this.options = {...defaults, ...options};
  }

  get info() {
    const {directory, host, user} = this.options;

    return {
      name: `${user} on ${host}`,
      uid: `sftp://${host}/${directory}`,
    };
  }

  async client() {
    const {host, user, password, port, verbose} = this.options;
    const client = new ftp.Client();
    client.ftp.verbose = verbose;
    await client.access({host, user, password, port, secure: true});
    return client;
  }

  /**
   * Create readable stream
   *
   * @private
   * @param {string} content File content
   * @returns {string} Readable stream
   */
  #createReadableStream(content) {
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(content, 'utf-8');
    readableStream.push(null); // eslint-disable-line unicorn/no-array-push-push
    return readableStream;
  }

  /**
   * Get absolute file path
   *
   * @private
   * @param {string} filePath Path to file
   * @returns {string} Absolute file path
   */
  #getAbsolutePath(filePath) {
    return path.join(this.options.directory, filePath);
  }

  /**
   * Create file
   *
   * @param {string} filePath Path to file
   * @param {string} content File content
   * @returns {Promise<Response>} HTTP response
   */
  async createFile(filePath, content) {
    const client = await this.client();

    try {
      const readableStream = this.#createReadableStream(content);
      const absolutePath = this.#getAbsolutePath(filePath);
      const dirname = path.dirname(absolutePath);
      const basename = path.basename(absolutePath);

      await client.ensureDir(dirname);
      await client.uploadFrom(readableStream, basename);
    } catch (error) {
      throw new Error(error.message);
    }

    client.close();
    return true;
  }

  /**
   * Update file
   *
   * @param {string} filePath Path to file
   * @param {string} content File content
   * @returns {Promise<Response>} A promise to the response
   */
  async updateFile(filePath, content) {
    const client = await this.client();

    try {
      const readableStream = this.#createReadableStream(content);
      const absolutePath = this.#getAbsolutePath(filePath);

      await client.uploadFrom(readableStream, absolutePath);
    } catch (error) {
      throw new Error(error);
    }

    client.close();
    return true;
  }

  /**
   * Delete file
   *
   * @param {string} filePath Path to file
   * @returns {Promise<Response>} A promise to the response
   */
  async deleteFile(filePath) {
    const absolutePath = this.#getAbsolutePath(filePath);
    const client = await this.client();

    try {
      await client.remove(absolutePath);
    } catch (error) {
      throw new Error(error);
    }

    client.close();
    return true;
  }
};

export default FtpStore;
