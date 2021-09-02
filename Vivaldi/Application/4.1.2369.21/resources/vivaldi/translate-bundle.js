!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1842)}({1388:function(e,t,n){var r,i,s;
/**
 * findAndReplaceDOMText v 0.4.6
 * @author James Padolsey http://james.padolsey.com
 * @license http://unlicense.org/UNLICENSE
 *
 * Matches the text of a DOM node against a regular expression
 * and replaces each match (or node-separated portions of the match)
 * in the specified element.
 */s=function(){var e=document,t={}.hasOwnProperty;function n(){return r.apply(null,arguments)||i.apply(null,arguments)}function r(e,t,r,s,a){if(t&&!t.nodeType&&arguments.length<=2)return!1;var o,d="function"==typeof r;d&&(o=r,r=function(e,t){return o(e.text,t.startIndex)});var l=i(t,{find:e,wrap:d?null:r,replace:d?r:"$"+(s||"&"),prepMatch:function(e,t){if(!e[0])throw"findAndReplaceDOMText cannot handle zero-length matches";if(s>0){var n=e[s];e.index+=e[0].indexOf(n),e[0]=n}return e.endIndex=e.index+e[0].length,e.startIndex=e.index,e.index=t,e},filterElements:a});return n.revert=function(){return l.revert()},!0}function i(e,t){return new s(e,t)}function s(e,r){var i=r.preset&&n.PRESETS[r.preset];if(r.portionMode=r.portionMode||"retain",i)for(var s in i)t.call(i,s)&&!t.call(r,s)&&(r[s]=i[s]);this.node=e,this.options=r,this.prepMatch=r.prepMatch||this.prepMatch,this.reverts=[],this.matches=this.search(),this.matches.length&&this.processMatches()}return n.NON_PROSE_ELEMENTS={br:1,hr:1,script:1,style:1,img:1,video:1,audio:1,canvas:1,svg:1,map:1,object:1,input:1,textarea:1,select:1,option:1,optgroup:1,button:1},n.NON_CONTIGUOUS_PROSE_ELEMENTS={address:1,article:1,aside:1,blockquote:1,dd:1,div:1,dl:1,fieldset:1,figcaption:1,figure:1,footer:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,header:1,hgroup:1,hr:1,main:1,nav:1,noscript:1,ol:1,output:1,p:1,pre:1,section:1,ul:1,br:1,li:1,summary:1,dt:1,details:1,rp:1,rt:1,rtc:1,script:1,style:1,img:1,video:1,audio:1,canvas:1,svg:1,map:1,object:1,input:1,textarea:1,select:1,option:1,optgroup:1,button:1,table:1,tbody:1,thead:1,th:1,tr:1,td:1,caption:1,col:1,tfoot:1,colgroup:1},n.NON_INLINE_PROSE=function(e){return t.call(n.NON_CONTIGUOUS_PROSE_ELEMENTS,e.nodeName.toLowerCase())},n.PRESETS={prose:{forceContext:n.NON_INLINE_PROSE,filterElements:function(e){return!t.call(n.NON_PROSE_ELEMENTS,e.nodeName.toLowerCase())}}},n.Finder=s,s.prototype={search:function(){var e,t=0,n=0,r=this.options.find,i=this.getAggregateText(),s=[],a=this;return r="string"==typeof r?RegExp(String(r).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1"),"g"):r,function i(o){for(var d=0,l=o.length;d<l;++d){var c=o[d];if("string"==typeof c){if(r.global)for(;e=r.exec(c);)s.push(a.prepMatch(e,t++,n));else(e=c.match(r))&&s.push(a.prepMatch(e,0,n));n+=c.length}else i(c)}}(i),s},prepMatch:function(e,t,n){if(!e[0])throw new Error("findAndReplaceDOMText cannot handle zero-length matches");return e.endIndex=n+e.index+e[0].length,e.startIndex=n+e.index,e.index=t,e},getAggregateText:function(){var e=this.options.filterElements,t=this.options.forceContext;return function n(r){if(r.nodeType===Node.TEXT_NODE)return[r.data];if(e&&!e(r))return[];var i=[""],s=0;if(r=r.firstChild)do{if(r.nodeType!==Node.TEXT_NODE){var a=n(r);t&&r.nodeType===Node.ELEMENT_NODE&&(!0===t||t(r))?(i[++s]=a,i[++s]=""):("string"==typeof a[0]&&(i[s]+=a.shift()),a.length&&(i[++s]=a,i[++s]=""))}else i[s]+=r.data}while(r=r.nextSibling);return i}(this.node)},processMatches:function(){var e,t,n,r=this.matches,i=this.node,s=this.options.filterElements,a=[],o=i,d=r.shift(),l=0,c=0,h=[i];e:for(;;){if(o.nodeType===Node.TEXT_NODE&&(!t&&o.length+l>=d.endIndex?t={node:o,index:c++,text:o.data.substring(d.startIndex-l,d.endIndex-l),indexInMatch:0===l?0:l-d.startIndex,indexInNode:d.startIndex-l,endIndexInNode:d.endIndex-l,isEnd:!0}:e&&a.push({node:o,index:c++,text:o.data,indexInMatch:l-d.startIndex,indexInNode:0}),!e&&o.length+l>d.startIndex&&(e={node:o,index:c++,indexInMatch:0,indexInNode:d.startIndex-l,endIndexInNode:d.endIndex-l,text:o.data.substring(d.startIndex-l,d.endIndex-l)}),l+=o.data.length),n=o.nodeType===Node.ELEMENT_NODE&&s&&!s(o),e&&t){if(o=this.replaceMatch(d,e,a,t),l-=t.node.data.length-t.endIndexInNode,e=null,t=null,a=[],c=0,!(d=r.shift()))break}else if(!n&&(o.firstChild||o.nextSibling)){o.firstChild?(h.push(o),o=o.firstChild):o=o.nextSibling;continue}for(;;){if(o.nextSibling){o=o.nextSibling;break}if((o=h.pop())===i)break e}}},revert:function(){for(var e=this.reverts.length;e--;)this.reverts[e]();this.reverts=[]},prepareReplacementString:function(e,t,n){var r=this.options.portionMode;return"first"===r&&t.indexInMatch>0?"":(e=e.replace(/\$(\d+|&|`|')/g,(function(e,t){var r;switch(t){case"&":r=n[0];break;case"`":r=n.input.substring(0,n.startIndex);break;case"'":r=n.input.substring(n.endIndex);break;default:r=n[+t]||""}return r})),"first"===r?e:t.isEnd?e.substring(t.indexInMatch):e.substring(t.indexInMatch,t.indexInMatch+t.text.length))},getPortionReplacementNode:function(t,n){var r=this.options.replace||"$&",i=this.options.wrap,s=this.options.wrapClass;if(i&&i.nodeType){var a=e.createElement("div");a.innerHTML=i.outerHTML||(new XMLSerializer).serializeToString(i),i=a.firstChild}if("function"==typeof r)return(r=r(t,n))&&r.nodeType?r:e.createTextNode(String(r));var o="string"==typeof i?e.createElement(i):i;return o&&s&&(o.className=s),(r=e.createTextNode(this.prepareReplacementString(r,t,n))).data&&o?(o.appendChild(r),o):r},replaceMatch:function(t,n,r,i){var s,a,o=n.node,d=i.node;if(o===d){var l=o;n.indexInNode>0&&(s=e.createTextNode(l.data.substring(0,n.indexInNode)),l.parentNode.insertBefore(s,l));var c=this.getPortionReplacementNode(i,t);return l.parentNode.insertBefore(c,l),i.endIndexInNode<l.length&&(a=e.createTextNode(l.data.substring(i.endIndexInNode)),l.parentNode.insertBefore(a,l)),l.parentNode.removeChild(l),this.reverts.push((function(){s===c.previousSibling&&s.parentNode.removeChild(s),a===c.nextSibling&&a.parentNode.removeChild(a),c.parentNode&&c.parentNode.replaceChild(l,c)})),c}s=e.createTextNode(o.data.substring(0,n.indexInNode)),a=e.createTextNode(d.data.substring(i.endIndexInNode));for(var h=this.getPortionReplacementNode(n,t),u=[],p=0,f=r.length;p<f;++p){var g=r[p],T=this.getPortionReplacementNode(g,t);g.node.parentNode.replaceChild(T,g.node),this.reverts.push(function(e,t){return function(){t.parentNode.replaceChild(e.node,t)}}(g,T)),u.push(T)}var x=this.getPortionReplacementNode(i,t);return o.parentNode.insertBefore(s,o),o.parentNode.insertBefore(h,o),o.parentNode.removeChild(o),d.parentNode.insertBefore(x,d),d.parentNode.insertBefore(a,d),d.parentNode.removeChild(d),this.reverts.push((function(){s.parentNode.removeChild(s),h.parentNode.replaceChild(o,h),a.parentNode.removeChild(a),x.parentNode.replaceChild(d,x)})),x}},n},e.exports?e.exports=s():void 0===(i="function"==typeof(r=s)?r.call(t,n,t,e):r)||(e.exports=i)},1842:function(e,t,n){"use strict";n.r(t);var r=n(1388),i=n.n(r);const s=0,a=6;function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"default",(function(){return T}));const d=["A","ARTICLE","ASIDE","B","BLOCKQUOTE","BODY","BR","CAPTION","CITE","COL","DD","DIV","DT","EM","FIGCAPTION","FONT","H1","H2","H3","H4","H5","H6","I","IMG","LABEL","LI","OPTGROUP","P","PRE","RUBY","RB","RT","SPAN","STRONG","SUB","SUMMARY","TBODY","TD","TFOOT","TH","THEAD","TITLE","TR","TSPAN","#TEXT"],l=["TITLE"],c=1,h=2,u=4,p=8,f=16,g=32;class T{constructor(){o(this,"setServerForTesting",e=>{this.startServerConnectFunction_=e}),o(this,"setDocumentForTesting",e=>{this.document_=e}),o(this,"setMaxTextLenForTesting",e=>{this.maxTextLength_=e}),this.error_=!1,this.errorCode_=s,this.sourceLang_="en",this.targetLang_="",this.document_=document,this.maxTextLength_=1500,this.startServerConnectFunction_=this.startServerConnect.bind(this),this.resetData(),window.addEventListener("scroll",this.continueTranslateInternal.bind(this))}get isTranslated(){return this.isTranslated_}get error(){return this.error_}get errorCode(){return this.errorCode_}get sourceLang(){return this.sourceLang_}startTranslate(e,t){return this.isTranslated_&&this.revert(),this.targetLang_=t,this.startTranslateInternal(e,t,!0)}revert(){this.revertInternal()}translationTime(){return Math.round(100*(this.endTime_-this.startTime_))/100}isElementVisible(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)}isElementPartiallyInViewport(e,t){const n=e.getBoundingClientRect();let r=!0;t&&(r=this.isElementVisible(e));const i=n.top-200,s=n.height+400,a=window.innerHeight||this.document_.documentElement.clientHeight,o=window.innerWidth||this.document_.documentElement.clientWidth,d=i<=a&&i+s>=0,l=n.left<=o&&n.left+n.width>=0;return d&&l&&r}trimWhitespace(e){return e=(e=e.trim().replaceAll(/[\r\n\u0085\u2028\u2029]+/g,"")).replace(/ {2,}/g," "),this.trimEntities(e)}trimEntities(e){return(e=(e=e.replaceAll("­","")).replaceAll("&nbsp;"," ")).replaceAll("&amp;","&")}convertSpecialSequences(e){return(e=e.replaceAll("&nbsp;",String.fromCharCode(160))).replaceAll("&amp;",String.fromCharCode(38))}processNodes(e,t=!1){function n(e){let t=e.innerHTML;if(!t)return"";t=function(e){for(let t=0;t<50;t++){const t=e.indexOf("\x3c!--");if(!(t>-1))break;{const n=e.indexOf("--\x3e",t);e=e.replace(e.substring(t,n+3),"")}}return e}(t);const n=t.indexOf("<");let r;return r=n>-1?t.substr(0,n):t,r}const r=this.filterUntranslatedNodes(e,t),i=[];for(let e=0;e<r.length;e++){const t=r[e],s=[],a=[];switch(t.nodeName){default:s[0]=n(t),a[0]=t;break;case"A":case"B":case"DIV":case"EM":case"I":case"RUBY":case"STRONG":case"SPAN":s[0]=n(t),a[0]=t,t.nextSibling&&this.isSupportedElement(t.nextSibling)&&(s[1]=t.nextSibling.nodeValue,a[1]=t.nextSibling);break;case"IMG":case"BR":t.nextSibling&&this.isSupportedElement(t.nextSibling)&&(s[0]=t.nextSibling.nodeValue,a[0]=t.nextSibling)}s.length||this.translatedNodes_.add(t);for(let e=0;e<s.length;e++)if(s[e])if(s[e].length>this.maxTextLength_){const t=this.splitLines(s[e],this.maxTextLength_);for(let n=0;n<t.length;n++)a[e]&&this.addTextLine(t[n],a[e],i)}else s[e].length>1?a[e]&&this.addTextLine(s[e],a[e],i):a[e]&&this.translatedNodes_.add(a[e])}return i}splitLines(e,t){const n=[];let r=0,i=t;for(;;){const t=e.indexOf(".",i);if(!(t>-1)){n.push(e.substr(r));break}{const s=e.substr(r,t-r+1);r+=s.length,i=t+1,n.push(s)}}return n}verifyTextLine(e){if(e.length>1)for(let t=0;t<e.length;t++)if("?"!==e[t]&&"!"!==e[t]&&"."!==e[t])return!0;return!1}addTextLine(e,t,n){let r=0;r=this.detectWhiteSpaces(e);const i={originalText:this.trimWhitespace(e),originalTextRaw:e,node:t,translatedText:"",strippedBits:r};this.verifyTextLine(i.originalText)?n.push(i):this.translatedNodes_.add(i.node)}generateJSON(e,t,n){const r={source:e||"",target:t||"en",q:n.map(e=>e.originalText)};return JSON.stringify(r)}startServerConnect(e,t,n,r){const i=n.translateElements;0!==i.length&&(this.startTime_=n.startTime=performance.now(),fetch("https://mimir.vivaldi.com/translate",{method:"POST",headers:{Accept:"application/json","Content-type":"application/json"},body:this.generateJSON(e,t,i)}).then((function(e){return e.status>=200&&e.status<300?Promise.resolve(e):Promise.reject(new Error(e.statusText))})).then((function(e){return e.json()})).then(e=>{this.error_=!1,this.errorCode_=s,this.sourceLang_=e.detectedSourceLanguage,this.isTranslated_=!0,this.endTime_=n.endTime=performance.now(),r(e),n.firstTranslate&&this.continueTranslateInternal()}).catch(e=>{console.log("Request failed: ",e),this.error_=!0,this.errorCode_=a,this.isTranslated_=!1,r()}))}detectWhiteSpaces(e){let t=0;switch(e[0]){case" ":t|=c;break;case",":t|=f;break;case".":t|=g;break;case String.fromCharCode(160):t|=u}switch(e[e.length-1]){case" ":t|=h;break;case String.fromCharCode(160):t|=p}return t}restoreWhiteSpaces(e,t){return e&c&&" "!==t[0]&&(t=" "+t),e&h&&" "!==t[t.length-1]&&(t+=" "),e&u&&t[0]!==String.fromCharCode(160)&&(t=String.fromCharCode(160)+t),e&p&&t[t.length-1]!==String.fromCharCode(160)&&(t+=String.fromCharCode(160)),e&f&&","!==t[0]&&(t=", "+t),e&g&&"."!==t[t.length-1]&&(t=". "+t),t}handleTranslationText(e,t,n){for(let r=0;r<e.length;r++)if(e[r].originalText===t){e[r].translatedText=n;let t=e[r].node;t&&t.isConnected||(t=this.document_.documentElement),n=this.restoreWhiteSpaces(e[r].strippedBits,n);const s=i()(t,{find:this.convertSpecialSequences(e[r].originalTextRaw),replace:n,preset:"prose"});s&&this.findTextInstances.push(s)}}isSupportedElement(e){const t=e.nodeName.toUpperCase();return!(!l.includes(t)&&!d.includes(t))}filterUntranslatedNodes(e,t){let n;const r=Array.from(e);let i=[];if(i=r.filter(e=>!this.translatedNodes_.has(e)&&(!!this.isSupportedElement(e)&&(!!this.isElementPartiallyInViewport(e,t)&&(n=e,!0)))),i.length<20&&n){let e=!1,t=20-i.length;r.filter(r=>{if(e||n!==r||(e=!0),e&&t>-1)return!i.includes(r)&&(!this.translatedNodes_.has(r)&&(!!this.isSupportedElement(r)&&(t--,!0)))}).forEach(e=>{i.push(e)})}return i}resetData(){this.isTranslated_=!1,this.translatedNodes_=new Set,this.findTextInstances=[],this.startTime_=0,this.endTime_=0}revertInternal(){this.findTextInstances.length>0&&window.requestAnimationFrame(()=>{for(let e=0;e<this.findTextInstances.length;e++)this.findTextInstances[e].revert();this.resetData()})}continueTranslateInternal(){this.isTranslated_&&window.requestIdleCallback(this.startTranslateInternal.bind(this,this.sourceLang_,this.targetLang_,!1),{timeout:100})}startTranslateInternal(e,t,n){const r=this.document_.getElementsByTagName("*"),i=this.processNodes(r,n);this.sourceLang_=e,i.forEach(e=>{e.node&&this.translatedNodes_.add(e.node)});const s={translateElements:i,startTime:0,endTime:0,firstTranslate:n};return this.startServerConnectFunction_(e,t,s,e=>{e&&e.translatedText&&(e.detectedSourceLanguage===t?console.warn("Translate: Detected source language '"+e.detectedSourceLanguage+"' identical to target language '"+t+"', not doing text replacement."):window.requestAnimationFrame(()=>{const t=performance.now();for(let t=0;t<e.translatedText.length;t++)this.handleTranslationText(i,e.sourceText[t],e.translatedText[t]);const n=performance.now();console.log("Translate server request of "+s.translateElements.length.toString()+" texts took "+(s.endTime-s.startTime).toFixed(2)+" ms, processing: "+(n-t).toFixed(2)+" ms.")}))}),!0}}window.vivaldiTranslate||(window.vivaldiTranslate=new T);const x={googleTranslate:{get translationTime(){return window.vivaldiTranslate.translationTime()},get readyTime(){return 0},get loadTime(){return 0}}};window.cr=x}});