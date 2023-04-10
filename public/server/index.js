const Mdict = require( 'js-mdict');
// import MdictTest from 'mdict';
// import express from 'express';
const path =  require( 'path');

// const app = express();
// const port = 5000;

const file = path.join(__dirname, '../dict/dictionary.mdx');

// app.get('/dict/:word', (req, res) => {
//   let word = req.params.word;

//   res.send(searchDefinition(word));
// });

function searchDefinition(word) {
  let finalResult = null;

  while (finalResult == null) {
    const dict = new Mdict.default(file);

    console.log('--log-- word: ', word);
    const dictRes = dict.lookup(word);

    console.log('--log-- dict res: ', dictRes);

    if (!checkIsEqual(dictRes.keyText, word) || dictRes.definition === null) {
      word = word.slice(0, word.length - 1);
      console.log('--log-- trying to find: ' + word);

      if (word.length === 0) {
        finalResult = {
          keyText: '',
          definition: '',
        };
      }
    } else {
      finalResult = dictRes;
    }
  }

  return finalResult;
}

// function searchDefinition(word) {
//   const dict = new Mdict.default(file);

//   const words = dict.fuzzy_search(word, 20);

//   words.sort((a, b) => {
//     if (a.ed < b.ed) return -1;
//     if (a.ed > b.ed) return 1;

//     return 0;
//   });

//   const nearestWord = words[1];

//   return dict.parse_defination(nearestWord.key, nearestWord.rofset);
// }

function checkIsEqual(dictWord, searchingWord) {
  dictWord = filterString(dictWord.toLowerCase());
  searchingWord = filterString(searchingWord.toLowerCase());

  console.log('check');
  console.log('dictWord', dictWord);
  console.log('searchingWord', searchingWord);

  if (dictWord !== searchingWord) {
    return false;
  }

  return true;
}

function filterString(string) {
  string = string.replaceAll('-', '');
  string = string.replaceAll('_', '');
  string = string.replaceAll(',', '');
  string = string.replaceAll('.', '');

  return string;
}

// app.get('/test', (req, res) => {
//   const out = findWithMdictTest()
//   console.log(out)

//   res.send('end testing');
// });

// function findWithMdictTest() {
//   MdictTest.dictionary(file).then(function (dictionary) {
//          dictionary.lookup("up").then( definitions => console.log(definitions) ); /// typeof word === string
//     //// dictionary is loaded
//     dictionary
//       .search({
//         phrase: 'treat', /// '*' and '?' supported
//         max: 10, /// maximum results
//       })
//       .then(function (foundWords) {
//         console.log('Found words:');
//         console.log(foundWords); /// foundWords is array

//         foundWords.map( word => console.log(JSON.stringify(word) ))

//         var word = '' + foundWords[0];
//         console.log('Loading definitions for: ' + word);
//       })
//       .then(function (definitions) {
//         console.log('definitions:'); /// definition is array
//         console.log(definitions);
//       });
//   });
// }

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

module.exports.search = searchDefinition;
