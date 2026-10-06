import {installReactTimingGuard} from './lib/react-dev-timing.mjs';

// Runs before hydration. Production keeps the native Performance API untouched.
if(process.env.NODE_ENV==='development')installReactTimingGuard(performance);
