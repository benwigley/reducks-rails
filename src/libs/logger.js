import utilities from './utilities'

const logger = (() => {
  let inGroup = false

  const methodToColorMap = {
    log: `#afcae8`, // Faded Blue
    info: `#8bb6e6`, // Slightly less faded blue
    debug: `#d0d0d0`, // Gray
    warn: `#f39c12`, // Yellow
    error: `#c0392b`, // Red
    groupCollapsed: `#2f5e96`, // Dark Blue
    groupEnd: null, // No colored prefix on groupEnd
  }

  const print = function (method, args) {
    if (method === 'groupCollapsed') {
      // Safari doesn't print all console.groupCollapsed() arguments:
      // https://bugs.webkit.org/show_bug.cgi?id=182754
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args)
        return
      }
    }

    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 3px`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.4em`,
    ]

    // When in a group, the workbox prefix is not displayed.
    const logPrefix = inGroup ? [] : ['%creducks-rails', styles.join(';')]

    // Log styles don't seem to work in node, so just skip it
    if (typeof window === 'undefined') {
      console[method](...args)
    } else {
      console[method](...logPrefix, ...args)
    }

    if (method === 'groupCollapsed') {
      inGroup = true
    }
    if (method === 'groupEnd') {
      inGroup = false
    }
  }

  const api = { shouldLog: true }
  for (const method of Object.keys(methodToColorMap)) {
    api[method] = (...args) => {
      if (!api.shouldLog) { return }
      if (method == 'debug') {
        if (utilities.isServer()) { // && !config.debugServer
          // Skip
        } else if (utilities.isBrowser()) { // && !config.debugBrowser
          // Skip
        } else {
          print(method, args)
        }
      } else {
        print(method, args)
      }
    }
  }

  return api
})()

export default logger
