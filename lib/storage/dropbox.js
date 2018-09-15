require('isomorphic-fetch')
const { Dropbox } = require('dropbox')
const dropboxStream = require('dropbox-stream')

const dropbox = {
  accessToken: null,
  dbx: null,
  async authenticate(accessToken) {
    this.accessToken = accessToken
    this.dbx = new Dropbox({accessToken})
  },
  async test() {
    const filesListRes = await this.dbx.filesListFolder({path: ''})
    const files = filesListRes.entries.map(entr => entr.name)
    if (filesListRes.has_more) files.push('...')
    return files
  },
  createDropboxUploadStream(filepath) {
    const options = {
      token: this.accessToken,
      filepath,
      chunkSize: 1000 * 1024,
      autorename: true,
    }
    const uploadStream = dropboxStream.createDropboxUploadStream(options)
    return uploadStream
  }
}

exports.dropbox = dropbox