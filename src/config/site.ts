/**
 * ====================================================
 *  站点配置 —— 只需修改这个文件即可更新页面内容
 * ====================================================
 */
export const siteConfig = {
  /** App 图标 / Logo 链接（正方形图片效果最好） */
  logoUrl: "https://placehold.co/256x256/png",

  /** Logo 下方显示的文字（App 名称） */
  appName: "KISSME",

  /** App 名称下方的一行说明文字（留空字符串则不显示） */
  tagline: "Where late-night chats turn into real-life sparks.",

  /** 下载按钮文字 */
  downloadLabel: "Download",

  /** 下载链接（APK 或应用商店地址） */
  downloadUrl: "https://your-cdn.com/kissme.apk",

  /** 浏览器标签页标题 & 分享描述 */
  pageTitle: "KISSME — Download the App",
  pageDescription: "Get the app now — fast download, beautifully crafted.",

  /**
   * 背景滚动展示的图片 / 视频链接列表。
   * 直接添加、删除或修改下面的链接即可。
   * 支持图片（.jpg .png .webp ...）和视频（.mp4 .webm .mov ...）。
   */
  media: [
    "https://placehold.co/400x500/png?text=1",
    "https://placehold.co/400x500/png?text=2",
    "https://placehold.co/400x500/png?text=3",
    "https://placehold.co/400x500/png?text=4",
    "https://placehold.co/400x500/png?text=5",
    "https://placehold.co/400x500/png?text=6",
  ] as string[],

  /** 是否每次刷新随机打乱展示顺序 */
  shuffleMedia: true,

  /** Meta (Facebook) 像素 ID，留空字符串则不加载像素 */
  fbPixelId: "2911996412489573",
};

export type SiteConfig = typeof siteConfig;