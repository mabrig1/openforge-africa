/** Local text export. Never uploads a draft or embeds it in a URL. */
export function exportCapstone(content:string):void {
  const url=URL.createObjectURL(new Blob([content],{type:"text/plain;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;
  a.download="openforge-capstone-draft.txt";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
