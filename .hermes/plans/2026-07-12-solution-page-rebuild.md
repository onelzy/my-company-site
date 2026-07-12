# Solution Page Rebuild — Shelly-Inspired Pattern

## Files to modify
1. `src/content/solutions/smart-hotel-energy-management.mdoc` — add useCases
2. `src/content/solutions/industrial-energy-submetering.mdoc` — add useCases
3. `src/content/solutions/senior-care-monitoring.mdoc` — add useCases
4. `src/pages/solutions/[slug].astro` — restructure template

## Task 1: Add useCases to smart-hotel-energy-management.mdoc

In file `/home/admin/my-company-site/src/content/solutions/smart-hotel-energy-management.mdoc`, add this YAML block right after the `language: en` line (before `---`):

```yaml
useCases:
  - icon: 📊
    title: Per-Room Energy Submetering
    desc: Track kWh usage per floor, wing, or individual room with PC341 multi-circuit monitors.
  - icon: 🌡️
    title: Smart HVAC Automation
    desc: PCT513 thermostats detect occupancy and adjust temperature automatically — no manual intervention.
  - icon: 🖥️
    title: Central Facility Dashboard
    desc: EdgeEco provides real-time analytics, energy reports, and automated alerts for facility managers.
  - icon: 📱
    title: Guest Comfort Control
    desc: Guests adjust room temperature via in-room panel or mobile app — boosting satisfaction scores.
  - icon: 📈
    title: Energy Cost Reporting
    desc: Per-floor and per-hour cost breakdowns enable data-driven energy procurement decisions.
  - icon: ⚡
    title: Peak Load Management
    desc: Automated load shedding during peak demand periods to avoid utility surcharges.
```

## Task 2: Add useCases to industrial-energy-submetering.mdoc

In file `/home/admin/my-company-site/src/content/solutions/industrial-energy-submetering.mdoc`, add this YAML block right after the `language: en` line (before `---`):

```yaml
useCases:
  - icon: 🔌
    title: Per-Machine Circuit Monitoring
    desc: PC341 sub-CTs clamp onto individual machine circuits for granular consumption data.
  - icon: 🔗
    title: MQTT-Driven SCADA Integration
    desc: Real-time energy data streams into existing industrial control systems via MQTT broker.
  - icon: 🚨
    title: Anomaly Detection & Alerts
    desc: EdgeEco identifies abnormal consumption patterns — stuck valves, idle machines, power anomalies.
  - icon: 💰
    title: Cost Allocation by Line
    desc: Allocate energy costs per production line, shift, or SKU for accurate product costing.
  - icon: 📉
    title: Peak Shaving Strategy
    desc: Identify peak consumption patterns and implement load-shifting to reduce demand charges.
  - icon: 🛡️
    title: Offline Data Buffering
    desc: Local storage ensures zero data loss during network outages — 99.9% uptime guarantee.
```

## Task 3: Add useCases to senior-care-monitoring.mdoc

In file `/home/admin/my-company-site/src/content/solutions/senior-care-monitoring.mdoc`, add this YAML block right after the `language: en` line (before `---`):

```yaml
useCases:
  - icon: 🛏️
    title: Non-Contact Sleep Monitoring
    desc: SPM-915 pads under the mattress track heart rate, respiratory rate, and sleep quality — no wearables needed.
  - icon: 🚑
    title: Emergency Fall Detection
    desc: Passive infrared + bed sensors detect falls and prolonged inactivity — alerts sent within 3 seconds.
  - icon: 📲
    title: Real-Time Caregiver Alerts
    desc: AiJuan mobile app pushes instant notifications with room number, event type, and resident vitals.
  - icon: 📊
    title: Facility Analytics Dashboard
    desc: Track trends, compliance reports, and staffing recommendations across all residents.
  - icon: 🔔
    title: Wireless Call Buttons
    desc: Wall-mounted and portable emergency buttons for residents who prefer active alerting.
  - icon: 🌙
    title: Night Shift Optimization
    desc: Automated monitoring reduces night rounds by 40% — staff focus on response, not routine checks.
```

## Task 4: Restructure [slug].astro template

In file `/home/admin/my-company-site/src/pages/solutions/[slug].astro`, make these changes:

### 4a. Extract useCases from entry data

After line 23 (`const bodyHtml = renderMarkdown(entry.body || '');`), add:

```astro
const useCases = (entry.data.useCases as Array<{ icon: string; title: string; desc: string }>) || [];
```

### 4b. Extract productLines as clean labels

After the useCases line, add a helper to convert product line slugs to display labels:

```astro
const productLineLabels: Record<string, string> = {
  'smart-meters': 'Smart Meters',
  thermostats: 'Thermostats',
  'senior-care': 'Senior Care',
  'hotel-control': 'Hotel Control',
  'software-platforms': 'Software & Platforms',
};
```

### 4c. Replace generic KVP cards (lines 140-172) with solution-specific use case cards

Find the section starting with `<!-- Key Value Props — like Shelly's 4-up cards -->` and ending at the closing `</div>` of the 4-card grid. Replace the entire block with:

```astro
      <!-- Use Case Scenarios — Solution-Specific Cards -->
      {
        useCases.length > 0 && (
          <div class="mb-16">
            <h2 class="text-2xl font-bold mb-2 text-default dark:text-slate-100 text-center">Use Cases</h2>
            <p class="text-muted dark:text-slate-400 mb-8 text-sm text-center">
              Real-world {title} scenarios powered by OWON devices and platform.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {useCases.map((uc: { icon: string; title: string; desc: string }) => (
                <div class="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-sm transition-all">
                  <span class="text-2xl mb-3 block">{uc.icon}</span>
                  <h4 class="font-semibold text-sm text-default dark:text-slate-200 mb-1.5">{uc.title}</h4>
                  <p class="text-xs text-muted dark:text-slate-400 leading-relaxed">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )
      }
```

### 4d. Enhance Related Products section

Find the line `<h2 class="text-2xl font-bold mb-2 text-default dark:text-slate-100">Products Used in This Solution</h2>` and the subtitle paragraph below it. Replace just the subtitle paragraph with:

```astro
            <p class="text-muted dark:text-slate-400 mb-8 text-sm">
              All hardware and software required to deploy the{' '}
              <strong class="text-default dark:text-slate-200">{title}</strong> solution.
            </p>
```

### 4e. Add "Free Platform" section after products section

Insert this new section right BEFORE the `<!-- Certifications & Trust -->` comment block (before line 259):

```astro
      <!-- Free Platform — Shelly-style "Free App" section -->
      <div class="mt-16 p-8 bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-slate-800/80 rounded-xl border border-primary/10 dark:border-primary/20">
        <div class="flex flex-col lg:flex-row items-center gap-6">
          <div class="flex-1 text-center lg:text-left">
            <h2 class="text-xl font-bold text-default dark:text-slate-100 mb-2">
              EdgeEco IoT Platform — Free Tier Available
            </h2>
            <p class="text-sm text-muted dark:text-slate-400 leading-relaxed">
              Monitor up to 5 devices for free. Real-time dashboards, energy reports, and mobile access — no credit card required. Scale to enterprise when you're ready.
            </p>
          </div>
          <a href="/products/software-platforms" class="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Learn More →
          </a>
        </div>
      </div>

      <!-- Ecosystem Compatibility -->
      <div class="mt-8 p-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
        <h2 class="text-xl font-bold text-default dark:text-slate-100 mb-4 text-center">Full Ecosystem Compatibility</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { icon: '🔗', title: 'MQTT', desc: 'Standard MQTT 3.1.1 / 5.0 broker integration' },
            { icon: '📡', title: 'ZigBee 3.0', desc: 'ZigBee cluster library for smart home & industrial' },
            { icon: '🏠', title: 'Home Assistant', desc: 'Native HA integration via MQTT auto-discovery' },
            { icon: '☁️', title: 'Tuya Cloud', desc: 'Tuya IoT platform for white-label app deployment' },
            { icon: '🔧', title: 'REST API', desc: 'Full RESTful API for custom system integration' },
            { icon: '📟', title: 'Modbus RTU/TCP', desc: 'Industrial protocol support for BMS and SCADA' },
            { icon: '🌐', title: 'WebSocket', desc: 'Real-time data streaming for dashboards' },
            { icon: '📦', title: 'Edge Computing', desc: 'On-device logic — no cloud dependency required' },
          ].map((eco) => (
            <div class="flex items-start gap-3 p-3">
              <span class="text-lg shrink-0 mt-0.5">{eco.icon}</span>
              <div>
                <h5 class="font-semibold text-xs text-default dark:text-slate-200">{eco.title}</h5>
                <p class="text-xs text-muted dark:text-slate-400 mt-0.5">{eco.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
```

### 4f. Update breadcrumb "Use Cases" → "Solutions"

On line 41, change:
```astro
    { '@type': 'ListItem', position: 2, name: 'Use Cases', item: `${Astro.url.origin}/solutions` },
```
to:
```astro
    { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${Astro.url.origin}/solutions` },
```

## Verification
After all changes, run:
```
cd /home/admin/my-company-site && npm run build
```

The build must succeed. Ignore any pre-existing Prettier warnings or SyntaxError in products/[slug].astro.
