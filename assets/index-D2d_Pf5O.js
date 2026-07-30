import{r as E}from"./iframe-B9CfvQby.js";var c={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d=Symbol.for("react.transitional.element"),p=Symbol.for("react.fragment");function f(t,e,r){var u=null;if(r!==void 0&&(u=""+r),e.key!==void 0&&(u=""+e.key),"key"in e){r={};for(var n in e)n!=="key"&&(r[n]=e[n])}else r=e;return e=r.ref,{$$typeof:d,type:t,key:u,ref:e!==void 0?e:null,props:r}}s.Fragment=p;s.jsx=f;s.jsxs=f;c.exports=s;var T=c.exports,l={exports:{}},v={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var o=E;function S(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var x=typeof Object.is=="function"?Object.is:S,h=o.useState,j=o.useEffect,m=o.useLayoutEffect,y=o.useDebugValue;function k(t,e){var r=e(),u=h({inst:{value:r,getSnapshot:e}}),n=u[0].inst,a=u[1];return m(function(){n.value=r,n.getSnapshot=e,i(n)&&a({inst:n})},[t,r,e]),j(function(){return i(n)&&a({inst:n}),t(function(){i(n)&&a({inst:n})})},[t]),y(r),r}function i(t){var e=t.getSnapshot;t=t.value;try{var r=e();return!x(t,r)}catch{return!0}}function R(t,e){return e()}var _=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?R:k;v.useSyncExternalStore=o.useSyncExternalStore!==void 0?o.useSyncExternalStore:_;l.exports=v;var $=l.exports;export{T as j,$ as s};
