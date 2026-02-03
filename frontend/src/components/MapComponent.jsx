import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle clicks on the map to set location
const MapEvents = ({ onLocationSelect, isReadOnly }) => {
    useMapEvents({
        click(e) {
            if (!isReadOnly && onLocationSelect) {
                onLocationSelect(e.latlng);
            }
        },
    });
    return null;
};

const MapComponent = ({
    areas = [], // Array of { lat, lng, radius, severity, ... }
    center = [20.5937, 78.9629], // Default: Center of India
    zoom = 5,
    isReadOnly = false,
    selectedLocation = null, // { lat, lng } for current selection
    radius = 1000, // Current radius for selection
    onLocationSelect, // Function(latlng)
    height = "400px"
}) => {
    // Determine color based on severity
    const getColor = (severity) => {
        switch (severity) {
            case 'CRITICAL': return '#ef4444'; // Red-500
            case 'HIGH': return '#f97316'; // Orange-500
            case 'MEDIUM': return '#eab308'; // Yellow-500
            default: return '#22c55e'; // Green-500
        }
    };

    return (
        <div className="rounded-xl overflow-hidden shadow-inner border border-white/20">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: height, width: "100%" }}
                className="z-0" // Lower z-index so modals cover it
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapEvents onLocationSelect={onLocationSelect} isReadOnly={isReadOnly} />

                {/* Display existing areas */}
                {areas.map((area, idx) => (
                    <Circle
                        key={idx}
                        center={[area.latitude || 0, area.longitude || 0]}
                        radius={area.radius || 1000}
                        pathOptions={{
                            color: getColor(area.severity),
                            fillColor: getColor(area.severity),
                            fillOpacity: 0.3
                        }}
                    >
                        <Popup>
                            <strong>{area.areaName || 'Affected Area'}</strong><br />
                            Severity: {area.severity}<br />
                            Radius: {area.radius}m
                        </Popup>
                    </Circle>
                ))}

                {/* Display current selection for Officer creating/editing */}
                {!isReadOnly && selectedLocation && (
                    <>
                        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                            <Popup>Selected Center</Popup>
                        </Marker>
                        <Circle
                            center={[selectedLocation.lat, selectedLocation.lng]}
                            radius={radius}
                            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                        />
                    </>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
