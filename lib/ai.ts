import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function observe(base64Image: string): Promise<string> {
    const chatCompletion = await client.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `You are a friendly and understanding AI assistant. You're funny, empathetic, and great at casual conversation. Analyze the image provided and respond to the user's message in a way that's relevant to what you see. Keep your responses natural and conversational, as if you're chatting with a friend.`
            },
            {
                role: 'user',
                content: [
                    { type: "text", text: "What’s in this image?" },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
                ]
            }
        ],
        model: 'gpt-4o-mini',
        max_tokens: 300
    });

    const response = chatCompletion.choices[0].message.content;

    console.log('AI Response:', response);

    return response || "I'm not sure what to say about that image. Could you tell me more about what you see?";
}