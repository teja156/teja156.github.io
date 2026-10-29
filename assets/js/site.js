(() => {
  "use strict";
  const doc = document.documentElement;
  doc.classList.add("js");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------------- boot sequence (the one orchestrated motion) ---------------- */
  const shell = $("#shell");
  const bootLines = $$("#boot p");
  if (reduced) {
    shell.classList.add("booted");
  } else {
    bootLines.forEach((p, i) => setTimeout(() => { p.style.opacity = 1; }, 90 + i * 110));
    setTimeout(() => shell.classList.add("booted"), 90 + bootLines.length * 110);
  }

  /* ---------------- data pulled from the page itself ---------------- */
  const repos = $$("#repos li").map(li => ({
    li,
    name: $(".r-name", li).textContent.trim(),
    url: $(".r-name", li).getAttribute("href"),
    lang: $(".r-lang", li).textContent.trim(),
    stars: $(".r-stars", li).textContent.trim(),
    desc: $(".r-desc", li).textContent.trim(),
    tags: li.dataset.tags.split(" ")
  }));

  const links = {
    github: "https://github.com/teja156",
    youtube: "https://youtube.com/techraj156",
    linkedin: "https://www.linkedin.com/in/tejaswaroop156",
    x: "https://x.com/techraj156",
    instagram: "https://www.instagram.com/teja.techraj",
    web: "https://techraj156.com",
    tubematic: "https://tubematic.ai",
    docs: "https://docs.tubematic.ai",
    oscp: "https://youtu.be/FetlX3Sn1lg"
  };

  /* ---------------- terminal ---------------- */
  const out = $("#term-out");
  const form = $("#term-form");
  const input = $("#term-in");
  const hist = [];
  let hIdx = 0;

  const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const a = (href, text) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(text || href)}</a>`;
  const pad = (s, n) => s + " ".repeat(Math.max(1, n - s.length));

  function print(html, cls = "") {
    const div = document.createElement("div");
    div.className = "blk " + cls;
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function goTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }

  const files = {
    "about.txt": () => $$("#whoami .prose p").map(p => esc(p.textContent.trim())).join("\n\n"),
    "tubematic.md": () =>
      `<span class="amb"># TubeMatic</span>  <span class="dim">(pinned, latest project)</span>\n\n` +
      `A self-hosted pipeline that turns a topic into a finished YouTube Short.\n\n` +
      `<span class="amb">research ── script ── voice ── imagery ── animate ── render ── ai review ── publish</span>\n\n` +
      `Every scene is a React component an AI agent writes for that video, rendered by Remotion.\n` +
      `Three human checkpoints before money is spent or a video ships, or hand them to Auto Pilot.\n\n` +
      `site   ${a(links.tubematic, "tubematic.ai")}\ndocs   ${a(links.docs, "docs.tubematic.ai")}\nsource ${a("https://github.com/teja156/tubematic", "github.com/teja156/tubematic")}`,
    "oscp.md": () =>
      `<span class="grn"># OSCP in 6 hours</span>\n\n` +
      `Passed the OffSec Certified Professional exam in 2024.\n` +
      `The exam gives you 24 hours. I was done in 6.\n\n` +
      `review  ${a(links.oscp, "youtu.be/FetlX3Sn1lg")}`,
    "links.txt": () => Object.entries(links).filter(([k]) => !["tubematic", "docs", "oscp"].includes(k))
      .map(([k, v]) => `${pad(k, 10)}${a(v, v.replace(/^https:\/\/(www\.)?/, ""))}`).join("\n")
  };

  const sections = ["shell", "whoami", "history", "projects", "oscp", "writeups"];

  const commands = {
    help: () => [
      "available commands",
      "",
      `  ${pad("whoami", 18)}<span class="dim">who I am</span>`,
      `  ${pad("neofetch", 18)}<span class="dim">system info, but it's me</span>`,
      `  ${esc(pad("projects [tag]", 18))}<span class="dim">list projects (security, automation, ai, infra)</span>`,
      `  ${esc(pad("cat <file>", 18))}<span class="dim">read a file, try ls first</span>`,
      `  ${esc(pad("open <name>", 18))}<span class="dim">open a project, social link, or tubematic</span>`,
      `  ${esc(pad("cd <section>", 18))}<span class="dim">jump to ${sections.slice(1).join(", ")}</span>`,
      `  ${pad("oscp", 18)}<span class="dim">how I passed the OSCP in 6 hours</span>`,
      `  ${pad("writeups", 18)}<span class="dim">pentest walkthroughs and notes</span>`,
      `  ${pad("social", 18)}<span class="dim">where else to find me</span>`,
      `  ${pad("history", 18)}<span class="dim">what you've typed</span>`,
      `  ${pad("clear", 18)}<span class="dim">clear the screen</span>`
    ].join("\n"),

    whoami: () => `teja\n<span class="dim">Solutions Architect at Kasm Technologies. OSCP. Tech Raj on YouTube, 700k+ subscribers.</span>`,

    neofetch: () => {
      const logo = [
        "  ████████╗",
        "  ╚══██╔══╝",
        "     ██║   ",
        "     ██║   ",
        "     ██║   ",
        "     ╚═╝   "
      ];
      const info = [
        `<span class="grn">teja</span>@<span class="grn">tejaswaroop</span>`,
        `<span class="dim">----------------</span>`,
        `<span class="grn">role</span>    Solutions Architect, Kasm`,
        `<span class="grn">cert</span>    OSCP`,
        `<span class="grn">uptime</span>  ${new Date().getFullYear() - 2015} years on YouTube`,
        `<span class="grn">subs</span>    700k+`,
        `<span class="grn">shell</span>   python, js, bash`,
        `<span class="grn">pinned</span>  <span class="amb">tubematic</span>`
      ];
      const rows = Math.max(logo.length, info.length);
      let s = "";
      for (let i = 0; i < rows; i++) s += `<span class="grn">${pad(logo[i] || "", 14)}</span>${info[i] || ""}\n`;
      return s.trimEnd();
    },

    ls: (args) => {
      const target = (args[0] || "~").replace(/\/$/, "");
      if (["projects", "~/projects"].includes(target)) return repos.map(r => r.name === "tubematic" ? `<span class="amb">${r.name}</span>` : r.name).join("  ");
      if (["writeups", "~/writeups"].includes(target)) return commands.writeups();
      return `<span class="grn">projects/</span>  <span class="grn">oscp/</span>  <span class="grn">writeups/</span>  ${Object.keys(files).join("  ")}`;
    },

    cat: (args) => {
      const f = (args[0] || "").replace(/^~\//, "");
      if (!f) return `<span class="err">cat: missing file operand. Try: ${Object.keys(files).join(", ")}</span>`;
      if (f === ".history" || f === "history") { goTo("history"); return `<span class="dim">jumped to ~/.history</span>`; }
      if (files[f]) return files[f]();
      return `<span class="err">cat: ${esc(f)}: No such file or directory</span>`;
    },

    projects: (args) => {
      const tag = (args[0] || "").toLowerCase();
      const list = tag ? repos.filter(r => r.tags.includes(tag)) : repos;
      if (!list.length) return `<span class="err">no projects tagged "${esc(tag)}". Tags: security, automation, ai, infra</span>`;
      return list.map(r => `${r.url ? a(r.url, r.name) : esc(r.name)}${" ".repeat(Math.max(1, 32 - r.name.length))}<span class="dim">${pad(r.lang, 12)}${esc(r.stars.startsWith("private") ? "private" : "★ " + r.stars)}</span>`).join("\n") +
        `\n\n<span class="dim">open &lt;name&gt; to view one</span>`;
    },

    tubematic: () => files["tubematic.md"](),

    writeups: () => $$("#writeups .posts li").map(li => {
      const t = $("time", li).textContent, l = $("a", li);
      return `<span class="dim">${t}</span>  ${a(l.getAttribute("href"), l.textContent)}`;
    }).join("\n"),

    oscp: () => files["oscp.md"](),
    social: () => files["links.txt"](),
    links: () => files["links.txt"](),

    open: (args) => {
      const n = (args[0] || "").toLowerCase();
      if (!n) return `<span class="err">open: what? Try open tubematic or open github</span>`;
      let url = links[n];
      if (!url) { const r = repos.find(r => r.name.toLowerCase() === n); url = r && r.url; }
      if (!url) return `<span class="err">open: ${esc(n)}: not found</span>`;
      window.open(url, "_blank", "noopener");
      return `<span class="dim">opening ${esc(url)}</span>`;
    },

    cd: (args) => {
      const s = (args[0] || "").replace(/^~\/?/, "").replace(/\/$/, "") || "shell";
      const map = { "..": "shell", "": "shell", about: "whoami" };
      const id = map[s] || s;
      if (!sections.includes(id)) return `<span class="err">cd: ${esc(s)}: No such directory</span>`;
      goTo(id);
      return "";
    },

    history: () => hist.map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`).join("\n"),
    date: () => new Date().toString(),
    pwd: () => "/home/teja",
    echo: (args) => esc(args.join(" ")),
    clear: () => { out.innerHTML = ""; return null; },
    sudo: () => `<span class="err">teja is not in the sudoers file. This incident will be reported.</span>`,
    rm: () => `<span class="err">rm: permission denied. Nice try.</span>`,
    exit: () => `<span class="dim">logout? you just got here. try</span> <span class="grn">oscp</span> <span class="dim">or</span> <span class="grn">projects</span>`,
    hack: () => `<span class="grn">access granted.</span> <span class="dim">just kidding. Watch the real thing on</span> ${a(links.youtube, "YouTube")}`,
    vim: () => `<span class="dim">you're safe here, there's nothing to exit.</span>`
  };
  commands.about = commands.whoami;
  commands["ls -la"] = commands.ls;

  function run(raw) {
    const line = raw.trim();
    print(`<span class="echo"><b>$</b> ${esc(line)}</span>`);
    if (!line) return;
    hist.push(line); hIdx = hist.length;
    const [cmd, ...args] = line.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    const res = fn ? fn(args) : `<span class="err">${esc(cmd)}: command not found. Type help to see what works.</span>`;
    if (res === null) return;
    if (res) print(res);
    form.scrollIntoView({ block: "nearest", behavior: "auto" });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    run(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && hist.length) { e.preventDefault(); hIdx = Math.max(0, hIdx - 1); input.value = hist[hIdx]; }
    else if (e.key === "ArrowDown" && hist.length) { e.preventDefault(); hIdx = Math.min(hist.length, hIdx + 1); input.value = hist[hIdx] || ""; }
    else if (e.key === "Tab" && input.value) {
      const cand = Object.keys(commands).filter(c => c.startsWith(input.value) && !c.includes(" "));
      if (cand.length === 1) { e.preventDefault(); input.value = cand[0] + " "; }
    }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.innerHTML = ""; }
  });

  $$(".cmd[data-run]").forEach(b => b.addEventListener("click", () => { run(b.dataset.run); input.focus({ preventScroll: true }); }));

  // clicking anywhere on the terminal focuses the prompt (desktop only, keeps mobile scroll calm)
  $("#term").addEventListener("click", e => {
    if (e.target.closest("a, button") || window.getSelection().toString()) return;
    input.focus({ preventScroll: true });
  });

  /* ---------------- project filter, mirrored as a grep ---------------- */
  const echo = $("#grep-echo");
  $$(".filter").forEach(btn => btn.addEventListener("click", () => {
    const tag = btn.dataset.tag;
    $$(".filter").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    repos.forEach(r => { r.li.hidden = tag !== "all" && !r.tags.includes(tag); });
    echo.textContent = tag === "all" ? "" : `| grep ${tag}`;
  }));

  /* ---------------- tmux status: active window + clock ---------------- */
  const winLinks = $$(".status-wins a");
  const watched = ["shell", "whoami", "projects", "oscp", "writeups"].map(id => document.getElementById(id));
  const setActive = id => winLinks.forEach(l => l.setAttribute("aria-current", String(l.dataset.win === id)));
  setActive("shell");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id === "history" ? "whoami" : en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    watched.concat(document.getElementById("history")).forEach(el => el && io.observe(el));
  }

  const clock = $("#clock");
  const tick = () => {
    const d = new Date();
    clock.textContent = d.toLocaleDateString("en-CA") + " " + d.toTimeString().slice(0, 5);
  };
  tick(); setInterval(tick, 15000);
  $("#year").textContent = new Date().getFullYear();

  /* ---------------- live star counts (silently keeps the hard-coded ones on failure) ---------------- */
  fetch("https://api.github.com/users/teja156/repos?per_page=100")
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(list => {
      const byName = Object.fromEntries(list.map(r => [r.name.toLowerCase(), r.stargazers_count]));
      $$("[data-repo]").forEach(el => {
        const n = byName[el.dataset.repo.toLowerCase()];
        if (typeof n === "number") el.textContent = n;
      });
      repos.forEach(r => { r.stars = $(".r-stars", r.li).textContent.trim(); });
    })
    .catch(() => {});
})();
