export async function classifyOpenAI(imageUrl: string, prior: string) {
  return { top_label: 'openai-test', confidence: 0.9, alt: [], tags: [], attributes: {} };
}

export async function classifyAzureOpenAI(imageUrl: string, prior: string) {
  return { top_label: 'azure-openai-test', confidence: 0.9, alt: [], tags: [], attributes: {} };
}

export async function classifyAzureVision(imageUrl: string, prior: string) {
  return { top_label: 'azure-vision-test', confidence: 0.9, alt: [], tags: [], attributes: {} };
}
