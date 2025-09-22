import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet.markercluster';
import 'leaflet.heat';

import { ResourceStatus, RegionConfig, Resource, CustomIconOptions } from '../types/types';

// Global map variables
export let map: L.Map;
export let markers: L.Marker[] = [];
export let markerCluster: L.MarkerClusterGroup;
export let drawControl: any; // Use any for draw control due to type issues
export let useCluster: boolean = true;

// Map initialization
export function initMap(): void {
    // Initialize map
    map = L.map('map', {
        center: [-28.5, 24.5],
        zoom: 6,
        zoomControl: true,
        attributionControl: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Initialize marker cluster
    markerCluster = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });

    // Initialize drawing controls
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    drawControl = new (L.Control as any).Draw({
        position: 'topright',
        draw: {
            polygon: true,
            rectangle: true,
            circle: true,
            marker: false,
            polyline: false,
            circlemarker: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });

    // Map event listeners
    map.on((L as any).Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        
        // Get resources within drawn area
        const bounds = layer.getBounds();
        filterResourcesByBounds(bounds);
    });

    // Initialize overlays
    initOverlays();
}

// Create custom icon for resources
export function createCustomIcon(options: CustomIconOptions): L.DivIcon {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin" style="background-color: ${options.color}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

// Get color for resource status
export function getStatusColor(status: ResourceStatus): string {
    switch (status) {
        case ResourceStatus.Active:
            return '#28a745';
        case ResourceStatus.Inactive:
            return '#ffc107';
        case ResourceStatus.Closed:
            return '#dc3545';
        case ResourceStatus.Exploration:
            return '#007bff';
        default:
            return '#6c757d';
    }
}

// Add resource marker to map
export function addResourceMarker(resource: Resource): L.Marker {
    const icon = createCustomIcon({
        color: getStatusColor(resource.status),
        className: 'custom-marker'
    });

    const marker = L.marker([resource.lat, resource.lng], { icon })
        .bindPopup(createPopupContent(resource));

    if (useCluster) {
        markerCluster.addLayer(marker);
    } else {
        marker.addTo(map);
    }

    markers.push(marker);
    return marker;
}

// Create popup content for resource
function createPopupContent(resource: Resource): string {
    return `
        <div class="resource-popup">
            <h3>${resource.name}</h3>
            <div class="popup-content">
                <p><strong>Owner:</strong> ${resource.owner}</p>
                <p><strong>Status:</strong> <span class="status status-${resource.status}">${resource.status}</span></p>
                <p><strong>Type:</strong> ${resource.type}</p>
                <p><strong>Production:</strong> ${resource.production}</p>
                <p><strong>Reserves:</strong> ${resource.reserves}</p>
                ${resource.details ? `
                    <div class="details">
                        ${resource.details.established ? `<p><strong>Established:</strong> ${resource.details.established}</p>` : ''}
                        ${resource.details.employees ? `<p><strong>Employees:</strong> ${resource.details.employees.toLocaleString()}</p>` : ''}
                        ${resource.details.lifespan ? `<p><strong>Lifespan:</strong> ${resource.details.lifespan}</p>` : ''}
                        ${resource.details.grade ? `<p><strong>Grade:</strong> ${resource.details.grade}</p>` : ''}
                    </div>
                ` : ''}
            </div>
            <button onclick="showResourceDetails('${resource.name}')" class="btn-details">View Details</button>
        </div>
    `;
}

// Clear all markers
export function clearMarkers(): void {
    markers.forEach(marker => {
        if (useCluster) {
            markerCluster.removeLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });
    markers = [];
}

// Toggle clustering
export function toggleClustering(): void {
    useCluster = !useCluster;
    
    if (useCluster) {
        // Move markers to cluster
        markers.forEach(marker => {
            map.removeLayer(marker);
            markerCluster.addLayer(marker);
        });
        map.addLayer(markerCluster);
    } else {
        // Remove from cluster and add to map
        map.removeLayer(markerCluster);
        markers.forEach(marker => {
            markerCluster.removeLayer(marker);
            marker.addTo(map);
        });
    }
}

// Filter resources by bounds
function filterResourcesByBounds(bounds: L.LatLngBounds): void {
    const filteredResources: Resource[] = [];
    
    markers.forEach(marker => {
        if (bounds.contains(marker.getLatLng())) {
            // Get resource data from marker (this would need to be stored in marker data)
            filteredResources.push(/* resource data */);
        }
    });
    
    // Update resource list with filtered results
    import('./resources').then(({ populateResourceList }) => {
        populateResourceList(filteredResources);
    });
}

// Initialize overlay layers
function initOverlays(): void {
    // Heat map layer
    const heatLayer = L.layerGroup();
    
    // Satellite layer
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    });

    // Topographic layer
    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
    });

    // Layer control
    const baseMaps = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        "Satellite": satelliteLayer,
        "Topographic": topoLayer
    };

    const overlayMaps = {
        "Resource Clusters": markerCluster,
        "Heat Map": heatLayer
    };

    L.control.layers(baseMaps, overlayMaps, {
        position: 'topright'
    }).addTo(map);

    // Add cluster layer by default
    map.addLayer(markerCluster);
}

// Add message to map (for AI assistant feedback)
export function addMessage(message: string, type: string): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = `map-message ${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.map-container');
    if (container) {
        container.appendChild(messageDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Set map view to region
export function setMapView(config: RegionConfig): void {
    map.setView(config.center, config.zoom);
}

// Global function for popup buttons
declare global {
    interface Window {
        showResourceDetails: (resourceName: string) => void;
    }
}

window.showResourceDetails = (resourceName: string) => {
    import('./resources').then(({ showResourceDetails }) => {
        showResourceDetails(resourceName);
    });
};