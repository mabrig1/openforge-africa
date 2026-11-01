import {ScrollView,Text,TouchableOpacity,View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {router} from "expo-router";
import {useCircleStore} from "../../stores/circleStore";

const COURSES=[
 {code:"LOG 101",title:"Logic & Critical Thinking",short:"Think clearly. Reason confidently.",route:"/course",units:23,tone:"#0F766E",icon:"brain"},
 {code:"PSY 210",title:"Psychology in the Age of AI",short:"Understand minds and machines.",route:"/psychology-course",units:6,tone:"#6D28D9",icon:"head-cog-outline"},
 {code:"HIL 201",title:"Human Intelligence & AI Decisions",short:"Reason, predict and choose wisely.",route:"/decision-science",units:20,tone:"#1D4ED8",icon:"chart-bell-curve"},
 {code:"FS 101",title:"Introduction to Forge Studies",short:"Build evidence, not just ideas.",route:"/forge-studies",units:10,tone:"#B45309",icon:"hammer-wrench"},
 {code:"AIL 101",title:"AI Literacy & Collaboration",short:"Work intelligently alongside AI.",route:"/ail101",units:20,tone:"#0369A1",icon:"robot-outline"},
 {code:"RLX 101",title:"Foundations of Relationalics",short:"Explore trust, identity and care.",route:"/relationalics",units:12,tone:"#7E22CE",icon:"account-heart-outline"},
 {code:"CEAI 401",title:"Computational Ethnobotany",short:"Learn research methods and simulations.",route:"/ethnobotany",units:7,tone:"#047857",icon:"sprout-outline"},
 {code:"SOUL",title:"The Integrated Soul",short:"Philosophy, psychology and formation.",route:"/integrated-soul",units:12,tone:"#9A3412",icon:"lightbulb-on-outline"},
 {code:"DISCERN",title:"Clear Sight: Discernment",short:"Evaluate claims and evidence.",route:"/clear-sight",units:24,tone:"#0E7490",icon:"eye-check-outline"},
 {code:"SPEAK",title:"The Multi-Channel Speaker",short:"Communicate across real formats.",route:"/multi-channel-speaker",units:24,tone:"#4338CA",icon:"microphone-variant"},
] as const;
const TOOLS=[
 {label:"AI Tutor",route:"/tutor",icon:"robot-happy-outline",detail:"Grounded study support"},
 {label:"Text Reader",route:"/reader",icon:"text-to-speech",detail:"Read aloud & pace"},
 {label:"Explainer Studio",route:"/explainer",icon:"movie-open-play-outline",detail:"Infographics & video"},
 {label:"Learning Agents",route:"/agents",icon:"account-network-outline",detail:"12 local workflows"},
 {label:"Focus Timer",route:"/(tabs)/sessions",icon:"timer-outline",detail:"Keep a study rhythm"},
 {label:"Tasks",route:"/(tabs)/tasks",icon:"check-circle-outline",detail:"Organise your work"},
] as const;
const open=(route:string)=>router.push(route as never);
function QuickCard({title,description,route,color,icon}:{
 title:string;description:string;route:string;color:string;icon:string;
}){
 return <TouchableOpacity accessibilityRole="button" accessibilityLabel={"Open "+title}
  onPress={()=>open(route)} activeOpacity={0.85}
  style={{backgroundColor:"#182338",borderColor:color,borderWidth:1,borderRadius:18,padding:15,width:"48%",marginBottom:12,minHeight:128}}>
  <View style={{width:42,height:42,borderRadius:12,backgroundColor:color,
   alignItems:"center",justifyContent:"center"}}>
   <MaterialCommunityIcons name={icon as never} size={24} color="#FFFFFF"/>
  </View>
  <Text style={{color:"#FFFFFF",fontSize:17,fontWeight:"800",marginTop:11}}>{title}</Text>
  <Text style={{color:"#CBD5E1",fontSize:12,lineHeight:17,marginTop:3}}>{description}</Text>
 </TouchableOpacity>;
}
export default function OpenForgeHome(){
 const circles=useCircleStore(s=>s.circles);
 const tasks=useCircleStore(s=>s.tasks);
 const materials=useCircleStore(s=>s.materials);
 return <ScrollView className="flex-1 bg-slate-950"
  contentContainerStyle={{paddingHorizontal:16,paddingTop:19,paddingBottom:90}}
  keyboardShouldPersistTaps="handled">
  <View style={{backgroundColor:"#101E37",borderRadius:26,borderColor:"#315B65",
   borderWidth:1,overflow:"hidden",padding:22}}>
   <View style={{backgroundColor:"#14B8A6",width:110,height:6,borderRadius:9,marginBottom:18}}/>
   <Text style={{color:"#5EEAD4",fontSize:11,fontWeight:"900",letterSpacing:2}}>
    OPENFORGE AFRICA · AI LEARNING UNIVERSITY
   </Text>
   <Text style={{color:"#FFFFFF",fontSize:34,lineHeight:41,fontWeight:"900",marginTop:13}}>
    Learn stronger, together.
   </Text>
   <Text style={{color:"#CBD5E1",fontSize:15,lineHeight:23,marginTop:12}}>
    Explore real learning tracks, question fifteen classroom roles and make progress with hands-on tools — even when you study offline.
   </Text>
   <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:20,marginBottom:20}}>
    {([{n:"10",label:"courses"},{n:"15",label:"agent roles"},{n:"158",label:"review units"}] as const).map(s=>
     <View key={s.label} style={{width:"31%",backgroundColor:"#20344F",padding:10,borderRadius:13}}>
      <Text style={{color:"#FFFFFF",fontSize:23,fontWeight:"900"}}>{s.n}</Text>
      <Text style={{color:"#A7F3D0",fontSize:11,marginTop:2}}>{s.label}</Text>
     </View>
    )}
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Explore all ten Academy courses"
    onPress={()=>open("/academy")} style={{backgroundColor:"#10B981",borderRadius:14,paddingVertical:16,
      flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
    <MaterialCommunityIcons name="school-outline" size={23} color="#03251D"/>
    <Text style={{fontWeight:"900",color:"#03251D",fontSize:17,marginLeft:8}}>Explore my Academy</Text>
    <MaterialCommunityIcons name="arrow-right" size={20} color="#03251D" style={{marginLeft:10}}/>
   </TouchableOpacity>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Launch free fifteen agent classroom from home"
    onPress={()=>open("/classroom")} style={{backgroundColor:"#243B63",
     borderColor:"#647FC1",borderWidth:1,borderRadius:14,paddingVertical:15,marginTop:11,
     flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
    <MaterialCommunityIcons name="robot-outline" size={21} color="#FFFFFF"/>
    <Text style={{fontWeight:"900",color:"#FFFFFF",fontSize:16,marginLeft:9}}>Meet the 15-Agent Classroom</Text>
   </TouchableOpacity>
   <Text style={{color:"#9BB4C9",fontSize:11,marginTop:11,textAlign:"center"}}>
    Offline roles are free. Generative AI is optional and not yet activated.
   </Text>
  </View>
  <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:30,marginBottom:12}}>
   <View>
    <Text style={{color:"#FFFFFF",fontWeight:"900",fontSize:23}}>Where will you begin?</Text>
    <Text style={{color:"#9CAEC3",fontSize:12,marginTop:4}}>Your learning spaces in one place</Text>
   </View>
  </View>
  <View style={{flexDirection:"row",justifyContent:"space-between",flexWrap:"wrap"}}>
   <QuickCard title="My Academy" description="Ten interactive course companions" route="/academy" color="#047857" icon="school-outline"/>
   <QuickCard title="15 AI Roles" description="Teacher-first debates and Q&A" route="/classroom" color="#4338CA" icon="account-group-outline"/>
   <QuickCard title="Agent Verification" description="Inspect local evidence and limits" route="/classroom-verify" color="#0E7490" icon="shield-check-outline"/>
   <QuickCard title="Creative Studio" description="Infographics, narration and lessons" route="/explainer" color="#B45309" icon="movie-open-play-outline"/>
  </View>
  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:24,marginBottom:13}}>
   <View>
    <Text style={{color:"#FFFFFF",fontSize:23,fontWeight:"900"}}>Explore courses</Text>
    <Text style={{color:"#94A3B8",fontSize:12,marginTop:3}}>Ten subjects · short interactive review tracks</Text>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="See all ten Academy courses"
    onPress={()=>open("/academy")}>
    <Text style={{color:"#5EEAD4",fontWeight:"800"}}>View all →</Text>
   </TouchableOpacity>
  </View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityLabel="Scrollable Academy course catalogue"
   contentContainerStyle={{paddingBottom:8}}>
   {COURSES.map((course,i)=><TouchableOpacity key={course.route} accessibilityRole="button"
    accessibilityLabel={"Open course "+course.title} onPress={()=>open(course.route)}
    style={{width:255,backgroundColor:"#1E293B",borderWidth:1,borderColor:"#334155",
     borderRadius:19,overflow:"hidden",marginRight:12}}>
    <View style={{height:7,backgroundColor:course.tone}}/>
    <View style={{padding:17,minHeight:195}}>
     <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
      <View style={{width:43,height:43,borderRadius:12,alignItems:"center",justifyContent:"center",
       backgroundColor:course.tone}}>
       <MaterialCommunityIcons name={course.icon as never} size={23} color="#FFFFFF"/>
      </View>
      <Text style={{color:"#A7F3D0",fontSize:11,fontWeight:"900"}}>{course.code}</Text>
     </View>
     <Text style={{color:"#FFFFFF",fontWeight:"800",fontSize:17,marginTop:14}}>{course.title}</Text>
     <Text style={{color:"#CBD5E1",fontSize:12,lineHeight:18,marginTop:5}}>{course.short}</Text>
     <Text style={{color:"#5EEAD4",fontWeight:"800",fontSize:12,marginTop:15}}>
      {course.units} reviews · Start learning →
     </Text>
    </View>
   </TouchableOpacity>)}
  </ScrollView>
  <View style={{backgroundColor:"#192742",borderRadius:19,padding:18,marginTop:19,
   borderColor:"#364E7D",borderWidth:1}}>
   <View style={{flexDirection:"row",alignItems:"center"}}>
    <MaterialCommunityIcons name="forum-outline" size={29} color="#93C5FD"/>
    <View style={{flex:1,marginLeft:12}}>
     <Text style={{color:"#FFFFFF",fontSize:19,fontWeight:"900"}}>Your AI Learning Classroom</Text>
     <Text style={{color:"#CBD5E1",fontSize:12,marginTop:4}}>
      Choose one of 15 roles, bring a course excerpt and explore an interactive discussion.
     </Text>
    </View>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Start fifteen agent role discussion"
    onPress={()=>open("/classroom")}
    style={{backgroundColor:"#4338CA",padding:15,borderRadius:13,marginTop:16}}>
    <Text style={{color:"#FFFFFF",textAlign:"center",fontSize:16,fontWeight:"900"}}>Launch Classroom →</Text>
   </TouchableOpacity>
  </View>
  <Text style={{color:"#FFFFFF",fontWeight:"900",fontSize:23,marginTop:29,marginBottom:12}}>Learning tools</Text>
  <View style={{flexDirection:"row",justifyContent:"space-between",flexWrap:"wrap"}}>
   {TOOLS.map(tool=><QuickCard key={tool.route} title={tool.label} description={tool.detail}
    route={tool.route} color="#334B77" icon={tool.icon}/>)}
  </View>
  <View style={{marginTop:18,marginBottom:15,flexDirection:"row",justifyContent:"space-between",
   alignItems:"center"}}>
   <View style={{flex:1}}>
    <Text style={{color:"#FFFFFF",fontSize:23,fontWeight:"900"}}>My study circles</Text>
    <Text style={{color:"#94A3B8",fontSize:12,marginTop:3}}>
     {circles.length} circles · {tasks.length} tasks · {materials.length} saved notes
    </Text>
   </View>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Create study circle"
    onPress={()=>open("/create-circle")}
    style={{backgroundColor:"#047857",paddingHorizontal:15,paddingVertical:12,borderRadius:14}}>
    <Text style={{color:"#FFFFFF",fontWeight:"900"}}>+ Create</Text>
   </TouchableOpacity>
  </View>
  {circles.length===0?<View style={{borderStyle:"dashed",borderColor:"#475569",borderWidth:1,
    padding:23,borderRadius:18,backgroundColor:"#162238",marginBottom:16}}>
    <MaterialCommunityIcons name="account-group-outline" size={31} color="#5EEAD4"/>
    <Text style={{color:"#FFFFFF",fontSize:18,fontWeight:"800",marginTop:10}}>Start your first learning circle</Text>
    <Text style={{color:"#CBD5E1",fontSize:13,lineHeight:20,marginTop:6}}>
     Organise your notes and create meaningful practice tasks that stay on your device.
    </Text>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Create first study circle"
      onPress={()=>open("/create-circle")} style={{marginTop:12}}>
      <Text style={{color:"#5EEAD4",fontWeight:"900"}}>Create a circle →</Text>
    </TouchableOpacity>
   </View>:circles.map(circle=>{
    const ownTasks=tasks.filter(task=>task.circleId===circle.id);
    return <TouchableOpacity key={circle.id} accessibilityRole="button" onPress={()=>router.push({
      pathname:"/circle/[id]",params:{id:circle.id}})}
      style={{backgroundColor:"#1E293B",borderRadius:17,padding:18,borderColor:"#334155",borderWidth:1,marginBottom:12}}>
     <Text style={{color:"#5EEAD4",fontSize:11,fontWeight:"800"}}>{circle.courseCode}</Text>
     <Text style={{color:"#FFFFFF",fontWeight:"900",fontSize:18,marginTop:6}}>{circle.name}</Text>
     <Text style={{color:"#CBD5E1",fontSize:12,marginTop:4}}>{circle.courseTitle}</Text>
     <Text style={{color:"#94A3B8",fontSize:12,marginTop:11}}>
      {ownTasks.filter(t=>t.status==="completed").length}/{ownTasks.length} tasks complete · Open circle →
     </Text>
    </TouchableOpacity>;
   })}
  <Text style={{color:"#64748B",fontSize:11,textAlign:"center",marginTop:16,marginBottom:5}}>
   OpenForge Africa · Self-directed education, not an accredited degree. No paid inference in free mode.
  </Text>
 </ScrollView>;
}
