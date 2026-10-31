import { useState } from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Alert } from "../lib/platformDialogs";
import { useCircleStore } from "../stores/circleStore";
import { makeSyntheticDemoPack, runLocalIntegrityChecks,
  type LocalIntegrityCheck } from "../lib/demoChallenge";

const CRITERIA = [
  ["Working product", 25, "Working workflows, not mockups."],
  ["Accuracy and evidence", 20, "Source checks and responsible abstention."],
  ["Offline and low-data", 20, "Real device and network-disconnect tests."],
  ["Privacy and security", 15, "Safe defaults, consent and data handling."],
  ["Accessibility", 10, "Usability on budget phones and with assistive tech."],
  ["Innovation and openness", 10, "Replicable and well-documented improvements."],
] as const;

export default function ChallengeScreen() {
  const [checks, setChecks] = useState<LocalIntegrityCheck[] | null>(null);
  const importPack = useCircleStore(s => s.importPack);
  const totalPassed = checks?.filter(item => item.passed).length ?? 0;

  const loadDemo = () => {
    const id = importPack(makeSyntheticDemoPack());
    if (!id) {
      Alert.alert("Demo already imported",
        "This exact synthetic pack is already saved on this device. Open the Circles tab to find DEMO 101. Nothing was overwritten.");
      return;
    }
    router.push({ pathname: "/circle/[id]", params: { id } });
  };
  const openSource = () => {
    Linking.openURL("https://github.com/mabrig1/openforge-africa").catch(() => {
      Alert.alert("Could not open GitHub", "Use the repository link in the challenge instructions.");
    });
  };

  return (
    <ScrollView className="flex-1 bg-slate-900"
      contentContainerStyle={{ padding: 18, paddingBottom: 75 }}>
      <Text className="text-green-400 text-xs font-bold tracking-widest">OPENFORGE AFRICA • INNOVATION CHALLENGE</Text>
      <Text className="text-white text-3xl font-extrabold mt-3">Build better. Prove it.</Text>
      <Text className="text-slate-300 mt-3 leading-6">
        Can your learning tool outperform OpenForge for students facing unreliable connectivity?
        We welcome reproducible evidence and independent judging—not self-declared rankings.
      </Text>
      <View className="bg-amber-950 border border-amber-700 p-4 rounded-xl mt-5">
        <Text className="text-amber-100 leading-5">
          Honesty first: OpenForge's current Study Coach is offline keyword retrieval, NOT a
          generative AI model. The tests below are self-checks—not proof of real-world learning impact,
          independent certification, or a live competition leaderboard.
        </Text>
      </View>

      <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-5">
        <Text className="text-white text-xl font-bold">1. Experience the real product</Text>
        <Text className="text-slate-300 mt-2 leading-6">
          Import a fictional DEMO 101 course with two source-labelled notes and three tasks,
          including a graded practice quiz. The pack is saved only on this device.
          It never alters existing circles, and re-importing it is blocked.
        </Text>
        <TouchableOpacity accessibilityRole="button"
          accessibilityLabel="Load synthetic demonstration study circle"
          onPress={loadDemo} className="bg-green-700 rounded-xl p-4 mt-4">
          <Text className="text-white text-center font-bold">Launch synthetic walkthrough →</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-4">
        <Text className="text-white text-xl font-bold">2. Run local integrity checks</Text>
        <Text className="text-slate-300 mt-2 leading-6">
          Six quick checks exercise actual local retrieval, honest no-answer handling,
          quiz grading, input validation, invalid-pack rejection and progress arithmetic.
          No network connection or account is required.
        </Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Run six local integrity checks"
          onPress={() => setChecks(runLocalIntegrityChecks())}
          className="bg-slate-700 border border-green-600 rounded-xl p-4 mt-4">
          <Text className="text-green-300 text-center font-bold">Run six checks on this device</Text>
        </TouchableOpacity>
        {checks && <>
          <Text accessibilityRole="summary" className="text-white font-bold mt-4">
            {totalPassed} of {checks.length} local checks passed
          </Text>
          {checks.map(check => <View key={check.id} className="border-t border-slate-700 pt-3 mt-3">
            <Text className={check.passed ? "text-green-300 font-bold" : "text-red-300 font-bold"}>
              {check.passed ? "PASS" : "FAIL"} • {check.title}
            </Text>
            <Text className="text-slate-300 mt-1 leading-5">{check.detail}</Text>
          </View>)}
          <Text className="text-slate-400 text-xs mt-4 leading-5">
            These checks are implemented by OpenForge itself and are not independently audited.
            They do not test mobile accessibility, server availability, model quality or student outcomes.
          </Text>
        </>}
      </View>

      <View className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-4">
        <Text className="text-white text-xl font-bold">3. Open challenge: 100-point rubric</Text>
        <Text className="text-slate-300 mt-2 leading-6">
          Compare working applications under the same published tasks and device conditions.
          Independent judges must assess results; no winner is currently declared.
        </Text>
        {CRITERIA.map(([name, points, detail]) => <View key={name}
          className="border-t border-slate-700 py-3 mt-2">
          <View className="flex-row justify-between">
            <Text className="text-white font-semibold flex-1">{name}</Text>
            <Text className="text-green-300 font-bold">{points} pts</Text>
          </View>
          <Text className="text-slate-400 text-sm mt-1">{detail}</Text>
        </View>)}
        <TouchableOpacity accessibilityRole="button" onPress={openSource}
          className="border border-green-700 rounded-xl p-4 mt-4">
          <Text className="text-green-300 text-center font-bold">Inspect the open-source repository ↗</Text>
        </TouchableOpacity>
        <Text className="text-slate-400 text-xs mt-4 leading-5">
          Participation, judging, prizes and submission dates are NOT open yet.
          A verified public announcement must name the independent judges and submission rules.
        </Text>
      </View>
    </ScrollView>
  );
}
