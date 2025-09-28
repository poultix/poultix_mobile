import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IOSDesign } from '../../constants/iosDesign';
import { SafeAreaView } from "react-native-safe-area-context";

interface VetReport {
    id: string;
    title: string;
    type: 'diagnosis' | 'treatment' | 'vaccination' | 'inspection' | 'consultation';
    date: string;
    status: 'completed' | 'pending' | 'in_progress';
    farmName: string;
    farmerName: string;
    summary: string;
    findings: string;
    recommendations: string;
    followUpDate?: string;
}

export default function VetReportsScreen() {
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'diagnosis' | 'treatment' | 'vaccination' | 'inspection' | 'consultation'>('all');

    // Mock veterinary reports data
    const mockReports: VetReport[] = [
        {
            id: '1',
            title: 'Respiratory Disease Diagnosis',
            type: 'diagnosis',
            date: '2024-01-20',
            status: 'completed',
            farmName: 'Green Valley Poultry Farm',
            farmerName: 'John Kamau',
            summary: 'Diagnosed respiratory infection in Block C chickens',
            findings: 'Observed coughing, nasal discharge, and reduced activity in approximately 50 birds. Temperature slightly elevated.',
            recommendations: 'Prescribed antibiotics, improved ventilation, isolation of affected birds.',
            followUpDate: '2024-01-27'
        },
        {
            id: '2',
            title: 'Routine Vaccination Program',
            type: 'vaccination',
            date: '2024-01-18',
            status: 'completed',
            farmName: 'Sunrise Poultry Farm',
            farmerName: 'Mary Njeri',
            summary: 'Administered Newcastle disease vaccine to 1,200 birds',
            findings: 'All birds in good health prior to vaccination. No adverse reactions observed.',
            recommendations: 'Continue regular vaccination schedule. Next vaccination due in 3 months.',
            followUpDate: '2024-04-18'
        },
        {
            id: '3',
            title: 'Emergency Treatment - Sudden Deaths',
            type: 'treatment',
            date: '2024-01-15',
            status: 'in_progress',
            farmName: 'Highland Poultry Farm',
            farmerName: 'Peter Mwangi',
            summary: 'Investigating sudden deaths in young chickens',
            findings: 'Post-mortem examination reveals possible coccidiosis. Awaiting lab results.',
            recommendations: 'Started anticoccidial treatment. Improved sanitation measures implemented.',
            followUpDate: '2024-01-22'
        },
        {
            id: '4',
            title: 'Monthly Health Inspection',
            type: 'inspection',
            date: '2024-01-12',
            status: 'completed',
            farmName: 'Valley View Farm',
            farmerName: 'Grace Wambui',
            summary: 'Routine monthly health and hygiene inspection',
            findings: 'Overall farm conditions excellent. Minor issues with water system in Block B.',
            recommendations: 'Repair water system. Continue current management practices.',
            followUpDate: '2024-02-12'
        },
        {
            id: '5',
            title: 'Nutrition Consultation',
            type: 'consultation',
            date: '2024-01-10',
            status: 'pending',
            farmName: 'Golden Egg Farm',
            farmerName: 'David Kiprotich',
            summary: 'Consultation on feed optimization for better egg production',
            findings: 'Current feed quality adequate but protein levels could be improved.',
            recommendations: 'Adjust feed formulation. Introduce calcium supplements.',
            followUpDate: '2024-01-17'
        }
    ];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'diagnosis': return IOSDesign.colors.systemRed;
            case 'treatment': return IOSDesign.colors.systemOrange;
            case 'vaccination': return IOSDesign.colors.systemGreen;
            case 'inspection': return IOSDesign.colors.systemBlue;
            case 'consultation': return IOSDesign.colors.systemPurple;
            default: return IOSDesign.colors.gray[500];
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'diagnosis': return 'medical-outline';
            case 'treatment': return 'bandage-outline';
            case 'vaccination': return 'shield-checkmark-outline';
            case 'inspection': return 'search-outline';
            case 'consultation': return 'chatbubble-ellipses-outline';
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
        { key: 'diagnosis', label: 'Diagnosis', icon: 'medical-outline' },
        { key: 'treatment', label: 'Treatment', icon: 'bandage-outline' },
        { key: 'vaccination', label: 'Vaccination', icon: 'shield-checkmark-outline' },
        { key: 'inspection', label: 'Inspection', icon: 'search-outline' },
        { key: 'consultation', label: 'Consultation', icon: 'chatbubble-ellipses-outline' }
    ];

    const handleCreateReport = () => {
        Alert.alert(
            'Create New Report',
            'What type of report would you like to create?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Diagnosis Report', onPress: () => Alert.alert('Success', 'Diagnosis report created') },
                { text: 'Treatment Report', onPress: () => Alert.alert('Success', 'Treatment report created') },
                { text: 'Inspection Report', onPress: () => Alert.alert('Success', 'Inspection report created') }
            ]
        );
    };

    const handleViewReport = (report: VetReport) => {
        Alert.alert(
            report.title,
            `Farm: ${report.farmName}\nFarmer: ${report.farmerName}\n\nFindings: ${report.findings}\n\nRecommendations: ${report.recommendations}${report.followUpDate ? `\n\nFollow-up: ${new Date(report.followUpDate).toLocaleDateString()}` : ''}`,
            [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: IOSDesign.colors.background.secondary }}>
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
                    Veterinary Reports
                </Text>
                <TouchableOpacity onPress={handleCreateReport}>
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
                            onPress={() => handleViewReport(report)}
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
                                        {report.farmName} - {report.farmerName}
                                    </Text>
                                    
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
                                            {new Date(report.date).toLocaleDateString()}
                                        </Text>
                                        {report.followUpDate && (
                                            <Text style={{
                                                ...IOSDesign.typography.footnote,
                                                color: IOSDesign.colors.systemOrange,
                                            }}>
                                                Follow-up: {new Date(report.followUpDate).toLocaleDateString()}
                                            </Text>
                                        )}
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

                    {/* Create Report Button */}
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
                        onPress={handleCreateReport}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="add-outline" size={20} color={IOSDesign.colors.text.inverse} />
                            <Text style={{
                                ...IOSDesign.typography.bodyEmphasized,
                                color: IOSDesign.colors.text.inverse,
                                marginLeft: IOSDesign.spacing.sm,
                            }}>
                                Create New Report
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
