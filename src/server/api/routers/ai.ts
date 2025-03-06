import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
// import books from "../../../json/books.json" assert { type: "json" };

// type Unit = {
//   vocabulary: string;
//   grammar: string;
//   examples: string;
//   language_in_use: string;
// }

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  organization: process.env.OPEN_AI_ORGANIZATION as string,
});

type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

const messages: Message[] = [];

const generateWithAI = async (messages: Message[], aiProvider: string): Promise<string | null> => {
  if (aiProvider === 'gemini') {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert messages to Gemini format
    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages.at(-1);
    if (!lastMessage) throw new Error("No messages to send");
    const result = await chat.sendMessage(lastMessage.content);
    console.log(result.response.text());
    return result.response.text();
  } else {
    // Existing OpenAI implementation
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    return completion.choices[0]?.message?.content ?? null;
  }
};

export const aiRouter = createTRPCRouter({
  generateText: publicProcedure
    .input(z.object({
      name: z.string(),
      note: z.string(),
      behaviour: z.string(),
      grammar: z.string(),
      unitData: z.object({
        vocabulary: z.string(),
        grammar: z.string(),
        examples: z.string(),
        language_in_use: z.string(),
      }),
      length: z.number(),
      promptIndex: z.number(),
      aiProvider: z.string(),
      level: z.enum(["Simple", "Intermediate", "Advanced"]),
    }))
    .output(z.object({ generatedText: z.string() }))
    .mutation(async ({ input }) => {
      const { name, note, behaviour, grammar, unitData, length, promptIndex, aiProvider, level } = input;

      const complexityInstructions = {
        Simple: "Use simple vocabulary (A2 level) clear sentences. Avoid complex grammatical structures.",
        Intermediate: "Include descriptive feedback with varied vocabulary (B1 level). Use compound sentences and transitional phrases.",
        Advanced: "Employ academic phrasing (C1 level) with constructive criticism. Use complex sentence structures and precise terminology."
      };

      const guidedPrompts = [
        `Give 2 differently worded options as a response labelled Option 1 and Option 2:
        You are an ESL teachers assistant. Please write a short ${length} word comment about the student: ${name}
        Language level: ${complexityInstructions[level]}
        Reference the following factors to construct your comment. And keep in mind the target language for the unit is ${unitData.language_in_use}.
        The content of the unit: ${unitData.vocabulary}
        The grammar: They ${grammar} with the grammar on ${unitData.grammar}
        Comment on there class behaviour, use synonyms for: ${behaviour} (use synonyms)
        Include the following: ${note}
        End with an encouraging message
        Language Complexity: ${complexityInstructions[level]}
        respond as string with no **`,

        `Generate two distinct comments labeled Option 1 and Option 2:
        As an ESL teacher's assistant, compose a concise ${length}-word comment about ${name},
        Language complexity level: ${complexityInstructions[level]}

        Do not use any of the following words: Understanding, Work, Great, Good, Excellent, grasp, Participates
        Incorporate the following aspects while maintaining the target language focus on ${unitData.language_in_use}.
        - Vocabulary covered: ${unitData.vocabulary}
        - Grammar usage: They ${grammar} with ${unitData.grammar} (grammar performance)
        - Classroom engagement: Replace ${behaviour} with synonyms to describe their interaction
        - Additional observations: ${note}
        Conclude with an uplifting message.
        Output the response as a string with no **.`,

        `Provide two uniquely worded comments labeled Option 1 and Option 2:
        You are an ESL teacher's assistant. Write a brief ${length}-word comment about ${name}.
        Language proficiency adjustments: ${complexityInstructions[level]}
        Use the following details to shape your response, ensuring that the target language for the unit is ${unitData.language_in_use}.
        Focus on the teachers note over other information if the note is not empty.
        - Unit content: ${unitData.vocabulary}
        - Grammar: The student ${grammar} with ${unitData.grammar} (grammar performance)
        - Class behavior: Use synonyms for ${behaviour} to describe their participation
        - Teachers note: ${note}
        Finish with a motivating remark.
        Return the response as a plain string without **.`,
      ];

      const guidedComment = guidedPrompts[promptIndex];

      messages.push({
        role: "user",
        content: guidedComment || "",
      });

      try {
        const generatedData = await generateWithAI(messages, aiProvider);

        if (!generatedData) {
          throw new Error("Failed to generate text");
        }

        return {
          generatedText: generatedData
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unknown error",
        });
      }
    }),

  reset: publicProcedure.mutation(() => {
    messages.length = 0;
  }),
});