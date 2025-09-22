import { loadStyles } from './utils';
import { initMap } from './map';
import { initializeResourceDatabases, setCurrentRegion, setCurrentResource, loadResources } from './resources';
import { initAIAssistant, sendMessage } from './ai-assistant';

// Import CSS files for webpack bundling
import '../css/main.css';
import '../css/map.css';
import '../css/components.css';

// Initialize styles
loadStyles();

// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the resource database
    initializeResourceDatabases();
    
    // Initialize the map
    initMap();
    
    // Initialize AI assistant
    initAIAssistant();
    
    // Show loading animation
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.add('active');
        setTimeout(() => {
            loadingElement.classList.remove('active');
        }, 1500);
    }
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize UI components
    initUIComponents();
});

// Initialize all event listeners
function initEventListeners(): void {
    const regionSelector = document.getElementById('regionSelector') as HTMLSelectElement;
    const resourceSelector = document.getElementById('resourceSelector') as HTMLSelectElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const statusFilter = document.getElementById('statusFilter') as HTMLSelectElement;
    const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement;
    const sendButton = document.getElementById('sendButton') as HTMLButtonElement;
    
    if (regionSelector) {
        regionSelector.addEventListener('change', handleRegionChange);
    }

    if (resourceSelector) {
        resourceSelector.addEventListener('change', handleResourceChange);
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', handleStatusFilter);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', handleChatKeypress);
    }
    
    if (sendButton) {
        sendButton.addEventListener('click', () => sendMessage());
    }
}

// Initialize UI components
function initUIComponents(): void {
    // Initialize tabs
    initTabs();
    
    // Initialize modals
    initModals();
    
    // Initialize tooltips and help
    initTooltips();
}

// Initialize tab functionality
function initTabs(): void {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            if (tabContents[index]) {
                tabContents[index].classList.add('active');
            }
        });
    });
}

// Initialize modal functionality
function initModals(): void {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        const overlay = modal.querySelector('.modal-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                (modal as HTMLElement).style.display = 'none';
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                (modal as HTMLElement).style.display = 'none';
            });
        }
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                (modal as HTMLElement).style.display = 'none';
            });
        }
    });
}

// Initialize tooltips
function initTooltips(): void {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(e: Event): void {
    const element = e.target as HTMLElement;
    const tooltipText = element.getAttribute('data-tooltip');
    
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.id = 'active-tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
}

// Hide tooltip
function hideTooltip(): void {
    const tooltip = document.getElementById('active-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Event handler for region selector change
function handleRegionChange(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const currentRegion = target.value;
    
    setCurrentRegion(currentRegion);

    if (currentRegion === 'custom') {
        import('./map').then(({ map, drawControl, addMessage }) => {
            map.addControl(drawControl);
            addMessage('Custom area mode activated. Please draw your area of interest on the map.', 'ai');
        });
    } else {
        import('./map').then(({ map, drawControl }) => {
            // Check if control is already added to avoid errors
            try {
                map.removeControl(drawControl);
            } catch (e) {
                // Control might not be added yet, ignore error
            }
        });
        loadResources();
    }
}

// Event handler for resource selector change
function handleResourceChange(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const currentResource = target.value.replace(/[^\w-]/g, '');
    
    setCurrentResource(currentResource);
    loadResources();
}

// Event handler for search input
function handleSearchInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const query = target.value.toLowerCase();
    
    import('./resources').then(({ getCurrentResource, getCurrentRegion, resourceDatabase, populateResourceList }) => {
        const currentResource = getCurrentResource();
        const currentRegion = getCurrentRegion();
        
        let allResources: any[] = [];
        
        if (currentResource === 'all') {
            Object.keys(resourceDatabase).forEach(resourceType => {
                const regionData = resourceDatabase[resourceType][currentRegion];
                if (regionData) {
                    allResources = allResources.concat(regionData);
                }
            });
        } else {
            allResources = resourceDatabase[currentResource]?.[currentRegion] || [];
        }
        
        const filtered = allResources.filter(r => 
            r.name.toLowerCase().includes(query) || 
            r.owner.toLowerCase().includes(query)
        );
                      
        populateResourceList(filtered);
    });
}

// Event handler for status filter change
function handleStatusFilter(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const status = target.value;
    
    import('./resources').then(({ getCurrentResource, getCurrentRegion, resourceDatabase, populateResourceList }) => {
        const currentResource = getCurrentResource();
        const currentRegion = getCurrentRegion();
        
        let allResources: any[] = [];
        
        if (currentResource === 'all') {
            Object.keys(resourceDatabase).forEach(resourceType => {
                const regionData = resourceDatabase[resourceType][currentRegion];
                if (regionData) {
                    allResources = allResources.concat(regionData);
                }
            });
        } else {
            allResources = resourceDatabase[currentResource]?.[currentRegion] || [];
        }
        
        const filtered = allResources.filter(r => !status || r.status === status);
            
        populateResourceList(filtered);
    });
}

// Event handler for chat keypress
function handleChatKeypress(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Tab switching
export function switchTab(tab: string): void {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    const tabIndex = tab === 'explore' ? 0 : tab === 'ai' ? 1 : 2;
    const clickedBtn = tabBtns[tabIndex];
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
    
    const targetTab = document.getElementById(`${tab}Tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// Toggle sidebar
export function toggleSidebar(): void {
    const sidebar = document.querySelector('.sidebar');
    const mapContainer = document.querySelector('.map-container');
    
    if (sidebar && mapContainer) {
        sidebar.classList.toggle('collapsed');
        mapContainer.classList.toggle('expanded');
        
        // Trigger map resize after animation
        setTimeout(() => {
            import('./map').then(({ map }) => {
                map.invalidateSize();
            });
        }, 300);
    }
}

// Show loading state
export function showLoading(show: boolean = true): void {
    const loading = document.getElementById('loading');
    if (loading) {
        if (show) {
            loading.classList.add('active');
        } else {
            loading.classList.remove('active');
        }
    }
}

// Show notification
export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Handle application errors
function handleError(error: Error): void {
    console.error('Application Error:', error);
    showNotification('An error occurred. Please try again.', 'error');
}

// Global error handler
window.addEventListener('error', (e) => {
    handleError(e.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    handleError(new Error(e.reason));
});

// Export functions for global access
declare global {
    interface Window {
        app: {
            switchTab: (tab: string) => void;
            toggleSidebar: () => void;
            showLoading: (show?: boolean) => void;
            showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
        };
    }
}

// Expose functions globally
window.app = {
    switchTab,
    toggleSidebar,
    showLoading,
    showNotification
};