'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Compass, MapPin, Navigation } from 'lucide-react';

export default function QiblaCompass({ onClose }) {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState(null);

  // 1. Calculate Qibla Angle based on User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const kaabaLat = 21.422487;
        const kaabaLng = 39.826206;

        const y = Math.sin(toRad(kaabaLng - longitude)) * Math.cos(toRad(kaabaLat));
        const x = Math.cos(toRad(latitude)) * Math.sin(toRad(kaabaLat)) -
                  Math.sin(toRad(latitude)) * Math.cos(toRad(kaabaLat)) * Math.cos(toRad(kaabaLng - longitude));
        
        let qibla = toDeg(Math.atan2(y, x));
        qibla = (qibla + 360) % 360; // Normalize
        setQiblaDirection(qibla);
      }, (err) => setError("Location access needed for Qibla."));
    }
  }, []);

  const toRad = (deg) => deg * (Math.PI / 180);
  const toDeg = (rad) => rad * (180 / Math.PI);

  // 2. Handle Device Orientation (Compass)
  const startCompass = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ Requirement
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            setPermissionGranted(true);
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            setError("Permission denied.");
          }
        })
        .catch(console.error);
    } else {
      // Android / Older Devices
      setPermissionGranted(true);
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  const handleOrientation = (e) => {
    let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    setHeading(compass);
  };

  // Determine if pointing correctly (+/- 5 degrees)
  const isAligned = Math.abs(heading - qiblaDirection) < 5;

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFCF8] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 bg-[#1B4332] text-white shadow-lg">
        <button onClick={onClose}><ArrowLeft /></button>
        <h2 className="font-bold text-lg">Qibla Finder</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Background Mandala */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1B4332 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        {!permissionGranted ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 max-w-sm">
             <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4"><Compass size={32}/></div>
             <h3 className="font-bold text-xl mb-2 text-gray-800">Calibrate Compass</h3>
             <p className="text-sm text-gray-500 mb-6">We need access to your phone's gyroscope to show the Qibla direction.</p>
             <button onClick={startCompass} className="w-full bg-[#1B4332] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-800">Start Compass</button>
             {error && <p className="text-red-500 text-xs mt-4">{error}</p>}
          </div>
        ) : (
          <>
            <div className="mb-12">
               <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Qibla Direction</p>
               <h1 className="text-5xl font-mono font-bold text-[#1B4332]">{Math.round(qiblaDirection)}°</h1>
            </div>

            {/* THE COMPASS UI */}
            <div className="relative w-72 h-72">
               {/* Fixed Compass Ring */}
               <div className="absolute inset-0 border-4 border-gray-200 rounded-full shadow-inner flex items-center justify-center">
                  {/* Rotating Dial (Based on Phone Heading) */}
                  <div 
                    className="w-full h-full rounded-full transition-transform duration-300 ease-out flex items-center justify-center"
                    style={{ transform: `rotate(${-heading}deg)` }}
                  >
                      {/* North Marker */}
                      <div className="absolute top-2 font-bold text-red-500 text-xs">N</div>
                      
                      {/* KAABA POINTER (Relative to Dial) */}
                      <div 
                        className="absolute w-1 h-1/2 origin-bottom flex flex-col items-center justify-start pt-2"
                        style={{ transform: `rotate(${qiblaDirection}deg)` }}
                      >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${isAligned ? 'bg-green-500 scale-125 animate-pulse' : 'bg-[#1B4332]'}`}>
                              <div className="w-2 h-2 bg-yellow-400 rounded-sm rotate-45"></div> {/* Kaaba Icon */}
                          </div>
                          {isAligned && <div className="mt-2 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">You found it!</div>}
                      </div>
                  </div>
               </div>
               
               {/* Center Dot */}
               <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white z-10"></div>
            </div>

            <div className="mt-12 text-sm text-gray-500 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Navigation size={14} className={isAligned ? "text-green-500" : "text-gray-400"} />
                {isAligned ? "Facing Qibla" : "Rotate phone to find Qibla"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}