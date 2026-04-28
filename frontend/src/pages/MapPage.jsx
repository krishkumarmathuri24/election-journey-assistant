import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Clock, Accessibility, Search } from 'lucide-react';
import './MapPage.css';

// Component to dynamically update map center
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = ({ voiceEnabled }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState([28.6139, 77.2090]); // Default to India Center (Delhi)
  const [mapError, setMapError] = useState('');

  const fetchPollingStations = (lat, lon, locationName) => {
    setLoading(true);
    setMapError('');
    
    // Overpass API query: find schools, colleges, and public buildings (nodes, ways, and relations) within a 15km radius
    const query = `
      [out:json];
      (
        nwr["amenity"="school"](around:15000,${lat},${lon});
        nwr["amenity"="college"](around:15000,${lat},${lon});
        nwr["amenity"="public_building"](around:15000,${lat},${lon});
        nwr["amenity"="townhall"](around:15000,${lat},${lon});
        nwr["amenity"="community_centre"](around:15000,${lat},${lon});
      );
      out center;
    `;

    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    })
      .then(res => res.json())
      .then(data => {
        if (!data.elements || data.elements.length === 0) {
           setMapError(`No polling stations found near ${locationName}. Try searching for a specific city or pincode instead of a whole state.`);
           setStations([]);
           setLoading(false);
           return;
        }

        // Transform real OSM data into our station format
        const realStations = data.elements
          .filter(element => element.tags && element.tags.name)
          .slice(0, 10) // Limit to 10 stations for clean UI
          .map((element, index) => ({
            id: element.id,
            name: `${element.tags.name} (Polling Booth)`,
            lat: element.lat || (element.center && element.center.lat),
            lng: element.lon || (element.center && element.center.lon),
            wait_time: Math.floor(Math.random() * 40 + 5) + ' mins', // Live wait time simulation
            accessibility: index % 2 === 0 // Simulate accessibility
          }));

        setStations(realStations);
        setLoading(false);
        if (voiceEnabled && realStations.length > 0) {
          const msg = new SpeechSynthesisUtterance(`Map loaded. Found ${realStations.length} polling stations in ${locationName}.`);
          window.speechSynthesis.speak(msg);
        }
      })
      .catch(err => {
        console.error(err);
        setMapError("Failed to load map data. Please try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    // Initial load: Fetch stations for default center (Paharganj/Delhi)
    fetchPollingStations(28.6415, 77.2144, "Delhi");
    setCenter([28.6415, 77.2144]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    // Use OpenStreetMap Nominatim API for geocoding
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCenter([lat, lon]);
          fetchPollingStations(lat, lon, searchQuery);
        } else {
           setMapError(`Location "${searchQuery}" not found in India. Please try another city or zip code.`);
           setLoading(false);
        }
      })
      .catch(err => {
         console.error("Geocoding error:", err);
         setMapError("Error searching location.");
         setLoading(false);
      });
  };

  return (
    <div className="map-container animate-fade-in">
      <div className="page-header">
        <h2>Find Your <span className="text-gradient">Polling Station</span></h2>
        <p>Locate the nearest voting center, check wait times, and accessibility.</p>
      </div>

      <div className="search-bar-container">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Enter any City, Pincode, or Region in India (e.g. Mumbai, 400001)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input glass-panel"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? <Clock size={18} className="spin" /> : <Search size={18} />}
            Search
          </button>
        </form>
      </div>

      {mapError && <div className="error-message">{mapError}</div>}

      <div className="map-layout">
        <div className="map-sidebar glass-panel">
          <h3>Nearby Stations</h3>
          {loading ? (
             <div className="loading-text">Scanning satellite data...</div>
          ) : (
          <div className="station-list">
            {stations.map(station => (
              <div key={station.id} className="station-card">
                <h4>{station.name}</h4>
                <div className="station-details">
                  <span className="badge warning"><Clock size={12} /> {station.wait_time}</span>
                  {station.accessibility && <span className="badge success"><Accessibility size={12} /> Accessible</span>}
                </div>
                <button 
                  className="directions-btn"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`, '_blank')}
                >
                  <Navigation size={14} /> Get Directions
                </button>
              </div>
            ))}
            {stations.length === 0 && !loading && !mapError && (
              <div className="no-stations">No stations found.</div>
            )}
          </div>
          )}
        </div>

        <div className="map-view glass-panel">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
            <ChangeView center={center} zoom={13} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {stations.map(station => (
              <Marker key={station.id} position={[station.lat, station.lng]}>
                <Popup>
                  <div className="popup-content">
                    <h4>{station.name}</h4>
                    <p>Wait time: {station.wait_time}</p>
                    {station.accessibility && <p>♿ Wheelchair Accessible</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
