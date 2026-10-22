import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIFacilitatorScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "I am your AI Facilitator.\n\nI help Study Circles stay productive offline. I can:\n• Suggest discussion questions grounded in your course materials\n• Check understanding\n• Help structure peer explanations\n• Guide micro-assessments\n\nAsk me how to run a better study session or generate questions for your circle.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    // Simple facilitator responses (will later use real RAG)
    const lower = userMsg.content.toLowerCase();
    let reply =
      "I can help your Study Circle go deeper. Try asking me to generate 3 discussion questions on a specific topic from your course, or ask how to structure a peer teaching session.";

    if (lower.includes("question") || lower.includes("discuss")) {
      reply =
        "Here are three strong discussion questions you can use in your Study Circle (grounded in typical open university materials):\n\n1. What is the most important practical implication of this concept for a Nigerian student?\n2. Where do you see this idea working differently in our local context compared to the textbook example?\n3. How would you explain this concept to a classmate who missed the last session?\n\nAssign one question to each member and reconvene offline.";
    } else if (lower.includes("peer") || lower.includes("teach") || lower.includes("explain")) {
      reply =
        "Peer teaching works best when structured:\n\n1. One student prepares a 5-minute explanation.\n2. Others ask clarifying questions only.\n3. The explainer then answers.\n4. Group votes on clarity (1–5).\n5. Record one key insight for the circle log.\n\nThis creates accountability without needing internet.";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
      },
    ]);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-900"
    >
      <View className="px-4 py-2 bg-slate-800 border-b border-slate-700">
        <Text className="text-xs text-slate-400">AI Facilitator • Works fully offline</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View
            className={`mb-4 max-w-[88%] ${
              item.role === "user" ? "self-end" : "self-start"
            }`}
          >
            <View
              className={`rounded-2xl px-4 py-3 ${
                item.role === "user"
                  ? "bg-green-600"
                  : "bg-slate-800 border border-slate-700"
              }`}
            >
              <Text className="text-white leading-5">{item.content}</Text>
            </View>
          </View>
        )}
      />

      <View className="flex-row items-center p-3 border-t border-slate-800 bg-slate-900">
        <TextInput
          className="flex-1 bg-slate-800 text-white rounded-full px-4 py-3 mr-2"
          placeholder="Ask the Facilitator..."
          placeholderTextColor="#64748B"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading || !input.trim()}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            loading || !input.trim() ? "bg-slate-700" : "bg-green-600"
          }`}
        >
          <Text className="text-white text-lg font-bold">{loading ? "…" : "↑"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
