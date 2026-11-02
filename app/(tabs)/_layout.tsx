import {Tabs} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Platform,useWindowDimensions} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function TabLayout(){
 const {width,height}=useWindowDimensions();
 const inset=useSafeAreaInsets();
 const sidebar=Platform.OS==="web"&&width>=1024;
 const compact=width<370||height<620;
 return <Tabs screenOptions={{
  tabBarPosition:sidebar?"top":"bottom",
  tabBarLabelPosition:"below-icon",
  tabBarActiveTintColor:"#087F74",tabBarInactiveTintColor:"#64748B",
  tabBarLabelStyle:{fontSize:sidebar?12:compact?9:11,fontWeight:"800"},
  tabBarStyle:{backgroundColor:"#FFFFFF",borderTopColor:"#E2E8F0",
   borderRightColor:"#E2E8F0",borderRightWidth:sidebar?1:0,
   width:undefined,height:sidebar?62:56+Math.max(inset.bottom,6),
   paddingBottom:sidebar?0:Math.max(inset.bottom,6)},
  headerStyle:{backgroundColor:"#F6F7FB"},headerTintColor:"#162036",
 }}>
  <Tabs.Screen name="index" options={{
   title:"Discover",tabBarIcon:({color,size})=>
    <MaterialCommunityIcons name="home-outline" color={color} size={size}/>,
  }}/>
  <Tabs.Screen name="academy-home" options={{
   title:"Academy",headerTitle:"My Academy",
   tabBarIcon:({color,size})=>
    <MaterialCommunityIcons name="school-outline" color={color} size={size}/>,
  }}/>
  <Tabs.Screen name="agent-classroom" options={{
   title:"Classroom",headerTitle:"Guided Classroom",
   tabBarIcon:({color,size})=>
    <MaterialCommunityIcons name="account-group-outline" color={color} size={size}/>,
  }}/>
  <Tabs.Screen name="ai" options={{
   title:"Coach",tabBarIcon:({color,size})=>
    <MaterialCommunityIcons name="robot-happy-outline" color={color} size={size}/>,
  }}/>
  <Tabs.Screen name="progress" options={{
   title:"Progress",tabBarIcon:({color,size})=>
    <MaterialCommunityIcons name="chart-timeline-variant" color={color} size={size}/>,
  }}/>
  <Tabs.Screen name="tasks" options={{href:null}}/>
  <Tabs.Screen name="sessions" options={{href:null}}/>
 </Tabs>;
}
