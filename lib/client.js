window.__ModuleLoader__.load({
	id: "dsh-inline-diff",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region vendored highlight.js 11 (core + lib/common, ~36 languages,
		// plus the highlight.svelte grammar; token colors live in the stylesheet
		// region below). Rebuild with:
		//   esbuild --bundle --minify --format=iife --global-name=didHljsVendor
		//     - entry:
		//       import hljs from "highlight.js/lib/common";
		//       import svelte from "highlight.svelte";
		//       hljs.registerLanguage("svelte", svelte);
		//       export default hljs;
var didHljsVendor=(()=>{var bi=Object.create;var Se=Object.defineProperty;var pi=Object.getOwnPropertyDescriptor;var _i=Object.getOwnPropertyNames;var mi=Object.getPrototypeOf,Ei=Object.prototype.hasOwnProperty;var R=(e,n)=>()=>{try{return n||e((n={exports:{}}).exports,n),n.exports}catch(t){throw n=0,t}},fi=(e,n)=>{for(var t in n)Se(e,t,{get:n[t],enumerable:!0})},je=(e,n,t,i)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of _i(n))!Ei.call(e,o)&&o!==t&&Se(e,o,{get:()=>n[o],enumerable:!(i=pi(n,o))||i.enumerable});return e};var hi=(e,n,t)=>(t=e!=null?bi(mi(e)):{},je(n||!e||!e.__esModule?Se(t,"default",{value:e,enumerable:!0}):t,e)),Ni=e=>je(Se({},"__esModule",{value:!0}),e);var Nn=R((Ir,hn)=>{function sn(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(n=>{let t=e[n],i=typeof t;(i==="object"||i==="function")&&!Object.isFrozen(t)&&sn(t)}),e}var we=class{constructor(n){n.data===void 0&&(n.data={}),this.data=n.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function cn(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function re(e,...n){let t=Object.create(null);for(let i in e)t[i]=e[i];return n.forEach(function(i){for(let o in i)t[o]=i[o]}),t}var yi="</span>",en=e=>!!e.scope,Ti=(e,{prefix:n})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){let t=e.split(".");return[`${n}${t.shift()}`,...t.map((i,o)=>`${i}${"_".repeat(o+1)}`)].join(" ")}return`${n}${e}`},Ke=class{constructor(n,t){this.buffer="",this.classPrefix=t.classPrefix,n.walk(this)}addText(n){this.buffer+=cn(n)}openNode(n){if(!en(n))return;let t=Ti(n.scope,{prefix:this.classPrefix});this.span(t)}closeNode(n){en(n)&&(this.buffer+=yi)}value(){return this.buffer}span(n){this.buffer+=`<span class="${n}">`}},nn=(e={})=>{let n={children:[]};return Object.assign(n,e),n},He=class e{constructor(){this.rootNode=nn(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(n){this.top.children.push(n)}openNode(n){let t=nn({scope:n});this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(n){return this.constructor._walk(n,this.rootNode)}static _walk(n,t){return typeof t=="string"?n.addText(t):t.children&&(n.openNode(t),t.children.forEach(i=>this._walk(n,i)),n.closeNode(t)),n}static _collapse(n){typeof n!="string"&&n.children&&(n.children.every(t=>typeof t=="string")?n.children=[n.children.join("")]:n.children.forEach(t=>{e._collapse(t)}))}},qe=class extends He{constructor(n){super(),this.options=n}addText(n){n!==""&&this.add(n)}startScope(n){this.openNode(n)}endScope(){this.closeNode()}__addSublanguage(n,t){let i=n.root;t&&(i.scope=`language:${t}`),this.add(i)}toHTML(){return new Ke(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function me(e){return e?typeof e=="string"?e:e.source:null}function ln(e){return ce("(?=",e,")")}function Si(e){return ce("(?:",e,")*")}function Oi(e){return ce("(?:",e,")?")}function ce(...e){return e.map(t=>me(t)).join("")}function wi(e){let n=e[e.length-1];return typeof n=="object"&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}function Ae(...e){return"("+(wi(e).capture?"":"?:")+e.map(i=>me(i)).join("|")+")"}function dn(e){return new RegExp(e.toString()+"|").exec("").length-1}function vi(e,n){let t=e&&e.exec(n);return t&&t.index===0}var Ai=new RegExp(Ae(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function Ye(e,{joinWith:n}){let t=0;return e.map(i=>{t+=1;let o=t,u=me(i),r="";for(;u.length>0;){let a=Ai.exec(u);if(!a){r+=u;break}r+=u.substring(0,a.index),u=u.substring(a.index+a[0].length),a[0][0]==="\\"&&a[1]?r+="\\"+String(Number(a[1])+o):(r+=a[0],(a[0]==="("||/^\(\?[<']/.test(a[0]))&&t++)}return r}).map(i=>`(${i})`).join(n)}var Ri=/\b\B/,un="[a-zA-Z]\\w*",Ze="[a-zA-Z_]\\w*",gn="\\b\\d+(\\.\\d+)?",bn="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",pn="\\b(0b[01]+)",Mi="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",ki=(e={})=>{let n=/^#![ ]*\//;return e.binary&&(e.begin=ce(n,/.*\b/,e.binary,/\b.*/)),re({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(t,i)=>{t.index!==0&&i.ignoreMatch()}},e)},Ee={begin:"\\\\[\\s\\S]",relevance:0},xi={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[Ee]},Ci={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[Ee]},Ii={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},Re=function(e,n,t={}){let i=re({scope:"comment",begin:e,end:n,contains:[]},t);i.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let o=Ae("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return i.contains.push({begin:ce(/[ ]+/,"(",o,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),i},Li=Re("//","$"),Di=Re("/\\*","\\*/"),Bi=Re("#","$"),Ui={scope:"number",begin:gn,relevance:0},Pi={scope:"number",begin:bn,relevance:0},Fi={scope:"number",begin:pn,relevance:0},zi={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[Ee,{begin:/\[/,end:/\]/,relevance:0,contains:[Ee]}]},$i={scope:"title",begin:un,relevance:0},Gi={scope:"title",begin:Ze,relevance:0},Ki={begin:"\\.\\s*"+Ze,relevance:0},Hi=function(e){return Object.assign(e,{"on:begin":(n,t)=>{t.data._beginMatch=n[1]},"on:end":(n,t)=>{t.data._beginMatch!==n[1]&&t.ignoreMatch()}})},Oe=Object.freeze({__proto__:null,APOS_STRING_MODE:xi,BACKSLASH_ESCAPE:Ee,BINARY_NUMBER_MODE:Fi,BINARY_NUMBER_RE:pn,COMMENT:Re,C_BLOCK_COMMENT_MODE:Di,C_LINE_COMMENT_MODE:Li,C_NUMBER_MODE:Pi,C_NUMBER_RE:bn,END_SAME_AS_BEGIN:Hi,HASH_COMMENT_MODE:Bi,IDENT_RE:un,MATCH_NOTHING_RE:Ri,METHOD_GUARD:Ki,NUMBER_MODE:Ui,NUMBER_RE:gn,PHRASAL_WORDS_MODE:Ii,QUOTE_STRING_MODE:Ci,REGEXP_MODE:zi,RE_STARTERS_RE:Mi,SHEBANG:ki,TITLE_MODE:$i,UNDERSCORE_IDENT_RE:Ze,UNDERSCORE_TITLE_MODE:Gi});function qi(e,n){e.input[e.index-1]==="."&&n.ignoreMatch()}function Wi(e,n){e.className!==void 0&&(e.scope=e.className,delete e.className)}function Yi(e,n){n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=qi,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function Zi(e,n){Array.isArray(e.illegal)&&(e.illegal=Ae(...e.illegal))}function Xi(e,n){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function Vi(e,n){e.relevance===void 0&&(e.relevance=1)}var Qi=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");let t=Object.assign({},e);Object.keys(e).forEach(i=>{delete e[i]}),e.keywords=t.keywords,e.begin=ce(t.beforeMatch,ln(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},Ji=["of","and","for","in","not","or","if","then","parent","list","value"],ji="keyword";function _n(e,n,t=ji){let i=Object.create(null);return typeof e=="string"?o(t,e.split(" ")):Array.isArray(e)?o(t,e):Object.keys(e).forEach(function(u){Object.assign(i,_n(e[u],n,u))}),i;function o(u,r){n&&(r=r.map(a=>a.toLowerCase())),r.forEach(function(a){let s=a.split("|");i[s[0]]=[u,ea(s[0],s[1])]})}}function ea(e,n){return n?Number(n):na(e)?0:1}function na(e){return Ji.includes(e.toLowerCase())}var tn={},se=e=>{console.error(e)},an=(e,...n)=>{console.log(`WARN: ${e}`,...n)},ue=(e,n)=>{tn[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),tn[`${e}/${n}`]=!0)},ve=new Error;function mn(e,n,{key:t}){let i=0,o=e[t],u={},r={};for(let a=1;a<=n.length;a++)r[a+i]=o[a],u[a+i]=!0,i+=dn(n[a-1]);e[t]=r,e[t]._emit=u,e[t]._multi=!0}function ta(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw se("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),ve;if(typeof e.beginScope!="object"||e.beginScope===null)throw se("beginScope must be object"),ve;mn(e,e.begin,{key:"beginScope"}),e.begin=Ye(e.begin,{joinWith:""})}}function ia(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw se("skip, excludeEnd, returnEnd not compatible with endScope: {}"),ve;if(typeof e.endScope!="object"||e.endScope===null)throw se("endScope must be object"),ve;mn(e,e.end,{key:"endScope"}),e.end=Ye(e.end,{joinWith:""})}}function aa(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function ra(e){aa(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),ta(e),ia(e)}function oa(e){function n(r,a){return new RegExp(me(r),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(a?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(a,s){s.position=this.position++,this.matchIndexes[this.matchAt]=s,this.regexes.push([s,a]),this.matchAt+=dn(a)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let a=this.regexes.map(s=>s[1]);this.matcherRe=n(Ye(a,{joinWith:"|"}),!0),this.lastIndex=0}exec(a){this.matcherRe.lastIndex=this.lastIndex;let s=this.matcherRe.exec(a);if(!s)return null;let c=s.findIndex((E,b)=>b>0&&E!==void 0),d=this.matchIndexes[c];return s.splice(0,c),Object.assign(s,d)}}class i{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(a){if(this.multiRegexes[a])return this.multiRegexes[a];let s=new t;return this.rules.slice(a).forEach(([c,d])=>s.addRule(c,d)),s.compile(),this.multiRegexes[a]=s,s}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(a,s){this.rules.push([a,s]),s.type==="begin"&&this.count++}exec(a){let s=this.getMatcher(this.regexIndex);s.lastIndex=this.lastIndex;let c=s.exec(a);if(this.resumingScanAtSamePosition()&&!(c&&c.index===this.lastIndex)){let d=this.getMatcher(0);d.lastIndex=this.lastIndex+1,c=d.exec(a)}return c&&(this.regexIndex+=c.position+1,this.regexIndex===this.count&&this.considerAll()),c}}function o(r){let a=new i;return r.contains.forEach(s=>a.addRule(s.begin,{rule:s,type:"begin"})),r.terminatorEnd&&a.addRule(r.terminatorEnd,{type:"end"}),r.illegal&&a.addRule(r.illegal,{type:"illegal"}),a}function u(r,a){let s=r;if(r.isCompiled)return s;[Wi,Xi,ra,Qi].forEach(d=>d(r,a)),e.compilerExtensions.forEach(d=>d(r,a)),r.__beforeBegin=null,[Yi,Zi,Vi].forEach(d=>d(r,a)),r.isCompiled=!0;let c=null;return typeof r.keywords=="object"&&r.keywords.$pattern&&(r.keywords=Object.assign({},r.keywords),c=r.keywords.$pattern,delete r.keywords.$pattern),c=c||/\w+/,r.keywords&&(r.keywords=_n(r.keywords,e.case_insensitive)),s.keywordPatternRe=n(c,!0),a&&(r.begin||(r.begin=/\B|\b/),s.beginRe=n(s.begin),!r.end&&!r.endsWithParent&&(r.end=/\B|\b/),r.end&&(s.endRe=n(s.end)),s.terminatorEnd=me(s.end)||"",r.endsWithParent&&a.terminatorEnd&&(s.terminatorEnd+=(r.end?"|":"")+a.terminatorEnd)),r.illegal&&(s.illegalRe=n(r.illegal)),r.contains||(r.contains=[]),r.contains=[].concat(...r.contains.map(function(d){return sa(d==="self"?r:d)})),r.contains.forEach(function(d){u(d,s)}),r.starts&&u(r.starts,a),s.matcher=o(s),s}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=re(e.classNameAliases||{}),u(e)}function En(e){return e?e.endsWithParent||En(e.starts):!1}function sa(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(n){return re(e,{variants:null},n)})),e.cachedVariants?e.cachedVariants:En(e)?re(e,{starts:e.starts?re(e.starts):null}):Object.isFrozen(e)?re(e):e}var ca="11.12.0",We=class extends Error{constructor(n,t){super(n),this.name="HTMLInjectionError",this.html=t}},Ge=cn,rn=re,on=Symbol("nomatch"),la=7,fn=function(e){let n=Object.create(null),t=Object.create(null),i=[],o=!0,u="Could not find the language '{}', did you forget to load/include a language module?",r={disableAutodetect:!0,name:"Plain text",contains:[]},a={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:qe};function s(l){return a.noHighlightRe.test(l)}function c(l){let _=l.className+" ";_+=l.parentNode?l.parentNode.className:"";let m=a.languageDetectRe.exec(_);if(m){let O=D(m[1]);return O||(an(u.replace("{}",m[1])),an("Falling back to no-highlight mode for this block.",l)),O?m[1]:"no-highlight"}return _.split(/\s+/).find(O=>s(O)||D(O))}function d(l,_,m){let O="",C="";typeof _=="object"?(O=l,m=_.ignoreIllegals,C=_.language):(ue("10.7.0","highlight(lang, code, ...args) has been deprecated."),ue("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),C=l,O=_),m===void 0&&(m=!0);let z={code:O,language:C};K("before:highlight",z);let G=z.result?z.result:E(z.language,z.code,m);return G.code=z.code,K("after:highlight",G),G}function E(l,_,m,O){let C=Object.create(null);function z(g,f){return g.keywords[f]}function G(){if(!y.keywords){q.addText($);return}let g=0;y.keywordPatternRe.lastIndex=0;let f=y.keywordPatternRe.exec($),A="";for(;f;){A+=$.substring(g,f.index);let B=ee.case_insensitive?f[0].toLowerCase():f[0],Y=z(y,B);if(Y){let[ie,ui]=Y;if(q.addText(A),A="",C[B]=(C[B]||0)+1,C[B]<=la&&(Te+=ui),ie.startsWith("_"))A+=f[0];else{let gi=ee.classNameAliases[ie]||ie;V(f[0],gi)}}else A+=f[0];g=y.keywordPatternRe.lastIndex,f=y.keywordPatternRe.exec($)}A+=$.substring(g),q.addText(A)}function j(){if($==="")return;let g=null;if(typeof y.subLanguage=="string"){if(!n[y.subLanguage]){q.addText($);return}g=E(y.subLanguage,$,!0,ye[y.subLanguage]),ye[y.subLanguage]=g._top}else g=p($,y.subLanguage.length?y.subLanguage:null);y.relevance>0&&(Te+=g.relevance),q.__addSublanguage(g._emitter,g.language)}function X(){y.subLanguage!=null?j():G(),$=""}function V(g,f){g!==""&&(q.startScope(f),q.addText(g),q.endScope())}function le(g,f){let A=1,B=f.length-1;for(;A<=B;){if(!g._emit[A]){A++;continue}let Y=ee.classNameAliases[g[A]]||g[A],ie=f[A];Y?V(ie,Y):($=ie,G(),$=""),A++}}function he(g,f){return g.scope&&typeof g.scope=="string"&&q.openNode(ee.classNameAliases[g.scope]||g.scope),g.beginScope&&(g.beginScope._wrap?(V($,ee.classNameAliases[g.beginScope._wrap]||g.beginScope._wrap),$=""):g.beginScope._multi&&(le(g.beginScope,f),$="")),y=Object.create(g,{parent:{value:y}}),y}function _e(g,f,A){let B=vi(g.endRe,A);if(B){if(g["on:end"]){let Y=new we(g);g["on:end"](f,Y),Y.isMatchIgnored&&(B=!1)}if(B){for(;g.endsParent&&g.parent;)g=g.parent;return g}}if(g.endsWithParent)return _e(g.parent,f,A)}function Be(g){return y.matcher.regexIndex===0?($+=g[0],1):($e=!0,0)}function Ue(g){let f=g[0],A=g.rule,B=new we(A),Y=[A.__beforeBegin,A["on:begin"]];for(let ie of Y)if(ie&&(ie(g,B),B.isMatchIgnored))return Be(f);return A.skip?$+=f:(A.excludeBegin&&($+=f),X(),!A.returnBegin&&!A.excludeBegin&&($=f)),he(A,g),A.returnBegin?0:f.length}function Pe(g){let f=g[0],A=_.substring(g.index),B=_e(y,g,A);if(!B)return on;let Y=y;y.endScope&&y.endScope._wrap?(X(),V(f,y.endScope._wrap)):y.endScope&&y.endScope._multi?(X(),le(y.endScope,g)):Y.skip?$+=f:(Y.returnEnd||Y.excludeEnd||($+=f),X(),Y.excludeEnd&&($=f));do y.scope&&q.closeNode(),!y.skip&&!y.subLanguage&&(Te+=y.relevance),y=y.parent;while(y!==B.parent);return B.starts&&he(B.starts,g),Y.returnEnd?0:f.length}function Fe(){let g=[];for(let f=y;f!==ee;f=f.parent)f.scope&&g.unshift(f.scope);g.forEach(f=>q.openNode(f))}let de={};function Ne(g,f){let A=f&&f[0];if($+=g,A==null)return X(),0;if(de.type==="begin"&&f.type==="end"&&de.index===f.index&&A===""){if($+=_.slice(f.index,f.index+1),!o){let B=new Error(`0 width match regex (${l})`);throw B.languageName=l,B.badRule=de.rule,B}return 1}if(de=f,f.type==="begin")return Ue(f);if(f.type==="illegal"&&!m){let B=new Error('Illegal lexeme "'+A+'" for mode "'+(y.scope||"<unnamed>")+'"');throw B.mode=y,B}else if(f.type==="end"){let B=Pe(f);if(B!==on)return B}if(f.type==="illegal"&&A==="")return f.index===_.length||($+=`
`),1;if(ze>1e5&&ze>f.index*3)throw new Error("potential infinite loop, way more iterations than matches");return $+=A,A.length}let ee=D(l);if(!ee)throw se(u.replace("{}",l)),new Error('Unknown language: "'+l+'"');let P=oa(ee),ae="",y=O||P,ye={},q=new a.__emitter(a);Fe();let $="",Te=0,oe=0,ze=0,$e=!1;try{if(ee.__emitTokens)ee.__emitTokens(_,q);else{for(y.matcher.considerAll();;){ze++,$e?$e=!1:y.matcher.considerAll(),y.matcher.lastIndex=oe;let g=y.matcher.exec(_);if(!g)break;let f=_.substring(oe,g.index),A=Ne(f,g);oe=g.index+A}Ne(_.substring(oe))}return q.finalize(),ae=q.toHTML(),{language:l,value:ae,relevance:Te,illegal:!1,_emitter:q,_top:y}}catch(g){if(g.message&&g.message.includes("Illegal"))return{language:l,value:Ge(_),illegal:!0,relevance:0,_illegalBy:{message:g.message,index:oe,context:_.slice(oe-100,oe+100),mode:g.mode,resultSoFar:ae},_emitter:q};if(o)return{language:l,value:Ge(_),illegal:!1,relevance:0,errorRaised:g,_emitter:q,_top:y};throw g}}function b(l){let _={value:Ge(l),illegal:!1,relevance:0,_top:r,_emitter:new a.__emitter(a)};return _._emitter.addText(l),_}function p(l,_){_=_||a.languages||Object.keys(n);let m=b(l),O=_.filter(D).filter(W).map(X=>E(X,l,!1));O.unshift(m);let C=O.sort((X,V)=>{if(X.relevance!==V.relevance)return V.relevance-X.relevance;if(X.language&&V.language){if(D(X.language).supersetOf===V.language)return 1;if(D(V.language).supersetOf===X.language)return-1}return 0}),[z,G]=C,j=z;return j.secondBest=G,j}function N(l,_,m){let O=_&&t[_]||m;l.classList.add("hljs"),l.classList.add(`language-${O}`)}function h(l){let _=null,m=c(l);if(s(m))return;if(K("before:highlightElement",{el:l,language:m}),l.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",l);return}if(l.children.length>0&&(a.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(l)),a.throwUnescapedHTML))throw new We("One of your code blocks includes unescaped HTML.",l.innerHTML);_=l;let O=_.textContent,C=m?d(O,{language:m,ignoreIllegals:!0}):p(O);l.innerHTML=C.value,l.dataset.highlighted="yes",N(l,m,C.language),l.result={language:C.language,re:C.relevance,relevance:C.relevance},C.secondBest&&(l.secondBest={language:C.secondBest.language,relevance:C.secondBest.relevance}),K("after:highlightElement",{el:l,result:C,text:O})}function S(l){a=rn(a,l)}let T=()=>{v(),ue("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function x(){v(),ue("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let I=!1;function v(){function l(){v()}if(document.readyState==="loading"){I||window.addEventListener("DOMContentLoaded",l,!1),I=!0;return}document.querySelectorAll(a.cssSelector).forEach(h)}function M(l,_){let m=null;try{m=_(e)}catch(O){if(se("Language definition for '{}' could not be registered.".replace("{}",l)),o)se(O);else throw O;m=r}m.name||(m.name=l),n[l]=m,m.rawDefinition=_.bind(null,e),m.aliases&&U(m.aliases,{languageName:l})}function k(l){delete n[l];for(let _ of Object.keys(t))t[_]===l&&delete t[_]}function L(){return Object.keys(n)}function D(l){return l=(l||"").toLowerCase(),n[l]||n[t[l]]}function U(l,{languageName:_}){typeof l=="string"&&(l=[l]),l.forEach(m=>{t[m.toLowerCase()]=_})}function W(l){let _=D(l);return _&&!_.disableAutodetect}function Q(l){l["before:highlightBlock"]&&!l["before:highlightElement"]&&(l["before:highlightElement"]=_=>{l["before:highlightBlock"](Object.assign({block:_.el},_))}),l["after:highlightBlock"]&&!l["after:highlightElement"]&&(l["after:highlightElement"]=_=>{l["after:highlightBlock"](Object.assign({block:_.el},_))})}function J(l){Q(l),i.push(l)}function ne(l){let _=i.indexOf(l);_!==-1&&i.splice(_,1)}function K(l,_){let m=l;i.forEach(function(O){O[m]&&O[m](_)})}function H(l){return ue("10.7.0","highlightBlock will be removed entirely in v12.0"),ue("10.7.0","Please use highlightElement now."),h(l)}Object.assign(e,{highlight:d,highlightAuto:p,highlightAll:v,highlightElement:h,highlightBlock:H,configure:S,initHighlighting:T,initHighlightingOnLoad:x,registerLanguage:M,unregisterLanguage:k,listLanguages:L,getLanguage:D,registerAliases:U,autoDetection:W,inherit:rn,addPlugin:J,removePlugin:ne}),e.debugMode=function(){o=!1},e.safeMode=function(){o=!0},e.versionString=ca,e.regex={concat:ce,lookahead:ln,either:Ae,optional:Oi,anyNumberOfTimes:Si};for(let l in Oe)typeof Oe[l]=="object"&&sn(Oe[l]);return Object.assign(e,Oe),e},ge=fn({});ge.newInstance=()=>fn({});hn.exports=ge;ge.HighlightJS=ge;ge.default=ge});var Tn=R((Lr,yn)=>{function da(e){let n=e.regex,t=n.concat(/[\p{L}_]/u,n.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),i=/[\p{L}0-9._:-]+/u,o={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},u={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},r=e.inherit(u,{begin:/\(/,end:/\)/}),a=e.inherit(e.APOS_STRING_MODE,{className:"string"}),s=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),c={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:i,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[o]},{begin:/'/,end:/'/,contains:[o]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[u,s,a,r,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[u,r,s,a]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},o,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[s]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[c],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:"css"}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[c],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:"javascript"}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:n.concat(/</,n.lookahead(n.concat(t,n.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:t,relevance:0,starts:c}]},{className:"tag",begin:n.concat(/<\//,n.lookahead(n.concat(t,/>/))),contains:[{className:"name",begin:t,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}yn.exports=da});var On=R((Dr,Sn)=>{function ua(e){let n=e.regex,t={},i={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[t]}]};Object.assign(t,{className:"variable",variants:[{begin:n.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},i]});let o={className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]},u=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),r={begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},a={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,t,o]};o.contains.push(a);let s={match:/\\"/},c={className:"string",begin:/'/,end:/'/},d={match:/\\'/},E={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,t]},b=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],p=e.SHEBANG({binary:`(${b.join("|")})`,relevance:10}),N={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},h=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],S=["true","false"],T={match:/(\/[a-z._-]+)+/},x=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],I=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],v=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],M=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:h,literal:S,built_in:[...x,...I,"set","shopt",...v,...M]},contains:[p,e.SHEBANG(),N,E,u,r,T,a,s,c,d,t]}}Sn.exports=ua});var vn=R((Br,wn)=>{function ga(e){let n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),i="decltype\\(auto\\)",o="[a-zA-Z_]\\w*::",r="("+i+"|"+n.optional(o)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",a=n.concat(/\batomic_/,n.either("bool","char","schar","uchar","short","ushort","int","uint","long","ulong","llong","ullong","char16_t","char32_t","wchar_t","int_least8_t","uint_least8_t","int_least16_t","uint_least16_t","int_least32_t","uint_least32_t","int_least64_t","uint_least64_t","int_fast8_t","uint_fast8_t","int_fast16_t","uint_fast16_t","int_fast32_t","uint_fast32_t","int_fast64_t","uint_fast64_t","intptr_t","uintptr_t","size_t","ptrdiff_t","intmax_t","uintmax_t"),/\b/),s={className:"type",variants:[{begin:"\\b[a-z\\d_]*_t\\b"},{match:a}]},d={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\\s"]{0,16})\(/,end:/\)([^()\\\s"]{0,16})"/})]},E={className:"number",variants:[{match:/\b(0b[01']+)/},{match:/(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/},{match:/(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/},{match:/(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/}],relevance:0},b={scope:"meta",begin:/#\s*include\b/,end:/$/,keywords:{keyword:"include"},contains:[{begin:/\\\n/},d,{scope:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},p={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(d,{className:"string"}),t,e.C_BLOCK_COMMENT_MODE]},N=[b,p],h={className:"title",begin:n.optional(o)+e.IDENT_RE,relevance:0},S=n.optional(o)+e.IDENT_RE+"\\s*\\(",T=12,v={keyword:["asm","auto","break","case","continue","default","do","else","enum","extern","for","fortran","goto","if","inline","register","restrict","return","sizeof","typeof","typeof_unqual","struct","switch","typedef","union","volatile","while","_Alignas","_Alignof","_Atomic","_Generic","_Noreturn","_Static_assert","_Thread_local","alignas","alignof","noreturn","static_assert","thread_local","_Pragma"],type:["float","double","signed","unsigned","int","short","long","char","void","_Bool","_BitInt","_Complex","_Imaginary","_Decimal32","_Decimal64","_Decimal96","_Decimal128","_Decimal64x","_Decimal128x","_Float16","_Float32","_Float64","_Float128","_Float32x","_Float64x","_Float128x","const","static","constexpr","complex","bool","imaginary"],literal:"true false NULL",built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"},M=[...N,s,t,e.C_BLOCK_COMMENT_MODE,E,d],k={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:v,contains:M.concat([{begin:/\(/,end:/\)/,keywords:v,contains:M.concat(["self"]),relevance:0}]),relevance:0},L={begin:"("+r+"[\\*&\\s]+){1,"+T+"}"+S,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:v,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:i,keywords:v,relevance:0},{begin:S,returnBegin:!0,contains:[e.inherit(h,{className:"title.function"})],relevance:0},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:v,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,d,E,s,{begin:/\(/,end:/\)/,keywords:v,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,d,E,s]}]},s,t,e.C_BLOCK_COMMENT_MODE,...N]};return{name:"C",aliases:["h"],keywords:v,disableAutodetect:!0,illegal:"</",contains:[].concat(k,L,M,[...N,{begin:e.IDENT_RE+"::",keywords:v},{className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,contains:[{beginKeywords:"final class struct"},e.TITLE_MODE]}]),exports:{preprocessor:p,strings:d,keywords:v}}}wn.exports=ga});var Rn=R((Ur,An)=>{function ba(e){let n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),i="decltype\\(auto\\)",o="[a-zA-Z_]\\w*::",r="(?!struct)("+i+"|"+n.optional(o)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",a={className:"type",begin:"\\b[a-z\\d_]*_t\\b"},c={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\\s"]{0,16})\(/,end:/\)([^()\\\s"]{0,16})"/})]},d={className:"number",variants:[{begin:"[+-]?(?:(?:\\b[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|\\b[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|\\b0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)"},{begin:"[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)"}],relevance:0},E={scope:"meta",begin:/#\s*include\b/,end:/$/,keywords:{keyword:"include"},contains:[{begin:/\\\n/},c,{scope:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},b={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(c,{className:"string"}),t,e.C_BLOCK_COMMENT_MODE]},p=[E,b],N={className:"title",begin:n.optional(o)+e.IDENT_RE,relevance:0},h=n.optional(o)+e.IDENT_RE+"\\s*\\(",S=12,T=["alignas","alignof","and","and_eq","asm","atomic_cancel","atomic_commit","atomic_noexcept","auto","bitand","bitor","break","case","catch","class","co_await","co_return","co_yield","compl","concept","const_cast|10","consteval","constexpr","constinit","continue","decltype","default","delete","do","dynamic_cast|10","else","enum","explicit","export","extern","false","final","for","friend","goto","if","import","inline","module","mutable","namespace","new","noexcept","not","not_eq","nullptr","operator","or","or_eq","override","private","protected","public","reflexpr","register","reinterpret_cast|10","requires","return","sizeof","static_assert","static_cast|10","struct","switch","synchronized","template","this","thread_local","throw","transaction_safe","transaction_safe_dynamic","true","try","typedef","typeid","typename","union","using","virtual","volatile","while","xor","xor_eq"],x=["bool","char","char16_t","char32_t","char8_t","double","float","int","long","short","void","wchar_t","unsigned","signed","const","static"],I=["any","auto_ptr","barrier","binary_semaphore","bitset","complex","condition_variable","condition_variable_any","counting_semaphore","deque","false_type","flat_map","flat_set","future","imaginary","initializer_list","istringstream","jthread","latch","lock_guard","multimap","multiset","mutex","optional","ostringstream","packaged_task","pair","promise","priority_queue","queue","recursive_mutex","recursive_timed_mutex","scoped_lock","set","shared_future","shared_lock","shared_mutex","shared_timed_mutex","shared_ptr","stack","string_view","stringstream","timed_mutex","thread","true_type","tuple","unique_lock","unique_ptr","unordered_map","unordered_multimap","unordered_multiset","unordered_set","variant","vector","weak_ptr","wstring","wstring_view"],v=["abort","abs","acos","apply","as_const","asin","atan","atan2","calloc","ceil","cerr","cin","clog","cos","cosh","cout","declval","endl","exchange","exit","exp","fabs","floor","fmod","forward","fprintf","fputs","free","frexp","fscanf","future","invoke","isalnum","isalpha","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","isxdigit","labs","launder","ldexp","log","log10","make_pair","make_shared","make_shared_for_overwrite","make_tuple","make_unique","malloc","memchr","memcmp","memcpy","memset","modf","move","pow","printf","putchar","puts","realloc","scanf","sin","sinh","snprintf","sprintf","sqrt","sscanf","std","stderr","stdin","stdout","strcat","strchr","strcmp","strcpy","strcspn","strlen","strncat","strncmp","strncpy","strpbrk","strrchr","strspn","strstr","swap","tan","tanh","terminate","to_underlying","tolower","toupper","vfprintf","visit","vprintf","vsprintf"],L={type:x,keyword:T,literal:["NULL","false","nullopt","nullptr","true"],built_in:["_Pragma"],_type_hints:I},D={className:"function.dispatch",relevance:0,keywords:{_hint:v},begin:n.concat(/\b/,`(?!${T.join("|")})`,e.IDENT_RE,n.lookahead(/(<[^<>]+>|)\s*\(/))},U=[D,...p,a,t,e.C_BLOCK_COMMENT_MODE,d,c],W={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:L,contains:U.concat([{begin:/\(/,end:/\)/,keywords:L,contains:U.concat(["self"]),relevance:0}]),relevance:0},Q={className:"function",begin:"("+r+"[\\*&\\s]+){1,"+S+"}"+h,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:L,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:i,keywords:L,relevance:0},{begin:h,returnBegin:!0,contains:[N],relevance:0},{begin:/::/,relevance:0},{begin:/:/,endsWithParent:!0,contains:[c,d]},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:L,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,c,d,a,{begin:/\(/,end:/\)/,keywords:L,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,c,d,a]}]},a,t,e.C_BLOCK_COMMENT_MODE,...p]};return{name:"C++",aliases:["cc","c++","h++","hpp","hh","hxx","cxx"],keywords:L,illegal:"</",classNameAliases:{"function.dispatch":"built_in"},contains:[].concat(W,Q,D,U,[...p,{begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",end:">",keywords:L,contains:["self",a]},{begin:e.IDENT_RE+"::",keywords:L},{match:[/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,/\s+/,/\w+/],className:{1:"keyword",3:"title.class"}}])}}An.exports=ba});var kn=R((Pr,Mn)=>{function pa(e){let n=["bool","byte","char","decimal","delegate","double","dynamic","enum","float","int","long","nint","nuint","object","sbyte","short","string","ulong","uint","ushort"],t=["public","private","protected","static","internal","protected","abstract","async","extern","override","unsafe","virtual","new","sealed","partial"],i=["default","false","null","true"],o=["abstract","as","base","break","case","catch","class","const","continue","do","else","event","explicit","extern","finally","fixed","for","foreach","goto","if","implicit","in","interface","internal","is","lock","namespace","new","operator","out","override","params","private","protected","public","readonly","record","ref","return","scoped","sealed","sizeof","stackalloc","static","struct","switch","this","throw","try","typeof","unchecked","unsafe","using","virtual","void","volatile","while"],u=["add","alias","and","ascending","args","async","await","by","descending","dynamic","equals","file","from","get","global","group","init","into","join","let","nameof","not","notnull","on","or","orderby","partial","record","remove","required","scoped","select","set","unmanaged","value|0","var","when","where","with","yield"],r={keyword:o.concat(u),built_in:n,literal:i},a=e.inherit(e.TITLE_MODE,{begin:"[a-zA-Z](\\.?\\w)*"}),s="\\d(_*\\d)*",c="([uU][lL]?|[lL][uU]?)?",E={className:"number",variants:[{begin:"\\b0[bB]_*[01](_*[01])*"+c},{begin:"(-?)\\b0[xX]_*[a-fA-F0-9](_*[a-fA-F0-9])*"+c},{begin:"(-?)(\\b"+s+"(\\.("+s+")?)?|\\."+s+")([eE][-+]?"+s+")?"+"([fFdDmM]|[uU][lL]?|[lL][uU]?)?"}],relevance:0},b={className:"string",begin:/"""("*)(?!")(.|\n)*?"""\1/,relevance:1},p={className:"string",begin:'@"',end:'"',contains:[{begin:'""'}]},N=e.inherit(p,{illegal:/\n/}),h={className:"subst",begin:/\{/,end:/\}/,keywords:r},S=e.inherit(h,{illegal:/\n/}),T={className:"string",begin:/\$"/,end:'"',illegal:/\n/,contains:[{begin:/\{\{/},{begin:/\}\}/},e.BACKSLASH_ESCAPE,S]},x={className:"string",begin:/\$@"/,end:'"',contains:[{begin:/\{\{/},{begin:/\}\}/},{begin:'""'},h]},I=e.inherit(x,{illegal:/\n/,contains:[{begin:/\{\{/},{begin:/\}\}/},{begin:'""'},S]});h.contains=[x,T,p,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,E,e.C_BLOCK_COMMENT_MODE],S.contains=[I,T,N,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,E,e.inherit(e.C_BLOCK_COMMENT_MODE,{illegal:/\n/})];let v={variants:[b,x,T,p,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},M={begin:"<",end:">",contains:[{beginKeywords:"in out"},a]},k=e.IDENT_RE+"(<"+e.IDENT_RE+"(\\s*,\\s*"+e.IDENT_RE+")*>)?(\\[\\])?",L={begin:"@"+e.IDENT_RE,relevance:0};return{name:"C#",aliases:["cs","c#"],keywords:r,illegal:/::/,contains:[e.COMMENT("///","$",{returnBegin:!0,contains:[{className:"doctag",variants:[{begin:"///",relevance:0},{begin:"<!--|-->"},{begin:"</?",end:">"}]}]}),e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"meta",begin:"#",end:"$",keywords:{keyword:"if else elif endif define undef warning error line region endregion pragma checksum"}},v,E,{beginKeywords:"class interface",relevance:0,end:/[{;=]/,illegal:/[^\s:,]/,contains:[{beginKeywords:"where class"},a,M,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{beginKeywords:"namespace",relevance:0,end:/[{;=]/,illegal:/[^\s:]/,contains:[a,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{beginKeywords:"record",relevance:0,end:/[{;=]/,illegal:/[^\s:]/,contains:[a,M,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"meta",begin:"^\\s*\\[(?=[\\w])",excludeBegin:!0,end:"\\]",excludeEnd:!0,contains:[{className:"string",begin:/"/,end:/"/}]},{beginKeywords:"new return throw await else",relevance:0},{className:"function",begin:"("+k+"\\s+)+"+e.IDENT_RE+"\\s*(<[^=]+>\\s*)?\\(",returnBegin:!0,end:/\s*[{;=]/,excludeEnd:!0,keywords:r,contains:[{beginKeywords:t.join(" "),relevance:0},{begin:e.IDENT_RE+"\\s*(<[^=]+>\\s*)?\\(",returnBegin:!0,contains:[e.TITLE_MODE,M],relevance:0},{match:/\(\)/},{className:"params",begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,relevance:0,contains:[v,E,e.C_BLOCK_COMMENT_MODE]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},L]}}Mn.exports=pa});var Cn=R((Fr,xn)=>{var _a=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{scope:"number",begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,5}(-[0-9A-Fa-f][0-9A-Fa-f]{0,5})?/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),ma=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],Ea=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],fa=[...ma,...Ea],ha=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),Na=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),ya=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),Ta=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","corner-bottom-left-shape","corner-bottom-right-shape","corner-shape","corner-top-left-shape","corner-top-right-shape","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse();function Sa(e){let n=e.regex,t=_a(e),i={begin:/-(webkit|moz|ms|o)-(?=[a-z])/},o="and or not only",u=/@-?\w[\w]*(-\w+)*/,r="[a-zA-Z-][a-zA-Z0-9_-]*",a=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE];return{name:"CSS",case_insensitive:!0,illegal:/[=|'\$]/,keywords:{keyframePosition:"from to"},classNameAliases:{keyframePosition:"selector-tag"},contains:[t.BLOCK_COMMENT,i,t.CSS_NUMBER_MODE,{className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0},{className:"selector-class",begin:"\\."+r,relevance:0},t.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{begin:":("+Na.join("|")+")"},{begin:":(:)?("+ya.join("|")+")"}]},t.CSS_VARIABLE,{className:"attribute",begin:"\\b("+Ta.join("|")+")\\b"},{begin:/:/,end:/[;}{]/,contains:[t.BLOCK_COMMENT,t.HEXCOLOR,t.IMPORTANT,t.CSS_NUMBER_MODE,t.UNICODE_RANGE,...a,{begin:/(url|data-uri)\(/,end:/\)/,relevance:0,keywords:{built_in:"url data-uri"},contains:[...a,{className:"string",begin:/[^)]/,endsWithParent:!0,excludeEnd:!0}]},t.FUNCTION_DISPATCH]},{begin:n.lookahead(/@/),end:"[{;]",relevance:0,illegal:/:/,contains:[{className:"keyword",begin:u},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{$pattern:/[a-z-]+/,keyword:o,attribute:ha.join(" ")},contains:[{begin:/[a-z-]+(?=:)/,className:"attribute"},...a,t.CSS_NUMBER_MODE]}]},{className:"selector-tag",begin:"\\b("+fa.join("|")+")\\b"}]}}xn.exports=Sa});var Ln=R((zr,In)=>{function Oa(e){let n=e.regex,t={begin:/<\/?[A-Za-z_]/,end:">",subLanguage:"xml",relevance:0},i={match:/^ {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,}$/},o={className:"code",variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{begin:"(~{3,})[^~](.|\\n)*?\\1~*[ ]*"},{begin:"```",end:"```+[ ]*$"},{begin:"~~~",end:"~~~+[ ]*$"},{begin:"`.+?`"},{begin:"(?=^( {4}|\\t))",contains:[{begin:"^( {4}|\\t)",end:"(\\n)$"}],relevance:0}]},u={className:"bullet",begin:"^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",end:"\\s+",excludeEnd:!0},r={begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:"symbol",begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:"link",begin:/:\s*/,end:/$/,excludeBegin:!0}]},a=/[A-Za-z][A-Za-z0-9+.-]*/,s={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,relevance:2},{begin:n.concat(/\[.+?\]\(/,a,/:\/\/.*?\)/),relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{match:/\[(?=\])/},{className:"string",relevance:0,begin:"\\[",end:"\\]",excludeBegin:!0,returnEnd:!0},{className:"link",relevance:0,begin:"\\]\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\]\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0}]},c={className:"strong",contains:[],variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]},d={className:"emphasis",contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{begin:/_(?![_\s])/,end:/_/,relevance:0}]},E=e.inherit(c,{contains:[]}),b=e.inherit(d,{contains:[]});c.contains.push(b),d.contains.push(E);let p=[t,s];return[c,d,E,b].forEach(T=>{T.contains=T.contains.concat(p)}),p=p.concat(c,d),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:p},{begin:"(?=^.+?\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\n",contains:p}]}]},t,u,i,c,d,{className:"quote",begin:"^>\\s+",contains:p,end:"$"},o,s,r,{scope:"literal",match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/}]}}In.exports=Oa});var Bn=R(($r,Dn)=>{function wa(e){let n=e.regex;return{name:"Diff",aliases:["patch"],contains:[{className:"meta",relevance:10,match:n.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+,\d+ +\+\d+ +@@/,/^@@ +-\d+ +\+\d+ +@@/,/^\*\*\* +\d+,\d+ +\*\*\*\*$/,/^--- +\d+,\d+ +----$/)},{className:"comment",variants:[{begin:n.either(/Index: /,/^index/,/={3,}/,/^-{3}/,/^\*{3} /,/^\+{3}/,/^diff --git/),end:/$/},{match:/^\*{15}$/}]},{className:"addition",begin:/^\+/,end:/$/},{className:"deletion",begin:/^-/,end:/$/},{className:"addition",begin:/^!/,end:/$/}]}}Dn.exports=wa});var Pn=R((Gr,Un)=>{function va(e){let n=e.regex,t="([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",i=n.either(/\b([A-Z]+[a-z0-9]+)+/,/\b([A-Z]+[a-z0-9]+)+[A-Z]+/),o=n.concat(i,/(::\w+)*/),r={"variable.constant":["__FILE__","__LINE__","__ENCODING__"],"variable.language":["self","super"],keyword:["alias","and","begin","BEGIN","break","case","class","defined","do","else","elsif","end","END","ensure","for","if","in","module","next","not","or","redo","require","rescue","retry","return","then","undef","unless","until","when","while","yield",...["include","extend","prepend","public","private","protected","raise","throw"]],built_in:["proc","lambda","attr_accessor","attr_reader","attr_writer","define_method","private_constant","module_function"],literal:["true","false","nil"]},a={className:"doctag",begin:"@[A-Za-z]+"},s={begin:"#<",end:">"},c=[e.COMMENT("#","$",{contains:[a]}),e.COMMENT("^=begin","^=end",{contains:[a],relevance:10}),e.COMMENT("^__END__",e.MATCH_NOTHING_RE)],d={className:"subst",begin:/#\{/,end:/\}/,keywords:r},E={className:"string",contains:[e.BACKSLASH_ESCAPE,d],variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/`/,end:/`/},{begin:/%[qQwWx]?\(/,end:/\)/},{begin:/%[qQwWx]?\[/,end:/\]/},{begin:/%[qQwWx]?\{/,end:/\}/},{begin:/%[qQwWx]?</,end:/>/},{begin:/%[qQwWx]?\//,end:/\//},{begin:/%[qQwWx]?%/,end:/%/},{begin:/%[qQwWx]?-/,end:/-/},{begin:/%[qQwWx]?\|/,end:/\|/},{begin:/\B\?(\\\d{1,3})/},{begin:/\B\?(\\x[A-Fa-f0-9]{1,2})/},{begin:/\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/},{begin:/\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/},{begin:/\B\?\\(c|C-)[\x20-\x7e]/},{begin:/\B\?\\?\S/},{begin:n.concat(/<<[-~]?'?/,n.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,contains:[e.BACKSLASH_ESCAPE,d]})]}]},b="[1-9](_?[0-9])*|0",p="[0-9](_?[0-9])*",N={className:"number",relevance:0,variants:[{begin:`\\b(${b})(\\.(${p}))?([eE][+-]?(${p})|r)?i?\\b`},{begin:"\\b0[dD][0-9](_?[0-9])*r?i?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*r?i?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*r?i?\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"},{begin:"\\b0(_?[0-7])+r?i?\\b"}]},h={variants:[{match:/\(\)/},{className:"params",begin:/\(/,end:/(?=\))/,excludeBegin:!0,endsParent:!0,keywords:r}]},k=[E,{variants:[{match:[/class\s+/,o,/\s+<\s+/,o]},{match:[/\b(class|module)\s+/,o]}],scope:{2:"title.class",4:"title.class.inherited"},keywords:r},{match:[/(include|extend)\s+/,o],scope:{2:"title.class"},keywords:r},{relevance:0,match:[o,/\.new[. (]/],scope:{1:"title.class"}},{relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"},{relevance:0,match:i,scope:"title.class"},{match:[/def/,/\s+/,t],scope:{1:"keyword",3:"title.function"},contains:[h]},{begin:"::"},{className:"symbol",begin:e.UNDERSCORE_IDENT_RE+"(!|\\?)?:",relevance:0},{className:"symbol",begin:":(?!\\s)",contains:[E,{begin:t}],relevance:0},N,{className:"variable",begin:"(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"},{className:"params",begin:/\|(?!=)/,end:/\|/,excludeBegin:!0,excludeEnd:!0,relevance:0,keywords:r},{begin:"("+e.RE_STARTERS_RE+"|unless)\\s*",keywords:"unless",contains:[{className:"regexp",contains:[e.BACKSLASH_ESCAPE,d],illegal:/\n/,variants:[{begin:"/",end:"/[a-z]*"},{begin:/%r\{/,end:/\}[a-z]*/},{begin:"%r\\(",end:"\\)[a-z]*"},{begin:"%r!",end:"![a-z]*"},{begin:"%r\\[",end:"\\][a-z]*"}]}].concat(s,c),relevance:0}].concat(s,c);d.contains=k,h.contains=k;let W=[{begin:/^\s*=>/,starts:{end:"$",contains:k}},{className:"meta.prompt",begin:"^("+"[>?]>"+"|"+"[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]"+"|"+"(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>"+")(?=[ ])",starts:{end:"$",keywords:r,contains:k}}];return c.unshift(s),{name:"Ruby",aliases:["rb","gemspec","podspec","thor","irb"],keywords:r,illegal:/\/\*/,contains:[e.SHEBANG({binary:"ruby"})].concat(W).concat(c).concat(k)}}Un.exports=va});var zn=R((Kr,Fn)=>{function Aa(e){let u={keyword:["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"],type:["bool","byte","complex64","complex128","error","float32","float64","int8","int16","int32","int64","string","uint8","uint16","uint32","uint64","int","uint","uintptr","rune"],literal:["true","false","iota","nil"],built_in:["append","cap","close","complex","copy","imag","len","make","new","panic","print","println","real","recover","delete"]};return{name:"Go",aliases:["golang"],keywords:u,illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"`",end:"`"}]},{className:"number",variants:[{match:/-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,relevance:0},{match:/-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b0[oO](_?[0-7])*i?/,relevance:0},{match:/-?\b0[bB](_?[01])*i?/,relevance:0},{match:/-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,relevance:0}]},{begin:/:=/},{className:"function",beginKeywords:"func",end:"\\s*(\\{|$)",excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",begin:/\(/,end:/\)/,endsParent:!0,keywords:u,illegal:/["']/}]}]}}Fn.exports=Aa});var Gn=R((Hr,$n)=>{function Ra(e){let n=e.regex,t=/[_A-Za-z][_0-9A-Za-z]*/;return{name:"GraphQL",aliases:["gql"],case_insensitive:!0,disableAutodetect:!1,keywords:{keyword:["query","mutation","subscription","type","input","schema","directive","interface","union","scalar","fragment","enum","on"],literal:["true","false","null"]},contains:[e.HASH_COMMENT_MODE,e.QUOTE_STRING_MODE,e.NUMBER_MODE,{scope:"punctuation",match:/[.]{3}/,relevance:0},{scope:"punctuation",begin:/[\!\(\)\:\=\[\]\{\|\}]{1}/,relevance:0},{scope:"variable",begin:/\$/,end:/\W/,excludeEnd:!0,relevance:0},{scope:"meta",match:/@\w+/,excludeEnd:!0},{scope:"symbol",begin:n.concat(t,n.lookahead(/\s*:/)),relevance:0}],illegal:[/[;<']/,/BEGIN/]}}$n.exports=Ra});var Hn=R((qr,Kn)=>{function Ma(e){let n=e.regex,t={className:"number",relevance:0,variants:[{begin:/([+-]+)?[\d]+_[\d_]+/},{begin:e.NUMBER_RE}]},i=e.COMMENT();i.variants=[{begin:/;/,end:/$/},{begin:/#/,end:/$/}];let o={className:"variable",variants:[{begin:/\$[\w\d"][\w\d_]*/},{begin:/\$\{(.*?)\}/}]},u={className:"literal",begin:/\bon|off|true|false|yes|no\b/},r={className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:"'''",end:"'''",relevance:10},{begin:'"""',end:'"""',relevance:10},{begin:'"',end:'"'},{begin:"'",end:"'"}]},a={begin:/\[/,end:/\]/,contains:[i,u,o,r,t,"self"],relevance:0},s=/[A-Za-z0-9_-]+/,c=/"(\\"|[^"])*"/,d=/'[^']*'/,E=n.either(s,c,d),b=n.concat(E,"(\\s*\\.\\s*",E,")*",n.lookahead(/\s*=\s*[^#\s]/));return{name:"TOML, also INI",aliases:["toml"],case_insensitive:!0,illegal:/\S/,contains:[i,{className:"section",begin:/\[+/,end:/\]+/},{begin:b,className:"attr",starts:{end:/$/,contains:[i,a,u,o,r,t]}}]}}Kn.exports=Ma});var Zn=R((Wr,Yn)=>{var be="[0-9](_*[0-9])*",Me=`\\.(${be})`,ke="[0-9a-fA-F](_*[0-9a-fA-F])*",qn={className:"number",variants:[{begin:`(\\b(${be})((${Me})|\\.)?|(${Me}))[eE][+-]?(${be})[fFdD]?\\b`},{begin:`\\b(${be})((${Me})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${Me})[fFdD]?\\b`},{begin:`\\b(${be})[fFdD]\\b`},{begin:`\\b0[xX]((${ke})\\.?|(${ke})?\\.(${ke}))[pP][+-]?(${be})[fFdD]?\\b`},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${ke})[lL]?\\b`},{begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],relevance:0};function Wn(e,n,t){return t===-1?"":e.replace(n,i=>Wn(e,n,t-1))}function ka(e){let n=e.regex,t="[\xC0-\u02B8a-zA-Z_$][\xC0-\u02B8a-zA-Z_$0-9]*",i="(?:(?:\\s*\\[\\s*])+)?",o=t+"<@@@>"+i,r="(?:"+("\\?(?:\\s+(?:extends|super)\\s+"+o+")?")+"|"+o+")",a=Wn("(?:\\s*<\\s*"+r+"(?:\\s*,\\s*"+r+")*\\s*>)?",/<@@@>/g,2),b={keyword:["synchronized","abstract","private","var","static","if","const ","for","while","strictfp","finally","protected","import","native","final","void","enum","else","break","transient","catch","instanceof","volatile","case","assert","package","default","public","try","switch","continue","throws","protected","public","private","module","requires","exports","do","sealed","yield","permits","goto","when"],literal:["false","true","null"],type:["char","boolean","long","float","int","byte","short","double"],built_in:["super","this"]},p={className:"meta",begin:"@"+t,contains:[{begin:/\(/,end:/\)/,contains:["self"]}]},N={className:"params",begin:/\(/,end:/\)/,keywords:b,relevance:0,contains:[e.C_BLOCK_COMMENT_MODE],endsParent:!0};return{name:"Java",aliases:["jsp"],keywords:b,illegal:/<\/|#/,contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{begin:/\w+@/,relevance:0},{className:"doctag",begin:"@[A-Za-z]+"}]}),{begin:/import java\.[a-z]+\./,keywords:"import",relevance:2},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{begin:/"""/,end:/"""/,className:"string",contains:[e.BACKSLASH_ESCAPE]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{match:[/\b(?:class|interface|enum|extends|implements|new)/,/\s+/,t],className:{1:"keyword",3:"title.class"}},{match:/non-sealed/,scope:"keyword"},{beginKeywords:"new throw return else yield assert",relevance:0},{begin:[t,n.concat(a,i,/\s+/),t,i,/\s*/,/=(?!=)/],className:{1:"type",3:"variable",6:"operator"}},{begin:[/record/,/\s+/,t],className:{1:"keyword",3:"title.class"},contains:[N,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{begin:[t,n.concat(a,i,/\s+/),t,/\s*(?=\()/],className:{1:"type",3:"title.function"},keywords:b,contains:[{className:"params",begin:/\(/,end:/\)/,keywords:b,relevance:0,contains:[p,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,qn,e.C_BLOCK_COMMENT_MODE]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},qn,p]}}Yn.exports=ka});var et=R((Yr,jn)=>{var Xn="[A-Za-z$_][0-9A-Za-z$_]*",xa=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Ca=["true","false","null","undefined","NaN","Infinity"],Vn=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Qn=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Jn=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Ia=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","self","global"],La=[].concat(Jn,Vn,Qn);function Da(e){let n=e.regex,t=(m,{after:O})=>{let C="</"+m[0].slice(1);return m.input.indexOf(C,O)!==-1},i=Xn,o={begin:"<>",end:"</>"},u=/<[A-Za-z0-9\\._:-]+\s*\/>/,r={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(m,O)=>{let C=m[0].length+m.index,z=m.input[C];if(z==="<"||z===","){O.ignoreMatch();return}z===">"&&(t(m,{after:C})||O.ignoreMatch());let G,j=m.input.substring(C);if(G=j.match(/^\s*=/)){O.ignoreMatch();return}if((G=j.match(/^\s+extends\s+/))&&G.index===0){O.ignoreMatch();return}}},a={$pattern:Xn,keyword:xa,literal:Ca,built_in:La,"variable.language":Ia},s="[0-9](_?[0-9])*",c=`\\.(${s})`,d="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",E={className:"number",variants:[{begin:`(\\b(${d})((${c})|\\.)?|(${c}))[eE][+-]?(${s})\\b`},{begin:`\\b(${d})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},b={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},p={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"xml"}},N={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"css"}},h={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"graphql"}},S={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,b]},x={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:i+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},I=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,p,N,h,S,{match:/\$\d+/},E];b.contains=I.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(I)});let v=[].concat(x,b.contains),M=v.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(v)}]),k={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:M},L={variants:[{match:[/class/,/\s+/,i,/\s+/,/extends/,/\s+/,n.concat(i,"(",n.concat(/\./,i),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,i],scope:{1:"keyword",3:"title.class"}}]},D={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Vn,...Qn]}},U={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},W={variants:[{match:[/function/,/\s+/,i,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[k],illegal:/%/},Q={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function J(m){return n.concat("(?!",m.join("|"),")")}let ne={match:n.concat(/\b/,J([...Jn,"super","import","await"].map(m=>`${m}\\s*\\(`)),i,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},K={begin:n.concat(/\./,n.lookahead(n.concat(i,/(?![0-9A-Za-z$_(])/))),end:i,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},H={match:[/get|set/,/\s+/,i,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},k]},l="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",_={match:[/const|var|let/,/\s+/,i,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(l)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[k]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:M,CLASS_REFERENCE:D},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),U,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,p,N,h,S,x,{match:/\$\d+/},E,D,{scope:"attr",match:i+n.lookahead(":"),relevance:0},_,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[x,e.REGEXP_MODE,{className:"function",begin:l,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:M}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:o.begin,end:o.end},{match:u},{begin:r.begin,"on:begin":r.isTrulyOpeningTag,end:r.end}],subLanguage:"xml",contains:[{begin:r.begin,end:r.end,skip:!0,contains:["self"]}]}]},W,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[k,e.inherit(e.TITLE_MODE,{begin:i,className:"title.function"})]},{match:/\.\.\./,relevance:0},K,{match:"\\$"+i,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[k]},ne,Q,L,H,{match:/\$[(.]/}]}}jn.exports=Da});var tt=R((Zr,nt)=>{var Ba="([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity",Ua={scope:"number",match:Ba,relevance:0};function Pa(e){let n={className:"attr",begin:/(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,relevance:1.01},t={match:/[{}[\],:]/,className:"punctuation",relevance:0},i=["true","false","null"],o={scope:"literal",beginKeywords:i.join(" ")};return{name:"JSON",aliases:["jsonc","json5"],keywords:{literal:i},contains:[n,t,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,o,Ua,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}nt.exports=Pa});var at=R((Xr,it)=>{var pe="[0-9](_*[0-9])*",xe=`\\.(${pe})`,Ce="[0-9a-fA-F](_*[0-9a-fA-F])*",Fa={className:"number",variants:[{begin:`(\\b(${pe})((${xe})|\\.)?|(${xe}))[eE][+-]?(${pe})[fFdD]?\\b`},{begin:`\\b(${pe})((${xe})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${xe})[fFdD]?\\b`},{begin:`\\b(${pe})[fFdD]\\b`},{begin:`\\b0[xX]((${Ce})\\.?|(${Ce})?\\.(${Ce}))[pP][+-]?(${pe})[fFdD]?\\b`},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${Ce})[lL]?\\b`},{begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],relevance:0};function za(e){let n={keyword:"abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",built_in:"Byte Short Char Int Long Boolean Float Double Void Unit Nothing",literal:"true false null"},t={className:"keyword",begin:/\b(break|continue|return|this)\b/,starts:{contains:[{className:"symbol",begin:/@\w+/}]}},i={className:"symbol",begin:e.UNDERSCORE_IDENT_RE+"@"},o={className:"subst",begin:/\$\{/,end:/\}/,contains:[e.C_NUMBER_MODE]},u={className:"variable",begin:"\\$"+e.UNDERSCORE_IDENT_RE},r={className:"string",variants:[{begin:'"""',end:'"""(?=[^"])',contains:[u,o]},{begin:"'",end:"'",illegal:/\n/,contains:[e.BACKSLASH_ESCAPE]},{begin:'"',end:'"',illegal:/\n/,contains:[e.BACKSLASH_ESCAPE,u,o]}]};o.contains.push(r);let a={className:"meta",begin:"@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*"+e.UNDERSCORE_IDENT_RE+")?"},s={className:"meta",begin:"@"+e.UNDERSCORE_IDENT_RE,contains:[{begin:/\(/,end:/\)/,contains:[e.inherit(r,{className:"string"}),"self"]}]},c=Fa,d=e.COMMENT("/\\*","\\*/",{contains:[e.C_BLOCK_COMMENT_MODE]}),E={variants:[{className:"type",begin:e.UNDERSCORE_IDENT_RE},{begin:/\(/,end:/\)/,contains:[]}]},b=E;return b.variants[1].contains=[E],E.variants[1].contains=[b],{name:"Kotlin",aliases:["kt","kts","ktm","ktx"],keywords:n,contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"}]}),e.C_LINE_COMMENT_MODE,d,t,i,a,s,{className:"function",beginKeywords:"fun",end:"[(]|$",returnBegin:!0,excludeEnd:!0,keywords:n,relevance:5,contains:[{begin:e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,relevance:0,contains:[e.UNDERSCORE_TITLE_MODE]},{className:"type",begin:/</,end:/>/,keywords:"reified",relevance:0},{className:"params",begin:/\(/,end:/\)/,endsParent:!0,keywords:n,relevance:0,contains:[{begin:/:/,end:/[=,\/]/,endsWithParent:!0,contains:[E,e.C_LINE_COMMENT_MODE,d],relevance:0},e.C_LINE_COMMENT_MODE,d,a,s,r,e.C_NUMBER_MODE]},d]},{begin:[/class|interface|trait/,/\s+/,e.UNDERSCORE_IDENT_RE],beginScope:{3:"title.class"},keywords:"class interface trait",end:/[:\{(]|$/,excludeEnd:!0,illegal:"extends implements",contains:[{beginKeywords:"public protected internal private constructor"},e.UNDERSCORE_TITLE_MODE,{className:"type",begin:/</,end:/>/,excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:/[,:]\s*/,end:/[<\(,){\s]|$/,excludeBegin:!0,returnEnd:!0},a,s]},r,{className:"meta",begin:"^#!/usr/bin/env",end:"$",illegal:`
`},c]}}it.exports=za});var ct=R((Vr,st)=>{var $a=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{scope:"number",begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,5}(-[0-9A-Fa-f][0-9A-Fa-f]{0,5})?/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),Ga=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],Ka=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],Ha=[...Ga,...Ka],qa=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),rt=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),ot=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),Wa=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","corner-bottom-left-shape","corner-bottom-right-shape","corner-shape","corner-top-left-shape","corner-top-right-shape","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse(),Ya=rt.concat(ot).sort().reverse();function Za(e){let n=$a(e),t=Ya,i="and or not only",o="[\\w-]+",u="("+o+"|@\\{"+o+"\\})",r=[],a=[],s=function(I){return{className:"string",begin:"~?"+I+".*?"+I}},c=function(I,v,M){return{className:I,begin:v,relevance:M}},d={$pattern:/[a-z-]+/,keyword:i,attribute:qa.join(" ")},E={begin:"\\(",end:"\\)",contains:a,keywords:d,relevance:0};a.push(e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,s("'"),s('"'),n.CSS_NUMBER_MODE,{begin:"(url|data-uri)\\(",starts:{className:"string",end:"[\\)\\n]",excludeEnd:!0}},n.UNICODE_RANGE,n.HEXCOLOR,E,c("variable","@@?"+o,10),c("variable","@\\{"+o+"\\}"),c("built_in","~?`[^`]*?`"),{className:"attribute",begin:o+"\\s*:",end:":",returnBegin:!0,excludeEnd:!0},n.IMPORTANT,{beginKeywords:"and not"},n.FUNCTION_DISPATCH);let b=a.concat({begin:/\{/,end:/\}/,contains:r}),p={beginKeywords:"when",endsWithParent:!0,contains:[{beginKeywords:"and not"}].concat(a)},N={begin:u+"\\s*:",returnBegin:!0,end:/[;}]/,relevance:0,contains:[{begin:/-(webkit|moz|ms|o)-/},n.CSS_VARIABLE,{className:"attribute",begin:"\\b("+Wa.join("|")+")\\b",end:/(?=:)/,starts:{endsWithParent:!0,illegal:"[<=$]",relevance:0,contains:a}}]},h={className:"keyword",begin:"@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",starts:{end:"[;{}]",keywords:d,returnEnd:!0,contains:a,relevance:0}},S={className:"variable",variants:[{begin:"@"+o+"\\s*:",relevance:15},{begin:"@"+o}],starts:{end:"[;}]",returnEnd:!0,contains:b}},T={variants:[{begin:"[\\.#:&\\[>]",end:"[;{}]"},{begin:u,end:/\{/}],returnBegin:!0,returnEnd:!0,illegal:`[<='$"]`,relevance:0,contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,p,c("keyword","all\\b"),c("variable","@\\{"+o+"\\}"),{begin:"\\b("+Ha.join("|")+")\\b",className:"selector-tag"},n.CSS_NUMBER_MODE,c("selector-tag",u,0),c("selector-id","#"+u),c("selector-class","\\."+u,0),c("selector-tag","&",0),n.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",begin:":("+rt.join("|")+")"},{className:"selector-pseudo",begin:":(:)?("+ot.join("|")+")"},{begin:/\(/,end:/\)/,relevance:0,contains:b},{begin:"!important"},n.FUNCTION_DISPATCH]},x={begin:o+`:(:)?(${t.join("|")})`,returnBegin:!0,contains:[T]};return r.push(e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,h,S,x,N,T,p,n.FUNCTION_DISPATCH),{name:"Less",case_insensitive:!0,illegal:`[=>'/<($"]`,contains:r}}st.exports=Za});var dt=R((Qr,lt)=>{function Xa(e){let n="\\[=*\\[",t="\\]=*\\]",i={begin:n,end:t,contains:["self"]},o=[e.COMMENT("--(?!"+n+")","$"),e.COMMENT("--"+n,t,{contains:[i],relevance:10})];return{name:"Lua",aliases:["pluto"],keywords:{$pattern:e.UNDERSCORE_IDENT_RE,literal:"true false nil",keyword:"and break do else elseif end for goto if in local global not or repeat return then until while",built_in:"_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"},contains:o.concat([{className:"function",beginKeywords:"function",end:"\\)",contains:[e.inherit(e.TITLE_MODE,{begin:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}),{className:"params",begin:"\\(",endsWithParent:!0,contains:o}].concat(o)},e.C_NUMBER_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{className:"string",begin:n,end:t,contains:[i],relevance:5}])}}lt.exports=Xa});var gt=R((Jr,ut)=>{function Va(e){let n={className:"variable",variants:[{begin:"\\$\\("+e.UNDERSCORE_IDENT_RE+"\\)",contains:[e.BACKSLASH_ESCAPE]},{begin:/\$[@%<?\^\+\*]/}]},t={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,n]},i={className:"variable",begin:/\$\([\w-]+\s/,end:/\)/,keywords:{built_in:"subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"},contains:[n,t]},o={begin:"^"+e.UNDERSCORE_IDENT_RE+"\\s*(?=[:+?]?=)"},u={className:"meta",begin:/^\.PHONY:/,end:/$/,keywords:{$pattern:/[\.\w]+/,keyword:".PHONY"}},r={className:"section",begin:/^[^\s]+:/,end:/$/,contains:[n]};return{name:"Makefile",aliases:["mk","mak","make"],keywords:{$pattern:/[\w-]+/,keyword:"define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"},contains:[e.HASH_COMMENT_MODE,n,t,i,o,u,r]}}ut.exports=Va});var pt=R((jr,bt)=>{function Qa(e){let n=e.regex,t=["abs","accept","alarm","and","atan2","bind","binmode","bless","break","caller","chdir","chmod","chomp","chop","chown","chr","chroot","class","close","closedir","connect","continue","cos","crypt","dbmclose","dbmopen","defined","delete","die","do","dump","each","else","elsif","endgrent","endhostent","endnetent","endprotoent","endpwent","endservent","eof","eval","exec","exists","exit","exp","fcntl","field","fileno","flock","for","foreach","fork","format","formline","getc","getgrent","getgrgid","getgrnam","gethostbyaddr","gethostbyname","gethostent","getlogin","getnetbyaddr","getnetbyname","getnetent","getpeername","getpgrp","getpriority","getprotobyname","getprotobynumber","getprotoent","getpwent","getpwnam","getpwuid","getservbyname","getservbyport","getservent","getsockname","getsockopt","given","glob","gmtime","goto","grep","gt","hex","if","index","int","ioctl","join","keys","kill","last","lc","lcfirst","length","link","listen","local","localtime","log","lstat","lt","ma","map","method","mkdir","msgctl","msgget","msgrcv","msgsnd","my","ne","next","no","not","oct","open","opendir","or","ord","our","pack","package","pipe","pop","pos","print","printf","prototype","push","q|0","qq","quotemeta","qw","qx","rand","read","readdir","readline","readlink","readpipe","recv","redo","ref","rename","require","reset","return","reverse","rewinddir","rindex","rmdir","say","scalar","seek","seekdir","select","semctl","semget","semop","send","setgrent","sethostent","setnetent","setpgrp","setpriority","setprotoent","setpwent","setservent","setsockopt","shift","shmctl","shmget","shmread","shmwrite","shutdown","sin","sleep","socket","socketpair","sort","splice","split","sprintf","sqrt","srand","stat","state","study","sub","substr","symlink","syscall","sysopen","sysread","sysseek","system","syswrite","tell","telldir","tie","tied","time","times","tr","truncate","uc","ucfirst","umask","undef","unless","unlink","unpack","unshift","untie","until","use","utime","values","vec","wait","waitpid","wantarray","warn","when","while","write","x|0","xor","y|0"],i=/[dualxmsipngr]{0,12}/,o={$pattern:/[\w.]+/,keyword:t.join(" ")},u={className:"subst",begin:"[$@]\\{",end:"\\}",keywords:o},r={begin:/->\{/,end:/\}/},a={scope:"attr",match:/\s+:\s*\w+(\s*\(.*?\))?/},s={scope:"variable",variants:[{begin:/\$\d/},{begin:n.concat(/[$%@](?!")(\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/,"(?![A-Za-z])(?![@$%])")},{begin:/[$%@](?!")[^\s\w{=]|\$=/,relevance:0}],contains:[a]},c={className:"number",variants:[{match:/0?\.[0-9][0-9_]+\b/},{match:/\bv?(0|[1-9][0-9_]*(\.[0-9_]+)?|[1-9][0-9_]*)\b/},{match:/\b0[0-7][0-7_]*\b/},{match:/\b0x[0-9a-fA-F][0-9a-fA-F_]*\b/},{match:/\b0b[0-1][0-1_]*\b/}],relevance:0},d=[e.BACKSLASH_ESCAPE,u,s],E=[/!/,/\//,/\|/,/\?/,/'/,/"/,/#/],b=(h,S,T="\\1")=>{let x=T==="\\1"?T:n.concat(T,S);return n.concat(n.concat("(?:",h,")"),S,/(?:\\.|[^\\\/])*?/,x,/(?:\\.|[^\\\/])*?/,T,i)},p=(h,S,T)=>n.concat(n.concat("(?:",h,")"),S,/(?:\\.|[^\\\/])*?/,T,i),N=[s,e.HASH_COMMENT_MODE,e.COMMENT(/^=\w/,/=cut/,{endsWithParent:!0}),r,{className:"string",contains:d,variants:[{begin:"q[qwxr]?\\s*\\(",end:"\\)",relevance:5},{begin:"q[qwxr]?\\s*\\[",end:"\\]",relevance:5},{begin:"q[qwxr]?\\s*\\{",end:"\\}",relevance:5},{begin:"q[qwxr]?\\s*\\|",end:"\\|",relevance:5},{begin:"q[qwxr]?\\s*<",end:">",relevance:5},{begin:"qw\\s+q",end:"q",relevance:5},{begin:"'",end:"'",contains:[e.BACKSLASH_ESCAPE]},{begin:'"',end:'"'},{begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE]},{begin:/\{\w+\}/,relevance:0},{begin:"-?\\w+\\s*=>",relevance:0}]},c,{begin:"(\\/\\/|"+e.RE_STARTERS_RE+"|\\b(split|return|print|reverse|grep)\\b)\\s*",keywords:"split return print reverse grep",relevance:0,contains:[e.HASH_COMMENT_MODE,{className:"regexp",variants:[{begin:b("s|tr|y",n.either(...E,{capture:!0}))},{begin:b("s|tr|y","\\(","\\)")},{begin:b("s|tr|y","\\[","\\]")},{begin:b("s|tr|y","\\{","\\}")}],relevance:2},{className:"regexp",variants:[{begin:/(m|qr)\/\//,relevance:0},{begin:p("(?:m|qr)?",/\//,/\//)},{begin:p("m|qr",n.either(...E,{capture:!0}),/\1/)},{begin:p("m|qr",/\(/,/\)/)},{begin:p("m|qr",/\[/,/\]/)},{begin:p("m|qr",/\{/,/\}/)}]}]},{className:"function",beginKeywords:"sub method",end:"(\\s*\\(.*?\\))?[;{]",excludeEnd:!0,relevance:5,contains:[e.TITLE_MODE,a]},{className:"class",beginKeywords:"class",end:"[;{]",excludeEnd:!0,relevance:5,contains:[e.TITLE_MODE,a,c]},{begin:"-\\w\\b",relevance:0},{begin:"^__DATA__$",end:"^__END__$",subLanguage:"mojolicious",contains:[{begin:"^@@.*",end:"$",className:"comment"}]}];return u.contains=N,r.contains=N,{name:"Perl",aliases:["pl","pm"],keywords:o,contains:N}}bt.exports=Qa});var mt=R((eo,_t)=>{function Ja(e){let n={className:"built_in",begin:"\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"},t=/[a-zA-Z@][a-zA-Z0-9_]*/,a={"variable.language":["this","super"],$pattern:t,keyword:["while","export","sizeof","typedef","const","struct","for","union","volatile","static","mutable","if","do","return","goto","enum","else","break","extern","asm","case","default","register","explicit","typename","switch","continue","inline","readonly","assign","readwrite","self","@synchronized","id","typeof","nonatomic","IBOutlet","IBAction","strong","weak","copy","in","out","inout","bycopy","byref","oneway","__strong","__weak","__block","__autoreleasing","@private","@protected","@public","@try","@property","@end","@throw","@catch","@finally","@autoreleasepool","@synthesize","@dynamic","@selector","@optional","@required","@encode","@package","@import","@defs","@compatibility_alias","__bridge","__bridge_transfer","__bridge_retained","__bridge_retain","__covariant","__contravariant","__kindof","_Nonnull","_Nullable","_Null_unspecified","__FUNCTION__","__PRETTY_FUNCTION__","__attribute__","getter","setter","retain","unsafe_unretained","nonnull","nullable","null_unspecified","null_resettable","class","instancetype","NS_DESIGNATED_INITIALIZER","NS_UNAVAILABLE","NS_REQUIRES_SUPER","NS_RETURNS_INNER_POINTER","NS_INLINE","NS_AVAILABLE","NS_DEPRECATED","NS_ENUM","NS_OPTIONS","NS_SWIFT_UNAVAILABLE","NS_ASSUME_NONNULL_BEGIN","NS_ASSUME_NONNULL_END","NS_REFINED_FOR_SWIFT","NS_SWIFT_NAME","NS_SWIFT_NOTHROW","NS_DURING","NS_HANDLER","NS_ENDHANDLER","NS_VALUERETURN","NS_VOIDRETURN"],literal:["false","true","FALSE","TRUE","nil","YES","NO","NULL"],built_in:["dispatch_once_t","dispatch_queue_t","dispatch_sync","dispatch_async","dispatch_once"],type:["int","float","char","unsigned","signed","short","long","double","wchar_t","unichar","void","bool","BOOL","id|0","_Bool"]},s={$pattern:t,keyword:["@interface","@class","@protocol","@implementation"]};return{name:"Objective-C",aliases:["mm","objc","obj-c","obj-c++","objective-c++"],keywords:a,illegal:"</",contains:[n,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.C_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{className:"string",variants:[{begin:'@"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]}]},{className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma ifdef ifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),{className:"string",begin:/<.*?>/,end:/$/,illegal:"\\n"},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"class",begin:"("+s.keyword.join("|")+")\\b",end:/(\{|$)/,excludeEnd:!0,keywords:s,contains:[e.UNDERSCORE_TITLE_MODE]},{begin:"\\."+e.UNDERSCORE_IDENT_RE,relevance:0}]}}_t.exports=Ja});var ft=R((no,Et)=>{function ja(e){let n=e.regex,t=/(?![A-Za-z0-9])(?![$])/,i=n.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,t),o=n.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,t),u=n.concat(/[A-Z]+/,t),r={scope:"variable",match:"\\$+"+i},a={scope:"meta",variants:[{begin:/<\?php/,relevance:10},{begin:/<\?=/},{begin:/<\?/,relevance:.1},{begin:/\?>/}]},s={scope:"subst",variants:[{begin:/\$\w+/},{begin:/\{\$/,end:/\}/}]},c=e.inherit(e.APOS_STRING_MODE,{illegal:null}),d=e.inherit(e.QUOTE_STRING_MODE,{illegal:null,contains:e.QUOTE_STRING_MODE.contains.concat(s)}),E={begin:/<<<[ \t]*(?:(\w+)|"(\w+)")\n/,end:/[ \t]*(\w+)\b/,contains:e.QUOTE_STRING_MODE.contains.concat(s),"on:begin":(K,H)=>{H.data._beginMatch=K[1]||K[2]},"on:end":(K,H)=>{H.data._beginMatch!==K[1]&&H.ignoreMatch()}},b=e.END_SAME_AS_BEGIN({begin:/<<<[ \t]*'(\w+)'\n/,end:/[ \t]*(\w+)\b/}),p=`[ 	
]`,N={scope:"string",variants:[d,c,E,b]},h={scope:"number",variants:[{begin:"\\b0[bB][01]+(?:_[01]+)*\\b"},{begin:"\\b0[oO][0-7]+(?:_[0-7]+)*\\b"},{begin:"\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b"},{begin:"(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?"}],relevance:0},S=["false","null","true"],T=["__CLASS__","__DIR__","__FILE__","__FUNCTION__","__COMPILER_HALT_OFFSET__","__LINE__","__METHOD__","__NAMESPACE__","__TRAIT__","die","echo","exit","include","include_once","print","require","require_once","array","abstract","and","as","binary","bool","boolean","break","callable","case","catch","class","clone","const","continue","declare","default","do","double","else","elseif","empty","enddeclare","endfor","endforeach","endif","endswitch","endwhile","enum","eval","extends","final","finally","float","for","foreach","from","global","goto","if","implements","instanceof","insteadof","int","integer","interface","isset","iterable","list","match|0","mixed","new","never","object","or","private","protected","public","readonly","real","return","string","switch","throw","trait","try","unset","use","var","void","while","xor","yield"],x=["Error|0","AppendIterator","ArgumentCountError","ArithmeticError","ArrayIterator","ArrayObject","AssertionError","BadFunctionCallException","BadMethodCallException","CachingIterator","CallbackFilterIterator","CompileError","Countable","DirectoryIterator","DivisionByZeroError","DomainException","EmptyIterator","ErrorException","Exception","FilesystemIterator","FilterIterator","GlobIterator","InfiniteIterator","InvalidArgumentException","IteratorIterator","LengthException","LimitIterator","LogicException","MultipleIterator","NoRewindIterator","OutOfBoundsException","OutOfRangeException","OuterIterator","OverflowException","ParentIterator","ParseError","RangeException","RecursiveArrayIterator","RecursiveCachingIterator","RecursiveCallbackFilterIterator","RecursiveDirectoryIterator","RecursiveFilterIterator","RecursiveIterator","RecursiveIteratorIterator","RecursiveRegexIterator","RecursiveTreeIterator","RegexIterator","RuntimeException","SeekableIterator","SplDoublyLinkedList","SplFileInfo","SplFileObject","SplFixedArray","SplHeap","SplMaxHeap","SplMinHeap","SplObjectStorage","SplObserver","SplPriorityQueue","SplQueue","SplStack","SplSubject","SplTempFileObject","TypeError","UnderflowException","UnexpectedValueException","UnhandledMatchError","ArrayAccess","BackedEnum","Closure","Fiber","Generator","Iterator","IteratorAggregate","Serializable","Stringable","Throwable","Traversable","UnitEnum","WeakReference","WeakMap","Directory","__PHP_Incomplete_Class","parent","php_user_filter","self","static","stdClass"],v={keyword:T,literal:(K=>{let H=[];return K.forEach(l=>{H.push(l),l.toLowerCase()===l?H.push(l.toUpperCase()):H.push(l.toLowerCase())}),H})(S),built_in:x},M=K=>K.map(H=>H.replace(/\|\d+$/,"")),k={variants:[{match:[/new/,n.concat(p,"+"),n.concat("(?!",M(x).join("\\b|"),"\\b)"),o],scope:{1:"keyword",4:"title.class"}}]},L=n.concat(i,"\\b(?!\\()"),D={variants:[{match:[n.concat(/::/,n.lookahead(/(?!class\b)/)),L],scope:{2:"variable.constant"}},{match:[/::/,/class/],scope:{2:"variable.language"}},{match:[o,n.concat(/::/,n.lookahead(/(?!class\b)/)),L],scope:{1:"title.class",3:"variable.constant"}},{match:[o,n.concat("::",n.lookahead(/(?!class\b)/))],scope:{1:"title.class"}},{match:[o,/::/,/class/],scope:{1:"title.class",3:"variable.language"}}]},U={scope:"attr",match:n.concat(i,n.lookahead(":"),n.lookahead(/(?!::)/))},W={relevance:0,begin:/\(/,end:/\)/,keywords:v,contains:[U,r,D,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,N,h,k]},Q={relevance:0,match:[/\b/,n.concat("(?!fn\\b|function\\b|",M(T).join("\\b|"),"|",M(x).join("\\b|"),"\\b)"),i,n.concat(p,"*"),n.lookahead(/(?=\()/)],scope:{3:"title.function.invoke"},contains:[W]};W.contains.push(Q);let J=[U,D,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,N,h,k],ne={begin:n.concat(/#\[\s*\\?/,n.either(o,u)),beginScope:"meta",end:/]/,endScope:"meta",keywords:{literal:S,keyword:["new","array"]},contains:[{begin:/\[/,end:/]/,keywords:{literal:S,keyword:["new","array"]},contains:["self",...J]},...J,{scope:"meta",variants:[{match:o},{match:u}]}]};return{case_insensitive:!1,keywords:v,contains:[ne,e.HASH_COMMENT_MODE,e.COMMENT("//","$"),e.COMMENT("/\\*","\\*/",{contains:[{scope:"doctag",match:"@[A-Za-z]+"}]}),{match:/__halt_compiler\(\);/,keywords:"__halt_compiler",starts:{scope:"comment",end:e.MATCH_NOTHING_RE,contains:[{match:/\?>/,scope:"meta",endsParent:!0}]}},a,{scope:"variable.language",match:/\$this\b/},r,Q,D,{match:[/const/,/\s/,i],scope:{1:"keyword",3:"variable.constant"}},k,{scope:"function",relevance:0,beginKeywords:"fn function",end:/[;{]/,excludeEnd:!0,illegal:"[$%\\[]",contains:[{beginKeywords:"use"},e.UNDERSCORE_TITLE_MODE,{begin:"=>",endsParent:!0},{scope:"params",begin:"\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0,keywords:v,contains:["self",ne,r,D,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,N,h]}]},{scope:"class",variants:[{beginKeywords:"enum",illegal:/[($"]/},{beginKeywords:"class interface trait",illegal:/[:($"]/}],relevance:0,end:/\{/,excludeEnd:!0,contains:[{beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"namespace",relevance:0,end:";",illegal:/[.']/,contains:[e.inherit(e.UNDERSCORE_TITLE_MODE,{scope:"title.class"})]},{beginKeywords:"use",relevance:0,end:";",contains:[{match:/\b(as|const|function)\b/,scope:"keyword"},e.UNDERSCORE_TITLE_MODE]},N,h]}}Et.exports=ja});var Nt=R((to,ht)=>{function er(e){return{name:"PHP template",subLanguage:"xml",contains:[{begin:/<\?(php|=)?/,end:/\?>/,subLanguage:"php",contains:[{begin:"/\\*",end:"\\*/",skip:!0},{begin:'b"',end:'"',skip:!0},{begin:"b'",end:"'",skip:!0},e.inherit(e.APOS_STRING_MODE,{illegal:null,className:null,contains:null,skip:!0}),e.inherit(e.QUOTE_STRING_MODE,{illegal:null,className:null,contains:null,skip:!0})]}]}}ht.exports=er});var Tt=R((io,yt)=>{function nr(e){return{name:"Plain text",aliases:["text","txt"],disableAutodetect:!0}}yt.exports=nr});var Ot=R((ao,St)=>{function tr(e){let n=e.regex,t=/[\p{XID_Start}_]\p{XID_Continue}*/u,i=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","lazy","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],a={$pattern:/[A-Za-z]\w+|__\w+__/,keyword:i,built_in:["__import__","abs","aiter","all","anext","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozendict","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","sentinel","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]},s={className:"meta",begin:/^(>>>|\.\.\.) /},c={className:"subst",begin:/\{/,end:/\}/,keywords:a,illegal:/#/},d={begin:/\{\{/,relevance:0},E={className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,s],relevance:10},{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,s],relevance:10},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,s,d,c]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,s,d,c]},{begin:/([uU]|[rR])'/,end:/'/,relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,end:/"/},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'/,end:/'/,contains:[e.BACKSLASH_ESCAPE,d,c]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,d,c]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},b="[0-9](_?[0-9])*",p=`(\\b(${b}))?\\.(${b})|\\b(${b})\\.`,N=`\\b|${i.join("|")}`,h={className:"number",relevance:0,variants:[{begin:`(\\b(${b})|(${p}))[eE][+-]?(${b})[jJ]?(?=${N})`},{begin:`(${p})[jJ]?`},{begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${N})`},{begin:`\\b0[bB](_?[01])+[lL]?(?=${N})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${N})`},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${N})`},{begin:`\\b(${b})[jJ](?=${N})`}]},S={className:"comment",begin:n.lookahead(/# type:/),end:/$/,keywords:a,contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},T={className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:["self",s,h,E,e.HASH_COMMENT_MODE]}]};return c.contains=[E,h,s],{name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:a,illegal:/(<\/|\?)|=>/,contains:[s,h,{scope:"variable.language",match:/\bself\b/},{beginKeywords:"if",relevance:0},{match:/\bor\b/,scope:"keyword"},E,S,e.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,t],scope:{1:"keyword",3:"title.function"},contains:[T]},{variants:[{match:[/\bclass/,/\s+/,t,/\s*/,/\(\s*/,t,/\s*\)/]},{match:[/\bclass/,/\s+/,t]}],scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[h,T,E]}]}}St.exports=tr});var vt=R((ro,wt)=>{function ir(e){return{aliases:["pycon"],contains:[{className:"meta.prompt",starts:{end:/ |$/,starts:{end:"$",subLanguage:"python"}},variants:[{begin:/^>>>(?=[ ]|$)/},{begin:/^\.\.\.(?=[ ]|$)/}]}]}}wt.exports=ir});var Rt=R((oo,At)=>{function ar(e){let n=e.regex,t=/(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,i=n.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,/0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/),o=/[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,u=n.either(/[()]/,/[{}]/,/\[\[/,/[[\]]/,/\\/,/,/);return{name:"R",keywords:{$pattern:t,keyword:"function if in break next repeat else for while",literal:"NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",built_in:"LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"},contains:[e.COMMENT(/#'/,/$/,{contains:[{scope:"doctag",match:/@examples/,starts:{end:n.lookahead(n.either(/\n^#'\s*(?=@[a-zA-Z]+)/,/\n^(?!#')/)),endsParent:!0}},{scope:"doctag",begin:"@param",end:/$/,contains:[{scope:"variable",variants:[{match:t},{match:/`(?:\\.|[^`\\])+`/}],endsParent:!0}]},{scope:"doctag",match:/@[a-zA-Z]+/},{scope:"keyword",match:/\\[a-zA-Z]+/}]}),e.HASH_COMMENT_MODE,{scope:"string",contains:[e.BACKSLASH_ESCAPE],variants:[e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\(/,end:/\)(-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\{/,end:/\}(-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\[/,end:/\](-*)"/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\(/,end:/\)(-*)'/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\{/,end:/\}(-*)'/}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\[/,end:/\](-*)'/}),{begin:'"',end:'"',relevance:0},{begin:"'",end:"'",relevance:0}]},{relevance:0,variants:[{scope:{1:"operator",2:"number"},match:[o,i]},{scope:{1:"operator",2:"number"},match:[/%[^%]*%/,i]},{scope:{1:"punctuation",2:"number"},match:[u,i]},{scope:{2:"number"},match:[/[^a-zA-Z0-9._]|^/,i]}]},{scope:{3:"operator"},match:[t,/\s+/,/<-/,/\s+/]},{scope:"operator",relevance:0,variants:[{match:o},{match:/%[^%]*%/}]},{scope:"punctuation",relevance:0,match:u},{begin:"`",end:"`",contains:[{begin:/\\./}]}]}}At.exports=ar});var kt=R((so,Mt)=>{function rr(e){let n=e.regex,t=/(r#)?/,i=n.concat(t,e.UNDERSCORE_IDENT_RE),o=n.concat(t,e.IDENT_RE),u={scope:"title.function.invoke",relevance:0,begin:n.concat(/\b/,/(?!(?:let|for|while|if|else|match)\b)/,o,n.lookahead(/\s*\(/))},r="([ui](8|16|32|64|128|size)|f(16|32|64|128))?",a=["abstract","as","async","await","become","box","break","const","continue","crate","do","dyn","else","enum","extern","false","final","fn","for","if","impl","in","let","loop","macro","match","mod","move","mut","override","priv","pub","raw","ref","return","self","Self","static","struct","super","trait","true","try","type","typeof","union","unsafe","unsized","use","virtual","where","while","yield"],s=["true","false","Some","None","Ok","Err"],c=["drop ","Copy","Send","Sized","Sync","Drop","Fn","FnMut","FnOnce","ToOwned","Clone","Debug","PartialEq","PartialOrd","Eq","Ord","AsRef","AsMut","Into","From","Default","Iterator","Extend","IntoIterator","DoubleEndedIterator","ExactSizeIterator","SliceConcatExt","ToString","assert!","assert_eq!","bitflags!","bytes!","cfg!","col!","concat!","concat_idents!","debug_assert!","debug_assert_eq!","env!","eprintln!","panic!","file!","format!","format_args!","include_bytes!","include_str!","line!","local_data_key!","module_path!","option_env!","print!","println!","select!","stringify!","try!","unimplemented!","unreachable!","vec!","write!","writeln!","macro_rules!","assert_ne!","debug_assert_ne!"],d=["i8","i16","i32","i64","i128","isize","u8","u16","u32","u64","u128","usize","f16","f32","f64","f128","str","char","bool","Box","Option","Result","String","Vec"];return{name:"Rust",aliases:["rs"],keywords:{$pattern:e.IDENT_RE+"!?",type:d,keyword:a,literal:s,built_in:c},illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.COMMENT("/\\*","\\*/",{contains:["self"]}),e.inherit(e.QUOTE_STRING_MODE,{begin:/b?"/,illegal:null}),{scope:"symbol",begin:/'[a-zA-Z_][a-zA-Z0-9_]*(?!')/},{scope:"string",variants:[{begin:/b?r(#*)"(.|\n)*?"\1(?!#)/},{begin:/b?'/,end:/'/,contains:[{scope:"char.escape",match:/\\('|"|\\|\w|x\w{2}|u\w{4}|U\w{8})/}]}]},{scope:"number",variants:[{begin:"\\b0b([01_]+)"+r},{begin:"\\b0o([0-7_]+)"+r},{begin:"\\b0x([A-Fa-f0-9_]+)"+r},{begin:"\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)"+r}],relevance:0},{begin:[/\bsafe/,/\s+/,/extern/],scope:{1:"keyword",3:"keyword"}},{begin:[/fn/,/\s+/,i],scope:{1:"keyword",3:"title.function"}},{scope:"meta",begin:"#!?\\[",end:"\\]",contains:[{scope:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE]}]},{begin:[/let/,/\s+/,/(?:mut\s+)?/,i],scope:{1:"keyword",3:"keyword",4:"variable"}},{begin:[/for/,/\s+/,i,/\s+/,/in/],scope:{1:"keyword",3:"variable",5:"keyword"}},{begin:[/type/,/\s+/,i],scope:{1:"keyword",3:"title.class"}},{begin:[/(?:trait|enum|struct|union|impl|for)/,/\s+/,i],scope:{1:"keyword",3:"title.class"}},{begin:e.IDENT_RE+"::",keywords:{keyword:"Self",built_in:c,type:d}},{scope:"punctuation",begin:"->"},u]}}Mt.exports=rr});var Ct=R((co,xt)=>{var or=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{scope:"number",begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,5}(-[0-9A-Fa-f][0-9A-Fa-f]{0,5})?/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),sr=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],cr=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],lr=[...sr,...cr],dr=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),ur=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),gr=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),br=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","corner-bottom-left-shape","corner-bottom-right-shape","corner-shape","corner-top-left-shape","corner-top-right-shape","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse();function pr(e){let n=or(e),t=gr,i=ur,o="@[a-z-]+",u="and or not only",a={className:"variable",begin:"(\\$"+"[a-zA-Z-][a-zA-Z0-9_-]*"+")\\b",relevance:0};return{name:"SCSS",case_insensitive:!0,illegal:"[=/|']",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,n.CSS_NUMBER_MODE,{className:"selector-id",begin:"#[A-Za-z0-9_-]+",relevance:0},{className:"selector-class",begin:"\\.[A-Za-z0-9_-]+",relevance:0},n.ATTRIBUTE_SELECTOR_MODE,{className:"selector-tag",begin:"\\b("+lr.join("|")+")\\b",relevance:0},{className:"selector-pseudo",begin:":("+i.join("|")+")"},{className:"selector-pseudo",begin:":(:)?("+t.join("|")+")"},a,{begin:/\(/,end:/\)/,contains:[n.CSS_NUMBER_MODE]},n.CSS_VARIABLE,{className:"attribute",begin:"\\b("+br.join("|")+")\\b"},{begin:"\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"},{begin:/:/,end:/[;}{]/,relevance:0,contains:[n.BLOCK_COMMENT,a,n.HEXCOLOR,n.CSS_NUMBER_MODE,n.UNICODE_RANGE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,n.IMPORTANT,n.FUNCTION_DISPATCH]},{begin:"@(page|font-face)",keywords:{$pattern:o,keyword:"@page @font-face"}},{begin:"@",end:"[{;]",returnBegin:!0,keywords:{$pattern:/[a-z-]+/,keyword:u,attribute:dr.join(" ")},contains:[{begin:o,className:"keyword"},{begin:/[a-z-]+(?=:)/,className:"attribute"},a,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,n.HEXCOLOR,n.CSS_NUMBER_MODE]},n.FUNCTION_DISPATCH]}}xt.exports=pr});var Lt=R((lo,It)=>{function _r(e){return{name:"Shell Session",aliases:["console","shellsession"],contains:[{className:"meta.prompt",begin:/^\s{0,3}[./~\w\d[\]()@-]*[>%$#][ ]?/,starts:{end:/[^\\](?=\s*$)/,subLanguage:"bash"}}]}}It.exports=_r});var Bt=R((uo,Dt)=>{function mr(e){let n=e.regex,t=e.COMMENT("--","$"),i={scope:"string",variants:[{begin:/'/,end:/'/,contains:[{match:/''/}]}]},o={begin:/"/,end:/"/,contains:[{match:/""/}]},u=["true","false","unknown"],r=["double precision","large object","with timezone","without timezone"],a=["bigint","binary","blob","boolean","char","character","clob","date","dec","decfloat","decimal","float","int","integer","interval","nchar","nclob","national","numeric","real","row","smallint","time","timestamp","varchar","varying","varbinary"],s=["add","asc","collation","desc","final","first","last","view"],c=["abs","acos","all","allocate","alter","and","any","are","array","array_agg","array_max_cardinality","as","asensitive","asin","asymmetric","at","atan","atomic","authorization","avg","begin","begin_frame","begin_partition","between","bigint","binary","blob","boolean","both","by","call","called","cardinality","cascaded","case","cast","ceil","ceiling","char","char_length","character","character_length","check","classifier","clob","close","coalesce","collate","collect","column","commit","condition","connect","constraint","contains","convert","copy","corr","corresponding","cos","cosh","count","covar_pop","covar_samp","create","cross","cube","cume_dist","current","current_catalog","current_date","current_default_transform_group","current_path","current_role","current_row","current_schema","current_time","current_timestamp","current_path","current_role","current_transform_group_for_type","current_user","cursor","cycle","date","day","deallocate","dec","decimal","decfloat","declare","default","define","delete","dense_rank","deref","describe","deterministic","disconnect","distinct","double","drop","dynamic","each","element","else","empty","end","end_frame","end_partition","end-exec","equals","escape","every","except","exec","execute","exists","exp","external","extract","false","fetch","filter","first_value","float","floor","for","foreign","frame_row","free","from","full","function","fusion","get","global","grant","group","grouping","groups","having","hold","hour","identity","in","indicator","initial","inner","inout","insensitive","insert","int","integer","intersect","intersection","interval","into","is","join","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","language","large","last_value","lateral","lead","leading","left","like","like_regex","listagg","ln","local","localtime","localtimestamp","log","log10","lower","match","match_number","match_recognize","matches","max","member","merge","method","min","minute","mod","modifies","module","month","multiset","national","natural","nchar","nclob","new","no","none","normalize","not","nth_value","ntile","null","nullif","numeric","octet_length","occurrences_regex","of","offset","old","omit","on","one","only","open","or","order","out","outer","over","overlaps","overlay","parameter","partition","pattern","per","percent","percent_rank","percentile_cont","percentile_disc","period","portion","position","position_regex","power","precedes","precision","prepare","primary","procedure","ptf","range","rank","reads","real","recursive","ref","references","referencing","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","release","result","return","returns","revoke","right","rollback","rollup","row","row_number","rows","running","savepoint","scope","scroll","search","second","seek","select","sensitive","session_user","set","show","similar","sin","sinh","skip","smallint","some","specific","specifictype","sql","sqlexception","sqlstate","sqlwarning","sqrt","start","static","stddev_pop","stddev_samp","submultiset","subset","substring","substring_regex","succeeds","sum","symmetric","system","system_time","system_user","table","tablesample","tan","tanh","then","time","timestamp","timezone_hour","timezone_minute","to","trailing","translate","translate_regex","translation","treat","trigger","trim","trim_array","true","truncate","uescape","union","unique","unknown","unnest","update","upper","user","using","value","values","value_of","var_pop","var_samp","varbinary","varchar","varying","versioning","when","whenever","where","width_bucket","window","with","within","without","year"],d=["abs","acos","array_agg","asin","atan","avg","cast","ceil","ceiling","coalesce","corr","cos","cosh","count","covar_pop","covar_samp","cume_dist","dense_rank","deref","element","exp","extract","first_value","floor","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","last_value","lead","listagg","ln","log","log10","lower","max","min","mod","nth_value","ntile","nullif","percent_rank","percentile_cont","percentile_disc","position","position_regex","power","rank","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","row_number","sin","sinh","sqrt","stddev_pop","stddev_samp","substring","substring_regex","sum","tan","tanh","translate","translate_regex","treat","trim","trim_array","unnest","upper","value_of","var_pop","var_samp","width_bucket"],E=["current_catalog","current_date","current_default_transform_group","current_path","current_role","current_schema","current_transform_group_for_type","current_user","session_user","system_time","system_user","current_time","localtime","current_timestamp","localtimestamp"],b=["create table","insert into","primary key","foreign key","not null","alter table","add constraint","grouping sets","on overflow","character set","respect nulls","ignore nulls","nulls first","nulls last","depth first","breadth first"],p=d,N=[...c,...s].filter(M=>!d.includes(M)),h={scope:"variable",match:/@[a-z0-9][a-z0-9_]*/},S={scope:"operator",match:/[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,relevance:0},T={match:n.concat(/\b/,n.either(...p),/\s*\(/),relevance:0,keywords:{built_in:p}};function x(M){return n.concat(/\b/,n.either(...M.map(k=>k.replace(/\s+/,"\\s+"))),/\b/)}let I={scope:"keyword",match:x(b),relevance:0};function v(M,{exceptions:k,when:L}={}){let D=L;return k=k||[],M.map(U=>U.match(/\|\d+$/)||k.includes(U)?U:D(U)?`${U}|0`:U)}return{name:"SQL",case_insensitive:!0,illegal:/[{}]|<\//,keywords:{$pattern:/\b[\w\.]+/,keyword:v(N,{when:M=>M.length<3}),literal:u,type:a,built_in:E},contains:[{scope:"type",match:x(r)},I,T,h,i,o,e.C_NUMBER_MODE,e.C_BLOCK_COMMENT_MODE,t,S]}}Dt.exports=mr});var qt=R((go,Ht)=>{function zt(e){return e?typeof e=="string"?e:e.source:null}function fe(e){return F("(?=",e,")")}function F(...e){return e.map(t=>zt(t)).join("")}function Er(e){let n=e[e.length-1];return typeof n=="object"&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}function Z(...e){return"("+(Er(e).capture?"":"?:")+e.map(i=>zt(i)).join("|")+")"}new RegExp(Z(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));var Qe=e=>F(/\b/,e,/\w$/.test(e)?/\b/:/\B/),fr=["Protocol","Type"].map(Qe),Ut=["init","self"].map(Qe),hr=["Any","Self"],Xe=["actor","any","associatedtype","async","await",/as\?/,/as!/,"as","borrowing","break","case","catch","class","consume","consuming","continue","convenience","copy","default","defer","deinit","didSet","distributed","do","dynamic","each","else","enum","extension","fallthrough",/fileprivate\(set\)/,"fileprivate","final","for","func","get","guard","if","import","indirect","infix",/init\?/,/init!/,"inout",/internal\(set\)/,"internal","in","is","isolated","nonisolated","lazy","let","macro","mutating","nonmutating",/open\(set\)/,"open","operator","optional","override","package","postfix","precedencegroup","prefix",/private\(set\)/,"private","protocol",/public\(set\)/,"public","repeat","required","rethrows","return","set","some","static","struct","subscript","super","switch","throws","throw",/try\?/,/try!/,"try","typealias",/unowned\(safe\)/,/unowned\(unsafe\)/,"unowned","var","weak","where","while","willSet"],Pt=["false","nil","true"],Nr=["assignment","associativity","higherThan","left","lowerThan","none","right"],yr=["#colorLiteral","#column","#dsohandle","#else","#elseif","#endif","#error","#file","#fileID","#fileLiteral","#filePath","#function","#if","#imageLiteral","#keyPath","#line","#selector","#sourceLocation","#warning"],Ft=["abs","all","any","assert","assertionFailure","debugPrint","dump","fatalError","getVaList","isKnownUniquelyReferenced","max","min","numericCast","pointwiseMax","pointwiseMin","precondition","preconditionFailure","print","readLine","repeatElement","sequence","stride","swap","swift_unboxFromSwiftValueWithType","transcode","type","unsafeBitCast","unsafeDowncast","withExtendedLifetime","withUnsafeMutablePointer","withUnsafePointer","withVaList","withoutActuallyEscaping","zip"],$t=Z(/[/=\-+!*%<>&|^~?]/,/[\u00A1-\u00A7]/,/[\u00A9\u00AB]/,/[\u00AC\u00AE]/,/[\u00B0\u00B1]/,/[\u00B6\u00BB\u00BF\u00D7\u00F7]/,/[\u2016-\u2017]/,/[\u2020-\u2027]/,/[\u2030-\u203E]/,/[\u2041-\u2053]/,/[\u2055-\u205E]/,/[\u2190-\u23FF]/,/[\u2500-\u2775]/,/[\u2794-\u2BFF]/,/[\u2E00-\u2E7F]/,/[\u3001-\u3003]/,/[\u3008-\u3020]/,/[\u3030]/),Gt=Z($t,/[\u0300-\u036F]/,/[\u1DC0-\u1DFF]/,/[\u20D0-\u20FF]/,/[\uFE00-\uFE0F]/,/[\uFE20-\uFE2F]/),Ve=F($t,Gt,"*"),Kt=Z(/[a-zA-Z_]/,/[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/,/[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/,/[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/,/[\u1E00-\u1FFF]/,/[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/,/[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/,/[\u2C00-\u2DFF\u2E80-\u2FFF]/,/[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/,/[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/,/[\uFE47-\uFEFE\uFF00-\uFFFD]/),Le=Z(Kt,/\d/,/[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/),te=F(Kt,Le,"*"),Ie=F(/[A-Z]/,Le,"*"),Tr=["attached","autoclosure",F(/convention\(/,Z("swift","block","c"),/\)/),"discardableResult","dynamicCallable","dynamicMemberLookup","escaping","freestanding","frozen","GKInspectable","IBAction","IBDesignable","IBInspectable","IBOutlet","IBSegueAction","inlinable","main","nonobjc","NSApplicationMain","NSCopying","NSManaged",F(/objc\(/,te,/\)/),"objc","objcMembers","propertyWrapper","requires_stored_property_inits","resultBuilder","Sendable","testable","UIApplicationMain","unchecked","unknown","usableFromInline","warn_unqualified_access"],Sr=["iOS","iOSApplicationExtension","macOS","macOSApplicationExtension","macCatalyst","macCatalystApplicationExtension","watchOS","watchOSApplicationExtension","tvOS","tvOSApplicationExtension","swift"];function Or(e){let n={match:/\s+/,relevance:0},t=e.COMMENT("/\\*","\\*/",{contains:["self"]}),i=[e.C_LINE_COMMENT_MODE,t],o={match:[/\./,Z(...fr,...Ut)],className:{2:"keyword"}},u={match:F(/\./,Z(...Xe)),relevance:0},r=Xe.filter(P=>typeof P=="string").concat(["_|0"]),a=Xe.filter(P=>typeof P!="string").concat(hr).map(Qe),s={variants:[{className:"keyword",match:Z(...a,...Ut)}]},c={$pattern:Z(/\b\w+/,/#\w+/),keyword:r.concat(yr),literal:Pt},d=[o,u,s],E={match:F(/\./,Z(...Ft)),relevance:0},b={className:"built_in",match:F(/\b/,Z(...Ft),/(?=\()/)},p=[E,b],N={match:/->/,relevance:0},h={className:"operator",relevance:0,variants:[{match:Ve},{match:`\\.(\\.|${Gt})+`}]},S=[N,h],T="([0-9]_*)+",x="([0-9a-fA-F]_*)+",I={className:"number",relevance:0,variants:[{match:`\\b(${T})(\\.(${T}))?([eE][+-]?(${T}))?\\b`},{match:`\\b0x(${x})(\\.(${x}))?([pP][+-]?(${T}))?\\b`},{match:/\b0o([0-7]_*)+\b/},{match:/\b0b([01]_*)+\b/}]},v=(P="")=>({className:"subst",variants:[{match:F(/\\/,P,/[0\\tnr"']/)},{match:F(/\\/,P,/u\{[0-9a-fA-F]{1,8}\}/)}]}),M=(P="")=>({className:"subst",match:F(/\\/,P,/[\t ]*(?:[\r\n]|\r\n)/)}),k=(P="")=>({className:"subst",label:"interpol",begin:F(/\\/,P,/\(/),end:/\)/}),L=(P="")=>({begin:F(P,/"""/),end:F(/"""/,P),contains:[v(P),M(P),k(P)]}),D=(P="")=>({begin:F(P,/"/),end:F(/"/,P),contains:[v(P),k(P)]}),U={className:"string",variants:[L(),L("#"),L("##"),L("###"),D(),D("#"),D("##"),D("###")]},W=[e.BACKSLASH_ESCAPE,{begin:/\[/,end:/\]/,relevance:0,contains:[e.BACKSLASH_ESCAPE]}],Q={begin:/\/[^\s](?=[^/\n]*\/)/,end:/\//,contains:W},J=P=>{let ae=F(P,/\//),y=F(/\//,P);return{begin:ae,end:y,contains:[...W,{scope:"comment",begin:`#(?!.*${y})`,end:/$/}]}},ne={scope:"regexp",variants:[J("###"),J("##"),J("#"),Q]},K={match:F(/`/,te,/`/)},H={className:"variable",match:/\$\d+/},l={className:"variable",match:`\\$${Le}+`},_=[K,H,l],m={match:/(@|#(un)?)available/,scope:"keyword",starts:{contains:[{begin:/\(/,end:/\)/,keywords:Sr,contains:[...S,I,U]}]}},O={scope:"keyword",match:F(/@/,Z(...Tr),fe(Z(/\(/,/\s+/)))},C={scope:"meta",match:F(/@/,te)},z=[m,O,C],G={match:fe(/\b[A-Z]/),relevance:0,contains:[{className:"type",match:F(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/,Le,"+")},{className:"type",match:Ie,relevance:0},{match:/[?!]+/,relevance:0},{match:/\.\.\./,relevance:0},{match:F(/\s+&\s+/,fe(Ie)),relevance:0}]},j={begin:/</,end:/>/,keywords:c,contains:[...i,...d,...z,N,G]};G.contains.push(j);let X={match:F(te,/\s*:/),keywords:"_|0",relevance:0},V={begin:/\(/,end:/\)/,relevance:0,keywords:c,contains:["self",X,...i,ne,...d,...p,...S,I,U,..._,...z,G]},le={begin:/</,end:/>/,keywords:"repeat each",contains:[...i,G]},he={begin:Z(fe(F(te,/\s*:/)),fe(F(te,/\s+/,te,/\s*:/))),end:/:/,relevance:0,contains:[{className:"keyword",match:/\b_\b/},{className:"params",match:te}]},_e={begin:/\(/,end:/\)/,keywords:c,contains:[he,...i,...d,...S,I,U,...z,G,V],endsParent:!0,illegal:/["']/},Be={match:[/(func|macro)/,/\s+/,Z(K.match,te,Ve)],className:{1:"keyword",3:"title.function"},contains:[le,_e,n],illegal:[/\[/,/%/]},Ue={match:[/\b(?:subscript|init[?!]?)/,/\s*(?=[<(])/],className:{1:"keyword"},contains:[le,_e,n],illegal:/\[|%/},Pe={match:[/operator/,/\s+/,Ve],className:{1:"keyword",3:"title"}},Fe={begin:[/precedencegroup/,/\s+/,Ie],className:{1:"keyword",3:"title"},contains:[G],keywords:[...Nr,...Pt],end:/}/},de={match:[/class\b/,/\s+/,/func\b/,/\s+/,/\b[A-Za-z_][A-Za-z0-9_]*\b/],scope:{1:"keyword",3:"keyword",5:"title.function"}},Ne={match:[/class\b/,/\s+/,/var\b/],scope:{1:"keyword",3:"keyword"}},ee={begin:[/(struct|protocol|class|extension|enum|actor)/,/\s+/,te,/\s*/],beginScope:{1:"keyword",3:"title.class"},keywords:c,contains:[le,...d,{begin:/:/,end:/\{/,keywords:c,contains:[{scope:"title.class.inherited",match:Ie},...d],relevance:0}]};for(let P of U.variants){let ae=P.contains.find(ye=>ye.label==="interpol");ae.keywords=c;let y=[...d,...p,...S,I,U,..._];ae.contains=[...y,{begin:/\(/,end:/\)/,contains:["self",...y]}]}return{name:"Swift",keywords:c,contains:[...i,Be,Ue,de,Ne,ee,Pe,Fe,{beginKeywords:"import",end:/$/,contains:[...i],relevance:0},ne,...d,...p,...S,I,U,..._,...z,G,V]}}Ht.exports=Or});var Yt=R((bo,Wt)=>{function wr(e){let n="true false yes no null",t="[\\w#;/?:@&=+$,.~*'()[\\]]+",i={className:"attr",variants:[{begin:/[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/},{begin:/"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/},{begin:/'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/}]},o={className:"template-variable",variants:[{begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]},u={className:"string",relevance:0,begin:/'/,end:/'/,contains:[{match:/''/,scope:"char.escape",relevance:0}]},r={className:"string",relevance:0,variants:[{begin:/"/,end:/"/},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,o]},a=e.inherit(r,{variants:[{begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]},{begin:/"/,end:/"/},{begin:/[^\s,{}[\]]+/}]}),b={className:"number",begin:"\\b"+"[0-9]{4}(-[0-9][0-9]){0,2}"+"([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?"+"(\\.[0-9]*)?"+"([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?"+"\\b"},p={end:",",endsWithParent:!0,excludeEnd:!0,keywords:n,relevance:0},N={begin:/\{/,end:/\}/,contains:[p],illegal:"\\n",relevance:0},h={begin:"\\[",end:"\\]",contains:[p],illegal:"\\n",relevance:0},S=[i,{className:"meta",begin:"^---\\s*$",relevance:10},{className:"string",begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!\\w+!"+t},{className:"type",begin:"!<"+t+">"},{className:"type",begin:"!"+t},{className:"type",begin:"!!"+t},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},b,{className:"number",begin:e.C_NUMBER_RE+"\\b",relevance:0},N,h,u,r],T=[...S];return T.pop(),T.push(a),p.contains=T,{name:"YAML",case_insensitive:!0,aliases:["yml"],contains:S}}Wt.exports=wr});var ti=R((po,ni)=>{var De="[A-Za-z$_][0-9A-Za-z$_]*",Zt=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Xt=["true","false","null","undefined","NaN","Infinity"],Vt=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Qt=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Jt=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],jt=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","self","global"],ei=[].concat(Jt,Vt,Qt);function vr(e){let n=e.regex,t=(m,{after:O})=>{let C="</"+m[0].slice(1);return m.input.indexOf(C,O)!==-1},i=De,o={begin:"<>",end:"</>"},u=/<[A-Za-z0-9\\._:-]+\s*\/>/,r={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(m,O)=>{let C=m[0].length+m.index,z=m.input[C];if(z==="<"||z===","){O.ignoreMatch();return}z===">"&&(t(m,{after:C})||O.ignoreMatch());let G,j=m.input.substring(C);if(G=j.match(/^\s*=/)){O.ignoreMatch();return}if((G=j.match(/^\s+extends\s+/))&&G.index===0){O.ignoreMatch();return}}},a={$pattern:De,keyword:Zt,literal:Xt,built_in:ei,"variable.language":jt},s="[0-9](_?[0-9])*",c=`\\.(${s})`,d="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",E={className:"number",variants:[{begin:`(\\b(${d})((${c})|\\.)?|(${c}))[eE][+-]?(${s})\\b`},{begin:`\\b(${d})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},b={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},p={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"xml"}},N={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"css"}},h={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"graphql"}},S={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,b]},x={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:i+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},I=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,p,N,h,S,{match:/\$\d+/},E];b.contains=I.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(I)});let v=[].concat(x,b.contains),M=v.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(v)}]),k={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:M},L={variants:[{match:[/class/,/\s+/,i,/\s+/,/extends/,/\s+/,n.concat(i,"(",n.concat(/\./,i),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,i],scope:{1:"keyword",3:"title.class"}}]},D={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Vt,...Qt]}},U={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},W={variants:[{match:[/function/,/\s+/,i,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[k],illegal:/%/},Q={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function J(m){return n.concat("(?!",m.join("|"),")")}let ne={match:n.concat(/\b/,J([...Jt,"super","import","await"].map(m=>`${m}\\s*\\(`)),i,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},K={begin:n.concat(/\./,n.lookahead(n.concat(i,/(?![0-9A-Za-z$_(])/))),end:i,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},H={match:[/get|set/,/\s+/,i,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},k]},l="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",_={match:[/const|var|let/,/\s+/,i,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(l)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[k]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:M,CLASS_REFERENCE:D},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),U,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,p,N,h,S,x,{match:/\$\d+/},E,D,{scope:"attr",match:i+n.lookahead(":"),relevance:0},_,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[x,e.REGEXP_MODE,{className:"function",begin:l,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:M}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:o.begin,end:o.end},{match:u},{begin:r.begin,"on:begin":r.isTrulyOpeningTag,end:r.end}],subLanguage:"xml",contains:[{begin:r.begin,end:r.end,skip:!0,contains:["self"]}]}]},W,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[k,e.inherit(e.TITLE_MODE,{begin:i,className:"title.function"})]},{match:/\.\.\./,relevance:0},K,{match:"\\$"+i,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[k]},ne,Q,L,H,{match:/\$[(.]/}]}}function Ar(e){let n=e.regex,t=vr(e),i=De,o=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],u={begin:[/namespace/,/\s+/,e.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},r={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:o},contains:[t.exports.CLASS_REFERENCE]},a={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},s=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],c={$pattern:De,keyword:Zt.concat(s),literal:Xt,built_in:ei.concat(o),"variable.language":jt},d={className:"meta",begin:"@"+i},E=(h,S,T)=>{let x=h.contains.findIndex(I=>I.label===S);if(x===-1)throw new Error("can not find mode to replace");h.contains.splice(x,1,T)};Object.assign(t.keywords,c),t.exports.PARAMS_CONTAINS.push(d);let b=t.contains.find(h=>h.scope==="attr"),p=Object.assign({},b,{match:n.concat(i,n.lookahead(/\s*\?:/))});t.exports.PARAMS_CONTAINS.push([t.exports.CLASS_REFERENCE,b,p]),t.contains=t.contains.concat([d,u,r,p]),E(t,"shebang",e.SHEBANG()),E(t,"use_strict",a);let N=t.contains.find(h=>h.label==="func.def");return N.relevance=0,Object.assign(t,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),t}ni.exports=Ar});var ai=R((_o,ii)=>{function Rr(e){let n=e.regex,t={className:"string",begin:/"(""|[^/n])"C\b/},i={className:"string",begin:/"/,end:/"/,illegal:/\n/,contains:[{begin:/""/}]},o=/\d{1,2}\/\d{1,2}\/\d{4}/,u=/\d{4}-\d{1,2}-\d{1,2}/,r=/(\d|1[012])(:\d+){0,2} *(AM|PM)/,a=/\d{1,2}(:\d{1,2}){1,2}/,s={className:"literal",variants:[{begin:n.concat(/# */,n.either(u,o),/ *#/)},{begin:n.concat(/# */,a,/ *#/)},{begin:n.concat(/# */,r,/ *#/)},{begin:n.concat(/# */,n.either(u,o),/ +/,n.either(r,a),/ *#/)}]},c={className:"number",relevance:0,variants:[{begin:/\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/},{begin:/\b\d[\d_]*((U?[SIL])|[%&])?/},{begin:/&H[\dA-F_]+((U?[SIL])|[%&])?/},{begin:/&O[0-7_]+((U?[SIL])|[%&])?/},{begin:/&B[01_]+((U?[SIL])|[%&])?/}]},d={className:"label",begin:/^\w+:/},E=e.COMMENT(/'''/,/$/,{contains:[{className:"doctag",begin:/<\/?/,end:/>/}]}),b=e.COMMENT(null,/$/,{variants:[{begin:/'/},{begin:/([\t ]|^)REM(?=\s)/}]});return{name:"Visual Basic .NET",aliases:["vb"],case_insensitive:!0,classNameAliases:{label:"symbol"},keywords:{keyword:"addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",built_in:"addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",type:"boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",literal:"true false nothing"},illegal:"//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",contains:[t,i,s,c,d,E,b,{className:"meta",begin:/[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,end:/$/,keywords:{keyword:"const disable else elseif enable end externalsource if region then"},contains:[b]}]}}ii.exports=Rr});var oi=R((mo,ri)=>{function Mr(e){e.regex;let n=e.COMMENT(/\(;/,/;\)/);n.contains.push("self");let t=e.COMMENT(/;;/,/$/),i=["anyfunc","block","br","br_if","br_table","call","call_indirect","data","drop","elem","else","end","export","func","global.get","global.set","local.get","local.set","local.tee","get_global","get_local","global","if","import","local","loop","memory","memory.grow","memory.size","module","mut","nop","offset","param","result","return","select","set_global","set_local","start","table","tee_local","then","type","unreachable"],o={begin:[/(?:func|call|call_indirect)/,/\s+/,/\$[^\s)]+/],className:{1:"keyword",3:"title.function"}},u={className:"variable",begin:/\$[\w_]+/},r={match:/(\((?!;)|\))+/,className:"punctuation",relevance:0},a={className:"number",relevance:0,match:/[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/},s={match:/(i32|i64|f32|f64)(?!\.)/,className:"type"},c={className:"keyword",match:/\b(f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))\b/};return{name:"WebAssembly",keywords:{$pattern:/[\w.]+/,keyword:i},contains:[t,n,{match:[/(?:offset|align)/,/\s*/,/=/],className:{1:"keyword",3:"operator"}},u,r,o,e.QUOTE_STRING_MODE,s,c,a]}}ri.exports=Mr});var ci=R((Eo,si)=>{var w=Nn();w.registerLanguage("xml",Tn());w.registerLanguage("bash",On());w.registerLanguage("c",vn());w.registerLanguage("cpp",Rn());w.registerLanguage("csharp",kn());w.registerLanguage("css",Cn());w.registerLanguage("markdown",Ln());w.registerLanguage("diff",Bn());w.registerLanguage("ruby",Pn());w.registerLanguage("go",zn());w.registerLanguage("graphql",Gn());w.registerLanguage("ini",Hn());w.registerLanguage("java",Zn());w.registerLanguage("javascript",et());w.registerLanguage("json",tt());w.registerLanguage("kotlin",at());w.registerLanguage("less",ct());w.registerLanguage("lua",dt());w.registerLanguage("makefile",gt());w.registerLanguage("perl",pt());w.registerLanguage("objectivec",mt());w.registerLanguage("php",ft());w.registerLanguage("php-template",Nt());w.registerLanguage("plaintext",Tt());w.registerLanguage("python",Ot());w.registerLanguage("python-repl",vt());w.registerLanguage("r",Rt());w.registerLanguage("rust",kt());w.registerLanguage("scss",Ct());w.registerLanguage("shell",Lt());w.registerLanguage("sql",Bt());w.registerLanguage("swift",qt());w.registerLanguage("yaml",Yt());w.registerLanguage("typescript",ti());w.registerLanguage("vbnet",ai());w.registerLanguage("wasm",oi());w.HighlightJS=w;w.default=w;si.exports=w});var xr={};fi(xr,{default:()=>kr});var li=hi(ci(),1);var Je=li.default;function di(e){let n=[{begin:/\$([a-zA-Z_][\w-]*)\s*\(/,className:"title function_",endsWithParent:!0,variants:[{begin:/\$([a-zA-Z_][\w-]*)\s*\(/,end:/\(/,returnBegin:!0,excludeEnd:!0,relevance:10}]},{begin:/\b(bind|use|transition|in|out|animate|class|style):/gm,className:"variable",relevance:10}];return{subLanguage:"xml",contains:[e.COMMENT("<!--","-->",{relevance:10}),{begin:/<script(?!.*lang=["']ts["'])>/gm,end:/<\/script>/gm,subLanguage:"javascript",excludeBegin:!0,excludeEnd:!0,contains:n},{begin:/<script\s+lang=["']ts["']>/gm,end:/<\/script>/gm,subLanguage:"typescript",excludeBegin:!0,excludeEnd:!0,contains:n},{begin:/^(\s*)(<style.*>)/gm,end:/^(\s*)(<\/style>)/gm,subLanguage:"css",excludeBegin:!0,excludeEnd:!0},{begin:/\{/,end:/\}/,subLanguage:"javascript",contains:[e.COMMENT(/\/\*/,/\*\//),{begin:/\{/,end:/\}/,skip:!0},{begin:/[#@/][a-zA-Z_][\w-]*/,className:"keyword",relevance:10}]}]}}Je.registerLanguage("svelte",di);var kr=Je;return Ni(xr);})();
		const hljs = didHljsVendor.default;
		//#endregion

		//#region stylesheet
		const CSS = `
/* Diff cards mount under .did-root in the conversation, the settings card
   under .did-card. */
.did-root, .did-card {
	/* Theme aliases, dark statics as fallbacks until theme CSS injects. The
	   code-block alias keeps cards matching the native code surface in any
	   theme or stylevault preset. */
	--did-border: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
	--did-surface: var(--dsw-alias-markdown-code-block, #1b1b1c);
	/* Native look: the banner alias token, no separator. */
	--did-banner: var(--dsw-alias-markdown-code-block-banner, #2c2c2e);
	--did-sep: transparent;
	--did-text: var(--dsw-alias-label-primary, #f9fafb);
	--did-text-secondary: var(--dsw-alias-label-secondary, #cfd3d6);
	--did-text-muted: var(--dsw-alias-label-tertiary, #adb2b8);
	--did-hover-bg: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.08));
	--did-empty-bg: color-mix(in srgb, var(--dsw-alias-label-primary, #808080) 5%, transparent);
	--did-code-font: var(--dsw-font-markdown-code-block, 13px/22px var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace));

	/* Syntax colors use the GUI's --shiki-token-* vars; dsh-stylevault
	   overrides exactly these from its Colors panel, and theme-alias values
	   stand in when shiki vars are absent. */
	--did-syn-keyword: var(--shiki-token-keyword, var(--dsw-alias-state-error-primary, var(--did-text)));
	--did-syn-title: var(--shiki-token-function, var(--dsw-alias-brand-primary, var(--did-text)));
	--did-syn-attr: var(--shiki-token-constant, var(--dsw-alias-state-warn-primary, var(--did-text)));
	--did-syn-string: var(--shiki-token-string, var(--dsw-alias-state-success-primary, var(--did-text)));
	--did-syn-builtin: var(--shiki-token-parameter, var(--dsw-alias-state-warn-primary, var(--did-text)));
	--did-syn-comment: var(--shiki-token-comment, var(--dsw-alias-label-tertiary, var(--did-text)));
	--did-syn-tag: var(--shiki-token-keyword, var(--dsw-alias-state-success-primary, var(--did-text)));
	--did-syn-text: var(--shiki-foreground, var(--did-text));

	/* Add/remove palette derives from the theme's success/error aliases via
	   color-mix, so tints follow the theme. */
	--did-add-stat: var(--dsw-alias-state-success-primary, #22c55e);
	--did-add-row: color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 7%, transparent);
	--did-add-hover: color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 18%, transparent);
	--did-add-word: color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 18%, transparent);
	--did-del-stat: var(--dsw-alias-state-error-primary, #f25a5a);
	--did-del-row: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f25a5a) 7%, transparent);
	--did-del-hover: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f25a5a) 18%, transparent);
	--did-del-word: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f25a5a) 18%, transparent);
}

/* Native headers paint brand 12% over the surface, not the flat banner alias.
   While stylevault's paint layers are live (head watcher toggles .did-sv-themed),
   diff cards copy that rendered recipe; otherwise the alias above stands. The
   Plugins-page card is excluded: its ladder below re-themes through the alias
   tokens anyway. */
.did-sv-themed .did-root {
	--did-banner: color-mix(in srgb, var(--dsw-alias-brand-primary, #808080) 12%, var(--did-surface));
	--did-sep: color-mix(in srgb, var(--dsw-alias-label-tertiary, #8b8f94) 25%, transparent);
}

.did-root {
	box-sizing: border-box;
	padding: 0;
	margin: 4px 0 2px;
	/* native code blocks carry no border, outline or shadow */
	border-radius: 12px;
	overflow: hidden;
	background: var(--did-surface);
	font-size: 12px;
	line-height: 19px;
}

/* The call errored: nothing was applied. The header carries the state
   (failed badge, toggle chevron); the attempted diff stays collapsed. */
.did-head.did-headtoggle {
	cursor: pointer;
	user-select: none;
}

.did-failedbadge {
	color: var(--did-del-stat);
	font-size: 11px;
	font-weight: 600;
}

.did-chev {
	color: var(--did-text-muted);
	font-size: 9px;
	transition: transform 0.12s ease;
}

.did-open .did-chev {
	transform: rotate(90deg);
}

.did-head {
	display: flex;
	align-items: center;
	gap: 8px;
	/* native banner geometry: 9px 14px, font-xs-13 */
	padding: 9px 14px;
	font: var(--dsw-font-xs-13, 13px/20px var(--dsw-font-family, system-ui, sans-serif));
	background: var(--did-banner);
	border-bottom: 1px solid var(--did-sep);
}

.did-tool {
	color: var(--did-text-secondary);
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 0.6px;
	text-transform: uppercase;
}

.did-stats {
	margin-left: auto;
	color: var(--did-text-muted);
	font-size: 12px;
	white-space: nowrap;
}

.did-indent {
	color: var(--did-text-muted);
	font-size: 10.5px;
	margin-right: 10px;
}

.did-addnum {
	color: var(--did-add-stat);
	font-weight: 600;
}

.did-delnum {
	color: var(--did-del-stat);
	font-weight: 600;
}

.did-filehead {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 6px 14px;
	/* native banner label: 12px/18px code family */
	font: 12px/18px var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
	background: var(--did-banner);
	border-bottom: 1px solid var(--did-sep);
}

.did-filepath {
	color: var(--did-text-secondary);
	font-size: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

button.did-path {
	appearance: none;
	border: 0;
	background: none;
	color: var(--did-text-secondary);
	font: inherit;
	padding: 1px 6px;
	border-radius: 4px;
	cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: left;
	max-width: 70%;
}

button.did-path:hover {
	background: var(--did-hover-bg);
	color: var(--did-text);
}

.did-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	column-gap: 12px;
	font: var(--did-code-font);
}

.did-col {
	min-width: 0;
}

/* Hover: row pairs share data-ri; a delegated handler marks both cells.
   Changed panes step their tint up; context panes get the shared wash. */
.did-code.did-hoverrow:not(.did-delbg):not(.did-insbg):not(.did-void) { background: var(--did-hover-bg); }
.did-code.did-delbg.did-hoverrow { background: var(--did-del-hover); }
.did-code.did-insbg.did-hoverrow { background: var(--did-add-hover); }

.did-code {
	position: relative;
	/* Left padding reserves the gutter on EVERY cell (including void ones) so
	   code text stays vertically aligned whether its row carries a number.
	   The lane sizes to the card's largest line number via --did-num-w. */
	padding: 0 8px 0 calc(4px + var(--did-num-w, 4ch) + 16px);
	/* Empty lines have no line box and would collapse to zero height, so
	   their gutter number renders on top of the next row's number. */
	min-height: 1.25em;
	min-height: 1lh;
	color: var(--did-text);
	min-width: 0;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	word-break: break-word;
}

/* 1-based file line numbers (real when anchored, window-relative fallback
   otherwise); renders on every row. Right-aligned tabular digits in a box at
   a 4px inset: the number hugs the edge and a wide lane separates it from the
   code, instead of floating mid-gutter pressed against the text. */
.did-num {
	position: absolute;
	left: 4px;
	width: var(--did-num-w, 4ch);
	text-align: right;
	font-variant-numeric: tabular-nums;
	color: var(--did-text-muted);
	user-select: none;
}

/* Numbers off: drop the gutter entirely — code text starts at the plain
   inset, like the right padding, and no number spans render at all. */
.did-nonumbers .did-code { padding-left: 8px; }

/* Changed rows carry a 3px colored edge on their pane's outer side. */
.did-delbg { background: var(--did-del-row); box-shadow: inset 3px 0 0 var(--did-del-stat); }
.did-insbg { background: var(--did-add-row); box-shadow: inset 3px 0 0 var(--did-add-stat); }
.did-delword { background: var(--did-del-word); border-radius: 3px; }
.did-insword { background: var(--did-add-word); border-radius: 3px; }
.did-void { background: var(--did-empty-bg); }
/* Blank changed lines: keep the edge marker, drop the bar; the ⏎ glyph
   explains why the row exists. */
.did-delbg.did-blank, .did-insbg.did-blank { background: transparent; }
.did-blank::after { content: "⏎"; color: var(--did-text-muted); opacity: 0.35; }

.did-more {
	padding: 4px 8px;
	color: var(--did-text-muted);
	font-size: 11px;
	border-top: 1px solid var(--did-sep);
}

/* Plugins-page card: remap its surfaces to the page's bg-layer ladder, which
   native settings cards here render with, so it matches siblings under the
   stock theme and under any stylevault preset. The code-block family above
   stays reserved for conversation diff cards. */
.did-card {
	--did-banner: var(--dsw-alias-bg-layer-3, #383a42);
	/* native open accordion surface: one step below the closed elevation */
	--did-surface: var(--dsw-alias-bg-layer-2, #2c2c2e);
	--did-text: var(--dsw-alias-label-primary, #f9fafb);
	--did-text-secondary: var(--dsw-alias-label-secondary, #cfd3d6);
	--did-text-muted: var(--dsw-alias-label-tertiary, #adb2b8);
	--did-hover-bg: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.08));
	--did-border: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
	border: 1px solid var(--did-border);
	/* native settings cards: elevated bg-layer-3 closed, bg-layer-2 open */
	background: var(--did-banner);
	border-radius: 12px;
	list-style: none;
	transition: border-color 0.16s, background 0.16s;
}

.did-card:hover,
.did-card.did-cardopen {
	border-color: var(--dsw-alias-label-dimmed, rgba(128, 128, 128, 0.45));
}

.did-card.did-cardopen {
	background: var(--did-surface);
}

.did-cardhead {
	appearance: none;
	width: 100%;
	font: inherit;
	color: inherit;
	text-align: left;
	cursor: pointer;
	background: none;
	border: 0;
	border-radius: 12px;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
}

.did-cardhead:focus-visible {
	outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);
	outline-offset: -2px;
}

.did-cardtext {
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
	flex: 1;
}

.did-cardname {
	color: var(--did-text);
	font-size: 15px;
	font-weight: 600;
	line-height: 1.4;
}

.did-carddesc {
	color: var(--did-text-muted);
	font-size: 13px;
	line-height: 1.5;
}

.did-chev {
	flex: none;
	color: var(--did-text-muted);
	display: flex;
	transition: transform 0.16s;
}

.did-chevopen {
	transform: rotate(180deg);
}

.did-cardbody {
	border-top: 1px solid var(--did-border);
	margin: 0 16px;
	padding-bottom: 8px;
}

.did-readonly {
	color: var(--did-text-muted);
	margin: 10px 0 0;
	font-size: 12px;
	line-height: 1.5;
}

/* "Diff highlighting" control row: Words vs Lines-only segmented buttons */
.did-setting {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 8px;
}

.did-setting-title {
	color: var(--did-text);
	font-size: 13px;
}

.did-seg {
	display: flex;
	border: 1px solid var(--did-border);
	border-radius: 6px;
	overflow: hidden;
}

.did-seg button {
	appearance: none;
	border: 0;
	background: none;
	color: var(--did-text-secondary);
	font: inherit;
	font-size: 12px;
	line-height: 18px;
	padding: 4px 10px;
	cursor: pointer;
	white-space: nowrap;
}

.did-seg button + button {
	border-left: 1px solid var(--did-border);
}

.did-seg button:hover {
	background: var(--did-hover-bg);
}

.did-seg button[aria-pressed="true"] {
	background: var(--did-hover-bg);
	color: var(--did-text);
	font-weight: 600;
}

/* Syntax token classes -> the --did-syn-* palette above. Same class groups
   dsh-solution-explorer styles. */
.did-root .hljs-doctag, .did-root .hljs-keyword, .did-root .hljs-template-tag, .did-root .hljs-template-variable, .did-root .hljs-type, .did-root .hljs-variable.language_ { color: var(--did-syn-keyword); }
.did-root .hljs-title, .did-root .hljs-title.class_, .did-root .hljs-title.class_.inherited__, .did-root .hljs-title.function_ { color: var(--did-syn-title); }
.did-root .hljs-attr, .did-root .hljs-attribute, .did-root .hljs-literal, .did-root .hljs-meta, .did-root .hljs-number, .did-root .hljs-operator, .did-root .hljs-variable, .did-root .hljs-selector-attr, .did-root .hljs-selector-class, .did-root .hljs-selector-id { color: var(--did-syn-attr); }
.did-root .hljs-regexp, .did-root .hljs-string, .did-root .hljs-meta .hljs-string { color: var(--did-syn-string); }
.did-root .hljs-built_in, .did-root .hljs-symbol { color: var(--did-syn-builtin); }
.did-root .hljs-comment, .did-root .hljs-code, .did-root .hljs-formula { color: var(--did-syn-comment); }
.did-root .hljs-name, .did-root .hljs-quote, .did-root .hljs-selector-tag, .did-root .hljs-selector-pseudo { color: var(--did-syn-tag); }
.did-root .hljs-subst { color: var(--did-syn-text); }
.did-root .hljs-section { color: var(--did-syn-keyword); font-weight: bold; }
.did-root .hljs-bullet { color: var(--did-syn-attr); }
.did-root .hljs-emphasis { color: var(--did-syn-text); font-style: italic; }
.did-root .hljs-strong { color: var(--did-syn-text); font-weight: bold; }
`;
		//#endregion

		//#region line diff (LCS with size cap)
		const LINE_DIFF_CAP = 1200;

		function splitLines(text) {
			return typeof text === "string" && text !== "" ? text.split("\n") : [];
		}

		// Strip the leading whitespace shared by every non-empty line; deeper
		// indents keep their extra depth, blank lines become "".
		function stripSharedIndent(oldLines, newLines) {
			let sharedPrefix = null;
			for (const lines of [oldLines, newLines]) {
				for (const line of lines) {
					if (!line.trim()) continue;
					const indent = /^[\t ]*/.exec(line)[0];
					if (sharedPrefix === null) { sharedPrefix = indent; continue; }
					let keptLength = 0;
					const limit = Math.min(sharedPrefix.length, indent.length);
					while (keptLength < limit && sharedPrefix[keptLength] === indent[keptLength]) keptLength++;
					sharedPrefix = sharedPrefix.slice(0, keptLength);
					if (sharedPrefix === "") return { oldLines, newLines, indentChars: 0 };
				}
			}
			if (!sharedPrefix) return { oldLines, newLines, indentChars: 0 };
			const cut = (lines) => lines.map((line) =>
				line.startsWith(sharedPrefix) ? line.slice(sharedPrefix.length) : line.trim() ? line : "");
			return { oldLines: cut(oldLines), newLines: cut(newLines), indentChars: sharedPrefix.length };
		}

		// Diff two arrays into ops of { type: "equal" | "removed" | "added",
		// oldIndex?, newIndex? }. Returns null past cap; callers fall back to
		// a whole-file replace.
		function lcsOps(oldItems, newItems, cap) {
			const oldCount = oldItems.length;
			const newCount = newItems.length;
			if (oldCount > cap || newCount > cap) return null;

			// commonLengths[row][column]: LCS length of the suffix starting at
			// that cell, flattened with a row stride.
			const stride = newCount + 1;
			const commonLengths = new Int32Array((oldCount + 1) * stride);
			for (let oldIndex = oldCount - 1; oldIndex >= 0; oldIndex--) {
				const row = oldIndex * stride;
				const rowBelow = row + stride;
				for (let newIndex = newCount - 1; newIndex >= 0; newIndex--) {
					commonLengths[row + newIndex] = oldItems[oldIndex] === newItems[newIndex]
						? commonLengths[rowBelow + newIndex + 1] + 1
						: Math.max(commonLengths[rowBelow + newIndex], commonLengths[row + newIndex + 1]);
				}
			}

			const ops = [];
			let oldIndex = 0;
			let newIndex = 0;
			while (oldIndex < oldCount && newIndex < newCount) {
				if (oldItems[oldIndex] === newItems[newIndex]) {
					ops.push({ type: "equal", oldIndex, newIndex });
					oldIndex++;
					newIndex++;
				} else if (commonLengths[(oldIndex + 1) * stride + newIndex] >= commonLengths[oldIndex * stride + newIndex + 1]) {
					ops.push({ type: "removed", oldIndex });
					oldIndex++;
				} else {
					ops.push({ type: "added", newIndex });
					newIndex++;
				}
			}
			for (; oldIndex < oldCount; oldIndex++) ops.push({ type: "removed", oldIndex });
			for (; newIndex < newCount; newIndex++) ops.push({ type: "added", newIndex });
			return ops;
		}

		//#region run pairing
		// Modified rows pair across each removed/added run by token similarity
		// rather than run order: an insertion placed above an edited line
		// otherwise word-chips the edited line against the first comment while
		// its true counterpart renders as a pure addition. Token-multiset
		// scores (same tokenizer as the word chips); weak matches stay
		// one-sided. Stats keep counting full runs, so badges stay true.
		const PAIR_SIMILARITY_MIN = 0.5;
		// Containment rule: a line embedded in a longer counterpart — a call
		// wrapped in a spread or conditional — is mostly shared, but Dice
		// punishes the length asymmetry. Pair on high overlap when the
		// smaller side carries enough tokens that bare brackets cannot match.
		const PAIR_CONTAINMENT_MIN = 0.8;
		const PAIR_MIN_TOKENS = 4;
		// Candidate matrix cap: past it, fall back to run-order pairing.
		const PAIR_MATRIX_CAP = 4096;

		function countTokens(line) {
			const tokens = tokenize(line);
			const counts = new Map();
			for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
			return { counts, size: tokens.length };
		}

		// Score for pairing two lines: 0 means "leave one-sided". Dice over
		// token multisets first; otherwise containment (shared over the
		// smaller side) with a token floor.
		function linePairScore(oldTokens, newTokens) {
			const minSize = Math.min(oldTokens.size, newTokens.size);
			if (minSize === 0) return 0;
			let shared = 0;
			for (const [token, count] of oldTokens.counts) {
				const other = newTokens.counts.get(token);
				if (other !== undefined) shared += Math.min(count, other);
			}
			const dice = (2 * shared) / (oldTokens.size + newTokens.size);
			if (dice >= PAIR_SIMILARITY_MIN) return dice;
			const containment = shared / minSize;
			if (containment >= PAIR_CONTAINMENT_MIN && minSize >= PAIR_MIN_TOKENS) return containment;
			return 0;
		}

		// Greedy best-similarity matching, emitted in old-line order. Returns
		// [oldIndex, newIndex] pairs; unpaired lines stay one-sided.
		function pairRunLines(oldLines, removedRun, newLines, addedRun) {
			// A 1:1 run cannot mispair: exactly one candidate exists per side,
			// so the insertion-steal failure mode the score gate guards against
			// does not apply. Stack the two lines as one modified row whatever
			// the score says, matching side-by-side convention (a replacement
			// renders its del/add on the same row) and saving a row of height.
			if (removedRun.length === 1 && addedRun.length === 1) {
				return [[removedRun[0].oldIndex, addedRun[0].newIndex]];
			}
			if (removedRun.length * addedRun.length > PAIR_MATRIX_CAP) {
				const pairs = [];
				const pairedCount = Math.min(removedRun.length, addedRun.length);
				for (let index = 0; index < pairedCount; index++) {
					pairs.push([removedRun[index].oldIndex, addedRun[index].newIndex]);
				}
				return pairs;
			}
			const oldTokens = removedRun.map((op) => countTokens(oldLines[op.oldIndex]));
			const newTokens = addedRun.map((op) => countTokens(newLines[op.newIndex]));
			const candidates = [];
			for (let oldSide = 0; oldSide < removedRun.length; oldSide++) {
				for (let newSide = 0; newSide < addedRun.length; newSide++) {
					const score = linePairScore(oldTokens[oldSide], newTokens[newSide]);
					if (score > 0) candidates.push({ oldSide, newSide, score });
				}
			}
			candidates.sort((a, b) => b.score - a.score);
			const takenOld = new Uint8Array(removedRun.length);
			const takenNew = new Uint8Array(addedRun.length);
			const pairs = [];
			for (const candidate of candidates) {
				if (takenOld[candidate.oldSide] === 1 || takenNew[candidate.newSide] === 1) continue;
				const oldIndex = removedRun[candidate.oldSide].oldIndex;
				const newIndex = addedRun[candidate.newSide].newIndex;
				// Keep the matching monotone: a pair crossing an accepted one
				// would render one column's rows out of file order.
				let crosses = false;
				for (const [acceptedOld, acceptedNew] of pairs) {
					if ((oldIndex < acceptedOld) !== (newIndex < acceptedNew)) { crosses = true; break; }
				}
				if (crosses) continue;
				takenOld[candidate.oldSide] = 1;
				takenNew[candidate.newSide] = 1;
				pairs.push([oldIndex, newIndex]);
			}
			pairs.sort((a, b) => a[0] - b[0]);
			return pairs;
		}
		//#endregion

		// Pair removed/added runs as "modified" rows by similarity; leftovers
		// stay one-sided.
		function buildRows(ops, oldLines, newLines) {
			const rows = [];
			let added = 0;
			let removed = 0;
			let opIndex = 0;
			while (opIndex < ops.length) {
				const op = ops[opIndex];
				if (op.type === "equal") {
					rows.push({
						kind: "context",
						leftText: oldLines[op.oldIndex],
						rightText: newLines[op.newIndex],
						oldIndex: op.oldIndex,
						newIndex: op.newIndex,
					});
					opIndex++;
					continue;
				}
				const removedRun = [];
				const addedRun = [];
				while (opIndex < ops.length && ops[opIndex].type === "removed") { removedRun.push(ops[opIndex]); opIndex++; }
				while (opIndex < ops.length && ops[opIndex].type === "added") { addedRun.push(ops[opIndex]); opIndex++; }
				const pairs = pairRunLines(oldLines, removedRun, newLines, addedRun);
				const pairedOld = new Set(pairs.map((pair) => pair[0]));
				const pairedNew = new Set(pairs.map((pair) => pair[1]));
				// Emit so both columns read top-down: a leftover line falls
				// before the pair it precedes on its own side, so gutters
				// never run backwards within a changed block.
				let removedAt = 0;
				let addedAt = 0;
				const emitRemoved = (op) => {
					rows.push({ kind: "removed", leftText: oldLines[op.oldIndex], oldIndex: op.oldIndex });
				};
				const emitAdded = (op) => {
					rows.push({ kind: "added", rightText: newLines[op.newIndex], newIndex: op.newIndex });
				};
				for (const [oldIndex, newIndex] of pairs) {
					while (removedAt < removedRun.length && removedRun[removedAt].oldIndex < oldIndex) {
						if (!pairedOld.has(removedRun[removedAt].oldIndex)) emitRemoved(removedRun[removedAt]);
						removedAt++;
					}
					while (addedAt < addedRun.length && addedRun[addedAt].newIndex < newIndex) {
						if (!pairedNew.has(addedRun[addedAt].newIndex)) emitAdded(addedRun[addedAt]);
						addedAt++;
					}
					rows.push({
						kind: "modified",
						leftText: oldLines[oldIndex],
						rightText: newLines[newIndex],
						oldIndex,
						newIndex,
					});
				}
				for (; removedAt < removedRun.length; removedAt++) {
					if (!pairedOld.has(removedRun[removedAt].oldIndex)) emitRemoved(removedRun[removedAt]);
				}
				for (; addedAt < addedRun.length; addedAt++) {
					if (!pairedNew.has(addedRun[addedAt].newIndex)) emitAdded(addedRun[addedAt]);
				}
				removed += removedRun.length;
				added += addedRun.length;
			}
			return { rows, added, removed };
		}
		//#endregion

		//#region wire card extraction
		// Validate untrusted wire diffs into well-formed hunks.
		function parseHunks(rawDiffs) {
			if (!Array.isArray(rawDiffs)) return null;
			const hunks = [];
			for (const candidate of rawDiffs) {
				if (candidate && typeof candidate === "object"
					&& typeof candidate.path === "string"
					&& typeof candidate.newText === "string"
					&& (candidate.oldText == null || typeof candidate.oldText === "string")) {
					// 1-based serve-time anchors from the host half (lib/index.js);
					// undefined means "no trustworthy position for this side".
					hunks.push({
						path: candidate.path,
						oldText: candidate.oldText == null ? "" : candidate.oldText,
						newText: candidate.newText,
						oldStart: anchorStart(candidate.oldStart),
						newStart: anchorStart(candidate.newStart),
					});
				}
			}
			return hunks.length > 0 ? hunks : null;
		}

		// Intended diff derived from the call arguments: what a running call is
		// about to do, and the whole-file fallback for settled writes the
		// runtime recorded no applied diffs for.
		function intendedDiffFromCall(call, name) {
			if (call == null || typeof call !== "object") return null;
			let args;
			try {
				args = JSON.parse(call.argsRaw);
			} catch {
				return null;
			}
			if (args == null || typeof args !== "object" || Array.isArray(args)) return null;
			if (name === "write") {
				return typeof args.content === "string" && typeof args.file_path === "string"
					? { path: args.file_path, oldText: null, newText: args.content }
					: null;
			}
			if (name !== "edit") return null;
			if (typeof args.file_path !== "string" || args.file_path === "") return null;
			if (typeof args.old_string !== "string" || typeof args.new_string !== "string") return null;
			return { path: args.file_path, oldText: args.old_string || null, newText: args.new_string };
		}

		// Settled blocks carry the applied diffs in meta.diffs; running calls
		// (no kind yet) only have the intended diff from their arguments. Older
		// hosts annotated resultView/callView on the block instead — kept as
		// back-compat sources behind the current contract.
		function extractHunks(block) {
			if (block == null || typeof block !== "object") return null;
			if (!("kind" in block)) {
				const intended = intendedDiffFromCall(block, block.name);
				return intended === null ? null : [intended];
			}
			if (!block.isError) {
				const meta = block.meta;
				if (meta && typeof meta === "object" && !Array.isArray(meta)) {
					const fromMeta = parseHunks(meta.diffs);
					if (fromMeta !== null) return fromMeta;
				}
				const resultView = block.resultView && block.resultView.card === "diff" ? block.resultView : null;
				if (resultView !== null) {
					const fromResult = parseHunks(resultView.diffs);
					if (fromResult !== null) return fromResult;
				}
				const callView = block.callView && block.callView.card === "diff" ? block.callView : null;
				if (callView !== null) {
					const fromCall = parseHunks(callView.diffs);
					if (fromCall !== null) return fromCall;
				}
				// A successful write may record no applied diffs (whole-file
				// replace); fall back to its argument-derived diff, matching
				// the stock row.
				if (block.call && block.call.name === "write") {
					const intended = intendedDiffFromCall(block.call, "write");
					if (intended !== null) return [intended];
				}
				return null;
			}
			// A failed call shows the diff it attempted, dimmed: nothing was
			// applied, but a bare header row explains nothing.
			const attempted = intendedDiffFromCall(block.call, block.call && block.call.name);
			return attempted === null ? null : [attempted];
		}

		// Relativize to the session cwd, then to ~ under the host home.
		function relativePath(path, cwd, home) {
			if (cwd && path.startsWith(cwd + "/")) return path.slice(cwd.length + 1);
			if (home && path.startsWith(home + "/")) return "~" + path.slice(home.length);
			return path;
		}
		//#endregion

		//#region gutter bases
		// Line numbers come from two sources, in order: the host's serve-time
		// oldStart/newStart stamps, then (stolen from dsh-diff-stat) a
		// best-effort locate of the hunk's post-image in the CURRENT file,
		// read through the host half's fenced read route. A hunk that cannot
		// be anchored falls back to window-relative 1..N numbering (also
		// dsh-diff-stat's policy), so the gutter always renders.

		/** Validate one wire anchor; anything non-finite/sub-1 is "absent". */
		function anchorStart(value) {
			return typeof value === "number" && Number.isFinite(value) && value >= 1 ? value : undefined;
		}

		/** Sole 0-based occurrence of `needle` in `fileLines`, else null. A
		 *  duplicated block has no single anchor and would number the wrong
		 *  region, so ambiguity refuses rather than guessing. */
		function locateOnce(needle, fileLines) {
			if (needle.length === 0) return null;
			let at = -1;
			outer: for (let i = 0; i + needle.length <= fileLines.length; i++) {
				for (let j = 0; j < needle.length; j++) {
					if (fileLines[i + j] !== needle[j]) continue outer;
				}
				if (at !== -1) return null;
				at = i;
			}
			return at === -1 ? null : at;
		}

		/** Per-side 1-based bases for one unstamped hunk: the post-image locates
		 *  the new side; the old side only when both sides start on the same
		 *  shared line. Deletion-only hunks anchor on their first old lines. */
		function locateHunkBases(hunk, fileLines) {
			const newLines = splitLines(hunk.newText);
			const oldLines = splitLines(hunk.oldText);
			let oldBase = null;
			let newBase = null;
			if (newLines.length > 0) {
				const at = locateOnce(newLines, fileLines);
				if (at !== null) {
					newBase = at + 1;
					if (oldLines.length > 0 && oldLines[0] === newLines[0]) oldBase = newBase;
				}
			} else if (oldLines.length > 0) {
				const at = locateOnce(oldLines.slice(0, Math.min(3, oldLines.length)), fileLines);
				if (at !== null) oldBase = at + 1;
			}
			return { oldBase, newBase };
		}

		/** LRU content cache: cwd-fenced path → text; one expanded file ≈ one entry. */
		const readCache = new Map();
		const READ_CACHE_CAP = 16;

		/** Read one workspace file through the host half's fenced route; null
		 *  when the host half is absent, the file is binary/unreadable. */
		async function readWorkspaceFile(path, cwd) {
			const key = (cwd ?? "") + "\0" + path;
			const hit = readCache.get(key);
			if (hit !== undefined) {
				readCache.delete(key);
				readCache.set(key, hit);
				return hit;
			}
			let content = null;
			try {
				const res = await fetch("/dsh-inline-diff/api/read", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ cwd, path }),
				});
				if (res.ok) {
					const payload = await res.json();
					if (payload && payload.kind === "text" && typeof payload.content === "string") {
						content = payload.content;
					}
				}
			} catch { /* host absent or offline: blank gutters */ }
			if (content === null) return null;
			readCache.set(key, content);
			if (readCache.size > READ_CACHE_CAP) {
				const oldest = readCache.keys().next();
				if (!oldest.done) readCache.delete(oldest.value);
			}
			return content;
		}

		/** Resolved gutter bases per hunk set, keyed by the render-side hunkKey.
		 *  Lets a re-mounted card paint its numbers on the FIRST render instead
		 *  of mutating the DOM post-paint. */
		const baseCache = new Map();
		const BASE_CACHE_CAP = 64;
		//#endregion

		//#region plugin preferences
		// Client-side view of the durable inline-diff prefs, synced by apply()
		// from the bound settings scope; both the diff cards and the Plugins
		// card subscribe here. Literal strings must match lib/index.js, since the
		// module-loader bundle cannot import across halves.
		const SETTINGS_NAMESPACE = "inline-diff";
		const HIGHLIGHT_FIELD = "highlight";
		const HIGHLIGHT_WORDS = "words";
		const HIGHLIGHT_LINES = "lines";
		const INDENT_FIELD = "indent";
		const INDENT_STRIP = "strip";
		const INDENT_KEEP = "keep";
		const SYNTAX_FIELD = "syntax";
		const SYNTAX_ON = "on";
		const SYNTAX_OFF = "off";
		const NUMBERS_FIELD = "numbers";
		const NUMBERS_ON = "on";
		const NUMBERS_OFF = "off";

		let wordsMode = true;
		const wordsListeners = new Set();

		function getWordsMode() {
			return wordsMode;
		}

		function setWordsMode(enabled) {
			if (wordsMode === enabled) return;
			wordsMode = enabled;
			for (const listener of [...wordsListeners]) listener(enabled);
		}

		function onWordsMode(listener) {
			wordsListeners.add(listener);
			return () => { wordsListeners.delete(listener); };
		}

		let keepIndentMode = false;
		const keepIndentListeners = new Set();

		function getKeepIndent() {
			return keepIndentMode;
		}

		function setKeepIndent(enabled) {
			if (keepIndentMode === enabled) return;
			keepIndentMode = enabled;
			for (const listener of [...keepIndentListeners]) listener(enabled);
		}

		function onKeepIndent(listener) {
			keepIndentListeners.add(listener);
			return () => { keepIndentListeners.delete(listener); };
		}

		// Durable `inline-diff.syntax` ("on" | "off"); on by default, and the
		// whole tokenizer path is skipped while off.
		let syntaxOnMode = true;
		const syntaxOnListeners = new Set();

		function getSyntaxOn() {
			return syntaxOnMode;
		}

		function setSyntaxOn(enabled) {
			if (syntaxOnMode === enabled) return;
			syntaxOnMode = enabled;
			for (const listener of [...syntaxOnListeners]) listener(enabled);
		}

		function onSyntaxOn(listener) {
			syntaxOnListeners.add(listener);
			return () => { syntaxOnListeners.delete(listener); };
		}

		// Durable `inline-diff.numbers` ("on" | "off"); on by default. Off
		// drops the gutter entirely: no numbers, no reserved lane.
		let numbersOnMode = true;
		const numbersOnListeners = new Set();

		function getNumbersOn() {
			return numbersOnMode;
		}

		function setNumbersOn(enabled) {
			if (numbersOnMode === enabled) return;
			numbersOnMode = enabled;
			for (const listener of [...numbersOnListeners]) listener(enabled);
		}

		function onNumbersOn(listener) {
			numbersOnListeners.add(listener);
			return () => { numbersOnListeners.delete(listener); };
		}

		// Whether the Host serves the namespace (a card must leave no trace
		// when it does not) and accepts writes. Replaced only on change so
		// subscribers re-render exactly once per transition.
		let settingsState = { ready: false, writable: false };
		const settingsListeners = new Set();

		function getSettingsState() {
			return settingsState;
		}

		function adoptSettingsState(snapshot) {
			const next = { ready: snapshot.status === "ready", writable: snapshot.writable };
			if (next.ready === settingsState.ready && next.writable === settingsState.writable) return;
			settingsState = next;
			for (const listener of [...settingsListeners]) listener(next);
		}

		function onSettingsState(listener) {
			settingsListeners.add(listener);
			return () => { settingsListeners.delete(listener); };
		}
		//#endregion

		//#region i18n
		// Private message tables rather than the locale service's shared
		// dictionary: registration there throws on duplicate namespace/locale
		// pairs and only two components read this copy. Fallback mirrors
		// LocaleRuntime.lookup: active locale, English, then the key itself.
		const LOCALE_IDS = ["en", "zh"];
		const LOCALE_EN = "en";
		const LOCALE_ZH = "zh";

		const MESSAGES = {
			en: {
				"card.name": "Inline diff",
				"card.desc": "Syntax, diff highlighting and indentation for edit and write tool calls",
				"readonly.note": "Preferences are read-only in this session.",
				"highlight.title": "Diff highlighting",
				"highlight.words": "Words",
				"highlight.lines": "Lines only",
				"indent.title": "Common indentation",
				"indent.strip": "Strip",
				"indent.keep": "Keep",
				"indent.stripped.tooltip": "common indentation stripped ({count} chars)",
				"syntax.title": "Syntax highlighting",
				"syntax.on": "On",
				"syntax.off": "Off",
				"numbers.title": "Line numbers",
				"numbers.on": "On",
				"numbers.off": "Off",
				"stats.files": "{count} files · ",
				"failed.badge": "{tool} failed — not applied",
				"truncated.lines": "… {count} more lines (truncated)"
			},
			zh: {
				"card.name": "行内 Diff",
				"card.desc": "编辑与写入工具调用的语法高亮、差异高亮与缩进处理",
				"readonly.note": "偏好设置在当前会话中为只读。",
				"highlight.title": "差异高亮",
				"highlight.words": "词级",
				"highlight.lines": "仅整行",
				"indent.title": "公共缩进",
				"indent.strip": "去除",
				"indent.keep": "保留",
				"indent.stripped.tooltip": "已去除公共缩进（{count} 字符）",
				"syntax.title": "语法高亮",
				"syntax.on": "开",
				"syntax.off": "关",
				"numbers.title": "行号",
				"numbers.on": "开",
				"numbers.off": "关",
				"stats.files": "{count} 个文件 · ",
				"failed.badge": "{tool} 失败 — 未应用",
				"truncated.lines": "… 另有 {count} 行（已截断）"
			}
		};

		// Active locale id, seeded from the browser like the locale service
		// seeds its provisional value; apply() overwrites once composed.
		let activeLocale = detectLocale();
		const localeListeners = new Set();

		// First shipped language named by the browser, matched on the primary subtag.
		function detectLocale() {
			if (typeof window === "undefined") return LOCALE_EN;
			for (const tag of [...(navigator.languages ?? []), navigator.language]) {
				if (typeof tag !== "string") continue;
				const primary = tag.toLowerCase().split("-")[0];
				if (primary === LOCALE_ZH || primary === LOCALE_EN) return primary;
			}
			return LOCALE_EN;
		}

		function adoptLocale(id) {
			if (!LOCALE_IDS.includes(id) || activeLocale === id) return;
			activeLocale = id;
			for (const listener of [...localeListeners]) listener(id);
		}

		function onLocale(listener) {
			localeListeners.add(listener);
			return () => { localeListeners.delete(listener); };
		}

		function tr(key, params) {
			const template = MESSAGES[activeLocale]?.[key] ?? MESSAGES[LOCALE_EN][key] ?? key;
			if (!params) return template;
			return template.replace(/\{(\w+)\}/g, (match, name) =>
				name in params ? String(params[name]) : match);
		}
		//#endregion

		//#region intra-line word diff
		const TOKEN_DIFF_CAP = 400;

		function tokenize(line) {
			return line.match(/\w+|\s+|[^\w\s]/g) || [];
		}

		// Mark runs over changed tokens as changed; shared runs stay plain and
		// inherit the row tint.
		function wordSegments(oldLine, newLine) {
			const oldTokens = tokenize(oldLine);
			const newTokens = tokenize(newLine);
			const ops = lcsOps(oldTokens, newTokens, TOKEN_DIFF_CAP);
			if (ops === null) {
				return {
					left: [{ text: oldLine, changed: true }],
					right: [{ text: newLine, changed: true }],
				};
			}
			const collectSide = (side) => {
				const segments = [];
				for (const op of ops) {
					if (side === "left" ? op.type === "added" : op.type === "removed") continue;
					const text = side === "left" ? oldTokens[op.oldIndex] : newTokens[op.newIndex];
					// Whitespace-only tokens stay unchanged: an indent-only chip
					// renders as a full-width bar before the text, which reads
					// worse than no chip (GitHub's word diff ignores whitespace).
					const changed = op.type !== "equal" && !/^\s+$/.test(text);
					const lastSegment = segments[segments.length - 1];
					if (lastSegment && lastSegment.changed === changed) lastSegment.text += text;
					else segments.push({ text, changed });
				}
				return segments;
			};
			return { left: collectSide("left"), right: collectSide("right") };
		}
		//#endregion

		//#region syntax highlighting
		// Extension -> hljs language id, same coverage as dsh-solution-explorer;
		// undefined leaves the row plain.
		const EXT_LANG = {
			ts: "typescript", tsx: "typescript", mts: "typescript", cts: "typescript",
			js: "javascript", jsx: "javascript", mjs: "javascript", cjs: "javascript",
			json: "json", jsonc: "json",
			sh: "bash", bash: "bash", zsh: "bash",
			html: "xml", htm: "xml", vue: "xml", svg: "xml", xml: "xml",
			css: "css", scss: "scss", less: "less",
			py: "python", pycon: "python-repl",
			md: "markdown", markdown: "markdown",
			yaml: "yaml", yml: "yaml",
			diff: "diff", patch: "diff",
			c: "c", h: "c",
			cpp: "cpp", cc: "cpp", cxx: "cpp", hpp: "cpp", hh: "cpp",
			java: "java",
			go: "go",
			rs: "rust",
			cs: "csharp",
			gql: "graphql", graphql: "graphql",
			ini: "ini", toml: "ini",
			kt: "kotlin", kts: "kotlin",
			lua: "lua",
			mk: "makefile", mak: "makefile",
			m: "objectivec", mm: "objectivec",
			pl: "perl", pm: "perl",
			php: "php", phtml: "php-template",
			r: "r",
			rb: "ruby", rake: "ruby", gemspec: "ruby",
			sql: "sql",
			swift: "swift",
			vb: "vbnet",
			wat: "wasm",
			txt: "plaintext",
			svelte: "svelte",
		};

		function langFromPath(path) {
			const name = typeof path === "string" ? path.replace(/\\/g, "/").split("/").pop() ?? "" : "";
			const dot = name.lastIndexOf(".");
			if (dot < 0 || dot === name.length - 1) return undefined;
			return EXT_LANG[name.slice(dot + 1).toLowerCase()];
		}

		const TOKEN_CACHE_CAP = 4000;
		const tokenCache = new Map();

		function decodeEntities(text) {
			if (text.indexOf("&") < 0) return text;
			return text
				.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"")
				.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
		}

		// Flatten hljs HTML into ordered { text, cls } segments. hljs escapes
		// every literal '<', so tags are unambiguous; nested spans collapse
		// into the joined class list.
		function parseHljsHtml(html) {
			const segments = [];
			const classStack = [];
			let plain = "";
			let cursor = 0;
			const flush = () => {
				if (plain === "") return;
				const text = decodeEntities(plain);
				plain = "";
				const cls = classStack.filter(Boolean).join(" ");
				const last = segments[segments.length - 1];
				if (last && last.cls === cls) last.text += text;
				else segments.push({ text, cls });
			};
			while (cursor < html.length) {
				const open = html.indexOf("<", cursor);
				if (open < 0) { plain += html.slice(cursor); break; }
				if (open > cursor) plain += html.slice(cursor, open);
				const close = html.indexOf(">", open);
				if (close < 0) { plain += html.slice(open); break; }
				const tag = html.slice(open + 1, close);
				flush();
				if (tag.startsWith("/")) classStack.pop();
				else {
					const match = /class="([^"]*)"/.exec(tag);
					classStack.push(match === null ? "" : match[1]);
				}
				cursor = close + 1;
			}
			flush();
			return segments;
		}

		// Per-line like the explorer's diff column; multi-line constructs just
		// lose their token across the break.
		function lineTokens(line, lang) {
			const key = lang + "\u0000" + line;
			const cached = tokenCache.get(key);
			if (cached !== undefined) return cached;
			let html;
			try {
				html = hljs.highlight(line, { language: lang, ignoreIllegals: true }).value;
			} catch {
				html = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			}
			const tokens = parseHljsHtml(html);
			if (tokenCache.size >= TOKEN_CACHE_CAP) tokenCache.clear();
			tokenCache.set(key, tokens);
			return tokens;
		}

		// Overlay word-diff changed runs as [start, end) offsets onto syntax
		// tokens: tokens split at run boundaries so a span carries both its
		// hljs class and the word chip when it falls inside a change.
		function mergeTokens(tokens, segments) {
			const totalLength = tokens.reduce((total, token) => total + token.text.length, 0);
			const flags = new Uint8Array(totalLength);
			let offset = 0;
			for (const segment of segments) {
				if (segment.changed) flags.fill(1, offset, offset + segment.text.length);
				offset += segment.text.length;
			}
			const parts = [];
			let position = 0;
			for (const token of tokens) {
				const tokenStart = position;
				const tokenEnd = position + token.text.length;
				while (position < tokenEnd) {
					const flag = flags[position];
					let runEnd = position + 1;
					while (runEnd < tokenEnd && flags[runEnd] === flag) runEnd++;
					parts.push({
						text: token.text.slice(position - tokenStart, runEnd - tokenStart),
						cls: token.cls,
						changed: flag === 1,
					});
					position = runEnd;
				}
			}
			return parts;
		}
		//#endregion

		//#region rendering
		const MAX_ROWS = 600;
		const CARD_WIDTH_RATIO = 0.75;
		const MIN_CONTAINER_WIDTH = 60;

		function cell(className, text, num) {
			return react.createElement("div", { className },
				num === null ? text : [react.createElement("span", { className: "did-num", key: "num" }, num), text]);
		}

		// Row computation shared by rendering and the collapsed-card totals:
		// line ops plus the strip result the cells and stats both need.
		function computeHunkRows(hunk, keepIndent) {
			const oldLines = splitLines(hunk.oldText);
			const newLines = splitLines(hunk.newText);
			const stripped = keepIndent
				? { oldLines, newLines, indentChars: 0 }
				: stripSharedIndent(oldLines, newLines);
			let ops = lcsOps(stripped.oldLines, stripped.newLines, LINE_DIFF_CAP);
			if (ops === null) {
				ops = [];
				for (let oldIndex = 0; oldIndex < stripped.oldLines.length; oldIndex++) ops.push({ type: "removed", oldIndex });
				for (let newIndex = 0; newIndex < stripped.newLines.length; newIndex++) ops.push({ type: "added", newIndex });
			}
			const { rows, added, removed } = buildRows(ops, stripped.oldLines, stripped.newLines);
			return { rows, added, removed, stripped };
		}

		// Syntax tokens with word-diff chips overlaid when the hunk's language
		// is known and syntax highlighting is on, plain text otherwise.
		// segments === null marks rows without word chips.
		function codeCell(className, text, lang, syntaxOn, segments, chipClass, num) {
			let children;
			if (syntaxOn && lang) {
				const tokens = lineTokens(text, lang);
				const parts = segments === null
					? tokens
					: mergeTokens(tokens, segments);
				children = parts.map((part, index) => {
					const partClass = part.changed
						? (part.cls ? part.cls + " " + chipClass : chipClass)
						: part.cls;
					return partClass === ""
						? part.text
						: react.createElement("span", { className: partClass, key: index }, part.text);
				});
			} else if (segments !== null) {
				children = segments.map((segment, index) => segment.changed
					? react.createElement("span", { className: chipClass, key: index }, segment.text)
					: segment.text);
			} else {
				children = text;
			}
			const parts = num === null
				? children
				: [react.createElement("span", { className: "did-num", key: "num" }, num),
					...(Array.isArray(children) ? children : [children])];
			return react.createElement("div", { className }, parts);
		}

		// Build one row's cell pair. Rows across the two column containers are
		// linked by data-ri (hover pairing, height sync).
		function pushCellPair(leftCells, rightCells, rowIndex, row, wordDiff, lang, syntaxOn, oldBase, newBase, numbersOn) {
			const leftText = row.leftText != null ? row.leftText : "";
			const rightText = row.rightText != null ? row.rightText : "";
			// Base + side index when anchored; otherwise window-relative 1..N
			// from the row's own side position (dsh-diff-stat's gutterNumbers
			// policy) so a gutter always renders. Numbers off drops the gutter.
			const leftNum = !numbersOn || row.oldIndex === undefined ? null
				: oldBase !== null ? oldBase + row.oldIndex : row.oldIndex + 1;
			const rightNum = !numbersOn || row.newIndex === undefined ? null
				: newBase !== null ? newBase + row.newIndex : row.newIndex + 1;
			let left;
			let right;
			if (row.kind === "removed") {
				left = codeCell(leftText.trim() === "" ? "did-code did-delbg did-blank" : "did-code did-delbg",
					leftText, lang, syntaxOn, null, "", leftNum);
				right = cell("did-code did-void", "", null);
			} else if (row.kind === "added") {
				left = cell("did-code did-void", "", null);
				right = codeCell(rightText.trim() === "" ? "did-code did-insbg did-blank" : "did-code did-insbg",
					rightText, lang, syntaxOn, null, "", rightNum);
			} else if (row.kind === "modified") {
				if (!wordDiff) {
					left = codeCell("did-code did-delbg", leftText, lang, syntaxOn, null, "", leftNum);
					right = codeCell("did-code did-insbg", rightText, lang, syntaxOn, null, "", rightNum);
				} else {
					const segments = wordSegments(leftText, rightText);
					left = codeCell("did-code did-delbg", leftText, lang, syntaxOn, segments.left, "did-delword", leftNum);
					right = codeCell("did-code did-insbg", rightText, lang, syntaxOn, segments.right, "did-insword", rightNum);
				}
			} else {
				left = codeCell("did-code", leftText, lang, syntaxOn, null, "", leftNum);
				right = codeCell("did-code", rightText, lang, syntaxOn, null, "", rightNum);
			}
			const dataRi = { "data-ri": String(rowIndex) };
			leftCells.push(react.cloneElement(left, { ...dataRi, key: "l" + rowIndex }));
			rightCells.push(react.cloneElement(right, { ...dataRi, key: "r" + rowIndex }));
		}

		// Card width: CARD_WIDTH_RATIO of the conversation scroll area, capped
		// to the tool call's content row — the row tracks the chat column, so
		// the card follows the host's chat-width handle. Centered on that row
		// via margin so cards align with the message text. Null on tiny
		// containers.
		function computeCardGeometry(containerRect, contentRect, element) {
			if (containerRect.width < MIN_CONTAINER_WIDTH || contentRect.width <= 0) return null;
			const width = Math.min(
				Math.floor(containerRect.width * CARD_WIDTH_RATIO),
				Math.floor(contentRect.width));
			const appliedMargin = parseFloat(element.style.marginLeft) || 0;
			const staticLeft = element.getBoundingClientRect().left - appliedMargin;
			const marginLeft = Math.round(contentRect.left + (contentRect.width - width) / 2 - staticLeft);
			return { width, marginLeft };
		}

		// Always-expanded split diff shown for edit/write tool calls.
		function InlineDiffRow(props) {
			const block = props && props.block;
			const toolName = (props && props.toolName) || "";
			const label = /write/i.test(toolName) ? "Write" : "Edit";
			const hunks = react.useMemo(() => extractHunks(block), [block]);

			const rootRef = react.useRef(null);
			const [cardStyle, setCardStyle] = react.useState(null);
			// Layout effect: apply width/margin before paint so the initial
			// card never renders unmeasured and rewraps post-paint (same
			// autoscroll-latching drift as the height sync below).
			react.useLayoutEffect(() => {
				const element = rootRef.current;
				if (!element || typeof ResizeObserver === "undefined") return;
				const container = element.closest("[data-conversation-scroll]");
				if (!container) return;
				// The card is sized and centered against its content row (the
				// tool call's full-width box). Zero-width wrappers in between
				// are display: contents. Observing the row matters: the host's
				// chat-width handle resizes the message column without touching
				// the scroll container, so the container's observer never fires.
				let contentRow = element.parentElement;
				while (contentRow && contentRow !== container && contentRow.getBoundingClientRect().width <= 0) {
					contentRow = contentRow.parentElement;
				}
				if (!contentRow || contentRow === container) contentRow = container;
				const applyMeasure = () => {
					const geometry = computeCardGeometry(
						container.getBoundingClientRect(),
						contentRow.getBoundingClientRect(),
						element);
					if (geometry === null) return;
					setCardStyle((previous) =>
						previous && previous.width === geometry.width + "px" && previous.marginLeft === geometry.marginLeft + "px"
							? previous
							: { width: geometry.width + "px", marginLeft: geometry.marginLeft + "px" }
					);
				};
				applyMeasure();
				const observer = new ResizeObserver(applyMeasure);
				observer.observe(container);
				if (contentRow !== container) observer.observe(contentRow);
				window.addEventListener("resize", applyMeasure);
				return () => {
					observer.disconnect();
					window.removeEventListener("resize", applyMeasure);
				};
			}, []);

			const [words, setWords] = react.useState(getWordsMode());
			react.useEffect(() => onWordsMode(setWords), []);
			const [keepIndent, setKeepIndent] = react.useState(getKeepIndent());
			react.useEffect(() => onKeepIndent(setKeepIndent), []);
			const [syntaxOn, setSyntaxOn] = react.useState(getSyntaxOn());
			react.useEffect(() => onSyntaxOn(setSyntaxOn), []);
			const [numbersOn, setNumbersOn] = react.useState(getNumbersOn());
			react.useEffect(() => onNumbersOn(setNumbersOn), []);
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);

			// Row hover: mark the data-ri pair under the cursor. Delegated so
			// it costs two listeners per card instead of two per cell.
			const rootRefForHover = rootRef;
			const clearHover = () => {
				const rootEl = rootRefForHover.current;
				if (!rootEl) return;
				for (const el of rootEl.querySelectorAll(".did-hoverrow")) {
					el.classList.remove("did-hoverrow");
				}
			};
			const onGridOver = (event) => {
				const target = event.target;
				const hit = target && target.closest ? target.closest(".did-code") : null;
				const ri = hit && hit.dataset ? hit.dataset.ri : null;
				clearHover();
				if (!ri) return;
				const rootEl = rootRefForHover.current;
				if (!rootEl) return;
				for (const el of rootEl.querySelectorAll('[data-ri="' + ri + '"]')) {
					el.classList.add("did-hoverrow");
				}
			};

			// Wrapped lines make the two columns grow independently; pair the
			// data-ri cells' heights so counterpart rows stay level. Layout
			// effect on purpose: sizing must land pre-paint, in the same frame
			// as the committed rows. A post-paint shift makes scroll anchoring
			// move scrollTop above the viewport, which the conversation
			// scroller misreads as a reader scroll and latches autoscroll off
			// once the drift passes its 25px at-bottom threshold — large diffs
			// drift farthest, so they kill follow-scroll first.
			react.useLayoutEffect(() => {
				const rootEl = rootRef.current;
				if (!rootEl) return;
				const sync = () => {
					for (const grid of rootEl.querySelectorAll(".did-grid")) {
						const pairs = new Map();
						for (const cellEl of grid.querySelectorAll("[data-ri]")) {
							cellEl.style.minHeight = "";
							const ri = cellEl.dataset.ri;
							const slot = pairs.get(ri);
							if (slot) slot.push(cellEl);
							else pairs.set(ri, [cellEl]);
						}
						for (const pairCells of pairs.values()) {
							if (pairCells.length < 2) continue;
							const height = Math.max(pairCells[0].offsetHeight, pairCells[1].offsetHeight);
							if (height > 0) {
								for (const cellEl of pairCells) cellEl.style.minHeight = height + "px";
							}
						}
					}
				};
				sync();
				if (typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(sync);
				observer.observe(rootEl);
				return () => observer.disconnect();
			}, [hunks, keepIndent, words, syntaxOn]);

			// Selection is native browser behavior: each pane is one contiguous
			// column of DOM, so a vertical drag confined to a column stays
			// there on its own. A drag crossing the gap selects the raw
			// in-between DOM too — accepted trade-off for keeping selection
			// fully native (copy, double-click, shift-click all just work).

			// A failed card starts collapsed: the error result below the card
			// explains the failure, so the attempted diff is opt-in detail.
			const failed = !!(block && block.isError);
			const [attemptOpen, setAttemptOpen] = react.useState(false);
			const perHunk = react.useMemo(
				() => hunks === null ? [] : hunks.map((hunk) => computeHunkRows(hunk, keepIndent)),
				[hunks, keepIndent]);

			// Gutter bases for hunks the host could not stamp: one fenced file
			// read per distinct path, then a verbatim locate of each hunk. A
			// failed read/locate leaves that hunk's gutter blank. Keyed so a
			// settled block replacing the running one cannot reuse stale values.
			const hunkKey = hunks === null ? "" : hunks.map((hunk) =>
				hunk.path + "#" + (hunk.oldStart ?? "?") + ":" + (hunk.newStart ?? "?")
				+ ":" + hunk.oldText.length + ":" + hunk.newText.length
				+ ":" + hunk.newText.slice(0, 32)).join("|");
			// Settled hunks only, cached module-wide. A running call re-renders
			// every stream tick, and per-tick locate work there means an extra
			// post-paint commit during autoscroll — the exact churn that latches
			// follow-scroll off (see the height-sync note). It would also always
			// fail: the file does not contain the call's new_string yet.
			const settled = !!(block && typeof block === "object" && "kind" in block);
			const [located, setLocated] = react.useState(() => baseCache.get(hunkKey) ?? null);
			react.useEffect(() => {
				const cwd = props ? props.cwd : undefined;
				if (hunks === null || failed || !settled || cwd === undefined) return;
				if (baseCache.has(hunkKey)) return;
				const wanted = [];
				hunks.forEach((hunk, index) => {
					if (hunk.oldStart === undefined || hunk.newStart === undefined) wanted.push(index);
				});
				if (wanted.length === 0) return;
				let alive = true;
				void (async () => {
					const next = new Array(hunks.length).fill(null);
					const fileLinesByPath = new Map();
					for (const index of wanted) {
						const hunk = hunks[index];
						let fileLines = fileLinesByPath.get(hunk.path);
						if (fileLines === undefined) {
							const content = await readWorkspaceFile(hunk.path, cwd);
							fileLines = content === null ? null : splitLines(content);
							fileLinesByPath.set(hunk.path, fileLines);
						}
						if (fileLines === null) continue;
						next[index] = locateHunkBases(hunk, fileLines);
					}
					if (!alive) return;
					baseCache.set(hunkKey, { key: hunkKey, values: next });
					if (baseCache.size > BASE_CACHE_CAP) {
						const oldest = baseCache.keys().next();
						if (!oldest.done) baseCache.delete(oldest.value);
					}
					setLocated({ key: hunkKey, values: next });
				})();
				return () => { alive = false; };
			}, [hunkKey, block, props ? props.cwd : undefined, failed]);

			if (hunks === null) {
				return react.createElement("div", { className: "did-root" + (failed ? " did-failed" : ""), ref: rootRef, style: cardStyle || undefined },
					react.createElement("div", { className: "did-head" },
						react.createElement("span", { className: "did-tool" }, label),
						failed ? react.createElement("span", { className: "did-failedbadge" }, tr("failed.badge", { tool: label })) : null,
						react.createElement("span", { className: "did-filepath" }, "…")
					)
				);
			}

			const rootClass = "did-root" + (failed ? " did-failed" : "") + (numbersOn ? "" : " did-nonumbers");
			const cwd = props.cwd, home = props.home, openFile = props.openFile;
			let totalAdded = 0, totalRemoved = 0;
			for (const computed of perHunk) {
				totalAdded += computed.added;
				totalRemoved += computed.removed;
			}
			let renderedRows = 0, hiddenRows = 0;
			let rowCounter = 0;
			const children = [];

			// Per-hunk bases first: the gutter box must fit the LARGEST number
			// the card actually renders, so 5-digit files get a 5ch lane
			// instead of digits spilling toward the code.
			const hunkBases = hunks.map((hunk, hunkIndex) => {
				const locatedHunk = located !== null && located.key === hunkKey ? located.values[hunkIndex] : null;
				return {
					oldBase: hunk.oldStart !== undefined ? hunk.oldStart
						: locatedHunk !== null ? locatedHunk.oldBase : null,
					newBase: hunk.newStart !== undefined ? hunk.newStart
						: locatedHunk !== null ? locatedHunk.newBase : null,
				};
			});
			// The lane must NEVER change after a card's first paint: the late
			// locate re-render would rewrap the whole card (padding-left rides
			// the lane), and a post-paint height shift latches follow-scroll
			// off. Unknown bases therefore reserve a 4-digit lane — located
			// numbers for files up to 9999 lines then arrive with no lane
			// change — and the lane only ever grows, never shrinks.
			let maxNo = 0;
			let anyUnknown = false;
			hunks.forEach((hunk, hunkIndex) => {
				const { oldBase, newBase } = hunkBases[hunkIndex];
				for (const row of perHunk[hunkIndex].rows) {
					if (row.oldIndex !== undefined) {
						if (oldBase !== null) maxNo = Math.max(maxNo, oldBase + row.oldIndex);
						else anyUnknown = true;
					}
					if (row.newIndex !== undefined) {
						if (newBase !== null) maxNo = Math.max(maxNo, newBase + row.newIndex);
						else anyUnknown = true;
					}
				}
			});
			const wantedWidth = Math.max(anyUnknown ? 4 : 3, String(maxNo).length);
			const [laneWidth, setLaneWidth] = react.useState(() => wantedWidth);
			// Render-phase growth: re-renders pre-paint in the same commit, so
			// widening never produces a painted intermediate layout.
			const gutterWidth = wantedWidth > laneWidth
				? (setLaneWidth(wantedWidth), wantedWidth)
				: laneWidth;
			const numWidth = gutterWidth + "ch";

			for (let hunkIndex = 0; hunkIndex < hunks.length; hunkIndex++) {
				const hunk = hunks[hunkIndex];
				const { rows, stripped, added, removed } = perHunk[hunkIndex];
				const { oldBase, newBase } = hunkBases[hunkIndex];

				const lang = langFromPath(hunk.path);
				const leftCells = [];
				const rightCells = [];
				for (const row of rows) {
					if (renderedRows >= MAX_ROWS) { hiddenRows++; continue; }
					pushCellPair(leftCells, rightCells, rowCounter++, row, words, lang, syntaxOn, oldBase, newBase, numbersOn);
					renderedRows++;
				}

				const pathElement = typeof openFile === "function"
					? react.createElement("button", {
						type: "button", className: "did-path", title: hunk.path,
						onClick: () => openFile(hunk.path)
					}, relativePath(hunk.path, cwd, home))
					: react.createElement("span", { className: "did-filepath", title: hunk.path }, relativePath(hunk.path, cwd, home));

				children.push(react.createElement("div", { className: "did-file", key: hunk.path },
					react.createElement("div", { className: "did-filehead" },
						pathElement,
						react.createElement("span", { className: "did-stats" },
							stripped.indentChars > 0 ? react.createElement("span", {
								className: "did-indent",
								title: tr("indent.stripped.tooltip", { count: stripped.indentChars })
							}, "⇤ " + stripped.indentChars) : null,
							" ",
							react.createElement("span", { className: "did-addnum" }, "+" + added), " ",
							react.createElement("span", { className: "did-delnum" }, "−" + removed)
						)
					),
					react.createElement("div", {
						className: "did-grid",
						onMouseOver: onGridOver,
						onMouseLeave: clearHover,
					},
						react.createElement("div", { className: "did-col" }, leftCells),
						react.createElement("div", { className: "did-col" }, rightCells))
				));
			}

			if (hiddenRows > 0) {
				children.push(react.createElement("div", { className: "did-more" },
					tr("truncated.lines", { count: hiddenRows })));
			}

			const toggleHead = (key) => react.createElement("div", {
				key,
				className: "did-head" + (failed ? " did-headtoggle" : ""),
				onClick: failed ? () => setAttemptOpen((open) => !open) : undefined,
				role: failed ? "button" : undefined,
				"aria-expanded": failed ? attemptOpen : undefined,
				tabIndex: failed ? 0 : undefined,
				onKeyDown: failed ? (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						setAttemptOpen((open) => !open);
					}
				} : undefined,
			},
				failed ? react.createElement("span", { className: "did-chev" }, "▸") : null,
				react.createElement("span", { className: "did-tool" }, label),
				failed ? react.createElement("span", { className: "did-failedbadge" }, tr("failed.badge", { tool: label })) : null,
				react.createElement("span", { className: "did-stats" },
					hunks.length > 1 ? tr("stats.files", { count: hunks.length }) : "",
					react.createElement("span", { className: "did-addnum" }, "+" + totalAdded), " ",
					react.createElement("span", { className: "did-delnum" }, "−" + totalRemoved)
				)
			);

			// Gutter width rides a custom property so both the number box and
			// every cell's reserved lane size to the card's largest number.
			const rootStyle = cardStyle === null
				? { "--did-num-w": numWidth }
				: { ...cardStyle, "--did-num-w": numWidth };

			if (failed && !attemptOpen) {
				return react.createElement("div", { className: rootClass, ref: rootRef, style: rootStyle },
					toggleHead("head"));
			}

			return react.createElement("div", { className: rootClass + (failed ? " did-open" : ""), ref: rootRef, style: rootStyle },
				toggleHead("head"),
				children
			);
		}
		//#endregion

		//#region plugin settings card
		// Settings card: Words (token chips on paired rows) vs Lines-only (row
		// tint), Strip vs Keep for shared leading indentation, Syntax on/off.
		// Reads through the shared mode subscriptions; writes go through the
		// injected setters, which echo optimistically and let the scope
		// subscription confirm. Hidden while the Host does not serve the
		// namespace; buttons disable while the document is read-only.
		function chevron(open) {
			return react.createElement("span", { className: "did-chev" + (open ? " did-chevopen" : "") },
				react.createElement("svg", {
					width: 14, height: 14, viewBox: "0 0 14 14", "aria-hidden": true,
					fill: "none", stroke: "currentColor", strokeWidth: 1.5,
					strokeLinecap: "round", strokeLinejoin: "round"
				}, react.createElement("path", { d: "M3.5 5.25 7 8.75l3.5-3.5" })));
		}

		function segmentButton(mode, label, active, choose, disabled) {
			return react.createElement("button", {
				type: "button",
				key: mode,
				"aria-pressed": active,
				disabled,
				onClick: () => choose(mode)
			}, label);
		}

		function DiffHighlightCard(props) {
			const setHighlight = props && props.setHighlight;
			const setIndent = props && props.setIndent;
			const setSyntax = props && props.setSyntax;
			const setNumbers = props && props.setNumbers;
			const [words, setWords] = react.useState(getWordsMode());
			react.useEffect(() => onWordsMode(setWords), []);
			const [keepIndent, setKeepIndent] = react.useState(getKeepIndent());
			react.useEffect(() => onKeepIndent(setKeepIndent), []);
			const [syntaxOn, setSyntaxOn] = react.useState(getSyntaxOn());
			react.useEffect(() => onSyntaxOn(setSyntaxOn), []);
			const [numbersOn, setNumbersOn] = react.useState(getNumbersOn());
			react.useEffect(() => onNumbersOn(setNumbersOn), []);
			const [settings, setSettings] = react.useState(getSettingsState());
			react.useEffect(() => onSettingsState(setSettings), []);
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);
			const [open, setOpen] = react.useState(false);
			if (!settings.ready) return null;
			const writable = settings.writable
				&& typeof setHighlight === "function" && typeof setIndent === "function"
				&& typeof setSyntax === "function" && typeof setNumbers === "function";
			const choose = writable ? setHighlight : () => {};
			const chooseIndent = writable ? setIndent : () => {};
			const chooseSyntax = writable ? setSyntax : () => {};
			const chooseNumbers = writable ? setNumbers : () => {};
			return react.createElement("li", { className: "did-card" + (open ? " did-cardopen" : "") },
				react.createElement("button", {
					type: "button",
					className: "did-cardhead",
					"aria-expanded": open,
					onClick: () => setOpen(!open)
				},
					react.createElement("span", { className: "did-cardtext" },
						react.createElement("span", { className: "did-cardname" }, tr("card.name")),
						react.createElement("span", { className: "did-carddesc" }, tr("card.desc"))),
					chevron(open)),
				open ? react.createElement("div", { className: "did-cardbody" },
					writable ? null : react.createElement("p", { className: "did-readonly", role: "status" },
						tr("readonly.note")),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("highlight.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("highlight.title") },
							segmentButton(HIGHLIGHT_WORDS, tr("highlight.words"), words, choose, !writable),
							segmentButton(HIGHLIGHT_LINES, tr("highlight.lines"), !words, choose, !writable)
						)
					),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("indent.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("indent.title") },
							segmentButton(INDENT_STRIP, tr("indent.strip"), !keepIndent, chooseIndent, !writable),
							segmentButton(INDENT_KEEP, tr("indent.keep"), keepIndent, chooseIndent, !writable)
						)
					),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("syntax.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("syntax.title") },
							segmentButton(SYNTAX_ON, tr("syntax.on"), syntaxOn, chooseSyntax, !writable),
							segmentButton(SYNTAX_OFF, tr("syntax.off"), !syntaxOn, chooseSyntax, !writable)
						)
					),
					react.createElement("div", { className: "did-setting" },
						react.createElement("span", { className: "did-setting-title" }, tr("numbers.title")),
						react.createElement("div", { className: "did-seg", role: "group", "aria-label": tr("numbers.title") },
							segmentButton(NUMBERS_ON, tr("numbers.on"), numbersOn, chooseNumbers, !writable),
							segmentButton(NUMBERS_OFF, tr("numbers.off"), !numbersOn, chooseNumbers, !writable)
						)
					)
				) : null
			);
		}
		//#endregion

		//#region plugin body
		function apply(ctx) {
			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-inline-diff";
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => tag.remove();
			}, "dsh-inline-diff: stylesheet");

			// Toggle .did-sv-themed on <html> while dsh-stylevault's <style>
			// layers are live in <head> (empty when disabled), so the stylesheet
			// can swap card chrome between recipes without a reload.
			ctx.effect(() => {
				const docEl = document.documentElement;
				const sync = () => {
					try {
						const themed = [...document.querySelectorAll('style[data-plugin="dsh-stylevault"]')]
							.some((s) => (s.textContent || "").trim().length > 0);
						docEl.classList.toggle("did-sv-themed", themed);
					} catch { /* head-less test harness: no DOM to inspect */ }
				};
				sync();
				let obs = null;
				if (typeof MutationObserver === "function") {
					obs = new MutationObserver(sync);
					obs.observe(document.head, { childList: true, subtree: true, characterData: true });
				}
				return () => {
					if (obs) obs.disconnect();
					try { docEl.classList.remove("did-sv-themed"); } catch { /* head-less */ }
				};
			}, "dsh-inline-diff: stylevault marker");

			const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
			const adoptScope = () => {
				const snapshot = scope.getSnapshot();
				const section = snapshot.value;
				setWordsMode(section === undefined || section[HIGHLIGHT_FIELD] !== HIGHLIGHT_LINES);
				setKeepIndent(section !== undefined && section[INDENT_FIELD] === INDENT_KEEP);
				setSyntaxOn(section === undefined || section[SYNTAX_FIELD] !== SYNTAX_OFF);
				setNumbersOn(section === undefined || section[NUMBERS_FIELD] !== NUMBERS_OFF);
				adoptSettingsState(snapshot);
			};
			ctx.effect(() => scope.subscribe(adoptScope), "dsh-inline-diff: settings adoption");
			adoptScope();
			const writeHighlight = (mode) => {
				setWordsMode(mode !== HIGHLIGHT_LINES); // optimistic echo; adoption confirms
				scope.set(HIGHLIGHT_FIELD, mode).catch(adoptScope);
			};
			const writeIndent = (mode) => {
				setKeepIndent(mode === INDENT_KEEP); // optimistic echo; adoption confirms
				scope.set(INDENT_FIELD, mode).catch(adoptScope);
			};
			const writeSyntax = (mode) => {
				setSyntaxOn(mode !== SYNTAX_OFF); // optimistic echo; adoption confirms
				scope.set(SYNTAX_FIELD, mode).catch(adoptScope);
			};
			const writeNumbers = (mode) => {
				setNumbersOn(mode !== NUMBERS_OFF); // optimistic echo; adoption confirms
				scope.set(NUMBERS_FIELD, mode).catch(adoptScope);
			};

			// Follow the GUI language while the optional locale service is
			// composed; without one, the browser-derived seed stands.
			ctx.inject(["locale"], (localeCtx) => {
				const locale = localeCtx.locale;
				const adoptServiceLocale = () => adoptLocale(locale.getLocale().active);
				adoptServiceLocale();
				localeCtx.effect(() => locale.subscribe(adoptServiceLocale),
					"dsh-inline-diff: locale adoption");
			});

			// Negative priority: unloading the plugin restores the stock rows.
			ctx.slots.inject("tool.call.toolview", function* () {
				yield ctx.slots.register({ name: "tool.call.toolview", key: "edit", priority: -1 }, InlineDiffRow);
				yield ctx.slots.register({ name: "tool.call.toolview", key: "write", priority: -1 }, InlineDiffRow);
			});
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: SETTINGS_NAMESPACE,
				inject: () => ({ setHighlight: writeHighlight, setIndent: writeIndent, setSyntax: writeSyntax, setNumbers: writeNumbers })
			}, DiffHighlightCard));
		}

		// Required host services.
		const inject = ["slots", "connection", "settingsScope"];
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
