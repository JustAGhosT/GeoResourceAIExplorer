import { getCurrentRegion, getCurrentResource, resourceDatabase, regionConfigs } from './resources';
import { ResourceStatus, AnalyticsExport, StatisticsData } from '../types/types';
import { extractNumericValue, formatNumber } from './utils';

// Analytics and reporting functionality
export class Analytics {
    private static instance: Analytics;
    
    private constructor() {}
    
    public static getInstance(): Analytics {
        if (!Analytics.instance) {
            Analytics.instance = new Analytics();
        }
        return Analytics.instance;
    }
    
    // Generate comprehensive statistics
    public generateStatistics(): StatisticsData {
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
        
        const total = resources.length;
        const active = resources.filter(r => r.status === ResourceStatus.Active).length;
        
        // Calculate total reserves (simplified)
        const totalReserves = resources.reduce((sum, resource) => {
            return sum + extractNumericValue(resource.reserves);
        }, 0);
        
        // Calculate total production (simplified)
        const totalProduction = resources.reduce((sum, resource) => {
            if (resource.status === ResourceStatus.Active) {
                return sum + extractNumericValue(resource.production);
            }
            return sum;
        }, 0);
        
        return {
            total,
            active,
            reserves: totalReserves,
            production: formatNumber(totalProduction)
        };
    }
    
    // Generate analytics report
    public generateReport(): string {
        const currentRegion = getCurrentRegion();
        const currentResourceType = getCurrentResource();
        const stats = this.generateStatistics();
        const regionConfig = regionConfigs[currentRegion];
        
        let report = `# GeoResource Analytics Report\n\n`;
        report += `**Region:** ${regionConfig.name}\n`;
        report += `**Resource Type:** ${currentResourceType === 'all' ? 'All Resources' : currentResourceType}\n`;
        report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
        
        report += `## Summary Statistics\n\n`;
        report += `- **Total Operations:** ${stats.total}\n`;
        report += `- **Active Operations:** ${stats.active}\n`;
        report += `- **Inactive Operations:** ${stats.total - stats.active}\n`;
        report += `- **Total Estimated Reserves:** ${formatNumber(stats.reserves)}\n`;
        report += `- **Annual Production:** ${stats.production}\n\n`;
        
        // Resource breakdown
        if (currentResourceType === 'all') {
            report += this.generateResourceBreakdown(currentRegion);
        } else {
            report += this.generateResourceDetails(currentRegion, currentResourceType);
        }
        
        // Company analysis
        report += this.generateCompanyAnalysis(currentRegion, currentResourceType);
        
        // Production trends (mock data for demonstration)
        report += this.generateProductionTrends();
        
        return report;
    }
    
    // Generate resource breakdown
    private generateResourceBreakdown(region: string): string {
        let breakdown = `## Resource Type Breakdown\n\n`;
        
        Object.keys(resourceDatabase).forEach(resourceType => {
            const resources = resourceDatabase[resourceType][region] || [];
            if (resources.length > 0) {
                const active = resources.filter(r => r.status === ResourceStatus.Active).length;
                breakdown += `### ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}\n`;
                breakdown += `- **Total Operations:** ${resources.length}\n`;
                breakdown += `- **Active Operations:** ${active}\n`;
                
                // List major operations
                const majorOps = resources.slice(0, 3);
                if (majorOps.length > 0) {
                    breakdown += `- **Major Operations:**\n`;
                    majorOps.forEach(resource => {
                        breakdown += `  - ${resource.name} (${resource.owner})\n`;
                    });
                }
                breakdown += `\n`;
            }
        });
        
        return breakdown;
    }
    
    // Generate detailed resource analysis
    private generateResourceDetails(region: string, resourceType: string): string {
        const resources = resourceDatabase[resourceType]?.[region] || [];
        let details = `## ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Operations Detail\n\n`;
        
        if (resources.length === 0) {
            return details + `No ${resourceType} operations found in this region.\n\n`;
        }
        
        // Status distribution
        const statusCounts = {
            [ResourceStatus.Active]: 0,
            [ResourceStatus.Inactive]: 0,
            [ResourceStatus.Closed]: 0,
            [ResourceStatus.Exploration]: 0
        };
        
        resources.forEach(resource => {
            statusCounts[resource.status]++;
        });
        
        details += `### Status Distribution\n`;
        Object.entries(statusCounts).forEach(([status, count]) => {
            if (count > 0) {
                details += `- **${status}:** ${count} operation${count > 1 ? 's' : ''}\n`;
            }
        });
        details += `\n`;
        
        // Top operations by production
        const activeResources = resources.filter(r => r.status === ResourceStatus.Active);
        if (activeResources.length > 0) {
            details += `### Top Active Operations\n`;
            activeResources.slice(0, 5).forEach((resource, index) => {
                details += `${index + 1}. **${resource.name}**\n`;
                details += `   - Owner: ${resource.owner}\n`;
                details += `   - Production: ${resource.production}\n`;
                details += `   - Reserves: ${resource.reserves}\n\n`;
            });
        }
        
        return details;
    }
    
    // Generate company analysis
    private generateCompanyAnalysis(region: string, resourceType: string): string {
        let analysis = `## Company Analysis\n\n`;
        
        let resources: any[] = [];
        
        if (resourceType === 'all') {
            Object.keys(resourceDatabase).forEach(type => {
                const regionData = resourceDatabase[type][region];
                if (regionData) {
                    resources = resources.concat(regionData);
                }
            });
        } else {
            resources = resourceDatabase[resourceType]?.[region] || [];
        }
        
        if (resources.length === 0) {
            return analysis + `No operations data available for company analysis.\n\n`;
        }
        
        // Company market share
        const companies = new Map<string, {count: number, resources: string[]}>();
        resources.forEach(resource => {
            if (!companies.has(resource.owner)) {
                companies.set(resource.owner, {count: 0, resources: []});
            }
            const company = companies.get(resource.owner)!;
            company.count++;
            company.resources.push(resource.name);
        });
        
        const sortedCompanies = Array.from(companies.entries())
            .sort((a, b) => b[1].count - a[1].count);
        
        analysis += `### Market Share by Operations Count\n`;
        sortedCompanies.forEach(([company, data], index) => {
            const percentage = ((data.count / resources.length) * 100).toFixed(1);
            analysis += `${index + 1}. **${company}**: ${data.count} operations (${percentage}%)\n`;
        });
        analysis += `\n`;
        
        // Top companies detail
        analysis += `### Top Companies Detail\n`;
        sortedCompanies.slice(0, 3).forEach(([company, data]) => {
            analysis += `#### ${company}\n`;
            analysis += `- **Operations:** ${data.count}\n`;
            analysis += `- **Properties:** ${data.resources.join(', ')}\n\n`;
        });
        
        return analysis;
    }
    
    // Generate production trends (mock data)
    private generateProductionTrends(): string {
        let trends = `## Production Trends\n\n`;
        trends += `*Note: This section would typically include historical production data and trend analysis.*\n\n`;
        
        trends += `### Key Insights\n`;
        trends += `- Regional production has shown steady growth over the past 5 years\n`;
        trends += `- Environmental regulations are driving more sustainable mining practices\n`;
        trends += `- Technology adoption is improving operational efficiency\n`;
        trends += `- Market demand continues to support expansion of active operations\n\n`;
        
        return trends;
    }
    
    // Export data to JSON
    public exportToJSON(): AnalyticsExport {
        const currentRegion = getCurrentRegion();
        const currentResourceType = getCurrentResource();
        const stats = this.generateStatistics();
        
        let resources: any[] = [];
        
        if (currentResourceType === 'all') {
            Object.keys(resourceDatabase).forEach(type => {
                const regionData = resourceDatabase[type][currentRegion];
                if (regionData) {
                    resources = resources.concat(regionData);
                }
            });
        } else {
            resources = resourceDatabase[currentResourceType]?.[currentRegion] || [];
        }
        
        return {
            region: currentRegion,
            resource: currentResourceType,
            timestamp: new Date().toISOString(),
            statistics: {
                total: stats.total.toString(),
                active: stats.active.toString(),
                reserves: formatNumber(stats.reserves)
            },
            sites: resources
        };
    }
    
    // Download report as text file
    public downloadReport(): void {
        const report = this.generateReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `georesource-report-${getCurrentRegion()}-${getCurrentResource()}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    // Download data as JSON
    public downloadJSON(): void {
        const data = this.exportToJSON();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `georesource-data-${getCurrentRegion()}-${getCurrentResource()}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}

// Export functions for global use
export function generateAnalyticsReport(): void {
    const analytics = Analytics.getInstance();
    const report = analytics.generateReport();
    
    // Display in modal or new window
    const modal = document.getElementById('analyticsModal');
    const content = document.getElementById('analyticsContent');
    
    if (modal && content) {
        content.innerHTML = `<pre>${report}</pre>`;
        modal.style.display = 'block';
    }
}

export function downloadReport(): void {
    const analytics = Analytics.getInstance();
    analytics.downloadReport();
}

export function downloadData(): void {
    const analytics = Analytics.getInstance();
    analytics.downloadJSON();
}

export function getStatistics(): StatisticsData {
    const analytics = Analytics.getInstance();
    return analytics.generateStatistics();
}

// Global functions for UI
declare global {
    interface Window {
        generateAnalyticsReport: () => void;
        downloadReport: () => void;
        downloadData: () => void;
    }
}

window.generateAnalyticsReport = generateAnalyticsReport;
window.downloadReport = downloadReport;
window.downloadData = downloadData;