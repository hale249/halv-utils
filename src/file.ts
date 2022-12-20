export const convertFileToBinary = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      // @ts-ignore
      if (e.target.result) {
        // @ts-ignore
        resolve(window.btoa(e.target.result as string));
      } else {
        // @ts-ignore
        reject(e.target.error);
      }
    };
    reader.readAsBinaryString(file);
  });
};

const jpegType = "image/jpeg";
const jpgBase64Prefix = `data:${jpegType};base64,`;

export const base64ToBlob = (dataURI: string): Blob => {
  // add content type
  dataURI = `${jpgBase64Prefix}${dataURI}`;

  const byteString = window.atob(dataURI.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: jpegType });
};
