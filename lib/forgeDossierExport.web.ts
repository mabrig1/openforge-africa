/** Download to user device only; never auto-publish or transmit. */
export function exportForgeDossier(content:string):void{
 const u=URL.createObjectURL(new Blob([content],{type:"text/plain;charset=utf-8"}));
 const a=document.createElement("a");a.href=u;a.download="forge-studies-private-evidence-dossier.txt";
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(u),60000);
}
