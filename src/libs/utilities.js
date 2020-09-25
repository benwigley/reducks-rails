export default {
  isServer: function() { return typeof window === 'undefined' },
  isBrowser: function() { return typeof window !== 'undefined' },
  isDevice: function() {
    return this.isBrowser() && !!navigator.platform && /iPad|iPhone|iPod|ReactNative/.test(navigator.platform)
  },
  apiConfig: {}
}
