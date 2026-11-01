import {Tabs} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function TabLayout(){
 return <Tabs screenOptions={{
  tabBarActiveTintColor:"#5EEAD4",tabBarInactiveTintColor:"#94A3B8",
  tabBarLabelStyle:{fontSize:11,fontWeight:"800"},
  tabBarStyle:{backgroundColor:"#0F172A",borderTopColor:"#334155",height:65,paddingBottom:6},
  headerStyle:{backgroundColor:"#0F172A"},headerTintColor:"#FFFFFF",
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
   title:"15 Agents",headerTitle:"AI Classroom",
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
