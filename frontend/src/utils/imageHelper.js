export const optimizeImage = (url, width = 600) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  // This automatically resizes and compresses the image on Cloudinary's end
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};