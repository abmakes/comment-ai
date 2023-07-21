import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { OpenAIApi, Configuration } from "openai";
import books from "../../../json/books.json" assert { type: "json" };

type Unit = {
  vocabulary: string;
  grammar: string;
  examples: string;
  language_in_use: string;
}

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
    .input(z.object({
      name: z.string(), 
      behaviour: z.string(), 
      grammar: z.string(), 
      note: z.string(),
      unitData: z.object({
        vocabulary: z.string(),
        grammar: z.string(),
        examples: z.string(),
        language_in_use: z.string(),
        }),
      }))
    .mutation(async ({ input }) => {
      const { name, behaviour, grammar, note, unitData } = input;
      
      const guidedComment = `
        Give 2 differently worded options as a response:
        
        You are an ESL teachers assistant. Please write a short 50 to 60 word comment about the student: ${name}
        Reference the following factors to construct your comment. 

        The content of the unit: ${unitData.vocabulary}
        The grammar: They ${grammar} with the grammar on ${unitData.grammar}
        Comment on there class behaviour: ${behaviour}
        Include the following: ${note}
        End with an encouraging message
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