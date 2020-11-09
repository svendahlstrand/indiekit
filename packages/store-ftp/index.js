import path from 'path';
import ftp from 'basic-ftp';
import {Readable} from 'stream';

const defaults = {
  verbose: true
};

/**
 * @typedef Response
 * @property {object} response HTTP response
 */
export const FtpStore = class {
  constructor(options = {}) {
    this.id = 'ftp';
    this.name = 'FTP';
    this.options = {...defaults, ...options};
  }

  async client() {
    const {host, user, password, verbose} = this.options;
    const client = new ftp.Client();
    client.ftp.verbose = verbose;
    await client.access({host, user, password, secure: true});
    return client;
  }

  /**
   * Create file
   *
   * @param {string} filepath Path to file
   * @param {string} content File content
   * @returns {Promise<Response>} HTTP response
   */
  async createFile(filepath, content) {
    const client = await this.client();

    try {
      filepath = path.join(this.options.directory, filepath);
      const dirname = path.dirname(filepath);
      const basename = path.basename(filepath);
      const readableStream = Readable.from([content], {
        encoding: 'utf-8'
      });
      readableStream.push(null);

      await client.ensureDir(dirname);
      await client.uploadFrom(readableStream, basename);
    } catch (error) {
      throw new Error(error.message);
    }

    client.close();
  }

  /**
   * Read file
   *
   * @param {string} filepath Path to file
   * @returns {Promise<Response>} A promise to the response
   */
  async readFile(filepath) {
    filepath = path.join(this.options.directory, filepath);
    console.log('filepath', filepath);
  }

  /**
   * Update file
   *
   * @param {string} filepath Path to file
   * @param {string} content File content
   * @returns {Promise<Response>} A promise to the response
   */
  async updateFile(filepath, content) {
    const client = await this.client();

    try {
      filepath = path.join(this.options.directory, filepath);
      const readableStream = Readable.from(content, {
        encoding: 'utf-8'
      });

      await client.uploadFrom(readableStream, filepath);
    } catch (error) {
      throw new Error(error);
    }

    client.close();
  }

  /**
   * Delete file
   *
   * @param {string} filepath Path to file
   * @returns {Promise<Response>} A promise to the response
   */
  async deleteFile(filepath) {
    filepath = path.join(this.options.directory, filepath);
    const client = await this.client();

    client.remove(filepath);
    client.close();
  }
};
