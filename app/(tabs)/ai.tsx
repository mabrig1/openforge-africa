import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useCircleStore } from "../../stores/circleStore";
import { groundedReply } from "../../lib/study";

interface Message { id: number; role: "student" | "coach"; text: string; }
export default function CoachScreen() {
  const { circles, materials } = useCircleStore();
  const [circleId, setCircleId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const selected = circleId && circles.some((c) => c.id === circleId) ? circleId : circles[0]?.id;
  const sources = materials.filter((m) => m.circleId === selected);
  const send = () => {
    if (!input.trim() || !selected) return;
    const reply = groundedReply(input.trim(), sources);
    setMessages((previous) => [...previous,
      {id: Date.now(),role:"student",text:input.trim()},
      {id: Date.now()+1,role:"coach",text:reply.content}]);
    setInput("");
  };
  return <KeyboardAvoidingView className="flex-1 bg-slate-900" behavior={Platform.OS==="ios"?"padding":undefined}>
    <View className="p-4 border-b border-slate-700">
      <Text className="text-white text-2xl font-bold">Study Coach</Text>
      <Text className="text-slate-300 text-sm mt-2 leading-5">Private keyword-based retrieval from saved course notes. No cloud AI, fabricated citations or hidden uploads.</Text>
      <Text className="text-slate-400 mt-3 mb-2">Choose a course</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {circles.map((c) => <TouchableOpacity key={c.id} accessibilityRole="button" onPress={() => {setCircleId(c.id);setMessages([]);}}
          className={selected===c.id?"bg-green-700 px-4 py-3 rounded-full mr-2":"bg-slate-700 px-4 py-3 rounded-full mr-2"}>
          <Text className="text-white font-semibold">{c.courseCode}</Text>
        </TouchableOpacity>)}
      </ScrollView>
      <Text className="text-green-400 text-xs mt-3">{sources.length} local note{sources.length===1?"":"s"} available • No network needed</Text>
    </View>
    <ScrollView className="flex-1 px-4" contentContainerStyle={{paddingVertical:20}}>
      {messages.length===0 && <View className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
        <Text className="text-white text-lg font-semibold">Ask a question from your notes</Text>
        <Text className="text-slate-300 leading-6 mt-2">For example: “What does public accountability mean?” I will show the closest matching passage and three ways to discuss it with classmates.</Text>
        {!selected && <Text className="text-amber-400 mt-3">Create a study circle first to begin.</Text>}
        {selected && !sources.length && <Text className="text-amber-400 mt-3">Open your circle and save course notes first.</Text>}
      </View>}
      {messages.map((m) => <View key={m.id} className={m.role==="student"?"bg-green-800 rounded-2xl p-4 mb-3 ml-8":"bg-slate-800 rounded-2xl border border-slate-700 p-4 mb-3 mr-4"}>
        <Text className="text-green-300 text-xs mb-2">{m.role==="student"?"YOU":"OFFLINE STUDY COACH"}</Text>
        <Text className="text-white leading-6">{m.text}</Text>
      </View>)}
    </ScrollView>
    <View className="flex-row p-3 border-t border-slate-700 items-center">
      <TextInput accessibilityLabel="Question for Study Coach" className="bg-slate-800 text-white rounded-2xl flex-1 px-4 py-3"
        placeholder="Ask about a saved topic..." placeholderTextColor="#94A3B8" value={input} onChangeText={setInput}
        maxLength={300} multiline />
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ask Study Coach" disabled={!selected||!input.trim()} onPress={send}
        className="bg-green-600 p-3 rounded-xl ml-2"><Text className="text-white font-bold">Ask</Text></TouchableOpacity>
    </View>
  </KeyboardAvoidingView>;
}
