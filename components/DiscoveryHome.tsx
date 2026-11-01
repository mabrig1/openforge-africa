import {useState} from "react";
import InstallAppPrompt from "./InstallAppPrompt";
import {ScrollView,Text,TextInput,TouchableOpacity,View,useWindowDimensions} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {router} from "expo-router";
import {useCircleStore} from "../stores/circleStore";
import {useClassroomAcademyDashboard} from "../hooks/useClassroomAcademyDashboard";
import {chooseNextDiscoveryCourse,DISCOVERY_CATEGORIES,DISCOVERY_SKINS,filterDiscoveryCourses,
 type DiscoveryCategory} from "../lib/discoveryCatalog";
import type {AcademyCourseSummary} from "../lib/academyDashboard";

const colors={
 page:"#F6F7FB",ink:"#162036",soft:"#5A667A",line:"#E5E9F1",
 navy:"#12264F",teal:"#0E9F88",mint:"#9AFFD6",violet:"#7C67FF",white:"#FFFFFF",
} as const;
function I({name,size=22,color="#FFFFFF"}:{name:string;size?:number;color?:string}){
 return <MaterialCommunityIcons name={name as never} size={size} color={color}/>;
}
function Go({label,route,accessibilityLabel,tone="primary",icon}:{
 label:string;route:string;accessibilityLabel:string;tone?:"primary"|"ghost"|"nav";icon?:string;
}){
 const primary=tone==="primary",ghost=tone==="ghost";
 return <TouchableOpacity accessibilityRole="button" accessibilityLabel={accessibilityLabel}
  activeOpacity={0.82} onPress={()=>router.push(route as never)}
  style={{flexDirection:"row",alignItems:"center",justifyContent:"center",
   backgroundColor:primary?"#A9FCD9":ghost?"#FFFFFF":"#152951",
   borderRadius:15,borderWidth:1,borderColor:primary?"#A9FCD9":ghost?"#DCE4ED":"#3D5685",
   paddingHorizontal:18,paddingVertical:15,minHeight:53}}>
  {icon?<I name={icon} size={21} color={primary?"#073D34":ghost?colors.navy:"#FFFFFF"}/>:null}
  <Text style={{fontWeight:"900",fontSize:14,color:primary?"#073D34":ghost?colors.ink:"#FFFFFF",
   marginLeft:icon?9:0}}>{label}</Text>
  <I name="arrow-top-right" size={17} color={primary?"#073D34":ghost?colors.ink:"#FFFFFF"}/>
 </TouchableOpacity>;
}
function Heading({eyebrow,title,detail}:{eyebrow:string;title:string;detail:string}){
 return <View style={{marginBottom:18}}>
  <Text style={{color:colors.teal,fontSize:11,fontWeight:"900",letterSpacing:2.5}}>{eyebrow}</Text>
  <Text style={{color:colors.ink,fontSize:29,lineHeight:35,fontWeight:"900",marginTop:8}}>{title}</Text>
  <Text style={{color:colors.soft,fontSize:14,lineHeight:21,marginTop:6}}>{detail}</Text>
 </View>;
}
function HeroArt({wide}:{wide:boolean}){
 return <View accessibilityLabel="Illustration of a connected learning classroom with fifteen registered offline roles"
  style={{height:wide?365:240,flex:wide?1:undefined,
   position:"relative",justifyContent:"center",alignItems:"center",
   marginTop:wide?0:22}}>
  <View style={{width:wide?310:230,height:wide?310:230,borderRadius:999,
   backgroundColor:"#283E79",position:"absolute",borderWidth:1,borderColor:"#6173AA"}}/>
  <View style={{width:wide?250:182,height:wide?250:182,borderRadius:999,
   borderWidth:1,borderColor:"#7284BF",position:"absolute",backgroundColor:"#314C8D"}}/>
  <View style={{width:wide?175:132,height:wide?175:132,borderRadius:999,
   alignItems:"center",justifyContent:"center",backgroundColor:"#816CFF",
   borderWidth:8,borderColor:"#6C60DC"}}>
   <I name="school-outline" size={wide?77:59}/>
  </View>
  {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{
   const angle=i*Math.PI/6,rad=wide?137:101;
   const diameter=i%3===0?25:17;
   return <View key={i} style={{position:"absolute",
    transform:[{translateX:Math.cos(angle)*rad},{translateY:Math.sin(angle)*rad}],
    width:diameter,height:diameter,borderRadius:999,
    backgroundColor:i%4===0?"#AFF9D7":i%4===1?"#FFA986":i%4===2?"#B8ADFF":"#F9DD85",
    borderColor:"#1F3569",borderWidth:3}}/>;
  })}
  <View style={{position:"absolute",top:wide?16:4,right:wide?0:2,
   paddingHorizontal:14,paddingVertical:10,borderRadius:13,
   backgroundColor:"#FCFFF8",flexDirection:"row",alignItems:"center"}}>
   <I name="check-decagram-outline" color="#10A888" size={19}/>
   <Text style={{fontWeight:"900",fontSize:11,color:colors.ink,marginLeft:7}}>15 roles registered</Text>
  </View>
  <View style={{position:"absolute",bottom:wide?18:2,left:wide?12:0,
   paddingHorizontal:14,paddingVertical:12,borderRadius:15,
   backgroundColor:"#FFFFFF",maxWidth:220}}>
   <Text style={{color:"#0D8D76",fontSize:10,fontWeight:"900",letterSpacing:1}}>TEACH • QUESTION • DISCUSS</Text>
   <Text style={{color:colors.ink,fontWeight:"900",marginTop:4,fontSize:13}}>Your classroom, your pace.</Text>
  </View>
 </View>;
}
function CourseTile({course,width}:{course:AcademyCourseSummary;width:string}){
 const s=DISCOVERY_SKINS[course.id],done=course.completed===course.total;
 return <TouchableOpacity accessibilityRole="button" accessibilityLabel={"Open course "+course.title}
  onPress={()=>router.push(course.route)} activeOpacity={0.84}
  style={{width:width as never,backgroundColor:"#FFFFFF",borderWidth:1,borderColor:"#E7EBF3",
   borderRadius:20,overflow:"hidden",marginBottom:17}}>
  <View style={{height:138,backgroundColor:s.tint,position:"relative",
   padding:17,overflow:"hidden",justifyContent:"space-between"}}>
   <View style={{position:"absolute",width:160,height:160,borderRadius:100,
    backgroundColor:s.color,opacity:0.10,right:-40,top:-75}}/>
   <View style={{position:"absolute",width:95,height:95,borderRadius:70,
    backgroundColor:s.color,opacity:0.12,right:40,bottom:-55}}/>
   <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
    <View style={{backgroundColor:"#FFFFFF",paddingHorizontal:10,paddingVertical:6,borderRadius:9}}>
     <Text style={{color:s.color,fontSize:11,fontWeight:"900"}}>{course.code}</Text>
    </View>
    <Text style={{fontSize:12,fontWeight:"900",color:s.color}}>OPEN LEARNING</Text>
   </View>
   <View style={{flexDirection:"row",alignItems:"flex-end",justifyContent:"space-between"}}>
    <View style={{backgroundColor:s.color,width:59,height:59,borderRadius:18,
     alignItems:"center",justifyContent:"center"}}>
     <I name={s.icon} size={31}/>
    </View>
    <Text style={{color:s.color,fontSize:45,fontWeight:"900",opacity:0.27,lineHeight:52}}>{s.index}</Text>
   </View>
  </View>
  <View style={{padding:18,minHeight:198}}>
   <Text style={{color:s.color,fontWeight:"900",fontSize:10,letterSpacing:1.1}}>{s.category.toUpperCase()}</Text>
   <Text style={{color:colors.ink,fontWeight:"900",fontSize:19,lineHeight:25,marginTop:8}}>{course.title}</Text>
   <Text style={{color:colors.soft,fontSize:12,lineHeight:18,marginTop:6}}>{s.description}</Text>
   <View style={{marginTop:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
    <Text style={{color:"#6B778A",fontSize:12,fontWeight:"700"}}>{course.total} short reviews</Text>
    <Text style={{color:s.color,fontSize:12,fontWeight:"900"}}>{done?"Review again":course.completed>0?"Continue":"Explore"} →</Text>
   </View>
   <View style={{height:5,borderRadius:9,backgroundColor:"#E8EDF4",overflow:"hidden",marginTop:11}}>
    <View style={{width:course.percent+"%" as never,height:"100%",backgroundColor:s.color}}/>
   </View>
   <Text style={{color:"#738096",fontSize:10,marginTop:6}}>
    {course.completed}/{course.total} local milestones recorded
   </Text>
  </View>
 </TouchableOpacity>;
}
function ModeCard({title,caption,route,icon,accent,width}:{
 title:string;caption:string;route:string;icon:string;accent:string;width:string;
}){
 return <TouchableOpacity accessibilityRole="button" accessibilityLabel={"Open "+title}
  onPress={()=>router.push(route as never)} activeOpacity={0.84}
  style={{width:width as never,backgroundColor:"#FFFFFF",borderRadius:17,
   borderWidth:1,borderColor:colors.line,padding:19,marginBottom:14}}>
  <View style={{width:47,height:47,backgroundColor:accent,borderRadius:15,
   alignItems:"center",justifyContent:"center"}}>
   <I name={icon} size={25}/>
  </View>
  <Text style={{color:colors.ink,fontSize:17,fontWeight:"900",marginTop:13}}>{title}</Text>
  <Text style={{color:colors.soft,fontSize:12,lineHeight:19,marginTop:5}}>{caption}</Text>
  <View style={{flexDirection:"row",alignItems:"center",marginTop:13}}>
   <Text style={{color:"#167B73",fontSize:12,fontWeight:"900"}}>Open studio</Text>
   <I name="arrow-right" size={16} color="#167B73"/>
  </View>
 </TouchableOpacity>;
}
export default function DiscoveryHome(){
 const {width}=useWindowDimensions();
 const wide=width>=920,tablet=width>=670;
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState<DiscoveryCategory>("All courses");
 const academy=useClassroomAcademyDashboard();
 const circles=useCircleStore(s=>s.circles);
 const tasks=useCircleStore(s=>s.tasks);
 const materials=useCircleStore(s=>s.materials);
 const courses=filterDiscoveryCourses(academy.courses,query,category);
 const next=chooseNextDiscoveryCourse(academy.courses);
 const cwidth=wide?"31.9%":tablet?"48.7%":"100%";
 const modeWidth=wide?"23.7%":tablet?"48.7%":"100%";
 return <ScrollView accessibilityLabel="OpenForge Africa learning discovery homepage"
  style={{backgroundColor:colors.page,flex:1}}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{alignItems:"center",paddingBottom:100}}>
  <View style={{width:"100%",maxWidth:1250,paddingHorizontal:wide?30:16,paddingTop:20}}>
   <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:19}}>
    <View style={{flexDirection:"row",alignItems:"center"}}>
     <View style={{width:43,height:43,backgroundColor:colors.navy,borderRadius:13,
      justifyContent:"center",alignItems:"center"}}>
      <I name="school" size={24} color="#A9FCD9"/>
     </View>
     <View style={{marginLeft:11}}>
      <Text style={{color:colors.ink,fontWeight:"900",fontSize:19,letterSpacing:-0.5}}>OpenForge<Text style={{color:"#0E9F88"}}> Africa</Text></Text>
      <Text style={{fontSize:9,fontWeight:"900",letterSpacing:2,color:"#79869A"}}>EXPLORE · LEARN · BUILD</Text>
     </View>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open Academy from header"
     onPress={()=>router.push("/academy")} style={{backgroundColor:"#E0F8F1",borderRadius:99,
      paddingVertical:12,paddingHorizontal:14,flexDirection:"row",alignItems:"center"}}>
     <I name="book-open-page-variant-outline" size={18} color="#0B7667"/>
     <Text style={{color:"#0B7667",fontSize:12,fontWeight:"900",marginLeft:6}}>My Academy</Text>
    </TouchableOpacity>
   </View>
   <InstallAppPrompt/>
   <View style={{backgroundColor:colors.navy,borderRadius:27,
    paddingHorizontal:wide?35:22,paddingVertical:wide?27:25,overflow:"hidden",
    flexDirection:wide?"row":"column",alignItems:wide?"center":"stretch"}}>
    <View style={{width:wide?"54%":"100%",zIndex:1}}>
     <View style={{backgroundColor:"#294269",borderRadius:99,paddingVertical:8,
      paddingHorizontal:13,alignSelf:"flex-start",flexDirection:"row",alignItems:"center"}}>
      <View style={{height:8,width:8,borderRadius:8,backgroundColor:"#A9FCD9",marginRight:8}}/>
      <Text style={{color:"#D0FFEE",fontSize:10,fontWeight:"900",letterSpacing:1.4}}>YOUR FUTURE STARTS HERE</Text>
     </View>
     <Text style={{color:"#FFFFFF",fontSize:wide?48:35,fontWeight:"900",
      lineHeight:wide?57:42,letterSpacing:-1.4,marginTop:20}}>
      Build the mind that{"\n"}builds the <Text style={{color:"#A9FCD9"}}>future.</Text>
     </Text>
     <Text style={{color:"#D5E2F5",fontSize:wide?16:14,lineHeight:wide?25:22,marginTop:15,maxWidth:510}}>
      Go beyond watching lessons. Explore ten original subjects, practise real thinking skills, and join a fifteen-role learning classroom — all from one place.
     </Text>
     <Text style={{color:"#B9CCEC",fontSize:12,marginTop:11,fontWeight:"700"}}>Learn stronger, together.</Text>
     <View style={{flexDirection:wide?"row":"column",marginTop:24,gap:10}}>
      <Go label="Explore courses" route="/academy" accessibilityLabel="Explore all ten Academy courses"
       tone="primary" icon="book-open-variant"/>
      <Go label="Meet the 15 agents" route="/classroom"
       accessibilityLabel="Launch free fifteen agent classroom from home" tone="nav" icon="account-group-outline"/>
     </View>
     <Text style={{color:"#9FB4D4",fontSize:11,marginTop:14,lineHeight:17}}>
      Free offline lessons and role-based discussions. Live model inference is not yet enabled.
     </Text>
    </View>
    <HeroArt wide={wide}/>
   </View>
   <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",
    marginTop:17,marginBottom:33}}>
    {([
     {name:"10",label:"Self-study subjects",icon:"bookshelf",color:"#E0F8F1"},
     {name:"158",label:"Short review units",icon:"book-open-page-variant",color:"#EDE9FE"},
     {name:"15",label:"Classroom roles",icon:"account-group-outline",color:"#FDE9DF"},
     {name:String(academy.percent)+"%",label:"Your recorded progress",icon:"chart-line",color:"#E3EDFF"},
    ] as const).map(stat=><View key={stat.label}
     style={{width:wide?"23.8%":"48.5%",backgroundColor:"#FFFFFF",borderRadius:17,
      borderColor:"#E5E9F2",borderWidth:1,padding:14,marginBottom:10,
      flexDirection:"row",alignItems:"center"}}>
     <View style={{height:37,width:37,backgroundColor:stat.color,borderRadius:12,
      alignItems:"center",justifyContent:"center"}}>
      <I name={stat.icon} color="#233956" size={20}/>
     </View>
     <View style={{marginLeft:11,flex:1}}>
      <Text style={{fontSize:20,fontWeight:"900",color:colors.ink}}>{stat.name}</Text>
      <Text style={{fontSize:10,lineHeight:13,color:colors.soft}}>{stat.label}</Text>
     </View>
    </View>)}
   </View>
   <View style={{backgroundColor:"#FFFFFF",borderColor:"#E5E9F2",borderWidth:1,borderRadius:22,
    padding:wide?24:18,marginBottom:36,flexDirection:wide?"row":"column",
    justifyContent:"space-between",alignItems:wide?"center":"stretch"}}>
    <View style={{flex:wide?1:undefined,paddingRight:wide?18:0}}>
     <Text style={{color:"#0E9F88",fontSize:11,fontWeight:"900",letterSpacing:1.4}}>PICK UP WHERE YOU LEFT OFF</Text>
     <Text style={{color:colors.ink,fontSize:22,fontWeight:"900",marginTop:7}}>
      {academy.completed>0?"Your learning journey continues":"Your first learning milestone awaits"}
     </Text>
     <Text style={{color:colors.soft,fontSize:13,lineHeight:20,marginTop:5}}>
      {next?next.title+": "+next.next.title:"Explore the self-study catalogue and choose a subject."}
     </Text>
     <View style={{height:7,backgroundColor:"#E8EEF4",borderRadius:7,marginTop:15,overflow:"hidden",
      maxWidth:430}}>
      <View style={{height:7,backgroundColor:colors.teal,width:academy.percent+"%" as never}}/>
     </View>
     <Text style={{color:"#718098",fontSize:11,marginTop:7}}>
      {academy.completed} of {academy.total} local milestones completed · Saved on this device
     </Text>
    </View>
    {next?<TouchableOpacity accessibilityRole="button" accessibilityLabel="Resume recommended next learning course"
     onPress={()=>router.push(next.route)} style={{backgroundColor:colors.navy,borderRadius:14,
      paddingHorizontal:22,paddingVertical:16,marginTop:wide?0:17,alignItems:"center"}}>
      <Text style={{color:"#FFFFFF",fontSize:13,fontWeight:"900"}}>{academy.completed>0?"Continue learning →":"Start learning →"}</Text>
     </TouchableOpacity>:null}
   </View>
   <Heading eyebrow="FIND YOUR PATH" title="Explore courses" detail="Search by subject or filter the catalogue. Every course card opens a working local review track."/>
   <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"#FFFFFF",
    borderColor:"#DBE1EB",borderWidth:1,borderRadius:16,paddingHorizontal:14,minHeight:56}}>
    <I name="magnify" color="#64748B" size={23}/>
    <TextInput accessibilityLabel="Search Academy courses" value={query} onChangeText={setQuery}
     placeholder="Search a course, subject or skill…" placeholderTextColor="#8491A4"
     autoCapitalize="none" style={{flex:1,color:colors.ink,fontSize:15,padding:11}}/>
    {!!query&&<TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear course search"
      onPress={()=>setQuery("")} style={{padding:6}}>
     <I name="close-circle" color="#64748B" size={21}/>
    </TouchableOpacity>}
   </View>
   <ScrollView horizontal showsHorizontalScrollIndicator={false}
    accessibilityLabel="Course subject filters" style={{marginTop:15,marginBottom:21}}
    contentContainerStyle={{gap:8,paddingRight:8}}>
    {DISCOVERY_CATEGORIES.map(cat=><TouchableOpacity accessibilityRole="button" key={cat}
     accessibilityLabel={"Filter courses: "+cat} accessibilityState={{selected:category===cat}}
     onPress={()=>setCategory(cat)} style={{borderRadius:99,paddingHorizontal:15,paddingVertical:11,
      backgroundColor:category===cat?colors.navy:"#FFFFFF",
      borderColor:category===cat?colors.navy:"#DBE1EA",borderWidth:1}}>
     <Text style={{color:category===cat?"#FFFFFF":"#4D5B71",fontWeight:"800",fontSize:12}}>{cat}</Text>
    </TouchableOpacity>)}
   </ScrollView>
   <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
    <Text style={{color:colors.soft,fontSize:12}}>{courses.length} of {academy.courses.length} courses</Text>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="See full Academy dashboard"
     onPress={()=>router.push("/academy")}>
     <Text style={{color:"#0E9F88",fontSize:12,fontWeight:"900"}}>Full Academy →</Text>
    </TouchableOpacity>
   </View>
   {courses.length?
    <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between"}}>
     {courses.map(course=><CourseTile key={course.id} course={course} width={cwidth}/>)}
    </View>:
    <View style={{backgroundColor:"#FFFFFF",borderRadius:18,padding:28,alignItems:"center",marginBottom:18}}>
     <I name="book-search-outline" size={35} color="#818CF8"/>
     <Text style={{color:colors.ink,fontSize:18,fontWeight:"900",marginTop:12}}>No matching courses</Text>
     <Text style={{color:colors.soft,textAlign:"center",fontSize:13,marginTop:7}}>
      Try a different subject, or reset the search and filters.
     </Text>
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset course discovery filters"
      onPress={()=>{setQuery("");setCategory("All courses");}}
      style={{backgroundColor:"#E4F8F1",borderRadius:12,padding:13,marginTop:15}}>
      <Text style={{fontWeight:"900",color:"#087B69"}}>Show all courses</Text>
     </TouchableOpacity>
    </View>}
   <View style={{backgroundColor:"#ECE8FF",borderRadius:25,padding:wide?27:19,
    marginTop:26,marginBottom:40,flexDirection:wide?"row":"column",alignItems:wide?"center":"stretch"}}>
    <View style={{width:wide?"69%":"100%"}}>
     <Text style={{color:"#6B4AE6",fontSize:11,fontWeight:"900",letterSpacing:1.6}}>THE OPENFORGE AI CLASSROOM</Text>
     <Text style={{color:"#241A50",fontSize:wide?30:26,fontWeight:"900",lineHeight:wide?37:33,marginTop:9}}>
      Don't just study. Join the conversation.
     </Text>
     <Text style={{color:"#4A4165",fontSize:14,lineHeight:21,marginTop:10}}>
      Explore teacher-first responses, classroom debates and 15 specialised learner roles. These are executable offline educational personas, not fifteen independent cloud models.
     </Text>
    </View>
    <View style={{marginTop:wide?0:16,flex:wide?1:undefined}}>
     <Go label="Enter classroom" route="/classroom" accessibilityLabel="Open interactive 15-agent classroom"
      tone="ghost" icon="forum-outline"/>
    </View>
   </View>
   <Heading eyebrow="LEARN BY DOING" title="A studio for every learning style"
    detail="Move from reading to practice with tools already available in your OpenForge workspace."/>
   <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between"}}>
    <ModeCard title="AI Study Tutor" caption="Ask questions about the notes you've selected." route="/tutor"
     icon="robot-happy-outline" accent="#0F766E" width={modeWidth}/>
    <ModeCard title="Visual Explainer" caption="Build source-based diagrams and educational storyboards." route="/explainer"
     icon="image-multiple-outline" accent="#6750A4" width={modeWidth}/>
    <ModeCard title="Text Reader" caption="Listen and review at a pace that works for you." route="/reader"
     icon="text-to-speech" accent="#D97706" width={modeWidth}/>
    <ModeCard title="Practice Lab" caption="Explore logical reasoning and truth-table exercises." route="/logic-lab"
     icon="flask-outline" accent="#2563EB" width={modeWidth}/>
   </View>
   <View style={{borderTopWidth:1,borderColor:"#DCE3ED",marginTop:24,paddingTop:27}}>
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
     <View style={{flex:1}}>
      <Text style={{fontSize:24,fontWeight:"900",color:colors.ink}}>Your study circles</Text>
      <Text style={{fontSize:12,color:colors.soft,marginTop:4}}>
       {circles.length} circles · {tasks.length} tasks · {materials.length} saved notes
      </Text>
     </View>
     <TouchableOpacity accessibilityRole="button" accessibilityLabel="Create study circle"
      onPress={()=>router.push("/create-circle")}
      style={{backgroundColor:colors.navy,borderRadius:13,paddingVertical:13,paddingHorizontal:18}}>
      <Text style={{color:"#FFFFFF",fontSize:13,fontWeight:"900"}}>+ Create</Text>
     </TouchableOpacity>
    </View>
    {!circles.length?
     <View style={{padding:22,backgroundColor:"#FFFFFF",borderRadius:16,
      borderColor:colors.line,borderWidth:1,marginTop:15,flexDirection:"row",alignItems:"center"}}>
      <I name="account-multiple-plus-outline" color="#0E9F88" size={30}/>
      <Text style={{fontSize:13,color:colors.soft,marginLeft:13,flex:1,lineHeight:20}}>
       Create a circle to organise notes and tasks with your own learning group.
      </Text>
     </View>:
     circles.map(circle=><TouchableOpacity key={circle.id} accessibilityRole="button"
      accessibilityLabel={"Open study circle "+circle.name}
      onPress={()=>router.push({pathname:"/circle/[id]",params:{id:circle.id}})}
      style={{backgroundColor:"#FFFFFF",borderWidth:1,borderColor:colors.line,
       borderRadius:15,padding:17,marginTop:12}}>
      <Text style={{fontSize:10,fontWeight:"900",color:colors.teal}}>{circle.courseCode}</Text>
      <Text style={{fontSize:17,fontWeight:"900",color:colors.ink,marginTop:5}}>{circle.name} →</Text>
      <Text style={{fontSize:12,color:colors.soft,marginTop:3}}>{circle.courseTitle}</Text>
     </TouchableOpacity>)}
   </View>
   <View style={{paddingVertical:31,alignItems:"center"}}>
    <Text style={{color:"#637189",fontWeight:"900",fontSize:12}}>OPENFORGE AFRICA</Text>
    <Text style={{color:"#7D889B",fontSize:11,textAlign:"center",lineHeight:18,marginTop:6}}>
     Free, offline-first self-directed education · Not an accredited university or official qualification.
    </Text>
   </View>
  </View>
 </ScrollView>;
}
