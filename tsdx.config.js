/**
 * Fix as per https://github.com/formium/tsdx/issues/981#issuecomment-789920054
 */

const replace = require('@rollup/plugin-replace')

module.exports = {
  rollup (config, opts) {
    config.plugins = config.plugins.map(p =>
      p.name === 'replace'
        ? replace({
            'process.env.NODE_ENV': JSON.stringify(opts.env),
            preventAssignment: true
          })
        : p
    )
    return config
  }
}
