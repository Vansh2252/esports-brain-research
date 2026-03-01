// ============================================================
//  PARTICIPANT INFORMATION FORM
//  Collects demographics + esports-specific variables
// ============================================================

var participant_info = {
  type: "survey-html-form",

  preamble: `
    <h2>🎮 Esports &amp; Cognitive Performance Study</h2>
    <p style="max-width:600px; margin:0 auto 20px; color:#a0a0b8; font-size:15px; text-align:center;">
      This experiment measures cognitive abilities related to esports performance.
      It consists of <strong>6 short tasks</strong> and takes approximately <strong>15–20 minutes</strong>.
      Your data is anonymous and used for research only.
    </p>
  `,

  html: `
    <fieldset>
      <legend>Personal Information</legend>

      <label>Full Name <span style="color:#e74c3c">*</span></label><br>
      <input name="name" type="text" required
             placeholder="e.g. Vansh Sharma"><br><br>

      <label>Age <span style="color:#e74c3c">*</span></label><br>
      <input name="age" type="number" min="13" max="80" required
             placeholder="e.g. 22"><br><br>

      <label>Gender <span style="color:#e74c3c">*</span></label><br>
      <select name="gender" required>
        <option value="">— Select —</option>
        <option>Male</option>
        <option>Female</option>
        <option>Non-binary</option>
        <option>Prefer not to say</option>
      </select><br><br>

      <label>Dominant Hand <span style="color:#e74c3c">*</span></label><br>
      <select name="dominant_hand" required>
        <option value="">— Select —</option>
        <option>Right</option>
        <option>Left</option>
        <option>Ambidextrous</option>
      </select><br><br>

      <label>Education Level</label><br>
      <select name="education">
        <option value="">— Select —</option>
        <option>High School</option>
        <option>Undergraduate</option>
        <option>Postgraduate</option>
        <option>Other</option>
      </select><br><br>

      <label>Hours of Sleep Last Night</label><br>
      <input name="sleep_hours" type="number" min="0" max="24" step="0.5"
             placeholder="e.g. 7"><br><br>
    </fieldset>

    <fieldset>
      <legend>Gaming Background</legend>

      <label>Are you an Esports / Competitive Player? <span style="color:#e74c3c">*</span></label><br>
      <select name="group" required>
        <option value="">— Select —</option>
        <option>Esports (competitive / semi-pro / pro)</option>
        <option>Casual Gamer</option>
        <option>Non-Gamer</option>
      </select><br><br>

      <label>Gaming Hours per Week <span style="color:#e74c3c">*</span></label><br>
      <input name="gaming_hours" type="number" min="0" max="120" required
             placeholder="e.g. 25"><br><br>

      <label>Years of Gaming Experience</label><br>
      <input name="gaming_years" type="number" min="0" max="50"
             placeholder="e.g. 8"><br><br>

      <label>Primary Game Title</label><br>
      <input name="game" placeholder="e.g. Valorant, CS2, League of Legends"><br><br>

      <label>In-Game Name / Gamertag</label><br>
      <input name="ign" placeholder="e.g. xNinja, TenZ"><br><br>

      <label>Game Genre</label><br>
      <select name="game_genre">
        <option value="">— Select —</option>
        <option>FPS (First-Person Shooter)</option>
        <option>MOBA</option>
        <option>Battle Royale</option>
        <option>RTS (Real-Time Strategy)</option>
        <option>Fighting</option>
        <option>Sports / Racing</option>
        <option>Other</option>
      </select><br><br>

      <label>Competitive Rank / Tier</label><br>
      <input name="rank" placeholder="e.g. Diamond 2, Global Elite"><br><br>

      <label>Primary Input Device</label><br>
      <select name="input_device">
        <option value="">— Select —</option>
        <option>Mouse &amp; Keyboard</option>
        <option>Controller</option>
        <option>Touch Screen</option>
        <option>Other</option>
      </select><br><br>
    </fieldset>

    <div style="text-align:center; margin-top:12px;">
      <button type="submit">Begin Experiment →</button>
    </div>
  `,

  autofocus: "age",

  data: { test: "participant_info" }
};