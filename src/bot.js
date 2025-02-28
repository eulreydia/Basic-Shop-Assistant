import OpenAI from 'openai';
import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'; dotenv.config();
import { consultarStock } from './functions.js';

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'Reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

const bot = new Telegraf(process.env.TELEGRAM_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const assistant_id = process.env.ASSISTANT_ID;

const userThreads = {};
/*
userThreads almacena el hilo de conversación de cada usuario.  
No es la solución más eficiente, pero para un caso básico es suficiente.  

Se puede almacenar el ID de Telegram del usuario junto con su thread en una nueva tabla de la base de datos.  
De esta manera, los datos se conservan incluso si el bot se reinicia.  

El comando `/start` reinicia el hilo de ese usuario, creando uno nuevo.  
Esto es útil porque, al finalizar una conversación con el asistente, los usuarios suelen borrar el chat.  

Si el usuario no borra el chat, no hay ningún problema, ya que OpenAI gestiona automáticamente los hilos.
*/

bot.start(async (ctx) => {
    try {
        const userId = ctx.from.id;
        userThreads[userId] = await openai.beta.threads.create();
        ctx.reply('¡Hola! Soy tu asistente virtual. Si necesitas cualquier cosa no dudes en decirme')
    } catch (error) {
        console.error('Error al iniciar conversacion', error);
    }
});

bot.on('text', async (ctx) => {
    try {
        const userId = ctx.from.id;
        const userMessage = ctx.message.text;
        userThreads[userId] ??= await openai.beta.threads.create();
        const thread = userThreads[userId];

        ctx.sendChatAction('typing');

        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: userMessage
        });

        let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant_id
        });

        if (run.status === 'requires_action') {
            run = await handleRequiresAction(run, thread.id);
        }

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(thread.id);
            const assistantResponse = messages.data.find(message => message.role === 'assistant');
            if (assistantResponse) {
                ctx.reply(assistantResponse.content[0]?.text.value || 'Me he quedado en blanco',
                    { parse_mode: 'Markdown'}
                );
            }
        }

    } catch (error) {
        console.error('Error en la ejecución:', error);
        await ctx.telegram.deleteMessage(ctx.chat.id, loadAnimation.message_id);
        ctx.reply('Ha ocurrido un error, te avisaré cuando se solucione');
    }

});

const handleRequiresAction = async (run, threadId) => {
    if (run.required_action?.submit_tool_outputs?.tool_calls) {
        const toolOutputs = await Promise.all(
            run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {
                if (tool.function.name === 'buscar_stock') {

                    const params = JSON.parse(tool.function.arguments);
                    const { prenda, talla, color } = params;

                    const stock = await consultarStock(prenda, talla, color);

                    return {
                        tool_call_id: tool.id,
                        output: JSON.stringify({ stock }),
                    };
                }
            })
        );

        const updatedRun = openai.beta.threads.runs.submitToolOutputsAndPoll(
            threadId,
            run.id,
            { tool_outputs: toolOutputs }
        );

        return updatedRun;
    }
};

bot.launch();
console.log('🟢 running ⊹╰(⌣ʟ⌣)╯⊹');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));