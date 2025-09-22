import L from 'leaflet';
import { RegionConfigs, ResourceDatabase, Resource, ResourceStatus, OperationType, ResourceType } from '../types/types';
import { markers, markerCluster, map, useCluster, addResourceMarker, clearMarkers, setMapView } from './map';
import { resourceDatabase } from '../data/resources';
import { regionConfigs } from '../data/regions';

// Global state
let currentRegion: string = 'south-africa';
let currentResource: string = 'all';

// Initialize resource databases
export function initializeResourceDatabases(): void {
    populateRegionSelector();
    populateResourceSelector();
    loadResources();
    updateStatistics();
}

// Populate region selector
function populateRegionSelector(): void {
    const selector = document.getElementById('regionSelector') as HTMLSelectElement;
    if (!selector) return;

    // Clear existing options
    selector.innerHTML = '';

    // Add regions
    Object.entries(regionConfigs).forEach(([key, config]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = config.name;
        selector.appendChild(option);
    });

    // Add custom region option
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom Area';
    selector.appendChild(customOption);

    // Set default value
    selector.value = currentRegion;
}

// Populate resource selector
function populateResourceSelector(): void {
    const selector = document.getElementById('resourceSelector') as HTMLSelectElement;
    if (!selector) return;

    // Clear existing options
    selector.innerHTML = '';

    // Add "All Resources" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Resources';
    selector.appendChild(allOption);

    // Add resource types
    Object.values(ResourceType).forEach(resource => {
        if (resource !== ResourceType.All) {
            const option = document.createElement('option');
            option.value = resource;
            option.textContent = resource.charAt(0).toUpperCase() + resource.slice(1).replace('-', ' ');
            selector.appendChild(option);
        }
    });

    // Set default value
    selector.value = currentResource;
}

// Load resources for current region and resource type
export function loadResources(): void {
    clearMarkers();

    if (currentRegion === 'custom') {
        // Custom region handling is done through map drawing
        return;
    }

    const resources = getFilteredResources();
    
    resources.forEach(resource => {
        addResourceMarker(resource);
    });

    // Update resource list
    populateResourceList(resources);
    updateStatistics();

    // Set map view to region
    const config = regionConfigs[currentRegion];
    if (config) {
        setMapView(config);
    }
}

// Get filtered resources based on current selections
function getFilteredResources(): Resource[] {
    let resources: Resource[] = [];

    if (currentResource === 'all') {
        // Get all resources for the region
        Object.keys(resourceDatabase).forEach(resourceType => {
            const regionData = resourceDatabase[resourceType][currentRegion];
            if (regionData) {
                resources = resources.concat(regionData);
            }
        });
    } else {
        // Get specific resource type for the region
        const regionData = resourceDatabase[currentResource]?.[currentRegion];
        if (regionData) {
            resources = regionData;
        }
    }

    return resources;
}

// Populate resource list in UI
export function populateResourceList(resources: Resource[]): void {
    const container = document.getElementById('resourceList');
    if (!container) return;

    container.innerHTML = '';

    if (resources.length === 0) {
        container.innerHTML = '<p class="no-resources">No resources found for the selected criteria.</p>';
        return;
    }

    resources.forEach(resource => {
        const resourceItem = createResourceListItem(resource);
        container.appendChild(resourceItem);
    });
}

// Create resource list item
function createResourceListItem(resource: Resource): HTMLElement {
    const item = document.createElement('div');
    item.className = 'resource-item';
    item.innerHTML = `
        <div class="resource-header">
            <h4>${resource.name}</h4>
            <span class="status status-${resource.status}">${resource.status}</span>
        </div>
        <div class="resource-details">
            <p><strong>Owner:</strong> ${resource.owner}</p>
            <p><strong>Type:</strong> ${resource.type}</p>
            <p><strong>Production:</strong> ${resource.production}</p>
            <p><strong>Reserves:</strong> ${resource.reserves}</p>
        </div>
        <div class="resource-actions">
            <button onclick="focusOnResource('${resource.name}')" class="btn-focus">Focus on Map</button>
            <button onclick="showResourceDetails('${resource.name}')" class="btn-details">View Details</button>
        </div>
    `;

    return item;
}

// Focus on resource on map
export function focusOnResource(resourceName: string): void {
    const resource = findResourceByName(resourceName);
    if (resource) {
        map.setView([resource.lat, resource.lng], 12);
        
        // Find and open the marker popup
        const marker = markers.find(m => {
            const popup = m.getPopup();
            const content = popup ? popup.getContent() : null;
            if (typeof content === 'string') {
                return content.includes(resourceName);
            }
            return false;
        });
        
        if (marker) {
            marker.openPopup();
        }
    }
}

// Show resource details in modal/panel
export function showResourceDetails(resourceName: string): void {
    const resource = findResourceByName(resourceName);
    if (!resource) return;

    const modal = document.getElementById('resourceModal');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalContent) {
        modalContent.innerHTML = `
            <div class="resource-detail-content">
                <h2>${resource.name}</h2>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Owner:</label>
                        <span>${resource.owner}</span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="status status-${resource.status}">${resource.status}</span>
                    </div>
                    <div class="detail-item">
                        <label>Operation Type:</label>
                        <span>${resource.type}</span>
                    </div>
                    <div class="detail-item">
                        <label>Production:</label>
                        <span>${resource.production}</span>
                    </div>
                    <div class="detail-item">
                        <label>Reserves:</label>
                        <span>${resource.reserves}</span>
                    </div>
                    <div class="detail-item">
                        <label>Location:</label>
                        <span>${resource.lat.toFixed(4)}, ${resource.lng.toFixed(4)}</span>
                    </div>
                    ${resource.details ? `
                        ${resource.details.established ? `
                            <div class="detail-item">
                                <label>Established:</label>
                                <span>${resource.details.established}</span>
                            </div>
                        ` : ''}
                        ${resource.details.employees ? `
                            <div class="detail-item">
                                <label>Employees:</label>
                                <span>${resource.details.employees.toLocaleString()}</span>
                            </div>
                        ` : ''}
                        ${resource.details.lifespan ? `
                            <div class="detail-item">
                                <label>Expected Lifespan:</label>
                                <span>${resource.details.lifespan}</span>
                            </div>
                        ` : ''}
                        ${resource.details.grade ? `
                            <div class="detail-item">
                                <label>Grade:</label>
                                <span>${resource.details.grade}</span>
                            </div>
                        ` : ''}
                        ${resource.details.processingMethod ? `
                            <div class="detail-item">
                                <label>Processing Method:</label>
                                <span>${resource.details.processingMethod}</span>
                            </div>
                        ` : ''}
                    ` : ''}
                </div>
                <div class="modal-actions">
                    <button onclick="focusOnResource('${resource.name}')" class="btn-focus">Focus on Map</button>
                    <button onclick="closeModal()" class="btn-close">Close</button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

// Find resource by name
function findResourceByName(name: string): Resource | undefined {
    for (const resourceType of Object.keys(resourceDatabase)) {
        for (const region of Object.keys(resourceDatabase[resourceType])) {
            const resource = resourceDatabase[resourceType][region].find(r => r.name === name);
            if (resource) {
                return resource;
            }
        }
    }
    return undefined;
}

// Update statistics display
function updateStatistics(): void {
    const resources = getFilteredResources();
    
    const total = resources.length;
    const active = resources.filter(r => r.status === ResourceStatus.Active).length;
    const inactive = resources.filter(r => r.status === ResourceStatus.Inactive).length;
    const exploration = resources.filter(r => r.status === ResourceStatus.Exploration).length;

    // Update statistics in UI
    updateStatElement('totalResources', total.toString());
    updateStatElement('activeResources', active.toString());
    updateStatElement('inactiveResources', inactive.toString());
    updateStatElement('explorationResources', exploration.toString());

    // Update region info
    const regionInfo = regionConfigs[currentRegion];
    if (regionInfo) {
        updateStatElement('regionName', regionInfo.name);
        updateStatElement('regionDescription', regionInfo.description);
    }
}

// Update statistics element
function updateStatElement(id: string, value: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Getters for current state
export function getCurrentRegion(): string {
    return currentRegion;
}

export function getCurrentResource(): string {
    return currentResource;
}

// Setters for current state
export function setCurrentRegion(region: string): void {
    currentRegion = region;
}

export function setCurrentResource(resource: string): void {
    currentResource = resource;
}

// Export data and configs
export { regionConfigs, resourceDatabase };

// Global functions for UI
declare global {
    interface Window {
        focusOnResource: (resourceName: string) => void;
        showResourceDetails: (resourceName: string) => void;
        closeModal: () => void;
    }
}

window.focusOnResource = focusOnResource;
window.showResourceDetails = showResourceDetails;
window.closeModal = () => {
    const modal = document.getElementById('resourceModal');
    if (modal) {
        modal.style.display = 'none';
    }
};