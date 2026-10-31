import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
/** Private object-URL playback of the actual locally recorded file. */
export default function LocalVideoPreview({blob}:{blob:Blob}) {
  const [source,setSource]=useState<string|null>(null);
  useEffect(()=>{
    const url=URL.createObjectURL(blob);
    setSource(url);
    return ()=>{URL.revokeObjectURL(url);setSource(null);};
  },[blob]);
  if(!source)return null;
  const style:CSSProperties={width:"100%",maxHeight:390,backgroundColor:"#020617",borderRadius:12};
  return <video aria-label="Local recorded explainer preview" src={source}
    controls playsInline preload="metadata" style={style}/>;
}
