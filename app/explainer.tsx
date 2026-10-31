import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createStoryboard } from "../lib/explainVisual";
import { buildAdvancedInfographicSvg, DIAGRAM_LAYOUTS, type DiagramLayout } from "../lib/advancedDiagram";
import { createSrt, createVtt, SLIDE_MS_OPTIONS, DEFAULT_SLIDE_MS } from "../lib/mediaCaptions";
import { downloadCaptionFile } from "../lib/captionExport";
import LocalVideoPreview from "../components/LocalVideoPreview";
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
  const [layout,setLayout]=useState<DiagramLayout>("cards");
  const [slideMs,setSlideMs]=useState<number>(DEFAULT_SLIDE_MS);
  const [withMicrophone,setWithMicrophone]=useState(false);
  const [error,setError]=useState("");
  const cancel=useRef<AbortController|null>(null);
  useEffect(()=>()=>{cancel.current?.abort();},[]);
  const svg=buildAdvancedInfographicSvg(slides,layout);
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
      const result=await renderExplainerVideo(slides,setProgress,controller.signal,{
        slideMs,withMicrophone,
      });
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
    <Text className="text-white font-bold mt-6 mb-3">Infographic layout (select a diagram style)</Text>
    <View className="flex-row flex-wrap justify-between">
      {DIAGRAM_LAYOUTS.map(value=><TouchableOpacity key={value} accessibilityRole="button"
        accessibilityLabel={"Choose "+value+" infographic layout"}
        accessibilityState={{selected:layout===value}}
        onPress={()=>setLayout(value)}
        className={layout===value?"bg-green-700 rounded-xl p-3 mb-2":"bg-slate-700 rounded-xl p-3 mb-2"}
        style={{width:"48%"}}>
        <Text className="text-white text-center font-semibold">{value==="cards"?"Learning cards":value==="flow"?"Process flow":value==="timeline"?"Timeline":"Comparison"}</Text>
      </TouchableOpacity>)}
    </View>
    <Text className="text-slate-400 mb-2 text-xs">Layouts arrange the provided text, not verified relationships or historical chronology.</Text>
    <Text className="text-white text-2xl font-bold mt-5">Your visual storyboard</Text>
    <Text className="text-slate-400 mt-2">Preview: {slides.length} panels • Edit input, then regenerate to update panels.</Text>
    {slides.map((slide,index)=><View key={index}
      className="bg-slate-800 rounded-2xl border border-slate-700 p-5 mt-3">
      <Text className="text-green-300 font-bold">STEP {index+1} • Editable</Text>
      <TextInput accessibilityLabel={"Edit slide "+(index+1)+" heading"}
        maxLength={90} value={slide.heading} placeholderTextColor="#94a3b8"
        onChangeText={value=>{setVideo(null);setSlides(prev=>prev.map((s,i)=>i===index?{...s,heading:value}:s));}}
        className="bg-slate-900 text-white text-lg font-bold rounded-xl p-3 mt-3"/>
      <TextInput accessibilityLabel={"Edit slide "+(index+1)+" explanation"}
        multiline textAlignVertical="top" maxLength={240} value={slide.body}
        onChangeText={value=>{setVideo(null);setSlides(prev=>prev.map((s,i)=>i===index?{...s,body:value}:s));}}
        className="bg-slate-900 text-slate-200 rounded-xl p-3 mt-2"
        style={{minHeight:80}}/>
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
      <Text className="text-white text-xl font-bold">Text → animated video + captions</Text>
      <Text className="text-slate-300 mt-2 leading-6">
        Creates a portrait animated slide video locally. Where supported, MP4 is exported;
        otherwise it exports actual WebM. Optional microphone audio is recorded live as
        you narrate. Neither footage nor voice is generated by an AI model.
      </Text>
      <Text className="text-white font-bold mt-4">Time per slide</Text>
      <View className="flex-row mt-3">
        {SLIDE_MS_OPTIONS.map(ms=><TouchableOpacity key={ms} accessibilityRole="button"
          accessibilityLabel={"Slide duration "+ms/1000+" seconds"}
          accessibilityState={{selected:slideMs===ms}}
          onPress={()=>{setSlideMs(ms);setVideo(null);}}
          className={ms===slideMs?"bg-green-700 rounded-xl p-3 mr-2":"bg-slate-700 rounded-xl p-3 mr-2"}>
          <Text className="text-white font-bold">{ms/1000}s</Text>
        </TouchableOpacity>)}
      </View>
      <Text className="text-slate-300 mt-3">Total video: {(slideMs*slides.length/1000)} seconds.</Text>
      {Platform.OS==="web"&&<TouchableOpacity accessibilityRole="checkbox"
        accessibilityState={{checked:withMicrophone}}
        accessibilityLabel="Record my own microphone narration locally"
        onPress={()=>{setWithMicrophone(x=>!x);setVideo(null);}}
        className="bg-slate-700 rounded-xl p-4 mt-4">
        <Text className="text-white">{withMicrophone?"☑":"☐"} Record my own voice while slides play</Text>
        <Text className="text-slate-300 mt-2 text-xs">Requires microphone permission upon Render. Speak as each slide appears. Ambient sounds may also be recorded. Audio stays inside your downloaded file; OpenForge does not upload it.</Text>
      </TouchableOpacity>}
      <Text className="text-slate-300 mt-3 text-xs">Subtitles below represent slide text, not recognized or synchronized spoken words.</Text>
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={Platform.OS==="web"?"Download SRT slide subtitles":"Share SRT slide subtitle text"}
          onPress={()=>downloadCaptionFile(createSrt(slides,slideMs),"srt")}
          className="bg-indigo-800 p-3 rounded-xl" style={{width:"48%"}}>
          <Text className="text-white text-center">{Platform.OS==="web"?"↓ SRT subtitles":"Share SRT"}</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={Platform.OS==="web"?"Download VTT slide subtitles":"Share VTT slide subtitle text"}
          onPress={()=>downloadCaptionFile(createVtt(slides,slideMs),"vtt")}
          className="bg-indigo-800 p-3 rounded-xl" style={{width:"48%"}}>
          <Text className="text-white text-center">{Platform.OS==="web"?"↓ VTT subtitles":"Share VTT"}</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS==="web"?<TouchableOpacity accessibilityRole="button" accessibilityLabel="Render explainer video"
        disabled={recording||!input.trim()} onPress={makeVideo}
        className="bg-green-700 rounded-xl p-4 mt-4">
        <Text className="text-white text-center font-bold">▶ Render {withMicrophone?"narrated":"silent"} video</Text>
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
      {!!video && <View className="mt-4"><Text className="text-white font-bold mb-2">Play and review your recorded video</Text><LocalVideoPreview blob={video}/></View>}
      {!!video && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Download rendered explainer video"
        onPress={()=>downloadExplainerVideo(video)}
        className="bg-indigo-700 p-4 rounded-xl mt-4">
        <Text className="text-white text-center font-bold">↓ Download {video.type.toLowerCase().includes("mp4")?"MP4":"WebM"} video ({Math.ceil(video.size/1024)} KB)</Text>
      </TouchableOpacity>}
    </View>
    {!!error && <Text className="text-amber-300 mt-4">{error}</Text>}
    <Text className="text-slate-400 text-xs mt-5 leading-5">
      SVG remains an editable vector image. The downloaded video can include microphone
      narration if you opt in; Text Reader playback is not automatically mixed into the recording.
      The SRT/VTT tracks follow slide timings and may need adjustments for natural speech.
    </Text>
  </ScrollView>;
}
