export const domain: string = 'samplechatapplication.page.link';

export const bundleId: string = 'com.simform.samplechatapplication';

export const deepLinkPrefixes = ['samplechatapplication://', `${domain}//`, `https://${domain}`];

export const deepLinkQueryParamsMatch: RegExp = /\?(.+)/;
export const routeReplace: RegExp = /.*?:\/\//g;
export const paramReplace: RegExp = /\/([^\\/]+)\/?$/;

export enum DeepLink {
  // samplechatapplication://magic_link&lang=en&tenantId=austin-electrical-qqm76
  MagicLink = 'magic_link',
  // samplechatapplication://forgot_password&lang=en&tenantId=austin-electrical-qqm76
  ForgotPassword = 'forgot_password',
  // samplechatapplication://?toastMessage=<message content>
  ToastMessage = 'toastMessage'
}

export default DeepLink;
