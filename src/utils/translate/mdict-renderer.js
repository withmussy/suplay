import $ from "jquery";
import * as Promise from "bluebird";

export default function MDictRenderer() {
  var MIME = {
    css: "text/css",
    img: "image",
    jpg: "image/jpeg",
    png: "image/png",
    spx: "audio/x-speex",
    wav: "audio/wav",
    mp3: "audio/mp3",
    js: "text/javascript",
  };

  return function createRenderer(resources) {
    console.log('resources',resources);
    var cache = (function createCache(mdd) {
      var repo = {};

      function get(id, load) {
        var entry = repo[id];
        if (!entry) {
          repo[id] = entry = new Promise(function (resolve) {
            var will = mdd
              .then(function (lookup) {
                console.log("lookup: " + id);
                return lookup(id);
              })
              .then(load)
              .then(function (url) {
                resolve(url);
              });
          });
        }
        return entry;
      }

      return { get: get };
    })(resources["mdd"]);

    function loadData(mime, data) {
      var blob = new Blob([data], { type: mime });
      return URL.createObjectURL(blob);
    }

    // TODO: LRU cache: remove oldest one only after rendering.
    function replaceImage(index, img) {
      var $img = $(img);
      var src = $img.attr("src"),
        m = /^file:\/\/(.*)/.exec(src);
      if (m) {
        src = m[1];
      }
      cache.get(src, loadData.bind(null, MIME["img"])).then(function (url) {
        $img.attr({ src: url, src_: src });
      });
    }

    function replaceCss(index, link) {
      var $link = $(link);
      var href = $link.attr("href");
      cache.get(href, loadData.bind(null, MIME["css"])).then(function (url) {

        $link.replaceWith(
          $("<style scoped>", { src_: href }).text('@import url("' + url + '")')
        );
      });
    }

    function injectJS(index, el) {
      var $el = $(el);
      var src = $el.attr("src");
      cache.get(src, loadData.bind(null, MIME["js"])).then(function (url) {
        $el.remove();
        $.ajax({ url: url, dataType: "script", cache: true });
      });
    }


    function render($content) {
      if (resources["mdd"]) {
        $content.find("img[src]").each(replaceImage);

        $content.find("link[rel=stylesheet]").each(replaceCss);

        $content.find("script[src]").each(injectJS);

        setTimeout(function () {
          $("#definition *").trigger("resize");
        });
      }

      return $content;
    }

    return {
      lookup: function lookup(query) {
        return (resources["mdx"] || resources["mdd"])
          .then(function (lookup) {
            return lookup(query);
          })
          .then(function (definitions) {
            console.log("lookup done!");
            var html = definitions.reduce(function (prev, txt) {
              return prev + "<p></p>" + txt;
            }, "<p>" + definitions.length + " entry(ies) </p>");
            return Promise.resolve(render($("<div>").html(html)));
          });
      },

      search: function (query) {
        return resources["mdx"].then(function (lookup) {
          return lookup(query);
        });
      },

      render: render,
    };
  };
}
