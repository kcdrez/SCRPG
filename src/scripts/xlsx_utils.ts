import xlsx from 'xlsx';
import { PlayerData } from './player';
import { BaddieData, VillainData, ModifierData } from './baddie';
import { SceneData, ChallengeData, ChallengeEntryData, LocationData } from './scene';

async function processXlsxFiles(files: Blob[], filterTypes: string[]) {
  let arr: any[] = [];
  for (let i = 0; i < files.length; i++) {
    arr = arr.concat(await readFile(files[i]));
  }
  if (filterTypes) {
    filterTypes = filterTypes.map(x => x.toLowerCase());
    return arr.filter((x: Blob) => filterTypes.includes(x.type.toLowerCase()));
  }
  else return arr;
}

function readFile(file: Blob): Promise<any> {
  let arr: ImportData[] = [];
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();

    reader.onload = () => {
      const bytes = new Uint8Array(reader.result as ArrayBuffer);
      let binary = "";
      for (let j = 0; j < bytes.byteLength; j++) {
        binary += String.fromCharCode(bytes[j]);
      }
      const wb = xlsx.read(binary, {type: 'binary'});
      wb.SheetNames.forEach(sheetName => {
        const jsonSheet: ImportData[] = xlsx.utils.sheet_to_json(wb.Sheets[sheetName]);
        arr = arr.concat(jsonSheet);
      });
      resolve(arr);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}

type ImportData = PlayerData | VillainData | BaddieData | ModifierData | SceneData | ChallengeData | ChallengeEntryData | LocationData;

export {
  processXlsxFiles,
  ImportData
}