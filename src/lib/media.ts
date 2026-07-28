export const isVideoUrl = (url: string) =>
  /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url);
