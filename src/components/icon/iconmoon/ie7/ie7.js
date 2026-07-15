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
      "mcr-clock": "&#xe900;",
      "mcr-earth": "&#xe901;",
      "mcr-laptop": "&#xe902;",
      "mcr-inbox": "&#xe903;",
      "mcr-message": "&#xe904;",
      "mcr-moon": "&#xe905;",
      "mcr-sun": "&#xe906;",
      "mcr-fingerprint": "&#xe907;",
      "mcr-language": "&#xe908;",
      "mcr-code": "&#xe909;",
      "mcr-redirect": "&#xe90a;",
      "mcr-arrows-rotate": "&#xe90b;",
      "mcr-arrow-rotate": "&#xe90c;",
      "mcr-arrow-down": "&#xe90d;",
      "mcr-arrow-left": "&#xe90e;",
      "mcr-arrow-right": "&#xe90f;",
      "mcr-arrow-up": "&#xe910;",
      "mcr-chevron-down": "&#xe911;",
      "mcr-chevron-left": "&#xe912;",
      "mcr-chevron-right": "&#xe913;",
      "mcr-chevron-up": "&#xe914;",
      "mcr-x": "&#xe915;",
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
    c = c.match(/mcr-[^\s'"]+/);
    if (c && icons[c[0]]) {
      addIcon(el, icons[c[0]]);
    }
  }
}());
