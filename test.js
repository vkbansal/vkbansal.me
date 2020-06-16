// https://codesandbox.io/s/pagination-grouped-buttons-roh6m?file=/src/App.tsx
const chalk = require('chalk');
let groupSize = 3;
let offsetSize = 1;
let totalPages = 7;
let halfGroup = Math.floor(groupSize / 2);

let elementsSize = groupSize + offsetSize * 2 + 2;

const p = Array.from({ length: totalPages }, (_, f) => {
  let currentPage = f + 1;
  const moreLeft = currentPage > groupSize;
  const moreRight = totalPages - currentPage >= groupSize;

  return (
    currentPage.toString().padStart(2, ' ') +
    ' => ' +
    [
      ...Array.from({ length: moreLeft ? offsetSize : offsetSize + groupSize }, (_, i) => i + 1),
      moreLeft ? '-' : null,
      ...(moreLeft && moreRight
        ? Array.from({ length: groupSize }, (_, i) => i + currentPage - halfGroup)
        : []),
      moreRight ? '-' : null,
      ...Array.from({ length: moreRight ? offsetSize : offsetSize + groupSize }, (_, i) =>
        moreRight ? totalPages + i : totalPages + i - groupSize
      )
    ]
      .filter(Boolean)
      .map((e) => {
        const str = e.toString().padStart(2, '\\s');

        if (e === currentPage) {
          return chalk.bgCyan(e);
        }

        return e;
      })
      .join('   ')
  );
}).join('\n');

process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
console.clear();
console.log(p);
