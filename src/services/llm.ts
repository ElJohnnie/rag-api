import { InferenceClient } from "@huggingface/inference";
import type { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { SimpleChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseMessage } from "@langchain/core/messages";
import { AIMessageChunk } from "@langchain/core/messages";
import { ChatGenerationChunk } from "@langchain/core/outputs";
import { config } from "../config.js";

if (!config.llm.apiKey) {
  throw new Error(
    "HUGGING_FACE_API_KEY não definido. Gere um token gratuito em https://huggingface.co/settings/tokens",
  );
}

type HFRole = "system" | "user" | "assistant";

// Mapeia mensagens do LangChain para o formato chat da HuggingFace.
function toHFMessages(messages: BaseMessage[]): { role: HFRole; content: string }[] {
  return messages.map((message) => {
    const type = message.type;
    const role: HFRole = type === "system" ? "system" : type === "ai" ? "assistant" : "user";
    return {
      role,
      content: typeof message.content === "string" ? message.content : message.text,
    };
  });
}

// Chat model sobre a HuggingFace Inference API (free tier), usando a tarefa
// chat completion (conversational) — compatível com modelos instruct como o Mistral.
class HuggingFaceChat extends SimpleChatModel {
  private client = new InferenceClient(config.llm.apiKey);

  _llmType(): string {
    return "huggingface-chat";
  }

  async _call(messages: BaseMessage[]): Promise<string> {
    const response = await this.client.chatCompletion({
      model: config.llm.model,
      messages: toHFMessages(messages),
      temperature: config.llm.temperature,
      max_tokens: config.llm.maxTokens,
    });
    return response.choices[0]?.message?.content ?? "";
  }

  async *_streamResponseChunks(
    messages: BaseMessage[],
    _options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun,
  ): AsyncGenerator<ChatGenerationChunk> {
    const stream = this.client.chatCompletionStream({
      model: config.llm.model,
      messages: toHFMessages(messages),
      temperature: config.llm.temperature,
      max_tokens: config.llm.maxTokens,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? "";
      if (!token) continue;
      await runManager?.handleLLMNewToken(token);
      yield new ChatGenerationChunk({
        message: new AIMessageChunk(token),
        text: token,
      });
    }
  }
}

export const llm = new HuggingFaceChat({});
