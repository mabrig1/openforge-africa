import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createStoryboard, buildInfographicSvg } from "../lib/explainVisual";
import { getStudioDraft } from "../lib/studioDraft";
import { exportInfographic } from "../lib/infographicExport";
import { renderExplainerVideo, downloadExplainerVideo } from "../lib/video";

export default function ExplainerScreen() {
  const [title,setTitle]=useState(()=>getStudioDraft().title||"Complex topic made simple");
  const [input,setInput]=useState(()=>getStudioDraft().body);
  const [slides,setSlides]=useState(()=>createStoryboard(title,input));
  const [progress,setProgress]=useState<number|null>(null);
  const [recording,setRecording]=useState(false);
  const [video,setVideo]=useState<Blob|null>(null);
  const [error,setError]=useState("");
  const cancel=useRef<AbortController|null>(null);
  useEffect(()=>()=>{cancel.current?.abort();},[]);
  const svg=buildInfographicSvg(slides);
  const outline=slides.map((s,i)=>(i+1)+". "+s.heading+"\n"+s.body).join("\n\n");
  const generate=()=>{cancel.current?.abort();setVideo(null);setError("");
    setSlides(createStoryboard(title,input));};
  const exportDiagram=async()=>{
    try {setError("");await exportInfographic(svg,outline);}
    catch(e){setError(e instanceof Error?e.message:"Could not export infographic.");}
  };
  const makeVideo=async()=>{
    if(recording)return;
    const controller=new AbortController();cancel.current=controller;
    setRecording(true);setProgress(0);setVideo(null);setError("");
    try {
      const result=await renderExplainerVideo(slides,setProgress,controller.signal);
      if(!controller.signal.aborted){setVideo(result);setProgress(100);}
    } catch(e) {
      if(!controller.signal.aborted)setError(e instanceof Error?e.message:"Video export failed.");
    } finally {setRecording(false);cancel.current=null;}
  };
  const stop=()=>cancel.current?.abort();
  return <ScrollView className="flex-1 bg-slate-900"
    contentContainerStyle={{padding:18,paddingBottom:80}} keyboardShouldPersistTaps="handled">
    <Text className="text-green-400 text-xs font-bold">OPENFORGE • VISUAL LEARNING STUDIO</Text>
    <Text className="text-white text-3xl font-extrabold mt-2">Explain It Visually</Text>
    <Text className="text-slate-300 mt-2 leading-6">
      Convert your lesson or tutor response into an infographic and an animated text explainer.
      Graphics are created locally without calling an AI model. Check accuracy before sharing.
    </Text>
    <Text className="text-white font-bold mt-5 mb-2">Topic/title</Text>
    <TextInput accessibilityLabel="Explainer topic" value={title} onChangeText={setTitle}
      maxLength={90} placeholderTextColor="#94a3b8"
      className="bg-slate-800 text-white rounded-xl p-4 border border-slate-700"/>
    <Text className="text-white font-bold mt-5 mb-2">Explanation or text to visualize</Text>
    <TextInput accessibilityLabel="Explainer source text" multiline textAlignVertical="top"
      value={input} onChangeText={setInput} maxLength={4000}
      placeholder="Paste an explanation, or open this screen from the AI Tutor..."
      placeholderTextColor="#94a3b8"
      className="bg-slate-800 text-white rounded-xl p-4 border border-slate-700"
      style={{minHeight:180}}/>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Generate storyboard and infographic"
      disabled={!input.trim()} onPress={generate}
      className="bg-green-700 rounded-xl p-4 mt-4">
      <Text className="text-white text-center font-bold">Generate visual explanation</Text>
    </TouchableOpacity>
    <Text className="text-white text-2xl font-bold mt-7">Your visual storyboard</Text>
    <Text className="text-slate-400 mt-2">Preview: {slides.length} panels • Edit input, then regenerate to update panels.</Text>
    {slides.map((slide,index)=><View key={index}
      className="bg-slate-800 rounded-2xl border border-slate-700 p-5 mt-3">
      <Text className="text-green-300 font-bold">STEP {index+1}</Text>
      <Text className="text-white text-xl font-bold mt-2">{slide.heading}</Text>
      <Text className="text-slate-300 leading-6 mt-2">{slide.body}</Text>
    </View>)}
    {Platform.OS==="web" && <View className="bg-slate-800 rounded-2xl mt-4 border border-slate-700 p-3">
      <Text className="text-white font-bold m-2">Actual SVG infographic preview</Text>
      <Image accessibilityLabel="Locally generated vertical learning infographic"
        source={{uri:"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg)}}
        style={{width:"100%",height:520}} resizeMode="contain"/>
    </View>}
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={Platform.OS==="web"?
      "Download SVG infographic":"Share infographic outline"} onPress={exportDiagram}
      className="bg-indigo-800 border border-indigo-600 rounded-xl p-4 mt-5">
      <Text className="text-white text-center font-bold">{Platform.OS==="web"?
        "↓ Download SVG infographic":"Share infographic outline"}</Text>
    </TouchableOpacity>
    <View className="bg-slate-800 border border-slate-700 p-5 mt-5 rounded-2xl">
      <Text className="text-white text-xl font-bold">Text → animated video</Text>
      <Text className="text-slate-300 mt-2 leading-6">
        Creates a real portrait-format animated text slideshow in WebM format using your browser.
        It is a silent motion-graphics video, not AI-generated footage or narrated MP4.
      </Text>
      {Platform.OS==="web"?<TouchableOpacity accessibilityRole="button" accessibilityLabel="Render silent WebM explainer video"
        disabled={recording||!input.trim()} onPress={makeVideo}
        className="bg-green-700 rounded-xl p-4 mt-4">
        <Text className="text-white text-center font-bold">▶ Render WebM video from panels</Text>
      </TouchableOpacity>:<Text className="text-amber-300 mt-3">
        Video rendering requires a compatible browser such as desktop Chrome or Chrome for Android.
        Native app export is not supported yet. Infographic outline sharing works here.
      </Text>}
      {recording&&<>
        <ActivityIndicator color="#4ade80" style={{marginTop:12}}/>
        <Text accessibilityLabel="Video rendering progress" className="text-green-300 mt-3">
          Rendering... {progress??0}%</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cancel video rendering"
          onPress={stop} className="bg-slate-700 p-3 rounded-xl mt-3">
          <Text className="text-white text-center">Cancel rendering</Text>
        </TouchableOpacity>
      </>}
      {!!video && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Download rendered WebM video"
        onPress={()=>downloadExplainerVideo(video)}
        className="bg-indigo-700 p-4 rounded-xl mt-4">
        <Text className="text-white text-center font-bold">↓ Download video ({Math.ceil(video.size/1024)} KB)</Text>
      </TouchableOpacity>}
    </View>
    {!!error && <Text className="text-amber-300 mt-4">{error}</Text>}
    <Text className="text-slate-400 text-xs mt-5 leading-5">
      SVG is an editable vector image. The exported WebM includes motion graphics but no voice track.
      For audio narration, use the Text Reader separately; it does not become part of the downloaded video.
    </Text>
  </ScrollView>;
}
