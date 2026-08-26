window.__ModuleLoader__.load({
	id: "dsh-inline-diff",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region vendored highlight.js 11 (core + the same 15 languages the
		// dsh-solution-explorer editor registers; token colors live in the
		// stylesheet region below, scoped to .did-root)
		var didHljsVendor=(()=>{var Un=Object.create;var de=Object.defineProperty;var $n=Object.getOwnPropertyDescriptor;var Fn=Object.getOwnPropertyNames;var zn=Object.getPrototypeOf,Gn=Object.prototype.hasOwnProperty;var Hn=(e,n)=>()=>{try{return n||e((n={exports:{}}).exports,n),n.exports}catch(t){throw n=0,t}},Kn=(e,n)=>{for(var t in n)de(e,t,{get:n[t],enumerable:!0})},Le=(e,n,t,i)=>{if(n&&typeof n=="object"||typeof n=="function")for(let l of Fn(n))!Gn.call(e,l)&&l!==t&&de(e,l,{get:()=>n[l],enumerable:!(i=$n(n,l))||i.enumerable});return e};var Zn=(e,n,t)=>(t=e!=null?Un(zn(e)):{},Le(n||!e||!e.__esModule?de(t,"default",{value:e,enumerable:!0}):t,e)),Yn=e=>Le(de({},"__esModule",{value:!0}),e);var en=Hn((ei,je)=>{function ze(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(n=>{let t=e[n],i=typeof t;(i==="object"||i==="function")&&!Object.isFrozen(t)&&ze(t)}),e}var ge=class{constructor(n){n.data===void 0&&(n.data={}),this.data=n.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function Ge(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function q(e,...n){let t=Object.create(null);for(let i in e)t[i]=e[i];return n.forEach(function(i){for(let l in i)t[l]=i[l]}),t}var Wn="</span>",De=e=>!!e.scope,Xn=(e,{prefix:n})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){let t=e.split(".");return[`${n}${t.shift()}`,...t.map((i,l)=>`${i}${"_".repeat(l+1)}`)].join(" ")}return`${n}${e}`},ye=class{constructor(n,t){this.buffer="",this.classPrefix=t.classPrefix,n.walk(this)}addText(n){this.buffer+=Ge(n)}openNode(n){if(!De(n))return;let t=Xn(n.scope,{prefix:this.classPrefix});this.span(t)}closeNode(n){De(n)&&(this.buffer+=Wn)}value(){return this.buffer}span(n){this.buffer+=`<span class="${n}">`}},Be=(e={})=>{let n={children:[]};return Object.assign(n,e),n},Ae=class e{constructor(){this.rootNode=Be(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(n){this.top.children.push(n)}openNode(n){let t=Be({scope:n});this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(n){return this.constructor._walk(n,this.rootNode)}static _walk(n,t){return typeof t=="string"?n.addText(t):t.children&&(n.openNode(t),t.children.forEach(i=>this._walk(n,i)),n.closeNode(t)),n}static _collapse(n){typeof n!="string"&&n.children&&(n.children.every(t=>typeof t=="string")?n.children=[n.children.join("")]:n.children.forEach(t=>{e._collapse(t)}))}},Oe=class extends Ae{constructor(n){super(),this.options=n}addText(n){n!==""&&this.add(n)}startScope(n){this.openNode(n)}endScope(){this.closeNode()}__addSublanguage(n,t){let i=n.root;t&&(i.scope=`language:${t}`),this.add(i)}toHTML(){return new ye(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function re(e){return e?typeof e=="string"?e:e.source:null}function He(e){return j("(?=",e,")")}function qn(e){return j("(?:",e,")*")}function Vn(e){return j("(?:",e,")?")}function j(...e){return e.map(t=>re(t)).join("")}function Jn(e){let n=e[e.length-1];return typeof n=="object"&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}function fe(...e){return"("+(Jn(e).capture?"":"?:")+e.map(i=>re(i)).join("|")+")"}function Ke(e){return new RegExp(e.toString()+"|").exec("").length-1}function Qn(e,n){let t=e&&e.exec(n);return t&&t.index===0}var jn=new RegExp(fe(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function we(e,{joinWith:n}){let t=0;return e.map(i=>{t+=1;let l=t,p=re(i),s="";for(;p.length>0;){let a=jn.exec(p);if(!a){s+=p;break}s+=p.substring(0,a.index),p=p.substring(a.index+a[0].length),a[0][0]==="\\"&&a[1]?s+="\\"+String(Number(a[1])+l):(s+=a[0],(a[0]==="("||/^\(\?[<']/.test(a[0]))&&t++)}return s}).map(i=>`(${i})`).join(n)}var et=/\b\B/,Ze="[a-zA-Z]\\w*",Me="[a-zA-Z_]\\w*",Ye="\\b\\d+(\\.\\d+)?",We="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",Xe="\\b(0b[01]+)",nt="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",tt=(e={})=>{let n=/^#![ ]*\//;return e.binary&&(e.begin=j(n,/.*\b/,e.binary,/\b.*/)),q({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(t,i)=>{t.index!==0&&i.ignoreMatch()}},e)},oe={begin:"\\\\[\\s\\S]",relevance:0},it={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[oe]},at={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[oe]},st={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},pe=function(e,n,t={}){let i=q({scope:"comment",begin:e,end:n,contains:[]},t);i.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let l=fe("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return i.contains.push({begin:j(/[ ]+/,"(",l,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),i},rt=pe("//","$"),ot=pe("/\\*","\\*/"),ct=pe("#","$"),lt={scope:"number",begin:Ye,relevance:0},dt={scope:"number",begin:We,relevance:0},ut={scope:"number",begin:Xe,relevance:0},gt={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[oe,{begin:/\[/,end:/\]/,relevance:0,contains:[oe]}]},bt={scope:"title",begin:Ze,relevance:0},ft={scope:"title",begin:Me,relevance:0},pt={begin:"\\.\\s*"+Me,relevance:0},_t=function(e){return Object.assign(e,{"on:begin":(n,t)=>{t.data._beginMatch=n[1]},"on:end":(n,t)=>{t.data._beginMatch!==n[1]&&t.ignoreMatch()}})},ue=Object.freeze({__proto__:null,APOS_STRING_MODE:it,BACKSLASH_ESCAPE:oe,BINARY_NUMBER_MODE:ut,BINARY_NUMBER_RE:Xe,COMMENT:pe,C_BLOCK_COMMENT_MODE:ot,C_LINE_COMMENT_MODE:rt,C_NUMBER_MODE:dt,C_NUMBER_RE:We,END_SAME_AS_BEGIN:_t,HASH_COMMENT_MODE:ct,IDENT_RE:Ze,MATCH_NOTHING_RE:et,METHOD_GUARD:pt,NUMBER_MODE:lt,NUMBER_RE:Ye,PHRASAL_WORDS_MODE:st,QUOTE_STRING_MODE:at,REGEXP_MODE:gt,RE_STARTERS_RE:nt,SHEBANG:tt,TITLE_MODE:bt,UNDERSCORE_IDENT_RE:Me,UNDERSCORE_TITLE_MODE:ft});function Et(e,n){e.input[e.index-1]==="."&&n.ignoreMatch()}function mt(e,n){e.className!==void 0&&(e.scope=e.className,delete e.className)}function ht(e,n){n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=Et,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function Nt(e,n){Array.isArray(e.illegal)&&(e.illegal=fe(...e.illegal))}function St(e,n){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function Tt(e,n){e.relevance===void 0&&(e.relevance=1)}var yt=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");let t=Object.assign({},e);Object.keys(e).forEach(i=>{delete e[i]}),e.keywords=t.keywords,e.begin=j(t.beforeMatch,He(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},At=["of","and","for","in","not","or","if","then","parent","list","value"],Ot="keyword";function qe(e,n,t=Ot){let i=Object.create(null);return typeof e=="string"?l(t,e.split(" ")):Array.isArray(e)?l(t,e):Object.keys(e).forEach(function(p){Object.assign(i,qe(e[p],n,p))}),i;function l(p,s){n&&(s=s.map(a=>a.toLowerCase())),s.forEach(function(a){let o=a.split("|");i[o[0]]=[p,Rt(o[0],o[1])]})}}function Rt(e,n){return n?Number(n):wt(e)?0:1}function wt(e){return At.includes(e.toLowerCase())}var Pe={},Q=e=>{console.error(e)},Ue=(e,...n)=>{console.log(`WARN: ${e}`,...n)},ee=(e,n)=>{Pe[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),Pe[`${e}/${n}`]=!0)},be=new Error;function Ve(e,n,{key:t}){let i=0,l=e[t],p={},s={};for(let a=1;a<=n.length;a++)s[a+i]=l[a],p[a+i]=!0,i+=Ke(n[a-1]);e[t]=s,e[t]._emit=p,e[t]._multi=!0}function Mt(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw Q("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),be;if(typeof e.beginScope!="object"||e.beginScope===null)throw Q("beginScope must be object"),be;Ve(e,e.begin,{key:"beginScope"}),e.begin=we(e.begin,{joinWith:""})}}function vt(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw Q("skip, excludeEnd, returnEnd not compatible with endScope: {}"),be;if(typeof e.endScope!="object"||e.endScope===null)throw Q("endScope must be object"),be;Ve(e,e.end,{key:"endScope"}),e.end=we(e.end,{joinWith:""})}}function xt(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function Ct(e){xt(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),Mt(e),vt(e)}function It(e){function n(s,a){return new RegExp(re(s),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(a?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(a,o){o.position=this.position++,this.matchIndexes[this.matchAt]=o,this.regexes.push([o,a]),this.matchAt+=Ke(a)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let a=this.regexes.map(o=>o[1]);this.matcherRe=n(we(a,{joinWith:"|"}),!0),this.lastIndex=0}exec(a){this.matcherRe.lastIndex=this.lastIndex;let o=this.matcherRe.exec(a);if(!o)return null;let d=o.findIndex((S,_)=>_>0&&S!==void 0),g=this.matchIndexes[d];return o.splice(0,d),Object.assign(o,g)}}class i{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(a){if(this.multiRegexes[a])return this.multiRegexes[a];let o=new t;return this.rules.slice(a).forEach(([d,g])=>o.addRule(d,g)),o.compile(),this.multiRegexes[a]=o,o}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(a,o){this.rules.push([a,o]),o.type==="begin"&&this.count++}exec(a){let o=this.getMatcher(this.regexIndex);o.lastIndex=this.lastIndex;let d=o.exec(a);if(this.resumingScanAtSamePosition()&&!(d&&d.index===this.lastIndex)){let g=this.getMatcher(0);g.lastIndex=this.lastIndex+1,d=g.exec(a)}return d&&(this.regexIndex+=d.position+1,this.regexIndex===this.count&&this.considerAll()),d}}function l(s){let a=new i;return s.contains.forEach(o=>a.addRule(o.begin,{rule:o,type:"begin"})),s.terminatorEnd&&a.addRule(s.terminatorEnd,{type:"end"}),s.illegal&&a.addRule(s.illegal,{type:"illegal"}),a}function p(s,a){let o=s;if(s.isCompiled)return o;[mt,St,Ct,yt].forEach(g=>g(s,a)),e.compilerExtensions.forEach(g=>g(s,a)),s.__beforeBegin=null,[ht,Nt,Tt].forEach(g=>g(s,a)),s.isCompiled=!0;let d=null;return typeof s.keywords=="object"&&s.keywords.$pattern&&(s.keywords=Object.assign({},s.keywords),d=s.keywords.$pattern,delete s.keywords.$pattern),d=d||/\w+/,s.keywords&&(s.keywords=qe(s.keywords,e.case_insensitive)),o.keywordPatternRe=n(d,!0),a&&(s.begin||(s.begin=/\B|\b/),o.beginRe=n(o.begin),!s.end&&!s.endsWithParent&&(s.end=/\B|\b/),s.end&&(o.endRe=n(o.end)),o.terminatorEnd=re(o.end)||"",s.endsWithParent&&a.terminatorEnd&&(o.terminatorEnd+=(s.end?"|":"")+a.terminatorEnd)),s.illegal&&(o.illegalRe=n(s.illegal)),s.contains||(s.contains=[]),s.contains=[].concat(...s.contains.map(function(g){return kt(g==="self"?s:g)})),s.contains.forEach(function(g){p(g,o)}),s.starts&&p(s.starts,a),o.matcher=l(o),o}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=q(e.classNameAliases||{}),p(e)}function Je(e){return e?e.endsWithParent||Je(e.starts):!1}function kt(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(n){return q(e,{variants:null},n)})),e.cachedVariants?e.cachedVariants:Je(e)?q(e,{starts:e.starts?q(e.starts):null}):Object.isFrozen(e)?q(e):e}var Lt="11.12.0",Re=class extends Error{constructor(n,t){super(n),this.name="HTMLInjectionError",this.html=t}},Te=Ge,$e=q,Fe=Symbol("nomatch"),Dt=7,Qe=function(e){let n=Object.create(null),t=Object.create(null),i=[],l=!0,p="Could not find the language '{}', did you forget to load/include a language module?",s={disableAutodetect:!0,name:"Plain text",contains:[]},a={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:Oe};function o(r){return a.noHighlightRe.test(r)}function d(r){let b=r.className+" ";b+=r.parentNode?r.parentNode.className:"";let u=a.languageDetectRe.exec(b);if(u){let m=L(u[1]);return m||(Ue(p.replace("{}",u[1])),Ue("Falling back to no-highlight mode for this block.",r)),m?u[1]:"no-highlight"}return b.split(/\s+/).find(m=>o(m)||L(m))}function g(r,b,u){let m="",y="";typeof b=="object"?(m=r,u=b.ignoreIllegals,y=b.language):(ee("10.7.0","highlight(lang, code, ...args) has been deprecated."),ee("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),y=r,m=b),u===void 0&&(u=!0);let x={code:m,language:y};X("before:highlight",x);let U=x.result?x.result:S(x.language,x.code,u);return U.code=x.code,X("after:highlight",U),U}function S(r,b,u,m){let y=Object.create(null);function x(c,f){return c.keywords[f]}function U(){if(!E.keywords){D.addText(R);return}let c=0;E.keywordPatternRe.lastIndex=0;let f=E.keywordPatternRe.exec(R),h="";for(;f;){h+=R.substring(c,f.index);let O=Z.case_insensitive?f[0].toLowerCase():f[0],$=x(E,O);if($){let[Y,Bn]=$;if(D.addText(h),h="",y[O]=(y[O]||0)+1,y[O]<=Dt&&(le+=Bn),Y.startsWith("_"))h+=f[0];else{let Pn=Z.classNameAliases[Y]||Y;K(f[0],Pn)}}else h+=f[0];c=E.keywordPatternRe.lastIndex,f=E.keywordPatternRe.exec(R)}h+=R.substring(c),D.addText(h)}function H(){if(R==="")return;let c=null;if(typeof E.subLanguage=="string"){if(!n[E.subLanguage]){D.addText(R);return}c=S(E.subLanguage,R,!0,ke[E.subLanguage]),ke[E.subLanguage]=c._top}else c=N(R,E.subLanguage.length?E.subLanguage:null);E.relevance>0&&(le+=c.relevance),D.__addSublanguage(c._emitter,c.language)}function z(){E.subLanguage!=null?H():U(),R=""}function K(c,f){c!==""&&(D.startScope(f),D.addText(c),D.endScope())}function ve(c,f){let h=1,O=f.length-1;for(;h<=O;){if(!c._emit[h]){h++;continue}let $=Z.classNameAliases[c[h]]||c[h],Y=f[h];$?K(Y,$):(R=Y,U(),R=""),h++}}function xe(c,f){return c.scope&&typeof c.scope=="string"&&D.openNode(Z.classNameAliases[c.scope]||c.scope),c.beginScope&&(c.beginScope._wrap?(K(R,Z.classNameAliases[c.beginScope._wrap]||c.beginScope._wrap),R=""):c.beginScope._multi&&(ve(c.beginScope,f),R="")),E=Object.create(c,{parent:{value:E}}),E}function Ce(c,f,h){let O=Qn(c.endRe,h);if(O){if(c["on:end"]){let $=new ge(c);c["on:end"](f,$),$.isMatchIgnored&&(O=!1)}if(O){for(;c.endsParent&&c.parent;)c=c.parent;return c}}if(c.endsWithParent)return Ce(c.parent,f,h)}function Cn(c){return E.matcher.regexIndex===0?(R+=c[0],1):(Se=!0,0)}function In(c){let f=c[0],h=c.rule,O=new ge(h),$=[h.__beforeBegin,h["on:begin"]];for(let Y of $)if(Y&&(Y(c,O),O.isMatchIgnored))return Cn(f);return h.skip?R+=f:(h.excludeBegin&&(R+=f),z(),!h.returnBegin&&!h.excludeBegin&&(R=f)),xe(h,c),h.returnBegin?0:f.length}function kn(c){let f=c[0],h=b.substring(c.index),O=Ce(E,c,h);if(!O)return Fe;let $=E;E.endScope&&E.endScope._wrap?(z(),K(f,E.endScope._wrap)):E.endScope&&E.endScope._multi?(z(),ve(E.endScope,c)):$.skip?R+=f:($.returnEnd||$.excludeEnd||(R+=f),z(),$.excludeEnd&&(R=f));do E.scope&&D.closeNode(),!E.skip&&!E.subLanguage&&(le+=E.relevance),E=E.parent;while(E!==O.parent);return O.starts&&xe(O.starts,c),$.returnEnd?0:f.length}function Ln(){let c=[];for(let f=E;f!==Z;f=f.parent)f.scope&&c.unshift(f.scope);c.forEach(f=>D.openNode(f))}let ce={};function Ie(c,f){let h=f&&f[0];if(R+=c,h==null)return z(),0;if(ce.type==="begin"&&f.type==="end"&&ce.index===f.index&&h===""){if(R+=b.slice(f.index,f.index+1),!l){let O=new Error(`0 width match regex (${r})`);throw O.languageName=r,O.badRule=ce.rule,O}return 1}if(ce=f,f.type==="begin")return In(f);if(f.type==="illegal"&&!u){let O=new Error('Illegal lexeme "'+h+'" for mode "'+(E.scope||"<unnamed>")+'"');throw O.mode=E,O}else if(f.type==="end"){let O=kn(f);if(O!==Fe)return O}if(f.type==="illegal"&&h==="")return f.index===b.length||(R+=`
`),1;if(Ne>1e5&&Ne>f.index*3)throw new Error("potential infinite loop, way more iterations than matches");return R+=h,h.length}let Z=L(r);if(!Z)throw Q(p.replace("{}",r)),new Error('Unknown language: "'+r+'"');let Dn=It(Z),he="",E=m||Dn,ke={},D=new a.__emitter(a);Ln();let R="",le=0,J=0,Ne=0,Se=!1;try{if(Z.__emitTokens)Z.__emitTokens(b,D);else{for(E.matcher.considerAll();;){Ne++,Se?Se=!1:E.matcher.considerAll(),E.matcher.lastIndex=J;let c=E.matcher.exec(b);if(!c)break;let f=b.substring(J,c.index),h=Ie(f,c);J=c.index+h}Ie(b.substring(J))}return D.finalize(),he=D.toHTML(),{language:r,value:he,relevance:le,illegal:!1,_emitter:D,_top:E}}catch(c){if(c.message&&c.message.includes("Illegal"))return{language:r,value:Te(b),illegal:!0,relevance:0,_illegalBy:{message:c.message,index:J,context:b.slice(J-100,J+100),mode:c.mode,resultSoFar:he},_emitter:D};if(l)return{language:r,value:Te(b),illegal:!1,relevance:0,errorRaised:c,_emitter:D,_top:E};throw c}}function _(r){let b={value:Te(r),illegal:!1,relevance:0,_top:s,_emitter:new a.__emitter(a)};return b._emitter.addText(r),b}function N(r,b){b=b||a.languages||Object.keys(n);let u=_(r),m=b.filter(L).filter(W).map(z=>S(z,r,!1));m.unshift(u);let y=m.sort((z,K)=>{if(z.relevance!==K.relevance)return K.relevance-z.relevance;if(z.language&&K.language){if(L(z.language).supersetOf===K.language)return 1;if(L(K.language).supersetOf===z.language)return-1}return 0}),[x,U]=y,H=x;return H.secondBest=U,H}function A(r,b,u){let m=b&&t[b]||u;r.classList.add("hljs"),r.classList.add(`language-${m}`)}function T(r){let b=null,u=d(r);if(o(u))return;if(X("before:highlightElement",{el:r,language:u}),r.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",r);return}if(r.children.length>0&&(a.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(r)),a.throwUnescapedHTML))throw new Re("One of your code blocks includes unescaped HTML.",r.innerHTML);b=r;let m=b.textContent,y=u?g(m,{language:u,ignoreIllegals:!0}):N(m);r.innerHTML=y.value,r.dataset.highlighted="yes",A(r,u,y.language),r.result={language:y.language,re:y.relevance,relevance:y.relevance},y.secondBest&&(r.secondBest={language:y.secondBest.language,relevance:y.secondBest.relevance}),X("after:highlightElement",{el:r,result:y,text:m})}function M(r){a=$e(a,r)}let v=()=>{w(),ee("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function I(){w(),ee("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let F=!1;function w(){function r(){w()}if(document.readyState==="loading"){F||window.addEventListener("DOMContentLoaded",r,!1),F=!0;return}document.querySelectorAll(a.cssSelector).forEach(T)}function B(r,b){let u=null;try{u=b(e)}catch(m){if(Q("Language definition for '{}' could not be registered.".replace("{}",r)),l)Q(m);else throw m;u=s}u.name||(u.name=r),n[r]=u,u.rawDefinition=b.bind(null,e),u.aliases&&G(u.aliases,{languageName:r})}function P(r){delete n[r];for(let b of Object.keys(t))t[b]===r&&delete t[b]}function k(){return Object.keys(n)}function L(r){return r=(r||"").toLowerCase(),n[r]||n[t[r]]}function G(r,{languageName:b}){typeof r=="string"&&(r=[r]),r.forEach(u=>{t[u.toLowerCase()]=b})}function W(r){let b=L(r);return b&&!b.disableAutodetect}function V(r){r["before:highlightBlock"]&&!r["before:highlightElement"]&&(r["before:highlightElement"]=b=>{r["before:highlightBlock"](Object.assign({block:b.el},b))}),r["after:highlightBlock"]&&!r["after:highlightElement"]&&(r["after:highlightElement"]=b=>{r["after:highlightBlock"](Object.assign({block:b.el},b))})}function ie(r){V(r),i.push(r)}function ae(r){let b=i.indexOf(r);b!==-1&&i.splice(b,1)}function X(r,b){let u=r;i.forEach(function(m){m[u]&&m[u](b)})}function se(r){return ee("10.7.0","highlightBlock will be removed entirely in v12.0"),ee("10.7.0","Please use highlightElement now."),T(r)}Object.assign(e,{highlight:g,highlightAuto:N,highlightAll:w,highlightElement:T,highlightBlock:se,configure:M,initHighlighting:v,initHighlightingOnLoad:I,registerLanguage:B,unregisterLanguage:P,listLanguages:k,getLanguage:L,registerAliases:G,autoDetection:W,inherit:$e,addPlugin:ie,removePlugin:ae}),e.debugMode=function(){l=!1},e.safeMode=function(){l=!0},e.versionString=Lt,e.regex={concat:j,lookahead:He,either:fe,optional:Vn,anyNumberOfTimes:qn};for(let r in ue)typeof ue[r]=="object"&&ze(ue[r]);return Object.assign(e,ue),e},ne=Qe({});ne.newInstance=()=>Qe({});je.exports=ne;ne.HighlightJS=ne;ne.default=ne});var Qt={};Kn(Qt,{default:()=>Jt});var nn=Zn(en(),1);var C=nn.default;var tn="[A-Za-z$_][0-9A-Za-z$_]*",Bt=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Pt=["true","false","null","undefined","NaN","Infinity"],an=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],sn=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],rn=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Ut=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","self","global"],$t=[].concat(rn,an,sn);function on(e){let n=e.regex,t=(u,{after:m})=>{let y="</"+u[0].slice(1);return u.input.indexOf(y,m)!==-1},i=tn,l={begin:"<>",end:"</>"},p=/<[A-Za-z0-9\\._:-]+\s*\/>/,s={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(u,m)=>{let y=u[0].length+u.index,x=u.input[y];if(x==="<"||x===","){m.ignoreMatch();return}x===">"&&(t(u,{after:y})||m.ignoreMatch());let U,H=u.input.substring(y);if(U=H.match(/^\s*=/)){m.ignoreMatch();return}if((U=H.match(/^\s+extends\s+/))&&U.index===0){m.ignoreMatch();return}}},a={$pattern:tn,keyword:Bt,literal:Pt,built_in:$t,"variable.language":Ut},o="[0-9](_?[0-9])*",d=`\\.(${o})`,g="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",S={className:"number",variants:[{begin:`(\\b(${g})((${d})|\\.)?|(${d}))[eE][+-]?(${o})\\b`},{begin:`\\b(${g})\\b((${d})\\b|\\.)?|(${d})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},_={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},N={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"xml"}},A={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"css"}},T={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"graphql"}},M={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,_]},I={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:i+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},F=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,N,A,T,M,{match:/\$\d+/},S];_.contains=F.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(F)});let w=[].concat(I,_.contains),B=w.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(w)}]),P={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:B},k={variants:[{match:[/class/,/\s+/,i,/\s+/,/extends/,/\s+/,n.concat(i,"(",n.concat(/\./,i),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,i],scope:{1:"keyword",3:"title.class"}}]},L={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...an,...sn]}},G={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},W={variants:[{match:[/function/,/\s+/,i,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[P],illegal:/%/},V={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function ie(u){return n.concat("(?!",u.join("|"),")")}let ae={match:n.concat(/\b/,ie([...rn,"super","import","await"].map(u=>`${u}\\s*\\(`)),i,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},X={begin:n.concat(/\./,n.lookahead(n.concat(i,/(?![0-9A-Za-z$_(])/))),end:i,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},se={match:[/get|set/,/\s+/,i,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},P]},r="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",b={match:[/const|var|let/,/\s+/,i,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(r)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[P]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:B,CLASS_REFERENCE:L},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),G,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,N,A,T,M,I,{match:/\$\d+/},S,L,{scope:"attr",match:i+n.lookahead(":"),relevance:0},b,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[I,e.REGEXP_MODE,{className:"function",begin:r,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:B}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:l.begin,end:l.end},{match:p},{begin:s.begin,"on:begin":s.isTrulyOpeningTag,end:s.end}],subLanguage:"xml",contains:[{begin:s.begin,end:s.end,skip:!0,contains:["self"]}]}]},W,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[P,e.inherit(e.TITLE_MODE,{begin:i,className:"title.function"})]},{match:/\.\.\./,relevance:0},X,{match:"\\$"+i,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[P]},ae,V,k,se,{match:/\$[(.]/}]}}var _e="[A-Za-z$_][0-9A-Za-z$_]*",cn=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],ln=["true","false","null","undefined","NaN","Infinity"],dn=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],un=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],gn=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],bn=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","self","global"],fn=[].concat(gn,dn,un);function Ft(e){let n=e.regex,t=(u,{after:m})=>{let y="</"+u[0].slice(1);return u.input.indexOf(y,m)!==-1},i=_e,l={begin:"<>",end:"</>"},p=/<[A-Za-z0-9\\._:-]+\s*\/>/,s={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(u,m)=>{let y=u[0].length+u.index,x=u.input[y];if(x==="<"||x===","){m.ignoreMatch();return}x===">"&&(t(u,{after:y})||m.ignoreMatch());let U,H=u.input.substring(y);if(U=H.match(/^\s*=/)){m.ignoreMatch();return}if((U=H.match(/^\s+extends\s+/))&&U.index===0){m.ignoreMatch();return}}},a={$pattern:_e,keyword:cn,literal:ln,built_in:fn,"variable.language":bn},o="[0-9](_?[0-9])*",d=`\\.(${o})`,g="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",S={className:"number",variants:[{begin:`(\\b(${g})((${d})|\\.)?|(${d}))[eE][+-]?(${o})\\b`},{begin:`\\b(${g})\\b((${d})\\b|\\.)?|(${d})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},_={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},N={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"xml"}},A={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"css"}},T={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"graphql"}},M={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,_]},I={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:i+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},F=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,N,A,T,M,{match:/\$\d+/},S];_.contains=F.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(F)});let w=[].concat(I,_.contains),B=w.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(w)}]),P={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:B},k={variants:[{match:[/class/,/\s+/,i,/\s+/,/extends/,/\s+/,n.concat(i,"(",n.concat(/\./,i),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,i],scope:{1:"keyword",3:"title.class"}}]},L={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...dn,...un]}},G={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},W={variants:[{match:[/function/,/\s+/,i,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[P],illegal:/%/},V={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function ie(u){return n.concat("(?!",u.join("|"),")")}let ae={match:n.concat(/\b/,ie([...gn,"super","import","await"].map(u=>`${u}\\s*\\(`)),i,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},X={begin:n.concat(/\./,n.lookahead(n.concat(i,/(?![0-9A-Za-z$_(])/))),end:i,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},se={match:[/get|set/,/\s+/,i,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},P]},r="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",b={match:[/const|var|let/,/\s+/,i,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(r)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[P]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:B,CLASS_REFERENCE:L},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),G,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,N,A,T,M,I,{match:/\$\d+/},S,L,{scope:"attr",match:i+n.lookahead(":"),relevance:0},b,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[I,e.REGEXP_MODE,{className:"function",begin:r,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:B}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:l.begin,end:l.end},{match:p},{begin:s.begin,"on:begin":s.isTrulyOpeningTag,end:s.end}],subLanguage:"xml",contains:[{begin:s.begin,end:s.end,skip:!0,contains:["self"]}]}]},W,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[P,e.inherit(e.TITLE_MODE,{begin:i,className:"title.function"})]},{match:/\.\.\./,relevance:0},X,{match:"\\$"+i,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[P]},ae,V,k,se,{match:/\$[(.]/}]}}function pn(e){let n=e.regex,t=Ft(e),i=_e,l=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],p={begin:[/namespace/,/\s+/,e.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},s={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:l},contains:[t.exports.CLASS_REFERENCE]},a={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},o=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],d={$pattern:_e,keyword:cn.concat(o),literal:ln,built_in:fn.concat(l),"variable.language":bn},g={className:"meta",begin:"@"+i},S=(T,M,v)=>{let I=T.contains.findIndex(F=>F.label===M);if(I===-1)throw new Error("can not find mode to replace");T.contains.splice(I,1,v)};Object.assign(t.keywords,d),t.exports.PARAMS_CONTAINS.push(g);let _=t.contains.find(T=>T.scope==="attr"),N=Object.assign({},_,{match:n.concat(i,n.lookahead(/\s*\?:/))});t.exports.PARAMS_CONTAINS.push([t.exports.CLASS_REFERENCE,_,N]),t.contains=t.contains.concat([g,p,s,N]),S(t,"shebang",e.SHEBANG()),S(t,"use_strict",a);let A=t.contains.find(T=>T.label==="func.def");return A.relevance=0,Object.assign(t,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),t}function _n(e){let n=e.regex,t=/[\p{XID_Start}_]\p{XID_Continue}*/u,i=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","lazy","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],a={$pattern:/[A-Za-z]\w+|__\w+__/,keyword:i,built_in:["__import__","abs","aiter","all","anext","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozendict","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","sentinel","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]},o={className:"meta",begin:/^(>>>|\.\.\.) /},d={className:"subst",begin:/\{/,end:/\}/,keywords:a,illegal:/#/},g={begin:/\{\{/,relevance:0},S={className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,o],relevance:10},{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,o],relevance:10},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,o,g,d]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,o,g,d]},{begin:/([uU]|[rR])'/,end:/'/,relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,end:/"/},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'/,end:/'/,contains:[e.BACKSLASH_ESCAPE,g,d]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,g,d]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},_="[0-9](_?[0-9])*",N=`(\\b(${_}))?\\.(${_})|\\b(${_})\\.`,A=`\\b|${i.join("|")}`,T={className:"number",relevance:0,variants:[{begin:`(\\b(${_})|(${N}))[eE][+-]?(${_})[jJ]?(?=${A})`},{begin:`(${N})[jJ]?`},{begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${A})`},{begin:`\\b0[bB](_?[01])+[lL]?(?=${A})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${A})`},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${A})`},{begin:`\\b(${_})[jJ](?=${A})`}]},M={className:"comment",begin:n.lookahead(/# type:/),end:/$/,keywords:a,contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},v={className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:["self",o,T,S,e.HASH_COMMENT_MODE]}]};return d.contains=[S,T,o],{name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:a,illegal:/(<\/|\?)|=>/,contains:[o,T,{scope:"variable.language",match:/\bself\b/},{beginKeywords:"if",relevance:0},{match:/\bor\b/,scope:"keyword"},S,M,e.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,t],scope:{1:"keyword",3:"title.function"},contains:[v]},{variants:[{match:[/\bclass/,/\s+/,t,/\s*/,/\(\s*/,t,/\s*\)/]},{match:[/\bclass/,/\s+/,t]}],scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[T,v,S]}]}}var zt="([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity",Gt={scope:"number",match:zt,relevance:0};function En(e){let n={className:"attr",begin:/(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,relevance:1.01},t={match:/[{}[\],:]/,className:"punctuation",relevance:0},i=["true","false","null"],l={scope:"literal",beginKeywords:i.join(" ")};return{name:"JSON",aliases:["jsonc","json5"],keywords:{literal:i},contains:[n,t,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,Gt,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}function mn(e){let n=e.regex,t={},i={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[t]}]};Object.assign(t,{className:"variable",variants:[{begin:n.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},i]});let l={className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]},p=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),s={begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},a={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,t,l]};l.contains.push(a);let o={match:/\\"/},d={className:"string",begin:/'/,end:/'/},g={match:/\\'/},S={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,t]},_=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],N=e.SHEBANG({binary:`(${_.join("|")})`,relevance:10}),A={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},T=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],M=["true","false"],v={match:/(\/[a-z._-]+)+/},I=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],F=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],w=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],B=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:T,literal:M,built_in:[...I,...F,"set","shopt",...w,...B]},contains:[N,e.SHEBANG(),A,S,p,s,v,a,o,d,g,t]}}function hn(e){let n=e.regex,t=n.concat(/[\p{L}_]/u,n.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),i=/[\p{L}0-9._:-]+/u,l={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},p={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},s=e.inherit(p,{begin:/\(/,end:/\)/}),a=e.inherit(e.APOS_STRING_MODE,{className:"string"}),o=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),d={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:i,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[l]},{begin:/'/,end:/'/,contains:[l]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[p,o,a,s,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[p,s,o,a]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},l,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[o]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[d],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:"css"}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[d],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:"javascript"}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:n.concat(/</,n.lookahead(n.concat(t,n.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:t,relevance:0,starts:d}]},{className:"tag",begin:n.concat(/<\//,n.lookahead(n.concat(t,/>/))),contains:[{className:"name",begin:t,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}var Ht=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{scope:"number",begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,5}(-[0-9A-Fa-f][0-9A-Fa-f]{0,5})?/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),Kt=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],Zt=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],Yt=[...Kt,...Zt],Wt=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),Xt=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),qt=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),Vt=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","corner-bottom-left-shape","corner-bottom-right-shape","corner-shape","corner-top-left-shape","corner-top-right-shape","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse();function Nn(e){let n=e.regex,t=Ht(e),i={begin:/-(webkit|moz|ms|o)-(?=[a-z])/},l="and or not only",p=/@-?\w[\w]*(-\w+)*/,s="[a-zA-Z-][a-zA-Z0-9_-]*",a=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE];return{name:"CSS",case_insensitive:!0,illegal:/[=|'\$]/,keywords:{keyframePosition:"from to"},classNameAliases:{keyframePosition:"selector-tag"},contains:[t.BLOCK_COMMENT,i,t.CSS_NUMBER_MODE,{className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0},{className:"selector-class",begin:"\\."+s,relevance:0},t.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{begin:":("+Xt.join("|")+")"},{begin:":(:)?("+qt.join("|")+")"}]},t.CSS_VARIABLE,{className:"attribute",begin:"\\b("+Vt.join("|")+")\\b"},{begin:/:/,end:/[;}{]/,contains:[t.BLOCK_COMMENT,t.HEXCOLOR,t.IMPORTANT,t.CSS_NUMBER_MODE,t.UNICODE_RANGE,...a,{begin:/(url|data-uri)\(/,end:/\)/,relevance:0,keywords:{built_in:"url data-uri"},contains:[...a,{className:"string",begin:/[^)]/,endsWithParent:!0,excludeEnd:!0}]},t.FUNCTION_DISPATCH]},{begin:n.lookahead(/@/),end:"[{;]",relevance:0,illegal:/:/,contains:[{className:"keyword",begin:p},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{$pattern:/[a-z-]+/,keyword:l,attribute:Wt.join(" ")},contains:[{begin:/[a-z-]+(?=:)/,className:"attribute"},...a,t.CSS_NUMBER_MODE]}]},{className:"selector-tag",begin:"\\b("+Yt.join("|")+")\\b"}]}}function Sn(e){let n=e.regex,t={begin:/<\/?[A-Za-z_]/,end:">",subLanguage:"xml",relevance:0},i={match:/^ {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,}$/},l={className:"code",variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{begin:"(~{3,})[^~](.|\\n)*?\\1~*[ ]*"},{begin:"```",end:"```+[ ]*$"},{begin:"~~~",end:"~~~+[ ]*$"},{begin:"`.+?`"},{begin:"(?=^( {4}|\\t))",contains:[{begin:"^( {4}|\\t)",end:"(\\n)$"}],relevance:0}]},p={className:"bullet",begin:"^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",end:"\\s+",excludeEnd:!0},s={begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:"symbol",begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:"link",begin:/:\s*/,end:/$/,excludeBegin:!0}]},a=/[A-Za-z][A-Za-z0-9+.-]*/,o={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,relevance:2},{begin:n.concat(/\[.+?\]\(/,a,/:\/\/.*?\)/),relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{match:/\[(?=\])/},{className:"string",relevance:0,begin:"\\[",end:"\\]",excludeBegin:!0,returnEnd:!0},{className:"link",relevance:0,begin:"\\]\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\]\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0}]},d={className:"strong",contains:[],variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]},g={className:"emphasis",contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{begin:/_(?![_\s])/,end:/_/,relevance:0}]},S=e.inherit(d,{contains:[]}),_=e.inherit(g,{contains:[]});d.contains.push(_),g.contains.push(S);let N=[t,o];return[d,g,S,_].forEach(v=>{v.contains=v.contains.concat(N)}),N=N.concat(d,g),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:N},{begin:"(?=^.+?\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\n",contains:N}]}]},t,p,i,d,g,{className:"quote",begin:"^>\\s+",contains:N,end:"$"},l,o,s,{scope:"literal",match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/}]}}function Tn(e){let n="true false yes no null",t="[\\w#;/?:@&=+$,.~*'()[\\]]+",i={className:"attr",variants:[{begin:/[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/},{begin:/"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/},{begin:/'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/}]},l={className:"template-variable",variants:[{begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]},p={className:"string",relevance:0,begin:/'/,end:/'/,contains:[{match:/''/,scope:"char.escape",relevance:0}]},s={className:"string",relevance:0,variants:[{begin:/"/,end:/"/},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,l]},a=e.inherit(s,{variants:[{begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]},{begin:/"/,end:/"/},{begin:/[^\s,{}[\]]+/}]}),_={className:"number",begin:"\\b"+"[0-9]{4}(-[0-9][0-9]){0,2}"+"([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?"+"(\\.[0-9]*)?"+"([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?"+"\\b"},N={end:",",endsWithParent:!0,excludeEnd:!0,keywords:n,relevance:0},A={begin:/\{/,end:/\}/,contains:[N],illegal:"\\n",relevance:0},T={begin:"\\[",end:"\\]",contains:[N],illegal:"\\n",relevance:0},M=[i,{className:"meta",begin:"^---\\s*$",relevance:10},{className:"string",begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!\\w+!"+t},{className:"type",begin:"!<"+t+">"},{className:"type",begin:"!"+t},{className:"type",begin:"!!"+t},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},_,{className:"number",begin:e.C_NUMBER_RE+"\\b",relevance:0},A,T,p,s],v=[...M];return v.pop(),v.push(a),N.contains=v,{name:"YAML",case_insensitive:!0,aliases:["yml"],contains:M}}function yn(e){let n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),i="decltype\\(auto\\)",l="[a-zA-Z_]\\w*::",s="("+i+"|"+n.optional(l)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",a=n.concat(/\batomic_/,n.either("bool","char","schar","uchar","short","ushort","int","uint","long","ulong","llong","ullong","char16_t","char32_t","wchar_t","int_least8_t","uint_least8_t","int_least16_t","uint_least16_t","int_least32_t","uint_least32_t","int_least64_t","uint_least64_t","int_fast8_t","uint_fast8_t","int_fast16_t","uint_fast16_t","int_fast32_t","uint_fast32_t","int_fast64_t","uint_fast64_t","intptr_t","uintptr_t","size_t","ptrdiff_t","intmax_t","uintmax_t"),/\b/),o={className:"type",variants:[{begin:"\\b[a-z\\d_]*_t\\b"},{match:a}]},g={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\\s"]{0,16})\(/,end:/\)([^()\\\s"]{0,16})"/})]},S={className:"number",variants:[{match:/\b(0b[01']+)/},{match:/(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/},{match:/(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/},{match:/(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/}],relevance:0},_={scope:"meta",begin:/#\s*include\b/,end:/$/,keywords:{keyword:"include"},contains:[{begin:/\\\n/},g,{scope:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},N={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(g,{className:"string"}),t,e.C_BLOCK_COMMENT_MODE]},A=[_,N],T={className:"title",begin:n.optional(l)+e.IDENT_RE,relevance:0},M=n.optional(l)+e.IDENT_RE+"\\s*\\(",v=12,w={keyword:["asm","auto","break","case","continue","default","do","else","enum","extern","for","fortran","goto","if","inline","register","restrict","return","sizeof","typeof","typeof_unqual","struct","switch","typedef","union","volatile","while","_Alignas","_Alignof","_Atomic","_Generic","_Noreturn","_Static_assert","_Thread_local","alignas","alignof","noreturn","static_assert","thread_local","_Pragma"],type:["float","double","signed","unsigned","int","short","long","char","void","_Bool","_BitInt","_Complex","_Imaginary","_Decimal32","_Decimal64","_Decimal96","_Decimal128","_Decimal64x","_Decimal128x","_Float16","_Float32","_Float64","_Float128","_Float32x","_Float64x","_Float128x","const","static","constexpr","complex","bool","imaginary"],literal:"true false NULL",built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"},B=[...A,o,t,e.C_BLOCK_COMMENT_MODE,S,g],P={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:w,contains:B.concat([{begin:/\(/,end:/\)/,keywords:w,contains:B.concat(["self"]),relevance:0}]),relevance:0},k={begin:"("+s+"[\\*&\\s]+){1,"+v+"}"+M,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:w,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:i,keywords:w,relevance:0},{begin:M,returnBegin:!0,contains:[e.inherit(T,{className:"title.function"})],relevance:0},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:w,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,g,S,o,{begin:/\(/,end:/\)/,keywords:w,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,g,S,o]}]},o,t,e.C_BLOCK_COMMENT_MODE,...A]};return{name:"C",aliases:["h"],keywords:w,disableAutodetect:!0,illegal:"</",contains:[].concat(P,k,B,[...A,{begin:e.IDENT_RE+"::",keywords:w},{className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,contains:[{beginKeywords:"final class struct"},e.TITLE_MODE]}]),exports:{preprocessor:N,strings:g,keywords:w}}}function An(e){let n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),i="decltype\\(auto\\)",l="[a-zA-Z_]\\w*::",s="(?!struct)("+i+"|"+n.optional(l)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",a={className:"type",begin:"\\b[a-z\\d_]*_t\\b"},d={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\\s"]{0,16})\(/,end:/\)([^()\\\s"]{0,16})"/})]},g={className:"number",variants:[{begin:"[+-]?(?:(?:\\b[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|\\b[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|\\b0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)"},{begin:"[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)"}],relevance:0},S={scope:"meta",begin:/#\s*include\b/,end:/$/,keywords:{keyword:"include"},contains:[{begin:/\\\n/},d,{scope:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},_={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(d,{className:"string"}),t,e.C_BLOCK_COMMENT_MODE]},N=[S,_],A={className:"title",begin:n.optional(l)+e.IDENT_RE,relevance:0},T=n.optional(l)+e.IDENT_RE+"\\s*\\(",M=12,v=["alignas","alignof","and","and_eq","asm","atomic_cancel","atomic_commit","atomic_noexcept","auto","bitand","bitor","break","case","catch","class","co_await","co_return","co_yield","compl","concept","const_cast|10","consteval","constexpr","constinit","continue","decltype","default","delete","do","dynamic_cast|10","else","enum","explicit","export","extern","false","final","for","friend","goto","if","import","inline","module","mutable","namespace","new","noexcept","not","not_eq","nullptr","operator","or","or_eq","override","private","protected","public","reflexpr","register","reinterpret_cast|10","requires","return","sizeof","static_assert","static_cast|10","struct","switch","synchronized","template","this","thread_local","throw","transaction_safe","transaction_safe_dynamic","true","try","typedef","typeid","typename","union","using","virtual","volatile","while","xor","xor_eq"],I=["bool","char","char16_t","char32_t","char8_t","double","float","int","long","short","void","wchar_t","unsigned","signed","const","static"],F=["any","auto_ptr","barrier","binary_semaphore","bitset","complex","condition_variable","condition_variable_any","counting_semaphore","deque","false_type","flat_map","flat_set","future","imaginary","initializer_list","istringstream","jthread","latch","lock_guard","multimap","multiset","mutex","optional","ostringstream","packaged_task","pair","promise","priority_queue","queue","recursive_mutex","recursive_timed_mutex","scoped_lock","set","shared_future","shared_lock","shared_mutex","shared_timed_mutex","shared_ptr","stack","string_view","stringstream","timed_mutex","thread","true_type","tuple","unique_lock","unique_ptr","unordered_map","unordered_multimap","unordered_multiset","unordered_set","variant","vector","weak_ptr","wstring","wstring_view"],w=["abort","abs","acos","apply","as_const","asin","atan","atan2","calloc","ceil","cerr","cin","clog","cos","cosh","cout","declval","endl","exchange","exit","exp","fabs","floor","fmod","forward","fprintf","fputs","free","frexp","fscanf","future","invoke","isalnum","isalpha","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","isxdigit","labs","launder","ldexp","log","log10","make_pair","make_shared","make_shared_for_overwrite","make_tuple","make_unique","malloc","memchr","memcmp","memcpy","memset","modf","move","pow","printf","putchar","puts","realloc","scanf","sin","sinh","snprintf","sprintf","sqrt","sscanf","std","stderr","stdin","stdout","strcat","strchr","strcmp","strcpy","strcspn","strlen","strncat","strncmp","strncpy","strpbrk","strrchr","strspn","strstr","swap","tan","tanh","terminate","to_underlying","tolower","toupper","vfprintf","visit","vprintf","vsprintf"],k={type:I,keyword:v,literal:["NULL","false","nullopt","nullptr","true"],built_in:["_Pragma"],_type_hints:F},L={className:"function.dispatch",relevance:0,keywords:{_hint:w},begin:n.concat(/\b/,`(?!${v.join("|")})`,e.IDENT_RE,n.lookahead(/(<[^<>]+>|)\s*\(/))},G=[L,...N,a,t,e.C_BLOCK_COMMENT_MODE,g,d],W={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:k,contains:G.concat([{begin:/\(/,end:/\)/,keywords:k,contains:G.concat(["self"]),relevance:0}]),relevance:0},V={className:"function",begin:"("+s+"[\\*&\\s]+){1,"+M+"}"+T,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:k,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:i,keywords:k,relevance:0},{begin:T,returnBegin:!0,contains:[A],relevance:0},{begin:/::/,relevance:0},{begin:/:/,endsWithParent:!0,contains:[d,g]},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:k,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,d,g,a,{begin:/\(/,end:/\)/,keywords:k,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,d,g,a]}]},a,t,e.C_BLOCK_COMMENT_MODE,...N]};return{name:"C++",aliases:["cc","c++","h++","hpp","hh","hxx","cxx"],keywords:k,illegal:"</",classNameAliases:{"function.dispatch":"built_in"},contains:[].concat(W,V,L,G,[...N,{begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",end:">",keywords:k,contains:["self",a]},{begin:e.IDENT_RE+"::",keywords:k},{match:[/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,/\s+/,/\w+/],className:{1:"keyword",3:"title.class"}}])}}var te="[0-9](_*[0-9])*",Ee=`\\.(${te})`,me="[0-9a-fA-F](_*[0-9a-fA-F])*",On={className:"number",variants:[{begin:`(\\b(${te})((${Ee})|\\.)?|(${Ee}))[eE][+-]?(${te})[fFdD]?\\b`},{begin:`\\b(${te})((${Ee})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${Ee})[fFdD]?\\b`},{begin:`\\b(${te})[fFdD]\\b`},{begin:`\\b0[xX]((${me})\\.?|(${me})?\\.(${me}))[pP][+-]?(${te})[fFdD]?\\b`},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${me})[lL]?\\b`},{begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],relevance:0};function Rn(e,n,t){return t===-1?"":e.replace(n,i=>Rn(e,n,t-1))}function wn(e){let n=e.regex,t="[\xC0-\u02B8a-zA-Z_$][\xC0-\u02B8a-zA-Z_$0-9]*",i="(?:(?:\\s*\\[\\s*])+)?",l=t+"<@@@>"+i,s="(?:"+("\\?(?:\\s+(?:extends|super)\\s+"+l+")?")+"|"+l+")",a=Rn("(?:\\s*<\\s*"+s+"(?:\\s*,\\s*"+s+")*\\s*>)?",/<@@@>/g,2),_={keyword:["synchronized","abstract","private","var","static","if","const ","for","while","strictfp","finally","protected","import","native","final","void","enum","else","break","transient","catch","instanceof","volatile","case","assert","package","default","public","try","switch","continue","throws","protected","public","private","module","requires","exports","do","sealed","yield","permits","goto","when"],literal:["false","true","null"],type:["char","boolean","long","float","int","byte","short","double"],built_in:["super","this"]},N={className:"meta",begin:"@"+t,contains:[{begin:/\(/,end:/\)/,contains:["self"]}]},A={className:"params",begin:/\(/,end:/\)/,keywords:_,relevance:0,contains:[e.C_BLOCK_COMMENT_MODE],endsParent:!0};return{name:"Java",aliases:["jsp"],keywords:_,illegal:/<\/|#/,contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{begin:/\w+@/,relevance:0},{className:"doctag",begin:"@[A-Za-z]+"}]}),{begin:/import java\.[a-z]+\./,keywords:"import",relevance:2},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{begin:/"""/,end:/"""/,className:"string",contains:[e.BACKSLASH_ESCAPE]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{match:[/\b(?:class|interface|enum|extends|implements|new)/,/\s+/,t],className:{1:"keyword",3:"title.class"}},{match:/non-sealed/,scope:"keyword"},{beginKeywords:"new throw return else yield assert",relevance:0},{begin:[t,n.concat(a,i,/\s+/),t,i,/\s*/,/=(?!=)/],className:{1:"type",3:"variable",6:"operator"}},{begin:[/record/,/\s+/,t],className:{1:"keyword",3:"title.class"},contains:[A,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{begin:[t,n.concat(a,i,/\s+/),t,/\s*(?=\()/],className:{1:"type",3:"title.function"},keywords:_,contains:[{className:"params",begin:/\(/,end:/\)/,keywords:_,relevance:0,contains:[N,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,On,e.C_BLOCK_COMMENT_MODE]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},On,N]}}function Mn(e){let p={keyword:["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"],type:["bool","byte","complex64","complex128","error","float32","float64","int8","int16","int32","int64","string","uint8","uint16","uint32","uint64","int","uint","uintptr","rune"],literal:["true","false","iota","nil"],built_in:["append","cap","close","complex","copy","imag","len","make","new","panic","print","println","real","recover","delete"]};return{name:"Go",aliases:["golang"],keywords:p,illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"`",end:"`"}]},{className:"number",variants:[{match:/-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,relevance:0},{match:/-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b0[oO](_?[0-7])*i?/,relevance:0},{match:/-?\b0[bB](_?[01])*i?/,relevance:0},{match:/-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,relevance:0}]},{begin:/:=/},{className:"function",beginKeywords:"func",end:"\\s*(\\{|$)",excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",begin:/\(/,end:/\)/,endsParent:!0,keywords:p,illegal:/["']/}]}]}}function vn(e){let n=e.regex,t=/(r#)?/,i=n.concat(t,e.UNDERSCORE_IDENT_RE),l=n.concat(t,e.IDENT_RE),p={scope:"title.function.invoke",relevance:0,begin:n.concat(/\b/,/(?!(?:let|for|while|if|else|match)\b)/,l,n.lookahead(/\s*\(/))},s="([ui](8|16|32|64|128|size)|f(16|32|64|128))?",a=["abstract","as","async","await","become","box","break","const","continue","crate","do","dyn","else","enum","extern","false","final","fn","for","if","impl","in","let","loop","macro","match","mod","move","mut","override","priv","pub","raw","ref","return","self","Self","static","struct","super","trait","true","try","type","typeof","union","unsafe","unsized","use","virtual","where","while","yield"],o=["true","false","Some","None","Ok","Err"],d=["drop ","Copy","Send","Sized","Sync","Drop","Fn","FnMut","FnOnce","ToOwned","Clone","Debug","PartialEq","PartialOrd","Eq","Ord","AsRef","AsMut","Into","From","Default","Iterator","Extend","IntoIterator","DoubleEndedIterator","ExactSizeIterator","SliceConcatExt","ToString","assert!","assert_eq!","bitflags!","bytes!","cfg!","col!","concat!","concat_idents!","debug_assert!","debug_assert_eq!","env!","eprintln!","panic!","file!","format!","format_args!","include_bytes!","include_str!","line!","local_data_key!","module_path!","option_env!","print!","println!","select!","stringify!","try!","unimplemented!","unreachable!","vec!","write!","writeln!","macro_rules!","assert_ne!","debug_assert_ne!"],g=["i8","i16","i32","i64","i128","isize","u8","u16","u32","u64","u128","usize","f16","f32","f64","f128","str","char","bool","Box","Option","Result","String","Vec"];return{name:"Rust",aliases:["rs"],keywords:{$pattern:e.IDENT_RE+"!?",type:g,keyword:a,literal:o,built_in:d},illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.COMMENT("/\\*","\\*/",{contains:["self"]}),e.inherit(e.QUOTE_STRING_MODE,{begin:/b?"/,illegal:null}),{scope:"symbol",begin:/'[a-zA-Z_][a-zA-Z0-9_]*(?!')/},{scope:"string",variants:[{begin:/b?r(#*)"(.|\n)*?"\1(?!#)/},{begin:/b?'/,end:/'/,contains:[{scope:"char.escape",match:/\\('|"|\\|\w|x\w{2}|u\w{4}|U\w{8})/}]}]},{scope:"number",variants:[{begin:"\\b0b([01_]+)"+s},{begin:"\\b0o([0-7_]+)"+s},{begin:"\\b0x([A-Fa-f0-9_]+)"+s},{begin:"\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)"+s}],relevance:0},{begin:[/\bsafe/,/\s+/,/extern/],scope:{1:"keyword",3:"keyword"}},{begin:[/fn/,/\s+/,i],scope:{1:"keyword",3:"title.function"}},{scope:"meta",begin:"#!?\\[",end:"\\]",contains:[{scope:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE]}]},{begin:[/let/,/\s+/,/(?:mut\s+)?/,i],scope:{1:"keyword",3:"keyword",4:"variable"}},{begin:[/for/,/\s+/,i,/\s+/,/in/],scope:{1:"keyword",3:"variable",5:"keyword"}},{begin:[/type/,/\s+/,i],scope:{1:"keyword",3:"title.class"}},{begin:[/(?:trait|enum|struct|union|impl|for)/,/\s+/,i],scope:{1:"keyword",3:"title.class"}},{begin:e.IDENT_RE+"::",keywords:{keyword:"Self",built_in:d,type:g}},{scope:"punctuation",begin:"->"},p]}}function xn(e){let n=e.regex;return{name:"Diff",aliases:["patch"],contains:[{className:"meta",relevance:10,match:n.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+,\d+ +\+\d+ +@@/,/^@@ +-\d+ +\+\d+ +@@/,/^\*\*\* +\d+,\d+ +\*\*\*\*$/,/^--- +\d+,\d+ +----$/)},{className:"comment",variants:[{begin:n.either(/Index: /,/^index/,/={3,}/,/^-{3}/,/^\*{3} /,/^\+{3}/,/^diff --git/),end:/$/},{match:/^\*{15}$/}]},{className:"addition",begin:/^\+/,end:/$/},{className:"deletion",begin:/^-/,end:/$/},{className:"addition",begin:/^!/,end:/$/}]}}C.registerLanguage("javascript",on);C.registerLanguage("typescript",pn);C.registerLanguage("python",_n);C.registerLanguage("json",En);C.registerLanguage("bash",mn);C.registerLanguage("xml",hn);C.registerLanguage("css",Nn);C.registerLanguage("markdown",Sn);C.registerLanguage("yaml",Tn);C.registerLanguage("c",yn);C.registerLanguage("cpp",An);C.registerLanguage("java",wn);C.registerLanguage("go",Mn);C.registerLanguage("rust",vn);C.registerLanguage("diff",xn);C.configure({classPrefix:"hljs-"});var Jt=C;return Yn(Qt);})();
		const hljs = didHljsVendor.default;
		//#endregion

		//#region stylesheet
		const CSS = `
/* Tokens live on both roots: diff cards mount under .did-root in the
   conversation, the settings card under .did-card in the Plugins page. */
.did-root, .did-card {
	/* host theme tokens first, fixed fallback second; every color tracks the
	   active GUI theme via --dsw-alias-* instead of a fixed palette */
	--did-border: var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.25));
	--did-surface: var(--dsw-alias-bg-layer-2, #2c2c2e);
	--did-text: var(--dsw-alias-label-primary, #d4d4d4);
	--did-text-secondary: var(--dsw-alias-label-secondary, #9a9a9a);
	--did-text-muted: var(--dsw-alias-label-tertiary, #6f6f6f);
	--did-hover-bg: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.15));
	--did-filehead-bg: var(--dsw-alias-bg-layer-3, rgba(128, 128, 128, 0.08));
	--did-empty-bg: color-mix(in srgb, var(--dsw-alias-label-primary, #808080) 5%, transparent);
	--did-code-font: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);

	/* Syntax token colors: the same --shiki-token-* variables the GUI's code
	   blocks render with. dsh-stylevault overrides exactly these from its
	   Colors panel, so diff cards track its themes; theme-alias-derived values
	   stand in when shiki vars are absent, plain card text last. */
	--did-syn-keyword: var(--shiki-token-keyword, var(--dsw-alias-state-error-primary, var(--did-text)));
	--did-syn-title: var(--shiki-token-function, var(--dsw-alias-brand-primary, var(--did-text)));
	--did-syn-attr: var(--shiki-token-constant, var(--dsw-alias-state-warn-primary, var(--did-text)));
	--did-syn-string: var(--shiki-token-string, var(--dsw-alias-state-success-primary, var(--did-text)));
	--did-syn-builtin: var(--shiki-token-parameter, var(--dsw-alias-state-warn-primary, var(--did-text)));
	--did-syn-comment: var(--shiki-token-comment, var(--dsw-alias-label-tertiary, var(--did-text)));
	--did-syn-tag: var(--shiki-token-keyword, var(--dsw-alias-state-success-primary, var(--did-text)));
	--did-syn-text: var(--shiki-foreground, var(--did-text));

	/* add/remove palette: stat color, row fill, number-gutter fill, word chip.
	   Tints derive from the theme's success/error aliases via color-mix, so
	   they follow whatever colors the user's theme assigns. */
	--did-add-stat: var(--dsw-alias-state-success-primary, #3fb950);
	--did-add-row: color-mix(in srgb, var(--dsw-alias-state-success-primary, #3fb950) 9%, transparent);
	--did-add-gutter: color-mix(in srgb, var(--dsw-alias-state-success-primary, #3fb950) 18%, transparent);
	--did-add-word: color-mix(in srgb, var(--dsw-alias-state-success-primary, #3fb950) 30%, transparent);
	--did-del-stat: var(--dsw-alias-state-error-primary, #f85149);
	--did-del-row: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f85149) 9%, transparent);
	--did-del-gutter: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f85149) 18%, transparent);
	--did-del-word: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f85149) 30%, transparent);
}

.did-root {
	box-sizing: border-box;
	padding: 5px;
	margin: 4px 0 2px;
	border: 1px solid var(--did-border);
	border-radius: 6px;
	overflow: hidden;
	background: var(--did-surface);
	font-size: 12px;
	line-height: 19px;
}

.did-head {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 5px 8px;
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
	font-size: 11px;
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

.did-file + .did-file {
	border-top: 1px solid var(--did-border);
}

.did-filehead {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 3px 8px;
	background: var(--did-filehead-bg);
}

.did-filepath {
	color: var(--did-text-secondary);
	font-size: 11px;
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
	font-size: 11px;
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
	grid-template-columns: 38px minmax(0, 1fr) 38px minmax(0, 1fr);
}

.did-no {
	padding: 0 6px;
	color: var(--did-text-muted);
	opacity: 0.7;
	user-select: none;
	text-align: right;
	font-size: 10.5px;
	font-family: var(--did-code-font);
}

.did-code {
	padding: 0 8px;
	color: var(--did-text);
	min-width: 0;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	word-break: break-word;
	font-family: var(--did-code-font);
}

.did-delbg { background: var(--did-del-row); }
.did-insbg { background: var(--did-add-row); }
.did-no.did-delbg { background: var(--did-del-gutter); }
.did-no.did-insbg { background: var(--did-add-gutter); }
.did-delword { background: var(--did-del-word); border-radius: 2px; }
.did-insword { background: var(--did-add-word); border-radius: 2px; }
.did-void { background: var(--did-empty-bg); }

.did-more {
	padding: 4px 8px;
	color: var(--did-text-muted);
	font-size: 11px;
	border-top: 1px solid var(--did-border);
}

/* Plugins-page card: "Inline diff" accordion around the highlight control */
.did-card {
	border: 1px solid var(--did-border);
	background: var(--dsw-alias-bg-layer-3, rgba(128, 128, 128, 0.08));
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

		// Strip the leading whitespace shared by every non-empty line on either
		// side. Lines indented deeper than the shared prefix keep their extra
		// indentation; blank lines become "".
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
		// oldIndex?, newIndex? }. Returns null when either side exceeds cap;
		// callers then show the hunk as a whole-file replace.
		function lcsOps(oldItems, newItems, cap) {
			const oldCount = oldItems.length;
			const newCount = newItems.length;
			if (oldCount > cap || newCount > cap) return null;

			// commonLengths[row][column] holds the LCS length of the suffixes
			// starting at that cell; flattened with a row stride.
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

		// Turn ops into side-by-side rows. Simultaneous removed/added runs pair
		// up as "modified" rows; leftovers stay one-sided.
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
						leftNumber: op.oldIndex + 1,
						rightNumber: op.newIndex + 1,
						leftText: oldLines[op.oldIndex],
						rightText: newLines[op.newIndex],
					});
					opIndex++;
					continue;
				}
				const removedRun = [];
				const addedRun = [];
				while (opIndex < ops.length && ops[opIndex].type === "removed") { removedRun.push(ops[opIndex]); opIndex++; }
				while (opIndex < ops.length && ops[opIndex].type === "added") { addedRun.push(ops[opIndex]); opIndex++; }
				const pairedCount = Math.min(removedRun.length, addedRun.length);
				for (let pairIndex = 0; pairIndex < pairedCount; pairIndex++) {
					rows.push({
						kind: "modified",
						leftNumber: removedRun[pairIndex].oldIndex + 1,
						rightNumber: addedRun[pairIndex].newIndex + 1,
						leftText: oldLines[removedRun[pairIndex].oldIndex],
						rightText: newLines[addedRun[pairIndex].newIndex],
					});
				}
				for (let pairIndex = pairedCount; pairIndex < removedRun.length; pairIndex++) {
					rows.push({ kind: "removed", leftNumber: removedRun[pairIndex].oldIndex + 1, leftText: oldLines[removedRun[pairIndex].oldIndex] });
				}
				for (let pairIndex = pairedCount; pairIndex < addedRun.length; pairIndex++) {
					rows.push({ kind: "added", rightNumber: addedRun[pairIndex].newIndex + 1, rightText: newLines[addedRun[pairIndex].newIndex] });
				}
				removed += removedRun.length;
				added += addedRun.length;
			}
			return { rows, added, removed };
		}
		//#endregion

		//#region wire card extraction
		// Validate untrusted wire diffs into well-formed { path, oldText,
		// newText } hunks.
		function parseHunks(rawDiffs) {
			if (!Array.isArray(rawDiffs)) return null;
			const hunks = [];
			for (const candidate of rawDiffs) {
				if (candidate && typeof candidate === "object"
					&& typeof candidate.path === "string"
					&& typeof candidate.newText === "string"
					&& (candidate.oldText == null || typeof candidate.oldText === "string")) {
					hunks.push({
						path: candidate.path,
						oldText: candidate.oldText == null ? "" : candidate.oldText,
						newText: candidate.newText,
					});
				}
			}
			return hunks.length > 0 ? hunks : null;
		}

		// Settled calls read the result view (authoritative). An empty or
		// absent result falls back to the call-time view: new-file whole writes
		// and still-running calls only ever have that side.
		function extractHunks(block) {
			if (block == null || typeof block !== "object") return null;
			if (!("kind" in block)) {
				const callView = block.callView && block.callView.card === "diff" ? block.callView : null;
				return callView === null ? null : parseHunks(callView.diffs);
			}
			const resultView = block.resultView && block.resultView.card === "diff" ? block.resultView : null;
			const fromResult = resultView === null ? null : parseHunks(resultView.diffs);
			if (fromResult !== null) return fromResult;
			const callView = block.callView && block.callView.card === "diff" ? block.callView : null;
			return callView === null ? null : parseHunks(callView.diffs);
		}

		// Relativize to the session cwd, then to ~ under the host home.
		function relativePath(path, cwd, home) {
			if (cwd && path.startsWith(cwd + "/")) return path.slice(cwd.length + 1);
			if (home && path.startsWith(home + "/")) return "~" + path.slice(home.length);
			return path;
		}
		//#endregion

		//#region plugin preferences
		// Client-side view of the durable `inline-diff.highlight` ("words" |
		// "lines") and `inline-diff.indent` ("strip" | "keep") preferences.
		// apply() keeps these synced from the bound settings scope; diff cards
		// and the Plugins-page card both subscribe here. The literal strings
		// must match lib/index.js — the module-loader bundle cannot import
		// across halves.
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

		// Whether the Host serves the namespace (a card must leave no trace when
		// it does not) and accepts writes. Replaced only on change so React state
		// holders re-render exactly once per transition.
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
		// Private message tables instead of entries in the locale service's
		// shared dictionary registry: registration there throws on duplicate
		// namespace/locale pairs and only two components consume copy here, so
		// lookups stay local. Fallback mirrors LocaleRuntime.lookup: active
		// locale, then English, then the key itself.
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
				"stats.files": "{count} files · ",
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
				"stats.files": "{count} 个文件 · ",
				"truncated.lines": "… 另有 {count} 行（已截断）"
			}
		};

		// Active locale id, seeded from the browser the same way the locale
		// service seeds its provisional value before any Host preference is
		// known; apply() overwrites it from the service once composed.
		let activeLocale = detectLocale();
		const localeListeners = new Set();

		// First shipped language named by the browser, matched on the primary
		// subtag; English when nothing matches or window is absent.
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

		// Translate for the active locale; {name} placeholders substitute
		// from params.
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

		// Split a changed line pair into per-side text segments. Runs over
		// changed tokens come back marked changed; shared runs stay plain and
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
					const changed = op.type !== "equal";
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
		// Same coverage as dsh-solution-explorer's editor: extension -> hljs
		// language id, undefined when unknown (row stays plain).
		const EXT_LANG = {
			ts: "typescript", tsx: "typescript", mts: "typescript", cts: "typescript",
			js: "javascript", jsx: "javascript", mjs: "javascript", cjs: "javascript",
			json: "json", jsonc: "json",
			sh: "bash", bash: "bash", zsh: "bash",
			html: "xml", htm: "xml", vue: "xml", svg: "xml", xml: "xml",
			css: "css", scss: "css", less: "css",
			py: "python",
			md: "markdown", markdown: "markdown",
			yaml: "yaml", yml: "yaml",
			diff: "diff", patch: "diff",
			c: "c", h: "c",
			cpp: "cpp", cc: "cpp", cxx: "cpp", hpp: "cpp", hh: "cpp",
			java: "java",
			go: "go",
			rs: "rust",
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
		// every literal '<', so tags are unambiguous; nested spans collapse into
		// the joined class list (CSS matches any of them, leaf wins visually).
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

		// One line -> token segments. Per-line like the explorer's diff column,
		// so multi-line constructs just lose their token across the break.
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

		// Overlay word-diff changed runs (as [start, end) offsets) onto syntax
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
		const FLOOR_GUTTER = 16;
		const MIN_CONTAINER_WIDTH = 60;

		function cell(className, text) {
			return react.createElement("div", { className }, text);
		}

		// Code cell: syntax tokens when the hunk's language is known and syntax
		// highlighting is on, with word-diff chips overlaid on the tokens;
		// plain text (chips when segments exist) otherwise. segments === null
		// marks rows without word chips (context, one-sided, words-off).
		function codeCell(className, text, lang, syntaxOn, segments, chipClass) {
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
			return react.createElement("div", { className }, children);
		}

		function pushRow(cells, row, wordDiff, lang, syntaxOn) {
			const leftNumber = row.leftNumber != null ? String(row.leftNumber) : "";
			const rightNumber = row.rightNumber != null ? String(row.rightNumber) : "";
			const leftText = row.leftText != null ? row.leftText : "";
			const rightText = row.rightText != null ? row.rightText : "";
			if (row.kind === "removed") {
				cells.push(cell("did-no did-delbg", leftNumber), codeCell("did-code did-delbg", leftText, lang, syntaxOn, null, ""),
					cell("did-no did-void", ""), cell("did-code did-void", ""));
			} else if (row.kind === "added") {
				cells.push(cell("did-no did-void", ""), cell("did-code did-void", ""),
					cell("did-no did-insbg", rightNumber), codeCell("did-code did-insbg", rightText, lang, syntaxOn, null, ""));
			} else if (row.kind === "modified") {
				if (!wordDiff) {
					cells.push(cell("did-no did-delbg", leftNumber), codeCell("did-code did-delbg", leftText, lang, syntaxOn, null, ""),
						cell("did-no did-insbg", rightNumber), codeCell("did-code did-insbg", rightText, lang, syntaxOn, null, ""));
					return;
				}
				const segments = wordSegments(leftText, rightText);
				cells.push(
					cell("did-no did-delbg", leftNumber),
					codeCell("did-code did-delbg", leftText, lang, syntaxOn, segments.left, "did-delword"),
					cell("did-no did-insbg", rightNumber),
					codeCell("did-code did-insbg", rightText, lang, syntaxOn, segments.right, "did-insword"));
			} else {
				cells.push(cell("did-no", leftNumber), codeCell("did-code", leftText, lang, syntaxOn, null, ""),
					cell("did-no", rightNumber), codeCell("did-code", rightText, lang, syntaxOn, null, ""));
			}
		}

		// Card width: CARD_WIDTH_RATIO of the conversation column, never
		// narrower than the reply-text column (--dsh-chat-content-width) minus
		// a gutter. Centered via margin so every card matches. Returns null on
		// tiny or missing containers.
		function computeCardGeometry(containerRect, containerStyle, element) {
			if (containerRect.width < MIN_CONTAINER_WIDTH) return null;
			const innerWidth = containerRect.width
				- (parseFloat(containerStyle.paddingLeft) || 0)
				- (parseFloat(containerStyle.paddingRight) || 0);
			const declaredWidth = parseFloat(containerStyle.getPropertyValue("--dsh-chat-content-width"));
			const floorWidth = declaredWidth > 0
				? Math.min(declaredWidth, Math.max(innerWidth - 2 * FLOOR_GUTTER, 0))
				: 0;
			const width = Math.max(Math.floor(containerRect.width * CARD_WIDTH_RATIO), floorWidth);
			const appliedMargin = parseFloat(element.style.marginLeft) || 0;
			const staticLeft = element.getBoundingClientRect().left - appliedMargin;
			const marginLeft = Math.round(containerRect.left + (containerRect.width - width) / 2 - staticLeft);
			return { width, marginLeft };
		}

		// Always-expanded split diff shown for edit/write tool calls.
		function InlineDiffRow(props) {
			const block = props && props.block;
			const toolName = (props && props.toolName) || "";
			const label = /write/i.test(toolName) ? "Write" : "Edit";
			const hunks = extractHunks(block);

			const rootRef = react.useRef(null);
			const [cardStyle, setCardStyle] = react.useState(null);
			react.useEffect(() => {
				const element = rootRef.current;
				if (!element || typeof ResizeObserver === "undefined") return;
				const container = element.closest("[data-conversation-scroll]");
				if (!container) return;
				const applyMeasure = () => {
					const geometry = computeCardGeometry(
						container.getBoundingClientRect(), getComputedStyle(container), element);
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
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);

			if (hunks === null) {
				return react.createElement("div", { className: "did-root", ref: rootRef, style: cardStyle || undefined },
					react.createElement("div", { className: "did-head" },
						react.createElement("span", { className: "did-tool" }, label),
						react.createElement("span", { className: "did-filepath" }, "…")
					)
				);
			}

			const cwd = props.cwd, home = props.home, openFile = props.openFile;
			const children = [];
			let totalAdded = 0, totalRemoved = 0, renderedRows = 0, hiddenRows = 0;

			for (const hunk of hunks) {
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
				totalAdded += added;
				totalRemoved += removed;

				const lang = langFromPath(hunk.path);
				const cells = [];
				for (const row of rows) {
					if (renderedRows >= MAX_ROWS) { hiddenRows++; continue; }
					pushRow(cells, row, words, lang, syntaxOn);
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
					react.createElement("div", { className: "did-grid" }, cells)
				));
			}

			if (hiddenRows > 0) {
				children.push(react.createElement("div", { className: "did-more" },
					tr("truncated.lines", { count: hiddenRows })));
			}

			return react.createElement("div", { className: "did-root", ref: rootRef, style: cardStyle || undefined },
				react.createElement("div", { className: "did-head" },
					react.createElement("span", { className: "did-tool" }, label),
					react.createElement("span", { className: "did-stats" },
						hunks.length > 1 ? tr("stats.files", { count: hunks.length }) : "",
						react.createElement("span", { className: "did-addnum" }, "+" + totalAdded), " ",
						react.createElement("span", { className: "did-delnum" }, "−" + totalRemoved)
					)
				),
				children
			);
		}
		//#endregion

		//#region plugin settings card
		// "Inline diff" card in Settings → Plugins: an accordion header over the
		// Words (token chips on paired rows) vs Lines-only (row tint) control,
		// the Strip vs Keep control for shared leading indentation, and the
		// Syntax on/off control for token coloring. Reads through the shared
		// wordsMode/keepIndentMode/syntaxOnMode subscriptions; writes go through
		// the injected setHighlight/setIndent/setSyntax, which echo optimistically
		// and let the scope subscription confirm. Hidden entirely while the Host
		// does not serve the namespace; buttons disable while the document is
		// read-only.
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
			const [words, setWords] = react.useState(getWordsMode());
			react.useEffect(() => onWordsMode(setWords), []);
			const [keepIndent, setKeepIndent] = react.useState(getKeepIndent());
			react.useEffect(() => onKeepIndent(setKeepIndent), []);
			const [syntaxOn, setSyntaxOn] = react.useState(getSyntaxOn());
			react.useEffect(() => onSyntaxOn(setSyntaxOn), []);
			const [settings, setSettings] = react.useState(getSettingsState());
			react.useEffect(() => onSettingsState(setSettings), []);
			// Re-render on GUI-language switches; copy resolves through tr().
			const [, rerenderOnLocale] = react.useReducer((count) => count + 1, 0);
			react.useEffect(() => onLocale(rerenderOnLocale), []);
			const [open, setOpen] = react.useState(false);
			if (!settings.ready) return null;
			const writable = settings.writable
				&& typeof setHighlight === "function" && typeof setIndent === "function"
				&& typeof setSyntax === "function";
			const choose = writable ? setHighlight : () => {};
			const chooseIndent = writable ? setIndent : () => {};
			const chooseSyntax = writable ? setSyntax : () => {};
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
					)
				) : null
			);
		}
		//#endregion

		//#region plugin body
		// Install the stylesheet, adopt the durable highlight/indent
		// preferences, then
		// shadow the stock edit/write keyed views and register the Plugins-page
		// card. Lowest priority renders, so unloading this plugin restores stock
		// rows.
		function apply(ctx) {
			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-inline-diff";
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => tag.remove();
			}, "dsh-inline-diff: stylesheet");

			const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
			const adoptScope = () => {
				const snapshot = scope.getSnapshot();
				const section = snapshot.value;
				setWordsMode(section === undefined || section[HIGHLIGHT_FIELD] !== HIGHLIGHT_LINES);
				setKeepIndent(section !== undefined && section[INDENT_FIELD] === INDENT_KEEP);
				setSyntaxOn(section === undefined || section[SYNTAX_FIELD] !== SYNTAX_OFF);
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

			// Follow the GUI language while the optional locale service is
			// composed; without one, the browser-derived seed stands.
			ctx.inject(["locale"], (localeCtx) => {
				const locale = localeCtx.locale;
				const adoptServiceLocale = () => adoptLocale(locale.getLocale().active);
				adoptServiceLocale();
				localeCtx.effect(() => locale.subscribe(adoptServiceLocale),
					"dsh-inline-diff: locale adoption");
			});

			ctx.slots.inject("tool.call.toolview", function* () {
				yield ctx.slots.register({ name: "tool.call.toolview", key: "edit", priority: -1 }, InlineDiffRow);
				yield ctx.slots.register({ name: "tool.call.toolview", key: "write", priority: -1 }, InlineDiffRow);
			});
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: SETTINGS_NAMESPACE,
				inject: () => ({ setHighlight: writeHighlight, setIndent: writeIndent, setSyntax: writeSyntax })
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
