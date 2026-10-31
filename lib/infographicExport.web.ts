export function exportInfographic(svg: string, _text: string) {
  const file = new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(file);
  const a=document.createElement("a");
  a.href=url;a.download="openforge-infographic.svg";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
