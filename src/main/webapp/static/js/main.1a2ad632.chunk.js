(this.webpackJsonpreactui=this.webpackJsonpreactui||[]).push([[0],{13:function(e,n,t){},14:function(e,n,t){},15:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),c=t(4),o=t.n(c),s=(t(13),t(14),t(1)),i=t(2),u=t(6),l=t(5),m=t(7),p=function(){function e(){Object(s.a)(this,e)}return Object(i.a)(e,[{key:"numbers",value:function(){return new Promise((function(e,n){var t=new XMLHttpRequest;t.open("GET","http://wildfly-app-wildfly-demo.apps-crc.testing/jaxrs-postgresql-demo/api/rest/numbers"),t.onreadystatechange=function(){var n=t.responseText,a=JSON.parse(n);e(a)},t.send()}))}}]),e}(),h=function(e){function n(e){var t;return Object(s.a)(this,n),(t=Object(u.a)(this,Object(l.a)(n).call(this,e))).client=new p,t.state={numbers:[]},t.client.numbers().then((function(e){return t.setState({numbers:e})})),t}return Object(m.a)(n,e),Object(i.a)(n,[{key:"render",value:function(){return r.a.createElement("div",null,"access numbers from REST",r.a.createElement("section",null,this.state.numbers.map((function(e){return r.a.createElement("div",null,e)}))))}}]),n}(r.a.Component);var f=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement("a",{className:"App-link",href:"https://reactjs.org",target:"_blank",rel:"noopener noreferrer"},"React Shinanigans")),r.a.createElement(h,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(f,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},8:function(e,n,t){e.exports=t(15)}},[[8,1,2]]]);
//# sourceMappingURL=main.1a2ad632.chunk.js.map