import { getCurrentRegion, getCurrentResource, regionConfigs, resourceDatabase } from './resources';
import { ResourceType, ResourceStatus } from '../types/types';

// AI Chat functionality
export function sendMessage(): void {
    const input = document.getElementById('chatInput') as HTMLTextAreaElement;
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    input.value = '';

    // Process message and generate AI response
    setTimeout(() => {
        const response = processAIQuery(message);
        addMessageToChat(response, 'ai');
    }, 1000);
}

// Process AI query and generate response
function processAIQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    // Resource information queries
    if (lowerQuery.includes('production') || lowerQuery.includes('how much')) {
        return handleProductionQuery(lowerQuery);
    }
    
    if (lowerQuery.includes('reserves') || lowerQuery.includes('how many')) {
        return handleReservesQuery(lowerQuery);
    }
    
    if (lowerQuery.includes('active') || lowerQuery.includes('operating')) {
        return handleActiveResourcesQuery(lowerQuery);
    }
    
    if (lowerQuery.includes('owner') || lowerQuery.includes('company')) {
        return handleOwnershipQuery(lowerQuery);
    }
    
    if (lowerQuery.includes('where') || lowerQuery.includes('location')) {
        return handleLocationQuery(lowerQuery);
    }
    
    if (lowerQuery.includes('best') || lowerQuery.includes('largest') || lowerQuery.includes('biggest')) {
        return handleBestResourcesQuery(lowerQuery);
    }
    
    if (lowerQuery.includes('comparison') || lowerQuery.includes('compare')) {
        return handleComparisonQuery(lowerQuery);
    }
    
    // Region-specific queries
    if (lowerQuery.includes('region') || lowerQuery.includes('country')) {
        return handleRegionQuery(lowerQuery);
    }
    
    // Status queries
    if (lowerQuery.includes('closed') || lowerQuery.includes('inactive')) {
        return handleStatusQuery(lowerQuery);
    }
    
    // Help and general queries
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
        return getHelpMessage();
    }
    
    // Default response for unrecognized queries
    return generateDefaultResponse(query);
}

// Handle production-related queries
function handleProductionQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    const currentResourceType = getCurrentResource();
    
    if (currentResourceType === 'all') {
        const regionConfig = regionConfigs[currentRegion];
        if (regionConfig && regionConfig.totalProduction) {
            let response = `Current production in ${regionConfig.name}:\n\n`;
            Object.entries(regionConfig.totalProduction).forEach(([resource, production]) => {
                response += `• ${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${production}\n`;
            });
            return response;
        }
    } else {
        const resources = resourceDatabase[currentResourceType]?.[currentRegion] || [];
        if (resources.length > 0) {
            let totalProduction = 0;
            let response = `${currentResourceType} production in ${regionConfigs[currentRegion].name}:\n\n`;
            
            resources.forEach(resource => {
                if (resource.status === ResourceStatus.Active) {
                    response += `• ${resource.name}: ${resource.production}\n`;
                }
            });
            
            return response;
        }
    }
    
    return `I don't have specific production data for ${currentResourceType} in ${regionConfigs[currentRegion].name}. Try selecting a different region or resource type.`;
}

// Handle reserves-related queries
function handleReservesQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    const currentResourceType = getCurrentResource();
    
    if (currentResourceType !== 'all') {
        const resources = resourceDatabase[currentResourceType]?.[currentRegion] || [];
        if (resources.length > 0) {
            let response = `${currentResourceType} reserves in ${regionConfigs[currentRegion].name}:\n\n`;
            
            resources.forEach(resource => {
                response += `• ${resource.name}: ${resource.reserves}\n`;
            });
            
            return response;
        }
    }
    
    return `Please select a specific resource type to view reserve information for ${regionConfigs[currentRegion].name}.`;
}

// Handle active resources queries
function handleActiveResourcesQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    const currentResourceType = getCurrentResource();
    
    let resources: any[] = [];
    
    if (currentResourceType === 'all') {
        Object.keys(resourceDatabase).forEach(resourceType => {
            const regionData = resourceDatabase[resourceType][currentRegion];
            if (regionData) {
                resources = resources.concat(regionData.filter(r => r.status === ResourceStatus.Active));
            }
        });
    } else {
        const regionData = resourceDatabase[currentResourceType]?.[currentRegion] || [];
        resources = regionData.filter(r => r.status === ResourceStatus.Active);
    }
    
    if (resources.length > 0) {
        let response = `Active mining operations in ${regionConfigs[currentRegion].name}:\n\n`;
        resources.forEach(resource => {
            response += `• ${resource.name} - ${resource.owner}\n`;
        });
        return response;
    }
    
    return `No active mining operations found for the current selection in ${regionConfigs[currentRegion].name}.`;
}

// Handle ownership queries
function handleOwnershipQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    const currentResourceType = getCurrentResource();
    
    let resources: any[] = [];
    
    if (currentResourceType === 'all') {
        Object.keys(resourceDatabase).forEach(resourceType => {
            const regionData = resourceDatabase[resourceType][currentRegion];
            if (regionData) {
                resources = resources.concat(regionData);
            }
        });
    } else {
        resources = resourceDatabase[currentResourceType]?.[currentRegion] || [];
    }
    
    if (resources.length > 0) {
        const owners = new Map<string, number>();
        resources.forEach(resource => {
            owners.set(resource.owner, (owners.get(resource.owner) || 0) + 1);
        });
        
        let response = `Major mining companies in ${regionConfigs[currentRegion].name}:\n\n`;
        Array.from(owners.entries())
            .sort((a, b) => b[1] - a[1])
            .forEach(([owner, count]) => {
                response += `• ${owner}: ${count} operation${count > 1 ? 's' : ''}\n`;
            });
        
        return response;
    }
    
    return `No ownership data available for the current selection.`;
}

// Handle location queries
function handleLocationQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    const regionConfig = regionConfigs[currentRegion];
    
    if (regionConfig) {
        return `You are currently viewing ${regionConfig.name}. ${regionConfig.description} The map is centered at coordinates ${regionConfig.center[0]}, ${regionConfig.center[1]}.`;
    }
    
    return `Location information not available for the current region.`;
}

// Handle best/largest resources queries
function handleBestResourcesQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    const currentResourceType = getCurrentResource();
    
    if (currentResourceType !== 'all') {
        const resources = resourceDatabase[currentResourceType]?.[currentRegion] || [];
        if (resources.length > 0) {
            // Sort by production (simplified - would need better parsing in real implementation)
            const sortedResources = [...resources].sort((a, b) => {
                // This is a simplified comparison - in practice, you'd need to parse the production strings
                return b.name.localeCompare(a.name);
            });
            
            let response = `Top ${currentResourceType} operations in ${regionConfigs[currentRegion].name}:\n\n`;
            sortedResources.slice(0, 3).forEach((resource, index) => {
                response += `${index + 1}. ${resource.name} - ${resource.production}\n`;
            });
            
            return response;
        }
    }
    
    return `Please select a specific resource type to see the largest operations.`;
}

// Handle comparison queries
function handleComparisonQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    
    let response = `Resource comparison for ${regionConfigs[currentRegion].name}:\n\n`;
    
    Object.keys(resourceDatabase).forEach(resourceType => {
        const resources = resourceDatabase[resourceType][currentRegion];
        if (resources && resources.length > 0) {
            const activeCount = resources.filter(r => r.status === ResourceStatus.Active).length;
            response += `• ${resourceType}: ${resources.length} total (${activeCount} active)\n`;
        }
    });
    
    return response;
}

// Handle region queries
function handleRegionQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    const regionConfig = regionConfigs[currentRegion];
    
    if (regionConfig) {
        let response = `${regionConfig.name} Overview:\n\n`;
        response += `${regionConfig.description}\n\n`;
        
        if (regionConfig.totalProduction) {
            response += `Major resource production:\n`;
            Object.entries(regionConfig.totalProduction).forEach(([resource, production]) => {
                response += `• ${resource}: ${production}\n`;
            });
        }
        
        return response;
    }
    
    return `Region information not available.`;
}

// Handle status queries
function handleStatusQuery(query: string): string {
    const currentRegion = getCurrentRegion();
    const currentResourceType = getCurrentResource();
    
    let resources: any[] = [];
    
    if (currentResourceType === 'all') {
        Object.keys(resourceDatabase).forEach(resourceType => {
            const regionData = resourceDatabase[resourceType][currentRegion];
            if (regionData) {
                resources = resources.concat(regionData);
            }
        });
    } else {
        resources = resourceDatabase[currentResourceType]?.[currentRegion] || [];
    }
    
    const statusCounts: any = {
        [ResourceStatus.Active]: 0,
        [ResourceStatus.Inactive]: 0,
        [ResourceStatus.Closed]: 0,
        [ResourceStatus.Exploration]: 0
    };
    
    resources.forEach(resource => {
        statusCounts[resource.status]++;
    });
    
    let response = `Resource status in ${regionConfigs[currentRegion].name}:\n\n`;
    Object.entries(statusCounts).forEach(([status, count]) => {
        if ((count as number) > 0) {
            response += `• ${status}: ${count as number} operation${(count as number) > 1 ? 's' : ''}\n`;
        }
    });
    
    return response;
}

// Get help message
function getHelpMessage(): string {
    return `I'm your AI assistant for the GeoResource Explorer! I can help you with:

• Production information: "How much gold is produced in South Africa?"
• Reserve data: "What are the diamond reserves in this region?"
• Active operations: "Show me active mining operations"
• Company information: "Which companies operate here?"
• Location details: "Where am I looking at?"
• Comparisons: "Compare resources in this region"
• Status information: "How many mines are closed?"

You can also ask about specific resources like gold, diamonds, platinum, copper, lithium, coal, iron, and uranium.

Try asking me something about the current region and resource selection!`;
}

// Generate default response
function generateDefaultResponse(query: string): string {
    const responses = [
        "I'm not sure I understand that question. Could you try asking about production, reserves, or active operations?",
        "That's an interesting question! Try asking about specific resources or mining operations in the current region.",
        "I can help with mining and resource information. Ask me about production, reserves, companies, or locations!",
        "Could you rephrase that? I'm better with questions about mining operations, production data, or resource information."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Add message to chat interface
function addMessageToChat(message: string, sender: 'user' | 'ai'): void {
    const chatHistory = document.getElementById('chatHistory');
    if (!chatHistory) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = new Date().toLocaleTimeString();
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(timestamp);
    
    chatHistory.appendChild(messageDiv);
    
    // Scroll to bottom
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Initialize AI assistant
export function initAIAssistant(): void {
    // Add welcome message
    setTimeout(() => {
        addMessageToChat("Hello! I'm your AI assistant for the GeoResource Explorer. Ask me anything about mining operations, production data, or resources in the current region!", 'ai');
    }, 1000);
}