import { env } from "@/lib/env";

type GenerateInput = {
  prompt: string;
  context?: string;
};

export type AIProvider = {
  generate(input: GenerateInput): Promise<string>;
};

class MockCommercialProvider implements AIProvider {
  async generate(input: GenerateInput) {
    const contextBlock = input.context ? `Contexto: ${input.context}\n\n` : "";

    return `${contextBlock}Mensagem sugerida:\n\n${input.prompt}\n\nVersao profissional:\nOi! Estruturei uma recomendacao objetiva, elegante e orientada a resultado. Podemos seguir com a sugestao, alinhar os proximos passos e definir um cronograma de execucao ainda esta semana.`;
  }
}

class OpenAICompatibleProvider implements AIProvider {
  async generate(input: GenerateInput) {
    if (!env.aiApiKey) {
      throw new Error("AI_API_KEY nao configurada para o provider real.");
    }

    const response = await fetch(`${env.aiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.aiApiKey}`,
      },
      body: JSON.stringify({
        model: env.aiModel,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "Voce e um assistente comercial premium para uma agencia de trafego pago. Escreva de forma clara, profissional, objetiva e orientada a proximo passo.",
          },
          {
            role: "user",
            content: `${input.context ? `Contexto: ${input.context}\n\n` : ""}${input.prompt}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Falha no provider de IA: ${response.status} ${body}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    return data.choices?.[0]?.message?.content?.trim() || "Nao foi possivel gerar uma resposta.";
  }
}

export function getAIProvider(): AIProvider {
  switch (env.aiProvider) {
    case "openai":
    case "openai_compatible":
      return new OpenAICompatibleProvider();
    case "mock":
    default:
      return new MockCommercialProvider();
  }
}
