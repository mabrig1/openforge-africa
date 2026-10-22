import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCircleStore } from "../../stores/circleStore";
import { getProgress } from "../../lib/study";

export default function CircleDetailScreen() {
  const params=useLocalSearchParams<{id:string}>();
  const id=typeof params.id==="string"?params.id:"";
  const {circles,tasks,materials,removeMaterial,removeCircle}=useCircleStore();
  const circle=circles.find((c)=>c.id===id);
  if(!circle) return <View className="flex-1 bg-slate-900 p-8 justify-center"><Text className="text-white text-xl">This circle is not on this device.</Text></View>;
  const ownTasks=tasks.filter((t)=>t.circleId===id);
  const ownMaterials=materials.filter((m)=>m.circleId===id);
  const stats=getProgress(ownTasks);
  return <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{padding:18,paddingBottom:50}}>
    <Text className="text-green-400 font-bold">{circle.courseCode}</Text>
    <Text className="text-white text-3xl font-bold mt-1">{circle.name}</Text>
    <Text className="text-slate-300 text-lg mt-1">{circle.courseTitle}</Text>
    <View className="bg-slate-800 p-5 rounded-3xl border border-slate-700 mt-6">
      <Text className="text-green-400 font-bold">OFFLINE WORKSPACE</Text>
      <Text className="text-slate-200 leading-6 mt-2">Saved on this device. Create tasks and ask the Study Coach using local notes. This is not yet live multi-user collaboration.</Text>
      <Text className="text-white mt-4 font-bold">{stats.completed}/{stats.total} tasks done • {ownMaterials.length} saved sources</Text>
    </View>
    <View className="flex-row mt-5">
      <TouchableOpacity accessibilityRole="button" onPress={()=>router.push({pathname:"/add-material",params:{circleId:id}})}
        className="bg-green-600 p-4 rounded-xl flex-1 mr-2 items-center"><Text className="text-white font-bold">+ Course notes</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" onPress={()=>router.push({pathname:"/create-task",params:{circleId:id}})}
        className="bg-slate-700 p-4 rounded-xl flex-1 ml-2 items-center"><Text className="text-white font-bold">+ Create task</Text></TouchableOpacity>
    </View>
    <Text className="text-white text-xl font-bold mt-8 mb-3">Saved sources</Text>
    {ownMaterials.length===0&&<Text className="text-slate-400 mb-4">No notes yet. Paste a section of your course handout to power source-based coaching.</Text>}
    {ownMaterials.map((m)=><View key={m.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-bold flex-1">{m.title}</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={"Remove "+m.title}
          onPress={()=>Alert.alert("Remove notes?","This cannot be undone.",[{text:"Cancel",style:"cancel"},{text:"Remove",style:"destructive",onPress:()=>removeMaterial(m.id)}])}>
          <Text className="text-rose-400 p-2">Remove</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-slate-400 text-sm mt-2" numberOfLines={3}>{m.content}</Text>
    </View>)}
    <Text className="text-white text-xl font-bold mt-6 mb-3">Tasks</Text>
    {ownTasks.length===0&&<Text className="text-slate-400 mb-4">No tasks yet. Set up a discussion or a short quiz.</Text>}
    {ownTasks.map((t)=><TouchableOpacity key={t.id} accessibilityRole="button" onPress={()=>router.push({pathname:"/task/[id]",params:{id:t.id}})}
      className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-3">
      <Text className="text-white font-bold">{t.title}</Text>
      <Text className="text-slate-400 mt-1">{t.type} • {t.status} →</Text>
    </TouchableOpacity>)}
    <TouchableOpacity accessibilityRole="button" className="mt-8 border border-rose-700 p-4 rounded-xl items-center"
      onPress={()=>Alert.alert("Delete this circle?","All its saved tasks and notes will be permanently removed from this device.",[
        {text:"Keep",style:"cancel"},{text:"Delete",style:"destructive",onPress:()=>{removeCircle(id);router.replace("/");}}
      ])}><Text className="text-rose-400 font-semibold">Delete local circle and data</Text></TouchableOpacity>
  </ScrollView>;
}
