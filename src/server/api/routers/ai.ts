import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { OpenAIApi, Configuration } from "openai";


const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

const messages: Message[] = [];

export const aiRouter = createTRPCRouter({
  generateText: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const { prompt } = input;
      const performance = "working hard and learning quickly"
      const topic = "comparative pronouns"

      const guidedComment = `
        You are an ESL teachers assistant. Please write a 60 word comment about the student: ${prompt}
        Reference the content of the unit: ${topic}
        Comment on there performance: ${performance}
        Give 3 options
      `

      messages.push({
        role: "user",
        content: guidedComment,
      });
    
      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages,
        })

        const generatedData = completion.data.choices[0]?.message?.content

        console.log(generatedData)

        if (!completion) {
          throw new Error("Failed to generate text");
        }

        // const generatedText = data.choices[0]?.text;

        // if (generatedText) {
        //   messages.push({
        //     role: "assistant",
        //     content: generatedText,
        //   });
        // }

        return {
          generatedText: generatedData
          // generatedText: generatedText ?? "<no text generated>",
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