import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';

import { usePharmacyVerificationContext } from '@/contexts/PharmacyVerificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { VerificationStatus } from '@/types';

export default function PharmacyVerificationDashboard() {
    const { currentUser } = useAuth();
    const {
        currentPharmacy,
        verificationStatus,
        missingDocuments,
        requiredDocuments,
        loading,
        error,
        loadPharmacyData,
    } = usePharmacyVerificationContext();

    useEffect(() => {
        // Load pharmacy data if user has pharmacy role
        if (currentUser?.role === 'PHARMACY') {
            // In a real app, you'd get the pharmacy ID from the user profile
            // For now, we'll handle the case where no pharmacy exists yet
        }
    }, [currentUser]);

    const getStatusColor = (status: VerificationStatus | null) => {
        switch (status) {
            case VerificationStatus.VERIFIED:
                return '#10B981'; // Green
            case VerificationStatus.PENDING:
                return '#F59E0B'; // Orange
            case VerificationStatus.REJECTED:
                return '#EF4444'; // Red
            default:
                return '#6B7280'; // Gray
        }
    };

    const getStatusText = (status: VerificationStatus | null) => {
        switch (status) {
            case VerificationStatus.VERIFIED:
                return 'Verified';
            case VerificationStatus.PENDING:
                return 'Pending Review';
            case VerificationStatus.REJECTED:
                return 'Rejected';
            default:
                return 'Not Verified';
        }
    };

    const getCompletionPercentage = () => {
        if (!requiredDocuments.length) return 0;
        const uploaded = requiredDocuments.length - missingDocuments.length;
        return Math.round((uploaded / requiredDocuments.length) * 100);
    };

    const canSubmitForVerification = () => {
        return missingDocuments.length === 0 && 
               currentPharmacy && 
               verificationStatus === VerificationStatus.UNVERIFIED;
    };

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <Text style={tw`text-gray-600`}>Loading verification status...</Text>
            </View>
        );
    }

    if (!currentPharmacy) {
        return (
            <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`flex-grow justify-center px-6`}>
                    <View style={tw`bg-white rounded-3xl p-8 mx-4 shadow-xl`}>
                        <View style={tw`items-center mb-8`}>
                            <View style={tw`w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4`}>
                                <Ionicons name="storefront-outline" size={48} color="#3B82F6" />
                            </View>
                            <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-2`}>
                                Welcome to Poultix
                            </Text>
                            <Text style={tw`text-gray-600 text-center leading-6`}>
                                Complete your pharmacy registration to start serving farmers and veterinarians
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={tw`bg-blue-600 py-4 rounded-xl shadow-lg`}
                            onPress={() => router.push('/pharmacy/registration')}
                        >
                            <Text style={tw`text-white font-semibold text-center text-lg`}>
                                Start Registration
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`mt-4 py-3`}
                            onPress={() => router.push('/pharmacy/requirements')}
                        >
                            <Text style={tw`text-blue-600 font-medium text-center`}>
                                View Requirements
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            style={tw`flex-1`}
        >
            <ScrollView contentContainerStyle={tw`pb-6`}>
                {/* Header */}
                <View style={tw`px-6 pt-12 pb-6`}>
                    <Text style={tw`text-white text-2xl font-bold mb-2`}>
                        Verification Dashboard
                    </Text>
                    <Text style={tw`text-blue-100`}>
                        {currentPharmacy.name}
                    </Text>
                </View>

                {/* Status Card */}
                <View style={tw`mx-6 mb-6`}>
                    <View style={tw`bg-white rounded-2xl p-6 shadow-lg`}>
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <Text style={tw`text-lg font-semibold text-gray-800`}>
                                Verification Status
                            </Text>
                            <View 
                                style={[
                                    tw`px-3 py-1 rounded-full`,
                                    { backgroundColor: getStatusColor(verificationStatus) + '20' }
                                ]}
                            >
                                <Text 
                                    style={[
                                        tw`text-sm font-medium`,
                                        { color: getStatusColor(verificationStatus) }
                                    ]}
                                >
                                    {getStatusText(verificationStatus)}
                                </Text>
                            </View>
                        </View>

                        {verificationStatus === VerificationStatus.VERIFIED && (
                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                <Text style={tw`ml-2 text-green-600 font-medium`}>
                                    Your pharmacy is verified and operational!
                                </Text>
                            </View>
                        )}

                        {verificationStatus === VerificationStatus.PENDING && (
                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="time-outline" size={24} color="#F59E0B" />
                                <Text style={tw`ml-2 text-orange-600 font-medium`}>
                                    Your submission is under review
                                </Text>
                            </View>
                        )}

                        {verificationStatus === VerificationStatus.REJECTED && (
                            <View>
                                <View style={tw`flex-row items-center mb-3`}>
                                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                                    <Text style={tw`ml-2 text-red-600 font-medium`}>
                                        Verification was rejected
                                    </Text>
                                </View>
                                {currentPharmacy.adminComments && (
                                    <View style={tw`bg-red-50 p-3 rounded-lg`}>
                                        <Text style={tw`text-red-700 text-sm`}>
                                            Admin Comments: {currentPharmacy.adminComments}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </View>

                {/* Progress Card */}
                {(verificationStatus === VerificationStatus.UNVERIFIED || 
                  verificationStatus === VerificationStatus.REJECTED) && (
                    <View style={tw`mx-6 mb-6`}>
                        <View style={tw`bg-white rounded-2xl p-6 shadow-lg`}>
                            <Text style={tw`text-lg font-semibold text-gray-800 mb-4`}>
                                Registration Progress
                            </Text>
                            
                            <View style={tw`mb-4`}>
                                <View style={tw`flex-row justify-between mb-2`}>
                                    <Text style={tw`text-gray-600`}>
                                        Documents Completed
                                    </Text>
                                    <Text style={tw`text-gray-800 font-medium`}>
                                        {getCompletionPercentage()}%
                                    </Text>
                                </View>
                                <View style={tw`bg-gray-200 rounded-full h-2`}>
                                    <View 
                                        style={[
                                            tw`bg-blue-600 h-2 rounded-full`,
                                            { width: `${getCompletionPercentage()}%` }
                                        ]}
                                    />
                                </View>
                            </View>

                            <Text style={tw`text-gray-600 text-sm`}>
                                {missingDocuments.length > 0 
                                    ? `${missingDocuments.length} documents remaining`
                                    : 'All documents completed!'
                                }
                            </Text>
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={tw`mx-6 gap-4`}>
                    {verificationStatus === VerificationStatus.UNVERIFIED && (
                        <>
                            <TouchableOpacity
                                style={tw`bg-white rounded-xl p-4 shadow-lg flex-row items-center justify-between`}
                                onPress={() => router.push('/pharmacy/checklist')}
                            >
                                <View style={tw`flex-row items-center`}>
                                    <View style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4`}>
                                        <Ionicons name="document-text-outline" size={24} color="#3B82F6" />
                                    </View>
                                    <View>
                                        <Text style={tw`text-gray-800 font-semibold text-base`}>
                                            Complete Checklist
                                        </Text>
                                        <Text style={tw`text-gray-600 text-sm`}>
                                            Upload required documents
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>

                            {canSubmitForVerification() && (
                                <TouchableOpacity
                                    style={tw`bg-green-600 rounded-xl p-4 shadow-lg`}
                                    onPress={() => router.push('/pharmacy/submit-verification')}
                                >
                                    <View style={tw`flex-row items-center justify-center`}>
                                        <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                                        <Text style={tw`text-white font-semibold text-base ml-2`}>
                                            Submit for Verification
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {verificationStatus === VerificationStatus.REJECTED && (
                        <TouchableOpacity
                            style={tw`bg-orange-600 rounded-xl p-4 shadow-lg flex-row items-center justify-center`}
                            onPress={() => router.push('/pharmacy/resubmit')}
                        >
                            <Ionicons name="refresh-outline" size={24} color="white" />
                            <Text style={tw`text-white font-semibold text-base ml-2`}>
                                Resubmit Application
                            </Text>
                        </TouchableOpacity>
                    )}

                    {verificationStatus === VerificationStatus.VERIFIED && (
                        <TouchableOpacity
                            style={tw`bg-green-600 rounded-xl p-4 shadow-lg flex-row items-center justify-center`}
                            onPress={() => router.push('/pharmacy/inventory')}
                        >
                            <Ionicons name="storefront-outline" size={24} color="white" />
                            <Text style={tw`text-white font-semibold text-base ml-2`}>
                                Manage Inventory
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={tw`bg-white rounded-xl p-4 shadow-lg flex-row items-center justify-between`}
                        onPress={() => router.push('/pharmacy/profile')}
                    >
                        <View style={tw`flex-row items-center`}>
                            <View style={tw`w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4`}>
                                <Ionicons name="person-outline" size={24} color="#6B7280" />
                            </View>
                            <View>
                                <Text style={tw`text-gray-800 font-semibold text-base`}>
                                    Pharmacy Profile
                                </Text>
                                <Text style={tw`text-gray-600 text-sm`}>
                                    View and edit details
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {error && (
                    <View style={tw`mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-4`}>
                        <Text style={tw`text-red-700`}>{error}</Text>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}
