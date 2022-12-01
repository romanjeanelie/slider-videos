/**
 * @param {Blob} blob
 * @return {Promise<string>}
 */
const blobToDataURL = (blob) => {
  return new Promise((fulfill, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => fulfill(reader.result);
    reader.readAsDataURL(blob);
  });
};

export default blobToDataURL;
