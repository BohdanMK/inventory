export default function setFullImgPath(path: string): string {
  if (!path) {
    return '';
  } else {
    return `${import.meta.env.VITE_API_URL}${path}`;
  }
}
