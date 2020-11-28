import xlsx from 'xlsx';

function unvue(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function roll(dieSize) {
  return Math.floor(Math.random() * dieSize);
}

async function processXlsxFiles(files, filterTypes) {
  let arr = [];
  for (let i = 0; i < files.length; i++) {
    arr = arr.concat(await readFile(files[i]));
  }
  if (filterTypes) {
    filterTypes = filterTypes.map(x => x.toLowerCase());
    return arr.filter(x => filterTypes.includes(x.type.toLowerCase()));
  }
  else return arr;
}

function readFile(file) {
  let arr = [];
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      const bytes = new Uint8Array(reader.result);
      let binary = "";
      for (let j = 0; j < bytes.byteLength; j++) {
        binary += String.fromCharCode(bytes[j]);
      }
      const wb = xlsx.read(binary, {type: 'binary'});
      wb.SheetNames.forEach(sheetName => {
        const jsonSheet = xlsx.utils.sheet_to_json(wb.Sheets[sheetName]);
        arr = arr.concat(jsonSheet);
      });
      resolve(arr);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  })
}

export {
  unvue,
  roll,
  processXlsxFiles
};