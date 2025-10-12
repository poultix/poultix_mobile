import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, RefreshControl, ActivityIndicator } from 'react-native';
import { IOSDesign } from '../../constants/iosDesign';
import { useReports } from '@/hooks/useReports';
import { Report, ReportType, ReportStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function FarmReportsScreen() {
    const { currentUser } = useAuth();
    const {
        reports,
        reportSummary,
        loading,
        refreshing,
        error,
        activeFilter,
        refreshReports,
        updateFilter,
        clearFilters,
        generateAutomatedReport,
        downloadReport,
        shareReport,
        getReportsByStatus,
        getReportsByType,
    } = useReports();
   
    const [selectedFilter, setSelectedFilter] = useState<'all' | ReportType>('all');

    // Handle filter changes
    useEffect(() => {
        if (selectedFilter === 'all') {
            updateFilter({ type: undefined });
        } else {
            updateFilter({ type: selectedFilter as ReportType });
        }
    }, [selectedFilter, updateFilter]);

    // Get filtered reports based on current selection
    const getDisplayReports = () => {
        return reports;
    };

    // Handle report actions
    const handleDownloadReport = async (reportId: string) => {
        const success = await downloadReport(reportId);
        if (success) {
            Alert.alert('Success', 'Report downloaded successfully');
        }
    };

    const handleShareReport = async (reportId: string) => {
        Alert.prompt(
            'Share Report',
            'Enter email addresses (comma separated):',
            async (emails: string) => {
                if (emails) {
                    const emailList = emails.split(',').map(e => e.trim());
                    const success = await shareReport(reportId, emailList);
                    if (success) {
                        Alert.alert('Success', 'Report shared successfully');
                    }
                }
            }
        );
    };

    const handleGenerateReport = async (type: ReportType) => {
        if (!currentUser) return;
        
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        
        // For demo purposes, we'll use a placeholder farm ID
        const farmId = 'demo-farm-id';
        
        const report = await generateAutomatedReport(
            farmId,
            type,
            lastMonth.toISOString().split('T')[0],
            endOfLastMonth.toISOString().split('T')[0]
        );
        
        if (report) {
            Alert.alert('Success', 'Report generated successfully');
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'health': return IOSDesign.colors.systemRed;
            case 'production': return IOSDesign.colors.systemGreen;
            case 'financial': return IOSDesign.colors.systemBlue;
            case 'maintenance': return IOSDesign.colors.systemOrange;
            default: return IOSDesign.colors.gray[500];
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'health': return 'medical-outline';
            case 'production': return 'trending-up-outline';
            case 'financial': return 'card-outline';
            case 'maintenance': return 'construct-outline';
            default: return 'document-outline';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return IOSDesign.colors.systemGreen;
            case 'in_progress': return IOSDesign.colors.systemOrange;
            case 'pending': return IOSDesign.colors.systemBlue;
            default: return IOSDesign.colors.gray[500];
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in_progress': return 'In Progress';
            case 'pending': return 'Pending';
            default: return 'Unknown';
        }
    };

    const filteredReports = selectedFilter === 'all' 
        ? reports 
        : reports.filter((report: Report) => report.type === selectedFilter);

    const filterOptions = [
        { key: 'all', label: 'All Reports', icon: 'document-text-outline' },
        { key: 'health', label: 'Health', icon: 'medical-outline' },
        { key: 'production', label: 'Production', icon: 'trending-up-outline' },
        { key: 'financial', label: 'Financial', icon: 'card-outline' },
        { key: 'maintenance', label: 'Maintenance', icon: 'construct-outline' }
    ];

    const handleGenerateReportDialog = () => {
        Alert.alert(
            'Generate New Report',
            'What type of report would you like to generate?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Health Report', onPress: () => Alert.alert('Success', 'Health report generation started') },
                { text: 'Production Report', onPress: () => Alert.alert('Success', 'Production report generation started') },
                { text: 'Financial Report', onPress: () => Alert.alert('Success', 'Financial report generation started') }
            ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: IOSDesign.colors.background.secondary }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: IOSDesign.layout.screenPadding,
                paddingVertical: IOSDesign.spacing.md,
                backgroundColor: IOSDesign.colors.background.primary,
                ...IOSDesign.shadows.small,
            }}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ marginRight: IOSDesign.spacing.md }}
                >
                    <Ionicons name="chevron-back" size={24} color={IOSDesign.colors.text.primary} />
                </TouchableOpacity>
                <Text style={{
                    ...IOSDesign.typography.headline,
                    color: IOSDesign.colors.text.primary,
                    flex: 1,
                }}>
                    Farm Reports
                </Text>
                <TouchableOpacity onPress={handleGenerateReportDialog}>
                    <Ionicons name="add-circle-outline" size={24} color={IOSDesign.colors.systemBlue} />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ padding: IOSDesign.layout.screenPadding }}>
                    
                    {/* Filter Tabs */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: IOSDesign.spacing.lg }}
                    >
                        <View style={{ flexDirection: 'row', gap: IOSDesign.spacing.sm }}>
                            {filterOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.key}
                                    style={{
                                        paddingHorizontal: IOSDesign.spacing.md,
                                        paddingVertical: IOSDesign.spacing.sm,
                                        borderRadius: IOSDesign.borderRadius.lg,
                                        backgroundColor: selectedFilter === option.key 
                                            ? IOSDesign.colors.systemBlue 
                                            : IOSDesign.colors.background.primary,
                                        borderWidth: 1,
                                        borderColor: selectedFilter === option.key 
                                            ? IOSDesign.colors.systemBlue 
                                            : IOSDesign.colors.gray[300],
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        ...IOSDesign.shadows.small,
                                    }}
                                    onPress={() => setSelectedFilter(option.key as any)}
                                >
                                    <Ionicons 
                                        name={option.icon as any} 
                                        size={16} 
                                        color={selectedFilter === option.key 
                                            ? IOSDesign.colors.text.inverse 
                                            : IOSDesign.colors.text.secondary
                                        }
                                        style={{ marginRight: IOSDesign.spacing.xs }}
                                    />
                                    <Text style={{
                                        ...IOSDesign.typography.footnoteEmphasized,
                                        color: selectedFilter === option.key 
                                            ? IOSDesign.colors.text.inverse 
                                            : IOSDesign.colors.text.secondary,
                                    }}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Summary Cards */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: IOSDesign.spacing.md, marginBottom: IOSDesign.spacing.lg }}>
                        <View style={{
                            flex: 1,
                            ...IOSDesign.components.card,
                            backgroundColor: IOSDesign.colors.systemGreen + '10',
                            minWidth: '45%',
                        }}>
                            <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemGreen }}>
                                {reports.filter((r: Report) => r.status === ReportStatus.COMPLETED).length}
                            </Text>
                            <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                Completed
                            </Text>
                        </View>
                        
                        <View style={{
                            flex: 1,
                            ...IOSDesign.components.card,
                            backgroundColor: IOSDesign.colors.systemOrange + '10',
                            minWidth: '45%',
                        }}>
                            <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemOrange }}>
                                {reports.filter((r: Report) => r.status === ReportStatus.IN_PROGRESS).length}
                            </Text>
                            <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                In Progress
                            </Text>
                        </View>
                        
                        <View style={{
                            flex: 1,
                            ...IOSDesign.components.card,
                            backgroundColor: IOSDesign.colors.systemBlue + '10',
                            minWidth: '45%',
                        }}>
                            <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.systemBlue }}>
                                {reports.filter((r: Report) => r.status === ReportStatus.PENDING).length}
                            </Text>
                            <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                Pending
                            </Text>
                        </View>
                        
                        <View style={{
                            flex: 1,
                            ...IOSDesign.components.card,
                            backgroundColor: IOSDesign.colors.gray[100],
                            minWidth: '45%',
                        }}>
                            <Text style={{ ...IOSDesign.typography.title2, color: IOSDesign.colors.text.primary }}>
                                {reports.length}
                            </Text>
                            <Text style={{ ...IOSDesign.typography.footnote, color: IOSDesign.colors.text.secondary }}>
                                Total Reports
                            </Text>
                        </View>
                    </View>

                    {/* Reports List */}
                    <Text style={{
                        ...IOSDesign.typography.headline,
                        color: IOSDesign.colors.text.primary,
                        marginBottom: IOSDesign.spacing.md,
                    }}>
                        {selectedFilter === 'all' ? 'All Reports' : `${filterOptions.find(o => o.key === selectedFilter)?.label} Reports`}
                    </Text>

                    {reports.map((report: Report) => (
                        <TouchableOpacity
                            key={report.id}
                            style={{
                                ...IOSDesign.components.card,
                                marginBottom: IOSDesign.spacing.md,
                            }}
                            onPress={() => Alert.alert('Report Details', `Opening ${report.title}`)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: IOSDesign.spacing.sm }}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: IOSDesign.borderRadius.md,
                                    backgroundColor: getTypeColor(report.type) + '20',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: IOSDesign.spacing.md,
                                }}>
                                    <Ionicons 
                                        name={getTypeIcon(report.type) as any} 
                                        size={20} 
                                        color={getTypeColor(report.type)} 
                                    />
                                </View>
                                
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: IOSDesign.spacing.xs }}>
                                        <Text style={{
                                            ...IOSDesign.typography.bodyEmphasized,
                                            color: IOSDesign.colors.text.primary,
                                            flex: 1,
                                        }}>
                                            {report.title}
                                        </Text>
                                        <View style={{
                                            backgroundColor: getStatusColor(report.status) + '20',
                                            paddingHorizontal: IOSDesign.spacing.sm,
                                            paddingVertical: IOSDesign.spacing.xs,
                                            borderRadius: IOSDesign.borderRadius.sm,
                                        }}>
                                            <Text style={{
                                                ...IOSDesign.typography.caption1Emphasized,
                                                color: getStatusColor(report.status),
                                            }}>
                                                {getStatusText(report.status)}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <Text style={{
                                        ...IOSDesign.typography.callout,
                                        color: IOSDesign.colors.text.secondary,
                                        marginBottom: IOSDesign.spacing.xs,
                                    }}>
                                        {report.description || 'No description available'}
                                    </Text>
                                    
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{
                                            ...IOSDesign.typography.footnote,
                                            color: IOSDesign.colors.text.tertiary,
                                        }}>
                                            By {report.generatedBy.name}
                                        </Text>
                                        <Text style={{
                                            ...IOSDesign.typography.footnote,
                                            color: IOSDesign.colors.text.tertiary,
                                        }}>
                                            {new Date(report.reportDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {filteredReports.length === 0 && (
                        <View style={{
                            ...IOSDesign.components.card,
                            alignItems: 'center',
                            paddingVertical: IOSDesign.spacing.xl,
                        }}>
                            <Ionicons name="document-outline" size={48} color={IOSDesign.colors.gray[400]} />
                            <Text style={{
                                ...IOSDesign.typography.body,
                                color: IOSDesign.colors.text.secondary,
                                marginTop: IOSDesign.spacing.md,
                                textAlign: 'center',
                            }}>
                                No {selectedFilter === 'all' ? '' : selectedFilter} reports found
                            </Text>
                        </View>
                    )}

                    {/* Generate Report Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: IOSDesign.colors.systemBlue,
                            paddingVertical: IOSDesign.spacing.md,
                            borderRadius: IOSDesign.borderRadius.lg,
                            alignItems: 'center',
                            marginTop: IOSDesign.spacing.lg,
                            marginBottom: IOSDesign.spacing.xl,
                            ...IOSDesign.shadows.medium,
                        }}
                        onPress={() => handleGenerateReport(ReportType.HEALTH)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="add-outline" size={20} color={IOSDesign.colors.text.inverse} />
                            <Text style={{
                                ...IOSDesign.typography.bodyEmphasized,
                                color: IOSDesign.colors.text.inverse,
                                marginLeft: IOSDesign.spacing.sm,
                            }}>
                                Generate New Report
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
