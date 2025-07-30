// components/ui/MapPicker/MapPicker.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '../Button/Button';
import { MapPin } from 'lucide-react';
import './MapPicker.scss';

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number, address?: string) => void;
    initialLat?: number;
    initialLng?: number;
    isOpen: boolean;
    onClose: () => void;
}

export const MapPicker: React.FC<MapPickerProps> = ({
                                                        onLocationSelect,
                                                        initialLat = 50.4501, // Default to Kyiv
                                                        initialLng = 30.5234,
                                                        isOpen,
                                                        onClose
                                                    }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        const initializeMap = async () => {
            const loader = new Loader({
                apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '', // Добавить в .env
                version: 'weekly',
                libraries: ['places']
            });

            try {
                await loader.load();

                if (mapRef.current) {
                    const mapInstance = new google.maps.Map(mapRef.current, {
                        center: { lat: initialLat, lng: initialLng },
                        zoom: 15,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                    });

                    const markerInstance = new google.maps.Marker({
                        position: { lat: initialLat, lng: initialLng },
                        map: mapInstance,
                        draggable: true,
                        title: 'Selected Location'
                    });

                    const geocoderInstance = new google.maps.Geocoder();

                    // Handle map click
                    mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
                        if (e.latLng) {
                            const lat = e.latLng.lat();
                            const lng = e.latLng.lng();

                            markerInstance.setPosition({ lat, lng });
                            setSelectedCoords({ lat, lng });

                            // Reverse geocoding
                            geocoderInstance.geocode(
                                { location: { lat, lng } },
                                (results, status) => {
                                    if (status === 'OK' && results?.[0]) {
                                        setSelectedAddress(results[0].formatted_address);
                                    }
                                }
                            );
                        }
                    });

                    // Handle marker drag
                    markerInstance.addListener('dragend', () => {
                        const position = markerInstance.getPosition();
                        if (position) {
                            const lat = position.lat();
                            const lng = position.lng();
                            setSelectedCoords({ lat, lng });

                            geocoderInstance.geocode(
                                { location: { lat, lng } },
                                (results, status) => {
                                    if (status === 'OK' && results?.[0]) {
                                        setSelectedAddress(results[0].formatted_address);
                                    }
                                }
                            );
                        }
                    });

                    setMap(mapInstance);
                    setMarker(markerInstance);
                    setGeocoder(geocoderInstance);
                    setSelectedCoords({ lat: initialLat, lng: initialLng });
                }
            } catch (error) {
                console.error('Error loading Google Maps:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeMap();
    }, [isOpen, initialLat, initialLng]);

    const handleSearch = () => {
        if (!geocoder || !map || !marker || !searchValue.trim()) return;

        geocoder.geocode({ address: searchValue }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lng = location.lng();

                map.setCenter({ lat, lng });
                marker.setPosition({ lat, lng });
                setSelectedCoords({ lat, lng });
                setSelectedAddress(results[0].formatted_address);
            } else {
                alert('Address not found. Please try a different address.');
            }
        });
    };

    const handleConfirm = () => {
        if (selectedCoords) {
            onLocationSelect(selectedCoords.lat, selectedCoords.lng, selectedAddress);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="map-picker-modal">
                <div className="modal-header">
                    <h3>Select Location</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="map-container">
                    {isLoading && <div className="map-loading">Loading map...</div>}
                    <div ref={mapRef} className="map" />
                </div>

                {selectedAddress && (
                    <div className="selected-info">
                        <MapPin size={16} />
                        <span>{selectedAddress}</span>
                    </div>
                )}

                <div className="modal-actions">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={!selectedCoords}
                    >
                        Confirm Location
                    </Button>
                </div>
            </div>
        </div>
    );
};