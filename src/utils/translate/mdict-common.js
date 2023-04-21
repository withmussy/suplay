export function getExtension(filename, defaultExt) {
  return /(?:\.([^.]+))?$/.exec(filename)[1] || defaultExt;
}

export function log() {
  console.log.apply(console, [].slice.apply(arguments));
}

export const mdx =  /[()., '/\\@_-]()/g;
export const mdd = /([.][^.]*$)|[()., '/\\@_-]/g ;// strip '.' before file extension that is keeping the last period

export const REGEXP_STRIPKEY =  {
  'mdx' : /[()., '/\\@_-]()/g,
  'mdd' : /([.][^.]*$)|[()., '/\\@_-]/g        // strip '.' before file extension that is keeping the last period
}