
const strength=[/pull[- ]?ups?/i,/push[- ]?ups?/i,/row|roeien|dumbbell|shoulder|schouder/i]
const power=[/sprint|hip[- ]?hop/i]
const core=[/plank|core|bridge|sit[- ]?ups?/i]
export function setRestSecondsFor(label:string){ const l=label.toLowerCase(); if(core.some(r=>r.test(l))) return 45; if(power.some(r=>r.test(l))) return 90; if(strength.some(r=>r.test(l))) return 75; return 60 }
export function exerciseRestSecondsFor(label:string){ const l=label.toLowerCase(); if(core.some(r=>r.test(l))) return 60; if(power.some(r=>r.test(l))) return 150; if(strength.some(r=>r.test(l))) return 120; return 90 }
