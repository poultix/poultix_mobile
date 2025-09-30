import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IOSDesign } from '../../constants/iosDesign';

interface Report {
    id: string; 
    title: string;
    type: 'health' | 'production' | 'financial' | 'maintenance';
    date: string;
    status: 'completed' | 'pending' | 'in_progress';
    summary: string;
    farmName: string;
    generatedBy: string;
}

export default function FarmReportsScreen() {
   
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'health' | 'production' | 'financial' | 'maintenance'>('all');

    // Mock reports data
    const mockReports: Report[] = [
        {
            id: '1',
            title: 'Monthly Health Assessment',
            type: 'health',
            date: '2024-01-20',
            status: 'completed',
            summary: 'Overall flock health is good. Minor respiratory issues detected in Block C.',
            farmName: 'Green Valley Poultry Farm',
            generatedBy: 'Dr. Sarah Wanjiku'
        },
        {
            id: '2',
            title: 'Egg Production Report',
            type: 'production',
            date: '2024-01-19',
            status: 'completed',
            summary: 'Production increased by 12% this month. Peak laying rate achieved.',
            farmName: 'Green Valley Poultry Farm',
            generatedBy: 'John Kamau'
        },
        {
            id: '3',
            title: 'Feed Cost Analysis',
            type: 'financial',
            date: '2024-01-18',
            status: 'in_progress',
            summary: 'Analyzing feed costs and ROI for Q1 2024.',
            farmName: 'Green Valley Poultry Farm',
            generatedBy: 'John Kamau'
        },
        {
            id: '4',
            title: 'Equipment Maintenance Log',
            type: 'maintenance',
            date: '2024-01-17',
            status: 'completed',
            summary: 'All equipment serviced and functioning properly.',
            farmName: 'Green Valley Poultry Farm',
            generatedBy: 'Maintenance Team'
        },
        {
            id: '5',
            title: 'Vaccination Schedule Report',
            type: 'health',
            date: '2024-01-15',
            status: 'pending',
            summary: 'Upcoming vaccination schedule for February 2024.',
            farmName: 'Green Valley Poultry Farm',
            generatedBy: 'Dr. Sarah Wanjiku'
        }
    ];

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
        ? mockReports 
        : mockReports.filter(report => report.type === selectedFilter);

    const filterOptions = [
        { key: 'all', label: 'All Reports', icon: 'document-text-outline' },
        { key: 'health', label: 'Health', icon: 'medical-outline' },
        { key: 'production', label: 'Production', icon: 'trending-up-outline' },
        { key: 'financial', label: 'Financial', icon: 'card-outline' },
        { key: 'maintenance', label: 'Maintenance', icon: 'construct-outline' }
    ];

    const handleGenerateReport = () => {
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
                <TouchableOpacity onPress={handleGenerateReport}>
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
                                {mockReports.filter(r => r.status === 'completed').length}
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
                                {mockReports.filter(r => r.status === 'in_progress').length}
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
                                {mockReports.filter(r => r.status === 'pending').length}
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
                                {mockReports.length}
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

                    {filteredReports.map((report) => (
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
                                        {report.summary}
                                    </Text>
                                    
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{
                                            ...IOSDesign.typography.footnote,
                                            color: IOSDesign.colors.text.tertiary,
                                        }}>
                                            By {report.generatedBy}
                                        </Text>
                                        <Text style={{
                                            ...IOSDesign.typography.footnote,
                                            color: IOSDesign.colors.text.tertiary,
                                        }}>
                                            {new Date(report.date).toLocaleDateString()}
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
                        onPress={handleGenerateReport}
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
