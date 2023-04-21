import MPraser from "utils/translate/mdict-parser";
import MRenderer from 'utils/translate/mdict-renderer'

export function translate() {
  const parser = MPraser();

  fetch("http://localhost:3000/assets/dictionaries/en-fa.mdx")
    .then((res) => {
      return res.blob();
    })
    .then((res) => {
      parser([
        new File([res], "name.mdx", { type: "application/x-genesis-32x-rom"}),
      ]).then(function (resources) {
        const MDict= MRenderer();

        MDict(resources).lookup('hi').then(function($content) {
          console.log($content);
          console.log('--');
        });
      });
    });
}
