/** Browser-approved PWA installation. Never forces a download or claims success. */
import {useEffect,useState} from "react";
import {Platform,Text,TouchableOpacity,View,useWindowDimensions} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed";platform:string}>};
declare global{interface Window{__openforgeDeferredPrompt?:InstallEvent}}
function environment(ua:string){
 if(/iPhone|iPad|iPod/i.test(ua))return "ios";
 if(/Android/i.test(ua))return "android";
 return "desktop";
}
function isInstalled(){
 if(typeof window==="undefined")return false;
 return window.matchMedia("(display-mode: standalone)").matches||
  Boolean((navigator as Navigator&{standalone?:boolean}).standalone);
}
export default function InstallAppPrompt(){
 const {width}=useWindowDimensions();
 const [kind,setKind]=useState<"ios"|"android"|"desktop">("desktop");
 const [event,setEvent]=useState<InstallEvent|null>(null);
 const [installed,setInstalled]=useState(false);
 const [dismissed,setDismissed]=useState(false);
 const [showGuide,setShowGuide]=useState(false);
 const [message,setMessage]=useState("");
 useEffect(()=>{
  if(Platform.OS!=="web"||typeof window==="undefined")return;
  setKind(environment(navigator.userAgent));
  setInstalled(isInstalled());
  try{setDismissed(sessionStorage.getItem("openforge-install-dismissed")==="yes");}catch{}
  if(window.__openforgeDeferredPrompt)setEvent(window.__openforgeDeferredPrompt);
  const onPrompt=(raw:Event)=>{
   raw.preventDefault();
   window.__openforgeDeferredPrompt=raw as InstallEvent;
   setEvent(raw as InstallEvent);
  };
  const onInstalled=()=>{setInstalled(true);setEvent(null);};
  window.addEventListener("beforeinstallprompt",onPrompt);
  window.addEventListener("appinstalled",onInstalled);
  const media=window.matchMedia("(display-mode: standalone)");
  const handleChange=()=>setInstalled(isInstalled());
  media.addEventListener?.("change",handleChange);
  return ()=>{
   window.removeEventListener("beforeinstallprompt",onPrompt);
   window.removeEventListener("appinstalled",onInstalled);
   media.removeEventListener?.("change",handleChange);
  };
 },[]);
 if(Platform.OS!=="web"||installed||dismissed)return null;
 const guide=kind==="ios"?
  "On iPhone: open the browser Share menu, choose Add to Home Screen, then tap Add. Safari offers the most consistent experience.":
  kind==="android"?
  "On Android: open Chrome's ⋮ menu and select Install app or Add to Home Screen. If an Install prompt becomes available, use it here.":
  "On Chrome or Edge desktop: use the Install icon in the address bar or the browser menu → Install OpenForge.";
 const install=async()=>{
  const deferred=event??window.__openforgeDeferredPrompt;
  if(!deferred){setShowGuide(true);return;}
  try{
   await deferred.prompt();
   const result=await deferred.userChoice;
   setEvent(null);delete window.__openforgeDeferredPrompt;
   if(result.outcome==="accepted")setMessage("Installation accepted. Your browser will finish installing OpenForge.");
   else setMessage("Installation was dismissed. You can use the browser menu to try again.");
  }catch{
   setShowGuide(true);setMessage("Your browser could not open its install prompt.");
  }
 };
 const close=()=>{
  setDismissed(true);
  try{sessionStorage.setItem("openforge-install-dismissed","yes");}catch{}
 };
 return <View accessibilityLabel="Install OpenForge Africa on your phone or computer"
  style={{borderWidth:1,borderColor:"#9ADAC9",borderRadius:18,
   backgroundColor:"#E4F9F0",padding:width<400?12:15,
   marginBottom:17,flexDirection:width>=700?"row":"column",
   alignItems:width>=700?"center":"stretch"}}>
  <View style={{flexDirection:"row",alignItems:"center",flex:1,paddingRight:8}}>
   <View style={{width:44,height:44,borderRadius:13,backgroundColor:"#0D806B",
    alignItems:"center",justifyContent:"center",marginRight:11}}>
    <MaterialCommunityIcons name="cellphone-arrow-down" size={25} color="#FFFFFF"/>
   </View>
   <View style={{flex:1}}>
    <Text style={{color:"#115344",fontSize:15,fontWeight:"900"}}>
     {kind==="desktop"?"Install OpenForge for desktop":"Add OpenForge to your home screen"}
    </Text>
    <Text style={{color:"#316D60",fontSize:12,lineHeight:18,marginTop:3}}>
     Quick access to courses and offline classroom tools. Free to install.
    </Text>
   </View>
  </View>
  <View style={{flexDirection:"row",alignItems:"center",marginTop:width>=700?0:12}}>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Install OpenForge app"
    onPress={install} style={{backgroundColor:"#0C806B",paddingHorizontal:18,paddingVertical:12,
     borderRadius:12,flex:1,alignItems:"center"}}>
    <Text style={{color:"#FFFFFF",fontSize:13,fontWeight:"900"}}>{event?"Install app":"How to install"}</Text>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Dismiss installation suggestion"
    onPress={close} style={{padding:12}}>
    <MaterialCommunityIcons name="close" size={21} color="#317262"/>
   </TouchableOpacity>
  </View>
  {(showGuide||!!message)&&<View style={{paddingTop:9,width:"100%"}}>
   {!!message&&<Text style={{color:"#175548",fontSize:12}}>{message}</Text>}
   {showGuide&&<Text selectable style={{color:"#175548",fontSize:12,lineHeight:19}}>{guide}</Text>}
  </View>}
 </View>;
}
