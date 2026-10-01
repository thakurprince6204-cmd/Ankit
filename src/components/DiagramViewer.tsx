import React, { useState } from 'react';
import { DiagramType } from '../types/dictionary';
import { Activity, ArrowRight, CheckCircle2, Info, RefreshCw, Zap } from 'lucide-react';

interface DiagramViewerProps {
  type?: DiagramType;
  title?: string;
  subtitle?: string;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({
  type = 'general',
  title,
  subtitle
}) => {
  // Lever state
  const [activeLeverClass, setActiveLeverClass] = useState<'first' | 'second' | 'third'>('third');

  // Cardiac state
  const [strokeVolume, setStrokeVolume] = useState<number>(75);
  const [heartRate, setHeartRate] = useState<number>(72);

  // Tournament state
  const [numTeams, setNumTeams] = useState<number>(11);

  // Posture state
  const [postureType, setPostureType] = useState<'normal' | 'kyphosis' | 'lordosis' | 'scoliosis'>('kyphosis');

  // PRICER state
  const [pricerStep, setPricerStep] = useState<number>(0);

  // Ashtanga state
  const [activeLimb, setActiveLimb] = useState<number>(3); // Pranayama by default

  // Energy system state
  const [exerciseDuration, setExerciseDuration] = useState<number>(30); // 30 seconds

  // Harvard Step test state
  const [durationSec, setDurationSec] = useState<number>(300);
  const [p1, setP1] = useState<number>(75);
  const [p2, setP2] = useState<number>(65);
  const [p3, setP3] = useState<number>(55);

  // Render Lever Diagram
  const renderLever = () => {
    return (
      <div className="space-y-4">
        {/* Class selector */}
        <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold text-slate-700">
          <button
            onClick={() => setActiveLeverClass('first')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeLeverClass === 'first' ? 'bg-white shadow-xs text-sky-700 font-bold' : 'hover:text-slate-900'
            }`}
          >
            1st Class (E-F-L)
          </button>
          <button
            onClick={() => setActiveLeverClass('second')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeLeverClass === 'second' ? 'bg-white shadow-xs text-sky-700 font-bold' : 'hover:text-slate-900'
            }`}
          >
            2nd Class (F-L-E)
          </button>
          <button
            onClick={() => setActiveLeverClass('third')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeLeverClass === 'third' ? 'bg-white shadow-xs text-sky-700 font-bold' : 'hover:text-slate-900'
            }`}
          >
            3rd Class (F-E-L)
          </button>
        </div>

        {/* SVG Graphic */}
        <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
          <svg viewBox="0 0 500 190" className="w-full h-auto">
            {/* Base ground line */}
            <line x1="40" y1="160" x2="460" y2="160" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

            {activeLeverClass === 'first' && (
              <>
                {/* 1st Class: Fulcrum in middle */}
                {/* Fulcrum Triangle */}
                <polygon points="250,110 230,158 270,158" fill="#38bdf8" />
                <circle cx="250" cy="110" r="4" fill="#ffffff" />
                <text x="250" y="175" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">Fulcrum (Pivot)</text>

                {/* Lever Bar */}
                <line x1="80" y1="106" x2="420" y2="106" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />

                {/* Effort Left (Down) */}
                <line x1="100" y1="50" x2="100" y2="95" stroke="#4ade80" strokeWidth="3" markerEnd="url(#arrow-down)" />
                <polygon points="100,102 94,90 106,90" fill="#4ade80" />
                <text x="100" y="42" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">Effort (Muscle Force)</text>

                {/* Load Right (Up/Resistance) */}
                <rect x="375" y="80" width="30" height="24" rx="3" fill="#f87171" />
                <text x="390" y="96" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">LOAD</text>
                <line x1="390" y1="106" x2="390" y2="135" stroke="#f87171" strokeWidth="3" />
                <polygon points="390,140 384,128 396,128" fill="#f87171" />
                <text x="390" y="152" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">Resistance</text>
              </>
            )}

            {activeLeverClass === 'second' && (
              <>
                {/* 2nd Class: Fulcrum Left, Load Middle, Effort Right (Up) */}
                {/* Fulcrum Triangle at Left */}
                <polygon points="90,110 70,158 110,158" fill="#38bdf8" />
                <circle cx="90" cy="110" r="4" fill="#ffffff" />
                <text x="90" y="175" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">Fulcrum (Ball of Foot)</text>

                {/* Lever Bar */}
                <line x1="85" y1="106" x2="420" y2="106" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />

                {/* Load Middle (Down) */}
                <rect x="235" y="80" width="30" height="24" rx="3" fill="#f87171" />
                <text x="250" y="96" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">BODY</text>
                <polygon points="250,135 244,120 256,120" fill="#f87171" />
                <line x1="250" y1="106" x2="250" y2="128" stroke="#f87171" strokeWidth="3" />
                <text x="250" y="150" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">Load (Weight)</text>

                {/* Effort Right (Upward pull) */}
                <line x1="410" y1="106" x2="410" y2="55" stroke="#4ade80" strokeWidth="3" />
                <polygon points="410,48 404,62 416,62" fill="#4ade80" />
                <text x="410" y="40" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">Effort (Calf Muscle)</text>
              </>
            )}

            {activeLeverClass === 'third' && (
              <>
                {/* 3rd Class: Fulcrum Left, Effort Middle, Load Right */}
                {/* Fulcrum Triangle at Left */}
                <polygon points="90,110 70,158 110,158" fill="#38bdf8" />
                <circle cx="90" cy="110" r="4" fill="#ffffff" />
                <text x="90" y="175" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">Fulcrum (Elbow Joint)</text>

                {/* Lever Bar */}
                <line x1="85" y1="106" x2="420" y2="106" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />

                {/* Effort Middle (Upward pull from Biceps insertion) */}
                <line x1="220" y1="106" x2="220" y2="55" stroke="#4ade80" strokeWidth="3" />
                <polygon points="220,48 214,62 226,62" fill="#4ade80" />
                <text x="220" y="40" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">Effort (Biceps Insertion)</text>

                {/* Load at Right Hand */}
                <rect x="395" y="80" width="32" height="24" rx="3" fill="#f87171" />
                <text x="411" y="96" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">WEIGHT</text>
                <polygon points="411,135 405,120 417,120" fill="#f87171" />
                <line x1="411" y1="106" x2="411" y2="128" stroke="#f87171" strokeWidth="3" />
                <text x="411" y="152" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">Load in Hand</text>
              </>
            )}
          </svg>
        </div>

        {/* Dynamic Explanation Box */}
        <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg text-xs text-sky-900 flex items-start gap-2.5">
          <Info size={16} className="text-sky-600 shrink-0 mt-0.5" />
          <div>
            {activeLeverClass === 'first' && (
              <p>
                <strong>First Class (E-F-L):</strong> Fulcrum is between Effort and Load. Human body example:
                Atlanto-occipital neck joint nodding the head. Mechanical Advantage can be &gt; 1, &lt; 1, or = 1.
              </p>
            )}
            {activeLeverClass === 'second' && (
              <p>
                <strong>Second Class (F-L-E):</strong> Load is in the middle. Human body example: Plantar flexion at
                the ankle (standing on tiptoes). Mechanical Advantage is ALWAYS &gt; 1 (Force Multiplier).
              </p>
            )}
            {activeLeverClass === 'third' && (
              <p>
                <strong>Third Class (F-E-L):</strong> Effort is in the middle. Human body example: Biceps curl at
                the elbow joint. <em>Most common lever in the human body</em>. Prioritizes Speed &amp; Range of Motion (MA &lt; 1).
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Cardiac Output Interactive Simulator
  const renderCardiac = () => {
    const cardiacOutputLiters = ((strokeVolume * heartRate) / 1000).toFixed(2);
    const isAthletic = parseFloat(cardiacOutputLiters) > 15;

    return (
      <div className="space-y-4">
        {/* Live Calculation Display */}
        <div className="bg-slate-900 rounded-xl p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Cardiac Output (Q)</span>
            <div className="text-3xl font-extrabold text-sky-400 tracking-tight flex items-baseline gap-1 mt-0.5">
              <span>{cardiacOutputLiters}</span>
              <span className="text-sm font-normal text-slate-300">Liters / min</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Formula: Q = Stroke Volume (SV) × Heart Rate (HR)
            </span>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                parseFloat(cardiacOutputLiters) < 7
                  ? 'bg-slate-800 text-slate-300'
                  : isAthletic
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                  : 'bg-amber-950 text-amber-300 border border-amber-700/50'
              }`}
            >
              {parseFloat(cardiacOutputLiters) < 6
                ? 'Resting Basal State'
                : parseFloat(cardiacOutputLiters) < 15
                ? 'Moderate Exercise'
                : 'Maximal Endurance Workload'}
            </span>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Stroke Volume (SV):</span>
              <span className="text-sky-600 font-mono font-bold">{strokeVolume} mL / beat</span>
            </div>
            <input
              type="range"
              min={50}
              max={180}
              step={5}
              value={strokeVolume}
              onChange={e => setStrokeVolume(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>50 mL (Sedentary)</span>
              <span>70–80 mL (Normal Rest)</span>
              <span>180 mL (Olympic Athlete)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Heart Rate (HR):</span>
              <span className="text-rose-600 font-mono font-bold">{heartRate} beats / min</span>
            </div>
            <input
              type="range"
              min={40}
              max={200}
              step={2}
              value={heartRate}
              onChange={e => setHeartRate(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>40 bpm (Athletic Bradycardia)</span>
              <span>72 bpm (Normal Rest)</span>
              <span>190–200 bpm (Max HR)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setStrokeVolume(70);
              setHeartRate(72);
            }}
            className="flex-1 py-1.5 text-xs font-medium border border-slate-200 bg-white rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Preset: Normal Adult Rest (5.0 L/min)
          </button>
          <button
            onClick={() => {
              setStrokeVolume(160);
              setHeartRate(190);
            }}
            className="flex-1 py-1.5 text-xs font-medium border border-sky-200 bg-sky-50 rounded-md text-sky-800 hover:bg-sky-100 transition-colors"
          >
            Preset: Olympic Marathoner (30.4 L/min)
          </button>
        </div>
      </div>
    );
  };

  // Render Spirometry Lung Volumes Graphic
  const renderSpirometry = () => {
    return (
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-xl p-5 text-white relative">
          <svg viewBox="0 0 520 220" className="w-full h-auto">
            {/* Background grid lines */}
            <line x1="50" y1="30" x2="480" y2="30" stroke="#1e293b" strokeWidth="1" />
            <line x1="50" y1="80" x2="480" y2="80" stroke="#1e293b" strokeWidth="1" />
            <line x1="50" y1="130" x2="480" y2="130" stroke="#1e293b" strokeWidth="1" />
            <line x1="50" y1="180" x2="480" y2="180" stroke="#1e293b" strokeWidth="1" />

            {/* Y axis volume marks */}
            <text x="40" y="34" textAnchor="end" fill="#64748b" fontSize="10">6000ml</text>
            <text x="40" y="84" textAnchor="end" fill="#64748b" fontSize="10">4500ml</text>
            <text x="40" y="134" textAnchor="end" fill="#64748b" fontSize="10">2500ml</text>
            <text x="40" y="184" textAnchor="end" fill="#64748b" fontSize="10">1200ml</text>

            {/* Spirometer Sine Wave with peak inspiration and deep expiration */}
            <path
              d="M 60,130 
                 Q 80,110 100,130 T 140,130 T 180,130 
                 C 210,130 220,35 240,35 
                 C 260,35 265,190 290,190 
                 C 310,190 320,130 340,130 
                 T 380,130 T 420,130 T 460,130"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
            />

            {/* Tidal Volume Band */}
            <rect x="70" y="115" width="90" height="30" fill="#38bdf8" fillOpacity="0.15" rx="3" />
            <text x="115" y="105" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">TV (500ml)</text>

            {/* IRV arrow */}
            <line x1="240" y1="115" x2="240" y2="40" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 3" />
            <text x="250" y="75" fill="#a78bfa" fontSize="11" fontWeight="bold">IRV (~3000ml)</text>

            {/* ERV arrow */}
            <line x1="290" y1="145" x2="290" y2="185" stroke="#f472b6" strokeWidth="2" strokeDasharray="3 3" />
            <text x="300" y="165" fill="#f472b6" fontSize="11" fontWeight="bold">ERV (~1100ml)</text>

            {/* Residual Volume shaded bottom zone */}
            <rect x="50" y="185" width="430" height="30" fill="#334155" fillOpacity="0.4" />
            <text x="260" y="202" textAnchor="middle" fill="#94a3b8" fontSize="11">Residual Volume (RV ~1200ml - Never exhaled)</text>

            {/* Vital capacity bracket on right */}
            <line x1="470" y1="35" x2="470" y2="185" stroke="#4ade80" strokeWidth="2" />
            <line x1="465" y1="35" x2="475" y2="35" stroke="#4ade80" strokeWidth="2" />
            <line x1="465" y1="185" x2="475" y2="185" stroke="#4ade80" strokeWidth="2" />
            <text x="478" y="110" fill="#4ade80" fontSize="11" fontWeight="bold">Vital Capacity</text>
            <text x="478" y="124" fill="#86efac" fontSize="10">(VC = TV+IRV+ERV)</text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-800">Vital Capacity (VC):</span>
            <p className="text-slate-600 text-[11px] mt-0.5">TV (500ml) + IRV (3000ml) + ERV (1100ml) ≈ 4600ml. Max air forcibly exhaled.</p>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-800">Total Lung Capacity (TLC):</span>
            <p className="text-slate-600 text-[11px] mt-0.5">VC (4600ml) + RV (1200ml) ≈ 5800ml. Total air volume in lungs after max inhale.</p>
          </div>
        </div>
      </div>
    );
  };

  // Render Knockout Tournament Calculator
  const renderTournament = () => {
    // Next higher power of 2
    let nextPower = 2;
    let rounds = 1;
    while (nextPower < numTeams) {
      nextPower *= 2;
      rounds += 1;
    }

    const byes = nextPower - numTeams;
    const totalMatches = numTeams - 1;
    const upperHalfTeams = Math.ceil(numTeams / 2);
    const lowerHalfTeams = Math.floor(numTeams / 2);
    const upperHalfByes = Math.floor(byes / 2);
    const lowerHalfByes = Math.ceil(byes / 2);

    return (
      <div className="space-y-4">
        {/* Interactive Team Slider */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Number of Participating Teams (N):</span>
            <span className="text-sky-600 font-mono font-bold text-base">{numTeams} Teams</span>
          </div>
          <input
            type="range"
            min={5}
            max={21}
            value={numTeams}
            onChange={e => setNumTeams(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>5 teams</span>
            <span>11 teams (CBSE standard)</span>
            <span>16 teams (Power of 2 = 0 byes)</span>
            <span>21 teams</span>
          </div>
        </div>

        {/* Formula Output Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Byes</span>
            <span className="text-2xl font-black text-rose-600">{byes}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{nextPower} - {numTeams}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Matches</span>
            <span className="text-2xl font-black text-sky-600">{totalMatches}</span>
            <span className="text-[10px] text-slate-500 block font-mono">N - 1</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Rounds</span>
            <span className="text-2xl font-black text-emerald-600">{rounds}</span>
            <span className="text-[10px] text-slate-500 block font-mono">2^{rounds} = {nextPower}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Halves (U / L)</span>
            <span className="text-lg font-black text-purple-600 mt-1">{upperHalfTeams} / {lowerHalfTeams}</span>
            <span className="text-[10px] text-slate-500 block font-mono">(N+1)/2, (N-1)/2</span>
          </div>
        </div>

        {/* Bye Allocation Rules Box */}
        <div className="p-3 bg-slate-900 text-white rounded-lg text-xs space-y-1.5 font-mono">
          <p className="text-sky-400 font-bold font-sans">Official Bye Distribution Order (KVS/CBSE Rule):</p>
          <p className="text-slate-300">1st Bye: Last team of Lower Half</p>
          <p className="text-slate-300">2nd Bye: First team of Upper Half</p>
          <p className="text-slate-300">3rd Bye: First team of Lower Half</p>
          <p className="text-slate-300">4th Bye: Last team of Upper Half (Cycle repeats)</p>
        </div>
      </div>
    );
  };

  // Render Postural Deformities
  const renderPosture = () => {
    return (
      <div className="space-y-4">
        {/* Selector */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setPostureType('normal')}
            className={`py-1.5 rounded-md transition-all ${
              postureType === 'normal' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600'
            }`}
          >
            Normal Spine
          </button>
          <button
            onClick={() => setPostureType('kyphosis')}
            className={`py-1.5 rounded-md transition-all ${
              postureType === 'kyphosis' ? 'bg-white shadow-xs text-rose-700 font-bold' : 'text-slate-600'
            }`}
          >
            Kyphosis
          </button>
          <button
            onClick={() => setPostureType('lordosis')}
            className={`py-1.5 rounded-md transition-all ${
              postureType === 'lordosis' ? 'bg-white shadow-xs text-amber-700 font-bold' : 'text-slate-600'
            }`}
          >
            Lordosis
          </button>
          <button
            onClick={() => setPostureType('scoliosis')}
            className={`py-1.5 rounded-md transition-all ${
              postureType === 'scoliosis' ? 'bg-white shadow-xs text-purple-700 font-bold' : 'text-slate-600'
            }`}
          >
            Scoliosis
          </button>
        </div>

        {/* Anatomical Silhouette Diagram */}
        <div className="bg-slate-900 rounded-xl p-6 text-white text-center">
          <svg viewBox="0 0 380 200" className="w-full max-w-sm mx-auto h-auto">
            {postureType === 'normal' && (
              <>
                {/* Normal gentle S-curve */}
                <path
                  d="M 190,30 C 193,60 185,90 190,120 C 193,150 188,180 190,190"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle cx="190" cy="20" r="10" fill="#4ade80" />
                <text x="190" y="115" textAnchor="start" fill="#86efac" fontSize="12" dx="15">
                  Natural Balanced Curves
                </text>
              </>
            )}

            {postureType === 'kyphosis' && (
              <>
                {/* Kyphosis: Exaggerated outward thoracic bump */}
                <path
                  d="M 190,30 C 235,65 210,110 190,135 C 185,160 188,180 190,190"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="190" cy="20" r="10" fill="#f87171" />
                <circle cx="218" cy="75" r="5" fill="#ef4444" />
                <text x="235" y="80" textAnchor="start" fill="#fca5a5" fontSize="12" fontWeight="bold">
                  Thoracic Convexity (Hunchback)
                </text>
              </>
            )}

            {postureType === 'lordosis' && (
              <>
                {/* Lordosis: Inward lumbar hollow */}
                <path
                  d="M 190,30 C 192,60 185,95 160,130 C 185,160 190,180 190,190"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="190" cy="20" r="10" fill="#fbbf24" />
                <circle cx="160" cy="130" r="5" fill="#f59e0b" />
                <text x="145" y="135" textAnchor="end" fill="#fde68a" fontSize="12" fontWeight="bold">
                  Lumbar Inward Hollow (Swayback)
                </text>
              </>
            )}

            {postureType === 'scoliosis' && (
              <>
                {/* Scoliosis: Lateral sideways S-bend seen from back */}
                <path
                  d="M 190,30 C 145,70 235,120 190,185"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="190" cy="20" r="10" fill="#c084fc" />
                <text x="210" y="70" textAnchor="start" fill="#e9d5ff" fontSize="12" fontWeight="bold">
                  Lateral C/S Sideways Deviation
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Detailed Correction Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
          {postureType === 'kyphosis' && (
            <div>
              <span className="font-bold text-slate-900 block text-sm">Kyphosis (Hunchback / Round Back)</span>
              <p className="text-slate-600 mt-0.5">
                Deformity of the <strong>Thoracic region</strong> of the spine. Exaggerated backward convex curve.
              </p>
              <div className="mt-2 text-slate-700">
                <span className="font-semibold text-rose-700">Recommended Corrective Asanas:</span> Bhujangasana (Cobra), Dhanurasana (Bow), Ushtrasana (Camel), and Swimming.
              </div>
            </div>
          )}

          {postureType === 'lordosis' && (
            <div>
              <span className="font-bold text-slate-900 block text-sm">Lordosis (Hollow Back / Swayback)</span>
              <p className="text-slate-600 mt-0.5">
                Deformity of the <strong>Lumbar region</strong> of the spine. Inward hyper-extension with anterior pelvic tilt.
              </p>
              <div className="mt-2 text-slate-700">
                <span className="font-semibold text-amber-700">Recommended Corrective Asanas:</span> Halasana (Plow), Paschimottanasana (Seated Forward Bend), and Pelvic Tilts.
              </div>
            </div>
          )}

          {postureType === 'scoliosis' && (
            <div>
              <span className="font-bold text-slate-900 block text-sm">Scoliosis (Lateral Spine Curvature)</span>
              <p className="text-slate-600 mt-0.5">
                <strong>Sideways lateral deviation</strong> of the vertebral column into a C-curve or S-curve, with uneven shoulders.
              </p>
              <div className="mt-2 text-slate-700">
                <span className="font-semibold text-purple-700">Recommended Corrective Exercises:</span> Hanging on horizontal bars, Trikonasana (Triangle pose) on concave side, and Breaststroke swimming.
              </div>
            </div>
          )}

          {postureType === 'normal' && (
            <div>
              <span className="font-bold text-slate-900 block text-sm">Normal Anatomical Spine</span>
              <p className="text-slate-600 mt-0.5">
                Features balanced physiological lordotic curves in the cervical and lumbar regions, and kyphotic curves in the thoracic and sacral regions for optimal shock absorption.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render PRICER Steps
  const renderPricer = () => {
    const steps = [
      { letter: 'P', title: 'Protect', desc: 'Shield the injured joint or muscle from further trauma using splints, braces, or crutches.' },
      { letter: 'R', title: 'Rest', desc: 'Cease physical activity immediately to limit internal bleeding and prevent muscle fiber tearing.' },
      { letter: 'I', title: 'Ice (Cryotherapy)', desc: 'Apply ice in a damp towel for 15–20 minutes every 2–3 hours. Induces vasoconstriction and reduces swelling.' },
      { letter: 'C', title: 'Compress', desc: 'Wrap an elastic compression bandage firmly starting distal to the injury to prevent interstitial fluid accumulation.' },
      { letter: 'E', title: 'Elevate', desc: 'Prop the injured limb above heart level whenever resting to promote venous return and lymphatic drainage.' },
      { letter: 'R', title: 'Refer', desc: 'Direct the athlete to an orthopedic sports physician or physiotherapist for accurate radiological diagnosis.' }
    ];

    return (
      <div className="space-y-4">
        {/* Step Letters */}
        <div className="grid grid-cols-6 gap-1">
          {steps.map((s, idx) => (
            <button
              key={s.letter}
              onClick={() => setPricerStep(idx)}
              className={`py-2 rounded-lg font-black text-sm flex flex-col items-center transition-all ${
                pricerStep === idx
                  ? 'bg-rose-600 text-white shadow-xs scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{s.letter}</span>
              <span className="text-[9px] font-normal uppercase">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Active Step Card */}
        <div className="p-4 bg-slate-900 text-white rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-lg font-black text-white shrink-0">
              {steps[pricerStep].letter}
            </div>
            <div>
              <h4 className="font-bold text-base text-white">{steps[pricerStep].title}</h4>
              <p className="text-slate-300 text-xs mt-0.5">{steps[pricerStep].desc}</p>
            </div>
          </div>
        </div>

        {/* Counter rule warning */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
          <strong className="text-amber-800">Exam Note - Avoid "HARM" in first 48 hours:</strong>
          <span className="block mt-0.5">
            <strong>H</strong>eat, <strong>A</strong>lcohol, <strong>R</strong>unning / Exercise, and <strong>M</strong>assage. All increase vasodilation and worsen swelling!
          </span>
        </div>
      </div>
    );
  };

  // Render Ashtanga Yoga Wheel
  const renderAshtanga = () => {
    const limbs = [
      { num: 1, name: 'Yama', hindi: 'यम', desc: '5 Social Restraints: Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha.', type: 'Bahiranga' },
      { num: 2, name: 'Niyama', hindi: 'नियम', desc: '5 Personal Observances: Saucha, Santosha, Tapas, Svadhyaya, Ishvara Pranidhana.', type: 'Bahiranga' },
      { num: 3, name: 'Asana', hindi: 'आसन', desc: 'Steady, comfortable posture ("Sthira Sukham Asanam" - Sutra 2.46).', type: 'Bahiranga' },
      { num: 4, name: 'Pranayama', hindi: 'प्राणायाम', desc: 'Breath regulation: Puraka (Inhale), Kumbhaka (Retention), Rechaka (Exhale).', type: 'Bahiranga' },
      { num: 5, name: 'Pratyahara', hindi: 'प्रत्याहार', desc: 'Withdrawal of sensory organs inward away from external distractions.', type: 'Bahiranga' },
      { num: 6, name: 'Dharana', hindi: 'धारणा', desc: 'Fixing consciousness onto a single point of concentration.', type: 'Antaranga' },
      { num: 7, name: 'Dhyana', hindi: 'ध्यान', desc: 'Unbroken continuous meditative flow of awareness.', type: 'Antaranga' },
      { num: 8, name: 'Samadhi', hindi: 'समाधि', desc: 'Transcendental absorption, union with the Self, and liberation.', type: 'Antaranga' },
    ];

    return (
      <div className="space-y-4">
        {/* Limbs 1-8 horizontal scroll buttons */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {limbs.map((limb, idx) => (
            <button
              key={limb.num}
              onClick={() => setActiveLimb(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                activeLimb === idx
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="font-mono mr-1 text-[11px] opacity-75">{limb.num}.</span>
              {limb.name}
            </button>
          ))}
        </div>

        {/* Selected Limb Details */}
        <div className="p-4 bg-amber-950 text-amber-50 rounded-xl border border-amber-900">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-amber-400 font-hindi text-base block">{limbs[activeLimb].hindi}</span>
              <h4 className="text-lg font-bold text-white">
                {limbs[activeLimb].num}. {limbs[activeLimb].name}
              </h4>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                limbs[activeLimb].type === 'Bahiranga'
                  ? 'bg-amber-800/80 text-amber-200'
                  : 'bg-purple-900 text-purple-200'
              }`}
            >
              {limbs[activeLimb].type} Yoga (Limbs {limbs[activeLimb].type === 'Bahiranga' ? '1–5' : '6–8'})
            </span>
          </div>
          <p className="mt-2 text-xs text-amber-100/90 leading-relaxed">{limbs[activeLimb].desc}</p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
          <strong className="text-slate-900">Samyama Note:</strong> The final three internal limbs (Dharana, Dhyana, Samadhi) practiced together in integration are called <strong>Samyama</strong> (Patanjali Sutra 3.4).
        </div>
      </div>
    );
  };

  // Render Harvard Step Test Interactive Calculator
  const renderHarvard = () => {
    const pulseSum = p1 + p2 + p3;
    const peiLong = pulseSum > 0 ? ((durationSec * 100) / (2 * pulseSum)).toFixed(1) : '0';
    const peiShort = p1 > 0 ? ((durationSec * 100) / (5.5 * p1)).toFixed(1) : '0';

    const peiVal = parseFloat(peiLong);
    let category = 'Excellent';
    let catColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (peiVal < 55) {
      category = 'Poor';
      catColor = 'text-rose-600 bg-rose-50 border-rose-200';
    } else if (peiVal < 65) {
      category = 'Low Average';
      catColor = 'text-amber-600 bg-amber-50 border-amber-200';
    } else if (peiVal < 80) {
      category = 'High Average';
      catColor = 'text-sky-600 bg-sky-50 border-sky-200';
    } else if (peiVal < 90) {
      category = 'Good';
      catColor = 'text-teal-600 bg-teal-50 border-teal-200';
    }

    return (
      <div className="space-y-4">
        {/* PEI Score Display */}
        <div className="bg-slate-900 rounded-xl p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Physical Efficiency Index (PEI)</span>
            <div className="text-3xl font-extrabold text-sky-400 tracking-tight flex items-baseline gap-2 mt-0.5">
              <span>{peiLong}</span>
              <span className="text-xs font-normal text-slate-300">(Short Form: {peiShort})</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Formula: (Duration in sec × 100) / [2 × (Pulse 1 + Pulse 2 + Pulse 3)]
            </span>
          </div>

          <div className="text-right">
            <span className={`inline-block px-3 py-1.5 rounded-lg border text-xs font-bold ${catColor}`}>
              {category} Fitness
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Test Duration (seconds):</label>
            <input
              type="number"
              min={60}
              max={300}
              step={10}
              value={durationSec}
              onChange={e => setDurationSec(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-sm"
            />
            <span className="text-[10px] text-slate-400">Max = 300s (5 minutes)</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pulse 1 (1 – 1.5 min):</label>
            <input
              type="number"
              min={30}
              max={120}
              value={p1}
              onChange={e => setP1(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-sm"
            />
            <span className="text-[10px] text-slate-400">Pulse count for 30 seconds</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pulse 2 (2 – 2.5 min):</label>
            <input
              type="number"
              min={30}
              max={120}
              value={p2}
              onChange={e => setP2(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pulse 3 (3 – 3.5 min):</label>
            <input
              type="number"
              min={30}
              max={120}
              value={p3}
              onChange={e => setP3(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-sm"
            />
          </div>
        </div>

        <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg text-xs text-sky-900">
          <strong>Bench Standards:</strong> 20 inches (50.8 cm) for men, 16 inches for women and schoolboys. Stepping rate is 30 cycles per minute (120 metronome beats).
        </div>
      </div>
    );
  };

  // Render Energy Systems Spectrum
  const renderEnergy = () => {
    // Estimate contributions based on duration
    let atp = 0;
    let glycolytic = 0;
    let aerobic = 0;

    if (exerciseDuration <= 10) {
      atp = 90 - exerciseDuration * 3;
      glycolytic = 10 + exerciseDuration * 2;
      aerobic = 100 - atp - glycolytic;
    } else if (exerciseDuration <= 60) {
      atp = Math.max(5, 50 - (exerciseDuration - 10));
      glycolytic = Math.max(30, 70 - (exerciseDuration - 10) * 0.6);
      aerobic = 100 - atp - glycolytic;
    } else {
      atp = 2;
      glycolytic = Math.max(5, 30 - (exerciseDuration - 60) * 0.1);
      aerobic = 100 - atp - glycolytic;
    }

    return (
      <div className="space-y-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Sprint / Exercise Duration:</span>
            <span className="text-sky-600 font-mono font-bold text-sm">{exerciseDuration} seconds</span>
          </div>
          <input
            type="range"
            min={2}
            max={240}
            value={exerciseDuration}
            onChange={e => setExerciseDuration(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>2s (Shot put)</span>
            <span>10s (100m sprint)</span>
            <span>45s (400m race)</span>
            <span>120s+ (800m+)</span>
          </div>
        </div>

        {/* Dynamic Energy Bar */}
        <div className="space-y-2">
          <div className="h-6 rounded-lg overflow-hidden flex text-[10px] font-bold text-white text-center leading-6">
            {atp > 5 && (
              <div style={{ width: `${atp}%` }} className="bg-amber-500 transition-all">
                ATP-PC {Math.round(atp)}%
              </div>
            )}
            {glycolytic > 5 && (
              <div style={{ width: `${glycolytic}%` }} className="bg-rose-500 transition-all">
                Glycolytic {Math.round(glycolytic)}%
              </div>
            )}
            {aerobic > 5 && (
              <div style={{ width: `${aerobic}%` }} className="bg-sky-600 transition-all">
                Aerobic {Math.round(aerobic)}%
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-900 block">1. ATP-PC (Phosphagen)</span>
              <span className="text-amber-800 text-[11px]">0–10 seconds. Alactic, explosive maximal force.</span>
            </div>
            <div className="p-2 rounded bg-rose-50 border border-rose-200">
              <span className="font-bold text-rose-900 block">2. Anaerobic Glycolytic</span>
              <span className="text-rose-800 text-[11px]">10–120 seconds. Produces lactic acid / lactate.</span>
            </div>
            <div className="p-2 rounded bg-sky-50 border border-sky-200">
              <span className="font-bold text-sky-900 block">3. Aerobic (Oxidative)</span>
              <span className="text-sky-800 text-[11px]">&gt;2 minutes. Uses oxygen, glycogen and fats.</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Anatomical Planes
  const renderPlanes = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
            <span className="font-bold text-sky-950 block text-sm">Sagittal Plane</span>
            <span className="text-sky-800 text-[11px] mt-1 block">
              Divides body into <strong>Right &amp; Left</strong> halves.
            </span>
            <div className="mt-2 text-[11px] text-sky-900 font-medium">
              Axis: <strong>Frontal (Transverse) Axis</strong>
              <br />
              Movements: Flexion, Extension (Running, Forward roll).
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="font-bold text-emerald-950 block text-sm">Frontal Plane</span>
            <span className="text-emerald-800 text-[11px] mt-1 block">
              Divides body into <strong>Anterior &amp; Posterior</strong> (Front &amp; Back).
            </span>
            <div className="mt-2 text-[11px] text-emerald-900 font-medium">
              Axis: <strong>Sagittal (Anteroposterior) Axis</strong>
              <br />
              Movements: Abduction, Adduction (Jumping jacks, Cartwheel).
            </div>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="font-bold text-purple-950 block text-sm">Transverse Plane</span>
            <span className="text-purple-800 text-[11px] mt-1 block">
              Divides body into <strong>Superior &amp; Inferior</strong> (Upper &amp; Lower).
            </span>
            <div className="mt-2 text-[11px] text-purple-900 font-medium">
              Axis: <strong>Vertical (Longitudinal) Axis</strong>
              <br />
              Movements: Rotation, Pronation, Supination (Discus spin, Pirouette).
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Somatotypes
  const renderSomatotype = () => {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="font-bold text-amber-950 block text-sm">Endomorph (7-1-1)</span>
            <p className="text-amber-800 text-[11px] mt-1">
              Soft, pear-shaped body, wide hips, thick neck, high body fat tendency.
            </p>
            <span className="block mt-2 text-[11px] font-semibold text-amber-900">Sports: Shot put, Weightlifting, Sumo.</span>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <span className="font-bold text-rose-950 block text-sm">Mesomorph (1-7-1)</span>
            <p className="text-rose-800 text-[11px] mt-1">
              Broad shoulders, narrow waist, muscular, low body fat, fast response to training.
            </p>
            <span className="block mt-2 text-[11px] font-semibold text-rose-900">Sports: Sprinters, Gymnasts, Boxers.</span>
          </div>

          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
            <span className="font-bold text-sky-950 block text-sm">Ectomorph (1-1-7)</span>
            <p className="text-sky-800 text-[11px] mt-1">
              Lean, linear, long delicate limbs, narrow chest and shoulders, high metabolism.
            </p>
            <span className="block mt-2 text-[11px] font-semibold text-sky-900">Sports: Marathoners, High Jumpers.</span>
          </div>
        </div>
      </div>
    );
  };

  // Render Newton Laws
  const renderNewton = () => {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <span className="font-bold text-sky-400 block text-sm">1. Law of Inertia</span>
            <p className="text-slate-300 text-[11px] mt-1">
              A body remains at rest or constant velocity unless acted upon by external net force.
            </p>
            <span className="block mt-2 text-[10px] text-sky-300 font-mono">Example: Sprinter in starting blocks.</span>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <span className="font-bold text-emerald-400 block text-sm">2. Law of Acceleration</span>
            <p className="text-slate-300 text-[11px] mt-1">
              F = m × a. Force applied is directly proportional to acceleration and mass.
            </p>
            <span className="block mt-2 text-[10px] text-emerald-300 font-mono">Example: Shot put release force.</span>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <span className="font-bold text-rose-400 block text-sm">3. Action &amp; Reaction</span>
            <p className="text-slate-300 text-[11px] mt-1">
              For every action, there is an equal and opposite reaction (Ground Reaction Force).
            </p>
            <span className="block mt-2 text-[10px] text-rose-300 font-mono">Example: Swimmer pushing off wall.</span>
          </div>
        </div>
      </div>
    );
  };

  // Default General Diagram View
  const renderGeneral = () => {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
        <Activity className="text-sky-600 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-xs text-slate-800">{title || 'Scientific Concept Diagram'}</h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {subtitle || 'Core physical education syllabus concept verified from NCERT & UGC-NET.'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-sky-600" />
          <h3 className="font-bold text-sm text-slate-900">{title || 'Interactive Scientific Illustration'}</h3>
        </div>
        {subtitle && <span className="text-xs text-slate-500 hidden sm:inline">{subtitle}</span>}
      </div>

      {type === 'lever' && renderLever()}
      {type === 'cardiac' && renderCardiac()}
      {type === 'spirometry' && renderSpirometry()}
      {type === 'tournament' && renderTournament()}
      {type === 'posture' && renderPosture()}
      {type === 'pricer' && renderPricer()}
      {type === 'ashtanga' && renderAshtanga()}
      {type === 'harvard' && renderHarvard()}
      {type === 'energy' && renderEnergy()}
      {type === 'planes' && renderPlanes()}
      {type === 'somatotype' && renderSomatotype()}
      {type === 'newton' && renderNewton()}
      {(type === 'fitt' || type === 'general') && renderGeneral()}
    </div>
  );
};
