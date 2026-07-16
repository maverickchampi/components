/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
  function addIcon(el, entity) {
    var html = el.innerHTML;
    el.innerHTML = "<span style=\"font-family: 'icons'\">" + entity + "</span>" + html;
  }
  var icons = {
      "mc-clock": "&#xe900;",
      "mc-earth": "&#xe901;",
      "mc-laptop": "&#xe902;",
      "mc-inbox": "&#xe903;",
      "mc-message": "&#xe904;",
      "mc-moon": "&#xe905;",
      "mc-sun": "&#xe906;",
      "mc-fingerprint": "&#xe907;",
      "mc-language": "&#xe908;",
      "mc-code": "&#xe909;",
      "mc-redirect": "&#xe90a;",
      "mc-arrows-rotate": "&#xe90b;",
      "mc-arrow-rotate": "&#xe90c;",
      "mc-arrow-down": "&#xe90d;",
      "mc-arrow-left": "&#xe90e;",
      "mc-arrow-right": "&#xe90f;",
      "mc-arrow-up": "&#xe910;",
      "mc-chevron-down": "&#xe911;",
      "mc-chevron-left": "&#xe912;",
      "mc-chevron-right": "&#xe913;",
      "mc-chevron-up": "&#xe914;",
      "mc-x": "&#xe915;",
      "0": 0
    },
    els = document.getElementsByTagName("*"),
    i, c, el;
  for (i = 0; ; i += 1) {
    el = els[i];
    if(!el) {
      break;
    }
    c = el.className;
    c = c.match(/mc-[^\s'"]+/);
    if (c && icons[c[0]]) {
      addIcon(el, icons[c[0]]);
    }
  }
}());
