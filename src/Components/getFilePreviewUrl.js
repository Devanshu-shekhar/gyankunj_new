export const getFilePreviewUrl = (fileObj) => {
  if (!fileObj) return null;

  if (typeof fileObj === "string") {
    // base64 string
    return `data:image/png;base64,${fileObj}`;
  } else if (fileObj.data && fileObj.mimetype) {
    return `data:${fileObj.mimetype};base64,${fileObj.data}`;
  }

  return null;
};
