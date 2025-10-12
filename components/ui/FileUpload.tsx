import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { getRoleTheme } from '@/utils/theme';
import { useAuth } from '@/contexts/AuthContext';
import tw from 'twrnc';

interface FileUploadProps {
    title: string;
    description?: string;
    acceptedTypes?: 'images' | 'documents' | 'all';
    maxSize?: number; // in MB
    onUpload?: (file: any) => void;
    required?: boolean;
    uploaded?: boolean;
}

export default function FileUpload({ 
    title, 
    description, 
    acceptedTypes = 'all', 
    maxSize = 10,
    onUpload,
    required = false,
    uploaded = false 
}: FileUploadProps) {
    const { currentUser } = useAuth();
    const theme = getRoleTheme(currentUser?.role);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<any>(null);

    const handleDocumentPick = async () => {
        try {
            setIsUploading(true);
            const result = await DocumentPicker.getDocumentAsync({
                type: acceptedTypes === 'images' ? 'image/*' : 
                      acceptedTypes === 'documents' ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] :
                      '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                
                // Check file size
                if (file.size && file.size > maxSize * 1024 * 1024) {
                    Alert.alert('File Too Large', `Please select a file smaller than ${maxSize}MB`);
                    return;
                }

                setUploadedFile(file);
                onUpload?.(file);
                Alert.alert('Success', 'File uploaded successfully!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document');
        } finally {
            setIsUploading(false);
        }
    };

    const handleImagePick = async () => {
        try {
            setIsUploading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                setUploadedFile(file);
                onUpload?.(file);
                Alert.alert('Success', 'Image uploaded successfully!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpload = () => {
        Alert.alert(
            'Upload File',
            'Choose upload method',
            [
                { text: 'Cancel', style: 'cancel' },
                ...(acceptedTypes !== 'documents' ? [{ text: 'Photo Library', onPress: handleImagePick }] : []),
                { text: 'Browse Files', onPress: handleDocumentPick },
            ]
        );
    };

    const getFileIcon = () => {
        if (uploadedFile || uploaded) {
            return 'checkmark-circle';
        }
        switch (acceptedTypes) {
            case 'images': return 'image-outline';
            case 'documents': return 'document-text-outline';
            default: return 'cloud-upload-outline';
        }
    };

    const getFileIconColor = () => {
        if (uploadedFile || uploaded) {
            return '#10B981'; // Green for uploaded
        }
        return theme.primary;
    };

    return (
        <TouchableOpacity
            style={[
                tw`border-2 border-dashed rounded-xl p-6 mb-4`,
                {
                    borderColor: (uploadedFile || uploaded) ? '#10B981' : theme.primary,
                    backgroundColor: (uploadedFile || uploaded) ? '#F0FDF4' : theme.primary + '08'
                }
            ]}
            onPress={handleUpload}
            disabled={isUploading}
        >
            <View style={tw`items-center`}>
                {isUploading ? (
                    <ActivityIndicator size="large" color={theme.primary} />
                ) : (
                    <Ionicons 
                        name={getFileIcon()} 
                        size={48} 
                        color={getFileIconColor()} 
                    />
                )}
                
                <Text style={[
                    tw`text-lg font-semibold mt-3 text-center`,
                    { color: (uploadedFile || uploaded) ? '#059669' : theme.primary }
                ]}>
                    {uploadedFile ? uploadedFile.name : 
                     uploaded ? 'File Uploaded' : 
                     title}
                    {required && !uploadedFile && !uploaded && (
                        <Text style={tw`text-red-500`}> *</Text>
                    )}
                </Text>
                
                {description && (
                    <Text style={tw`text-gray-600 text-sm text-center mt-2`}>
                        {description}
                    </Text>
                )}
                
                <View style={tw`flex-row items-center mt-3`}>
                    <Text style={tw`text-gray-500 text-xs`}>
                        Max size: {maxSize}MB • 
                        {acceptedTypes === 'images' ? ' Images only' : 
                         acceptedTypes === 'documents' ? ' Documents only' : 
                         ' All file types'}
                    </Text>
                </View>
                
                {(uploadedFile || uploaded) && (
                    <View style={tw`flex-row items-center mt-2`}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={tw`text-green-600 text-sm font-medium ml-1`}>
                            Ready to submit
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
