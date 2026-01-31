import {
    CopilotRuntime,
    GoogleGenerativeAIAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

const runtime = new CopilotRuntime();

export const POST = async (req: Request) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
        runtime,
        serviceAdapter: new GoogleGenerativeAIAdapter({
            model: "gemini-1.5-flash",
        }),
        endpoint: "/api/copilotkit",
    });

    return handleRequest(req);
};
