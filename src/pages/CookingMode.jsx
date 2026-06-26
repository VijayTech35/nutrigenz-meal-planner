import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Volume2, VolumeX, X, Timer, Play, Pause, RotateCcw, ChefHat } from 'lucide-react';
import api from '../services/api';

const CookingMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [speakEnabled, setSpeakEnabled] = useState(true);
    const [showTimer, setShowTimer] = useState(false);
    const [timerMinutes, setTimerMinutes] = useState(5);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerEndTime, setTimerEndTime] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    useEffect(() => {
        if (timerRunning && timerEndTime) {
            timerRef.current = setInterval(() => {
                const now = Date.now();
                const remaining = Math.ceil((timerEndTime - now) / 1000);
                
                if (remaining <= 0) {
                    setTimerRunning(false);
                    setTimerEndTime(null);
                    if (speakEnabled) {
                        const alarm = new SpeechSynthesisUtterance('Timer finished!');
                        alarm.rate = 1;
                        window.speechSynthesis.speak(alarm);
                    }
                    alert('Timer finished!');
                }
            }, 1000);
        }
        
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timerRunning, timerEndTime, speakEnabled]);

    const fetchRecipe = async () => {
        try {
            const response = await api.get(`/recipes/${id}`);
            setRecipe(response.data.data.recipe);
        } catch (error) {
            navigate('/recipes');
        }
    };

    const speak = (text) => {
        if (speakEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    };

    const nextStep = () => {
        if (recipe && currentStep < recipe.instructions.length - 1) {
            setCurrentStep(currentStep + 1);
            speak(`Step ${currentStep + 2}: ${recipe.instructions[currentStep + 1]}`);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            speak(`Step ${currentStep}: ${recipe.instructions[currentStep - 1]}`);
        }
    };

    const toggleStep = (index) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(index)) {
            newCompleted.delete(index);
        } else {
            newCompleted.add(index);
        }
        setCompletedSteps(newCompleted);
    };

    const finishCooking = () => {
        navigate(`/recipes/${id}`);
    };

    const startTimer = () => {
        const totalSeconds = timerMinutes * 60 + timerSeconds;
        if (totalSeconds > 0) {
            setTimerEndTime(Date.now() + totalSeconds * 1000);
            setTimerRunning(true);
        }
    };

    const pauseTimer = () => {
        setTimerRunning(false);
    };

    const resetTimer = () => {
        setTimerRunning(false);
        setTimerEndTime(null);
    };

    const getTimerDisplay = () => {
        if (!timerEndTime) {
            return `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;
        }
        const remaining = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    if (!recipe) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            </div>
        );
    }

    const progress = ((currentStep + 1) / recipe.instructions.length) * 100;

    const gradients = [
        'from-emerald-500 to-teal-500',
        'from-orange-500 to-rose-500',
        'from-violet-500 to-purple-500',
        'from-amber-500 to-orange-500',
        'from-cyan-500 to-blue-500',
    ];
    const gradient = gradients[id % gradients.length];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
            <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
                            <ChefHat className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{recipe.name}</h2>
                            <p className="text-sm text-slate-400">Cooking Mode</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowTimer(!showTimer)}
                            className={`p-3 rounded-xl transition-all ${showTimer ? `bg-gradient-to-r ${gradient}` : 'hover:bg-slate-700'}`}
                            title="Kitchen Timer"
                        >
                            <Timer className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                setSpeakEnabled(!speakEnabled);
                                if (speakEnabled) window.speechSynthesis.cancel();
                            }}
                            className="p-3 hover:bg-slate-700 rounded-xl transition-all"
                        >
                            {speakEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => navigate(`/recipes/${id}`)}
                            className="p-3 hover:bg-slate-700 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="h-1 bg-slate-700">
                    <div 
                        className={`h-full bg-gradient-to-r ${gradient} transition-all duration-300`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Timer Panel */}
            {showTimer && (
                <div className="fixed top-24 right-4 z-50 bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 w-80 shadow-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Timer className="w-5 h-5 text-emerald-400" /> Kitchen Timer
                    </h3>
                    <div className={`text-5xl font-bold text-center mb-6 font-mono bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                        {getTimerDisplay()}
                    </div>
                    {!timerRunning && !timerEndTime && (
                        <div className="flex gap-3 mb-4">
                            <div className="flex-1">
                                <label className="text-xs text-slate-400 mb-1 block">Minutes</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="180"
                                    value={timerMinutes}
                                    onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 bg-slate-700 rounded-xl text-center font-semibold"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-slate-400 mb-1 block">Seconds</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={timerSeconds}
                                    onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 bg-slate-700 rounded-xl text-center font-semibold"
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3">
                        {!timerRunning ? (
                            <button
                                onClick={timerEndTime ? () => setTimerRunning(true) : startTimer}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${gradient} rounded-xl font-bold hover:opacity-90 transition-opacity`}
                            >
                                <Play className="w-5 h-5" /> {timerEndTime ? 'Resume' : 'Start'}
                            </button>
                        ) : (
                            <button
                                onClick={pauseTimer}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-bold"
                            >
                                <Pause className="w-5 h-5" /> Pause
                            </button>
                        )}
                        <button
                            onClick={resetTimer}
                            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="pt-28 pb-28 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <span className={`text-sm font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                            Step {currentStep + 1} of {recipe.instructions.length}
                        </span>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-8 border border-slate-700">
                        <p className="text-2xl md:text-3xl leading-relaxed text-center text-slate-200">
                            {recipe.instructions[currentStep]}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => toggleStep(currentStep)}
                            className={`px-8 py-4 rounded-xl font-bold transition-all ${
                                completedSteps.has(currentStep)
                                    ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                                    : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                        >
                            {completedSteps.has(currentStep) ? (
                                <><Check className="w-5 h-5 inline mr-2" /> Done</>
                            ) : (
                                'Mark as Done'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                            currentStep === 0
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    {currentStep === recipe.instructions.length - 1 ? (
                        <button
                            onClick={finishCooking}
                            className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${gradient} rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg`}
                        >
                            Finish Cooking
                            <Check className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${gradient} rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg`}
                        >
                            Next Step
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CookingMode;
