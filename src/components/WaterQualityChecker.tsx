import React, { useState } from 'react';
import { Thermometer, Droplets, Wind, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Assessment {
  level: 'success' | 'warning' | 'danger';
  text: string;
}

export const WaterQualityChecker: React.FC = () => {
  const [temp, setTemp] = useState<string>('27');
  const [ph, setPh] = useState<string>('7.2');
  const [oxygen, setOxygen] = useState<string>('6.5');

  const analyze = (): Assessment[] => {
    const t = parseFloat(temp);
    const p = parseFloat(ph);
    const o = parseFloat(oxygen);
    const results: Assessment[] = [];

    if (!isNaN(t)) {
      if (t < 24) {
        results.push({
          level: 'warning',
          text: 'Water temperature is below optimal (24–30°C). Consider heating or reducing feed to prevent indigestion.'
        });
      } else if (t > 32) {
        results.push({
          level: 'danger',
          text: 'Water temperature is too high (>32°C). This stresses Clarias batrachus and reduces oxygen solubility. Cool the water immediately.'
        });
      } else {
        results.push({
          level: 'success',
          text: 'Temperature is in the optimal range (24–30°C) for Clarias batrachus growth.'
        });
      }
    }

    if (!isNaN(p)) {
      if (p < 6.5) {
        results.push({
          level: 'warning',
          text: 'pH is acidic (<6.5). Add agricultural limestone to stabilize. Acidic water affects nutrient absorption.'
        });
      } else if (p > 9.0) {
        results.push({
          level: 'danger',
          text: 'pH is too alkaline (>9.0). High pH is toxic to catfish. Perform a partial water change and monitor.'
        });
      } else {
        results.push({
          level: 'success',
          text: 'pH is in the ideal range (6.5–9.0) for catfish health.'
        });
      }
    }

    if (!isNaN(o)) {
      if (o < 3) {
        results.push({
          level: 'danger',
          text: 'Dissolved oxygen is critically low (<3 mg/L). Turn on emergency aerators immediately to prevent suffocation.'
        });
      } else if (o < 5) {
        results.push({
          level: 'warning',
          text: 'Dissolved oxygen is adequate (3–5 mg/L) but sub-optimal. Increase aeration during feeding peak hours.'
        });
      } else {
        results.push({
          level: 'success',
          text: 'Dissolved oxygen is optimal (>5 mg/L) for maximum appetite and rapid growth.'
        });
      }
    }

    return results;
  };

  const assessments = analyze();

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/60 my-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-primary/20 text-primary">
          <Droplets className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Interactive Water Quality Diagnostics</h3>
          <p className="text-xs text-muted-foreground">
            Test your pond parameters against optimal Clarias batrachus bio-benchmarks.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {/* Temperature input */}
        <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/40">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-amber-500" />
            Water Temp (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={temp}
            onChange={e => setTemp(e.target.value)}
            placeholder="24 - 30"
            className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          <span className="text-[11px] text-muted-foreground block">Ideal: 24.0°C – 30.0°C</span>
        </div>

        {/* pH Level */}
        <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/40">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-500" />
            pH Level
          </label>
          <input
            type="number"
            step="0.1"
            value={ph}
            onChange={e => setPh(e.target.value)}
            placeholder="6.5 - 9.0"
            className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          <span className="text-[11px] text-muted-foreground block">Ideal: 6.5 – 9.0</span>
        </div>

        {/* Dissolved Oxygen */}
        <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/40">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-emerald-500" />
            Dissolved Oxygen (mg/L)
          </label>
          <input
            type="number"
            step="0.1"
            value={oxygen}
            onChange={e => setOxygen(e.target.value)}
            placeholder="> 5.0"
            className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          <span className="text-[11px] text-muted-foreground block">Ideal: &gt; 5.0 mg/L</span>
        </div>
      </div>

      {/* Diagnostics output list */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Bio-Analysis Report
        </h4>
        {assessments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Enter values above to analyze pond safety.</p>
        ) : (
          <div className="space-y-2">
            {assessments.map((a, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm ${
                  a.level === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : a.level === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-destructive/10 border-destructive/30 text-destructive'
                }`}
              >
                {a.level === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                ) : a.level === 'warning' ? (
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
                )}
                <span>{a.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
