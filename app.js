const app = document.querySelector("#app");

const seed = {
  students: [
    { id: "s01", no: "01", name: "林小晴", level: "穩定精熟", loginDays: 4, completion: 92, status: "已達標", abilities: { 字詞理解: 88, 文意統整: 84, 修辭賞析: 79, 寫作表達: 82, 閱讀策略: 90 } },
    { id: "s02", no: "02", name: "陳柏宇", level: "持續成長", loginDays: 3, completion: 78, status: "接近達標", abilities: { 字詞理解: 76, 文意統整: 72, 修辭賞析: 68, 寫作表達: 74, 閱讀策略: 80 } },
    { id: "s03", no: "03", name: "王品安", level: "需要支援", loginDays: 2, completion: 55, status: "需要關注", abilities: { 字詞理解: 58, 文意統整: 52, 修辭賞析: 49, 寫作表達: 61, 閱讀策略: 56 } },
    { id: "s04", no: "04", name: "張祐辰", level: "穩定精熟", loginDays: 5, completion: 96, status: "已達標", abilities: { 字詞理解: 92, 文意統整: 88, 修辭賞析: 86, 寫作表達: 90, 閱讀策略: 93 } },
    { id: "s05", no: "05", name: "黃語芯", level: "持續成長", loginDays: 3, completion: 73, status: "接近達標", abilities: { 字詞理解: 70, 文意統整: 69, 修辭賞析: 76, 寫作表達: 72, 閱讀策略: 75 } },
    { id: "s06", no: "06", name: "蔡承恩", level: "需要支援", loginDays: 1, completion: 41, status: "需要關注", abilities: { 字詞理解: 46, 文意統整: 44, 修辭賞析: 40, 寫作表達: 52, 閱讀策略: 48 } }
  ],
  lessons: [
    {
      id: "l01",
      title: "第八課：在風中旅行的種子",
      theme: "自然書寫與說明文",
      goal: "辨識說明文結構，擷取重點並完成摘要。",
      text: "蒲公英的種子輕得像一朵小傘，風一吹，就離開母株，開始自己的旅行。它不急著抵達，只順著風向尋找合適的土壤。等雨水落下，種子便把細小的根伸進土地，悄悄長成新的生命。",
      vocab: ["母株", "順著", "合適", "伸展", "萌芽"],
      strategies: ["標題預測", "段落摘要", "因果線索", "圖文對照"]
    },
    {
      id: "l02",
      title: "第九課：山城書信",
      theme: "記敘文與情感描寫",
      goal: "分析人物心情轉折，練習用細節描寫情感。",
      text: "祖母的信總帶著淡淡茶香。她說山城的雨下得細，屋簷滴水像慢慢數著日子。我讀著讀著，彷彿聽見遠方的腳步聲，也明白等待不是空白，而是把思念摺好，放進每一天。",
      vocab: ["屋簷", "彷彿", "思念", "摺好", "轉折"],
      strategies: ["人物線索", "情緒曲線", "景物襯托", "佳句仿寫"]
    },
    {
      id: "l03",
      title: "第十課：辯論會開始",
      theme: "議論文與口語表達",
      goal: "找出論點、理由與例證，完成短講提綱。",
      text: "一場好的辯論，不是比誰聲音大，而是比誰能把理由說清楚。先提出立場，再舉出證據，最後回應對方疑問。當我們學會傾聽，也就更懂得如何說服別人。",
      vocab: ["立場", "證據", "回應", "說服", "傾聽"],
      strategies: ["論點整理", "理由例證", "反方提問", "口說提綱"]
    }
  ],
  tasks: [
    { id: "t01", lessonId: "l01", title: "說明文重點摘要", type: "閱讀理解", target: "全班", due: "本週五", assigned: true, done: 4 },
    { id: "t02", lessonId: "l02", title: "情緒曲線與佳句仿寫", type: "寫作表達", target: "第 3 組", due: "明天", assigned: true, done: 2 }
  ],
  quizzes: [
    { q: "「蒲公英的種子輕得像一朵小傘」使用哪一種修辭？", options: ["譬喻", "排比", "設問", "摹聲"], answer: 0, ability: "修辭賞析" },
    { q: "閱讀說明文時，最適合先做哪件事？", options: ["直接背全文", "找標題與段落重點", "只看圖片", "先寫心得"], answer: 1, ability: "閱讀策略" },
    { q: "議論文中的「證據」主要功能是什麼？", options: ["增加字數", "讓版面好看", "支持理由與論點", "製造懸疑"], answer: 2, ability: "文意統整" }
  ],
  logs: [
    { student: "林小晴", event: "完成說明文重點摘要", score: 92, time: "今日 08:20" },
    { student: "張祐辰", event: "完成閱讀策略小測", score: 96, time: "今日 08:32" },
    { student: "王品安", event: "訂正修辭賞析錯題", score: 68, time: "昨日 14:10" },
    { student: "蔡承恩", event: "開啟電子書第八課", score: 0, time: "昨日 13:55" }
  ]
};

let state = loadState();
let view = "login";
let role = "teacher";
let page = "dashboard";
let selectedLesson = state.lessons[0].id;
let selectedStudent = "class";
let quizAnswered = null;

function loadState() {
  const saved = localStorage.getItem("languageChampionState");
  if (!saved) return structuredClone(seed);
  try {
    return { ...structuredClone(seed), ...JSON.parse(saved) };
  } catch {
    return structuredClone(seed);
  }
}

function saveState() {
  localStorage.setItem("languageChampionState", JSON.stringify(state));
}

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function average(values) {
  return Math.round(values.reduce((sum, n) => sum + n, 0) / values.length);
}

function classAbility() {
  const keys = Object.keys(state.students[0].abilities);
  return Object.fromEntries(keys.map((key) => [key, average(state.students.map((s) => s.abilities[key]))]));
}

function statusBadge(status) {
  const cls = status === "已達標" ? "green" : status === "接近達標" ? "yellow" : "red";
  return `<span class="badge ${cls}">${status}</span>`;
}

function loginScreen() {
  app.innerHTML = `
    <main class="hero">
      <div class="hero-inner">
        <section class="hero-copy">
          <div class="brand">
            <div class="logo">語</div>
            <div><strong>語文我最棒</strong><span>六年級國語智慧教學平台</span></div>
          </div>
          <h1>備課、教學、評量、紀錄 <span>一站完成。</span></h1>
          <p>結合電子書、課文朗讀、教案產生、任務指派、即時評量與學習儀表板，協助國小六年級老師掌握每一位學生的國語學習狀態。</p>
          <div class="feature-pills">
            <span>電子書互動教學</span>
            <span>素養題庫評量</span>
            <span>學習歷程紀錄</span>
            <span>班級儀表板</span>
          </div>
        </section>
        <section class="login-card">
          <h2>歡迎回來！</h2>
          <p>選擇入口後登入，立即進入示範班級。</p>
          <div class="segmented">
            <button class="${role === "teacher" ? "active" : ""}" data-role="teacher">教師入口</button>
            <button class="${role === "student" ? "active" : ""}" data-role="student">學生入口</button>
          </div>
          <label class="field">帳號
            <input id="account" value="${role === "teacher" ? "teacher" : "student"}" aria-label="帳號" />
          </label>
          <label class="field">密碼
            <input id="password" value="best1234" type="password" aria-label="密碼" />
          </label>
          <button class="primary" id="loginBtn">登入，開始使用</button>
          <div class="hint">快速體驗：教師帳號 teacher，學生帳號 student，密碼皆為 best1234。此原型會將操作紀錄保存在本機瀏覽器。</div>
        </section>
      </div>
    </main>
  `;
  document.querySelectorAll("[data-role]").forEach((btn) => {
    btn.addEventListener("click", () => {
      role = btn.dataset.role;
      loginScreen();
    });
  });
  document.querySelector("#loginBtn").addEventListener("click", () => {
    view = role;
    page = role === "teacher" ? "dashboard" : "studentHome";
    render();
  });
}

function shell(content) {
  const teacherNav = [
    ["dashboard", "班級總覽"],
    ["ebook", "電子書教學"],
    ["prep", "備課中心"],
    ["assessment", "評量與任務"],
    ["records", "學習紀錄"],
    ["analytics", "數位儀表板"]
  ];
  const studentNav = [
    ["studentHome", "我的任務"],
    ["studentBook", "課文練習"],
    ["studentQuiz", "能力小測"],
    ["studentRecord", "我的紀錄"]
  ];
  const nav = view === "teacher" ? teacherNav : studentNav;
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="logo">語</div>
          <div><strong>語文我最棒</strong><span>${view === "teacher" ? "教師後台" : "學生學習島"}</span></div>
        </div>
        <nav class="nav">
          ${nav.map(([id, label]) => `<button class="${page === id ? "active" : ""}" data-page="${id}">${label}</button>`).join("")}
          <button data-logout="true">登出</button>
        </nav>
        <div class="side-note">六年一班示範資料已載入。平台會依閱讀、字詞、修辭、寫作與策略五面向彙整學習證據。</div>
      </aside>
      <main class="main">${content}</main>
    </div>
  `;
  document.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      page = btn.dataset.page;
      render();
    });
  });
  document.querySelector("[data-logout]").addEventListener("click", () => {
    view = "login";
    render();
  });
}

function dashboard() {
  const abilities = classAbility();
  const avgCompletion = average(state.students.map((s) => s.completion));
  const active = state.students.filter((s) => s.loginDays >= 3).length;
  shell(`
    <header class="page-head">
      <div><h1>班級學習總覽</h1><p>國小六年一班｜本週國語課前、課中、課後學習狀況</p></div>
      <div class="actions"><button class="secondary" data-jump="assessment">指派新任務</button><button class="secondary" data-jump="prep">產生教案</button></div>
    </header>
    <section class="stats">
      <div class="stat"><span>班級學生</span><strong>${state.students.length} 人</strong></div>
      <div class="stat"><span>本週活躍</span><strong>${active} 人</strong></div>
      <div class="stat"><span>任務完成率</span><strong>${avgCompletion}%</strong></div>
      <div class="stat"><span>需關注學生</span><strong>${state.students.filter((s) => s.status === "需要關注").length} 人</strong></div>
    </section>
    <section class="grid two">
      <article class="card">
        <h2>五大語文能力</h2>
        <p>由電子書閱讀、線上評量與任務完成紀錄自動彙整。</p>
        <div class="ability-list">${Object.entries(abilities).map(([k, v]) => abilityRow(k, v)).join("")}</div>
      </article>
      <article class="card">
        <h2>本週教學提醒</h2>
        <p><strong>修辭賞析</strong>平均較低，建議用第九課佳句仿寫補強譬喻、轉化與映襯。</p>
        <p><strong>王品安、蔡承恩</strong>閱讀策略與文意統整低於 60，可指派短文分段摘要任務。</p>
        <button class="secondary" data-jump="analytics">查看完整診斷</button>
      </article>
    </section>
    <section class="card" style="margin-top:16px">
      <h2>學生近況</h2>
      ${studentTable()}
    </section>
  `);
  bindJumps();
}

function abilityRow(k, v) {
  return `<div class="ability"><strong>${k}</strong><div class="bar"><span style="width:${v}%"></span></div><span>${v}</span></div>`;
}

function studentTable() {
  return `
    <table>
      <thead><tr><th>學生</th><th>程度</th><th>本週登入</th><th>完成率</th><th>狀態</th></tr></thead>
      <tbody>${state.students.map((s) => `
        <tr><td>${s.no} ${s.name}</td><td>${s.level}</td><td>${s.loginDays} 天</td><td>${s.completion}%</td><td>${statusBadge(s.status)}</td></tr>
      `).join("")}</tbody>
    </table>
  `;
}

function ebook() {
  const lesson = state.lessons.find((l) => l.id === selectedLesson);
  shell(`
    <header class="page-head">
      <div><h1>電子書教學</h1><p>課文、朗讀、標註、字詞卡與課堂投影工具集中使用。</p></div>
      <div class="actions"><button class="secondary" id="speakBtn">朗讀課文</button><button class="secondary" id="noteBtn">加入教學註記</button></div>
    </header>
    <section class="ebook">
      <aside class="panel">
        <h2>課次</h2>
        <div class="lesson-list">${state.lessons.map((l) => `<button class="lesson-item ${l.id === selectedLesson ? "active" : ""}" data-lesson="${l.id}"><strong>${l.title}</strong><br><span>${l.theme}</span></button>`).join("")}</div>
      </aside>
      <article class="panel">
        <div class="toolbar">
          <button class="tool" id="highlightBtn">顯示重點</button>
          <button class="tool" id="vocabBtn">字詞卡</button>
          <button class="tool" id="strategyBtn">閱讀策略</button>
          <button class="tool" id="projectBtn">投影模式</button>
        </div>
        <div class="book-page" id="bookPage">
          <h2>${lesson.title}</h2>
          <p>${lesson.text}</p>
          <p><strong>學習目標：</strong>${lesson.goal}</p>
        </div>
      </article>
    </section>
  `);
  document.querySelectorAll("[data-lesson]").forEach((btn) => btn.addEventListener("click", () => {
    selectedLesson = btn.dataset.lesson;
    render();
  }));
  document.querySelector("#highlightBtn").addEventListener("click", () => {
    document.querySelector("#bookPage").innerHTML = `<h2>${lesson.title}</h2><p>${lesson.text.replaceAll("種子", "<mark>種子</mark>").replaceAll("理由", "<mark>理由</mark>").replaceAll("思念", "<mark>思念</mark>")}</p><p><strong>學習目標：</strong>${lesson.goal}</p>`;
  });
  document.querySelector("#vocabBtn").addEventListener("click", () => toast(`字詞卡：${lesson.vocab.join("、")}`));
  document.querySelector("#strategyBtn").addEventListener("click", () => toast(`建議策略：${lesson.strategies.join("、")}`));
  document.querySelector("#projectBtn").addEventListener("click", () => document.querySelector("#bookPage").style.fontSize = "24px");
  document.querySelector("#noteBtn").addEventListener("click", () => toast("已加入教學註記：請學生圈出因果連接詞並完成 50 字摘要。"));
  document.querySelector("#speakBtn").addEventListener("click", () => toast("朗讀示範已啟動：可搭配逐句跟讀與停頓標記。"));
}

function prep() {
  const lesson = state.lessons.find((l) => l.id === selectedLesson);
  shell(`
    <header class="page-head">
      <div><h1>備課中心</h1><p>依課文、教學目標和學生弱點，快速整理課前、課中、課後流程。</p></div>
      <div class="actions"><button class="secondary" id="copyPlan">複製教案摘要</button></div>
    </header>
    <section class="grid two">
      <article class="panel">
        <label class="field">選擇課次
          <select id="prepLesson">${state.lessons.map((l) => `<option value="${l.id}" ${l.id === selectedLesson ? "selected" : ""}>${l.title}</option>`).join("")}</select>
        </label>
        <label class="field">課堂時間
          <select id="minutes"><option>40 分鐘</option><option>80 分鐘</option><option>彈性學習 2 節</option></select>
        </label>
        <label class="field">教學重點
          <textarea id="focus">學生需加強文意統整與修辭賞析，課中安排分組討論與即時小測。</textarea>
        </label>
        <button class="primary" id="makePlan">產生備課包</button>
      </article>
      <article class="panel" id="planBox">
        ${lessonPlan(lesson)}
      </article>
    </section>
  `);
  document.querySelector("#prepLesson").addEventListener("change", (e) => {
    selectedLesson = e.target.value;
    render();
  });
  document.querySelector("#makePlan").addEventListener("click", () => {
    document.querySelector("#planBox").innerHTML = lessonPlan(lesson, document.querySelector("#focus").value);
    toast("已更新備課包。");
  });
  document.querySelector("#copyPlan").addEventListener("click", () => toast("教案摘要已準備好，可貼到教師手冊或共備文件。"));
}

function lessonPlan(lesson, focus = "學生需加強文意統整與修辭賞析。") {
  return `
    <h2>${lesson.title} 備課包</h2>
    <p><strong>學習目標：</strong>${lesson.goal}</p>
    <p><strong>課前：</strong>派發 5 分鐘預習任務，學生先圈出生字詞並回答標題預測題。</p>
    <p><strong>課中：</strong>教師用電子書投影朗讀，分段標記關鍵句，再以小組白板整理「重點、證據、我的理解」。</p>
    <p><strong>課後：</strong>完成素養小測與 80 字短寫作，系統自動匯入學習紀錄。</p>
    <p><strong>差異化：</strong>${focus}</p>
    <p><strong>可用素材：</strong>${lesson.vocab.join("、")} 字詞卡；${lesson.strategies.join("、")}策略單。</p>
  `;
}

function assessment() {
  shell(`
    <header class="page-head">
      <div><h1>評量與任務</h1><p>建立素養題、指派個人或小組任務，並回收成績與答題歷程。</p></div>
      <div class="actions"><button class="secondary" id="newTask">新增任務</button><button class="secondary" id="newQuiz">產生三題小測</button></div>
    </header>
    <section class="grid two">
      <article class="panel">
        <h2>已指派任務</h2>
        <div class="grid">${state.tasks.map(taskCard).join("")}</div>
      </article>
      <article class="panel">
        <h2>題庫預覽</h2>
        ${state.quizzes.map((q, i) => `<div class="task-card"><strong>題 ${i + 1}｜${q.ability}</strong><p>${q.q}</p><span class="badge">答案：${q.options[q.answer]}</span></div>`).join("")}
      </article>
    </section>
  `);
  document.querySelector("#newTask").addEventListener("click", () => {
    const lesson = state.lessons.find((l) => l.id === selectedLesson);
    state.tasks.unshift({ id: crypto.randomUUID(), lessonId: lesson.id, title: `${lesson.theme}課後任務`, type: "混合題組", target: "全班", due: "下週一", assigned: true, done: 0 });
    saveState();
    render();
    toast("已新增並指派一份課後任務。");
  });
  document.querySelector("#newQuiz").addEventListener("click", () => toast("已依目前課次產生：字詞理解、閱讀策略、修辭賞析各一題。"));
}

function taskCard(t) {
  const lesson = state.lessons.find((l) => l.id === t.lessonId);
  return `<div class="task-card">
    <strong>${t.title}</strong>
    <span>${lesson.title}｜${t.type}</span>
    <div><span class="badge">${t.target}</span> <span class="badge yellow">${t.due}</span> <span class="badge green">完成 ${t.done}/${state.students.length}</span></div>
  </div>`;
}

function records() {
  shell(`
    <header class="page-head">
      <div><h1>學習紀錄</h1><p>記錄學生登入、閱讀、作答、訂正、寫作與教師回饋。</p></div>
      <div class="actions"><button class="secondary" id="exportBtn">匯出班級紀錄</button></div>
    </header>
    <section class="grid two">
      <article class="panel">
        <label class="field">查看對象
          <select id="studentSelect"><option value="class">全班</option>${state.students.map((s) => `<option value="${s.id}">${s.no} ${s.name}</option>`).join("")}</select>
        </label>
        <h2>近期事件</h2>
        ${state.logs.map((l) => `<div class="task-card"><strong>${l.student}</strong><span>${l.event}</span><div><span class="badge">${l.score ? `${l.score} 分` : "閱讀中"}</span> <span class="badge yellow">${l.time}</span></div></div>`).join("")}
      </article>
      <article class="panel">
        <h2>教師回饋模板</h2>
        <p>你能找出課文中的關鍵句，代表閱讀策略正在進步。下一步請練習用自己的話整合段落重點。</p>
        <p>修辭判斷若不確定，可以先問自己：作者是不是把一件事物說成另一件事物？有沒有讓句子更有畫面？</p>
      </article>
    </section>
  `);
  document.querySelector("#exportBtn").addEventListener("click", () => toast("已產生班級學習紀錄摘要，可供親師溝通與補救教學使用。"));
}

function analytics() {
  const abilities = classAbility();
  shell(`
    <header class="page-head">
      <div><h1>數位儀表板</h1><p>把學生學習狀態轉成可判讀的教學決策。</p></div>
      <div class="actions"><button class="secondary" data-jump="assessment">一鍵指派補強</button></div>
    </header>
    <section class="stats">
      <div class="stat"><span>平均答題表現</span><strong>${average(Object.values(abilities))}</strong></div>
      <div class="stat"><span>已達標能力</span><strong>${Object.values(abilities).filter((v) => v >= 80).length}/5</strong></div>
      <div class="stat"><span>本週任務</span><strong>${state.tasks.length} 項</strong></div>
      <div class="stat"><span>學習事件</span><strong>${state.logs.length} 筆</strong></div>
    </section>
    <section class="grid three">
      ${Object.entries(abilities).map(([k, v]) => `<article class="card"><h3>${k}</h3><strong style="font-size:34px">${v}</strong><div class="bar"><span style="width:${v}%"></span></div><p>${v >= 80 ? "整體穩定，可安排延伸閱讀。" : v >= 65 ? "接近達標，適合課中即時檢核。" : "需補強，建議短任務與個別回饋。"}</p></article>`).join("")}
    </section>
    <section class="card" style="margin-top:16px">
      <h2>易錯內容與教學建議</h2>
      <table>
        <thead><tr><th>面向</th><th>常見狀況</th><th>建議行動</th></tr></thead>
        <tbody>
          <tr><td>修辭賞析</td><td>譬喻與轉化判斷混淆</td><td>用第九課佳句做「本體、喻體、效果」三欄整理</td></tr>
          <tr><td>文意統整</td><td>能找細節，但摘要過長</td><td>限制 30 字摘要，訓練刪除次要資訊</td></tr>
          <tr><td>寫作表達</td><td>段落銜接詞不足</td><td>提供「首先、接著、因此、然而」句型支架</td></tr>
        </tbody>
      </table>
    </section>
  `);
  bindJumps();
}

function studentHome() {
  shell(`
    <header class="page-head">
      <div><h1>我的國語任務</h1><p>完成今日任務，累積閱讀、字詞、修辭、寫作與策略能力。</p></div>
    </header>
    <section class="stats">
      <div class="stat"><span>本週完成率</span><strong>78%</strong></div>
      <div class="stat"><span>連續學習</span><strong>3 天</strong></div>
      <div class="stat"><span>最高能力</span><strong>閱讀策略</strong></div>
      <div class="stat"><span>待完成</span><strong>${state.tasks.length} 項</strong></div>
    </section>
    <section class="grid two">
      <article class="panel"><h2>老師指派</h2>${state.tasks.map((t) => `${taskCard(t)}<button class="primary do-task" data-task="${t.id}">完成這項任務</button>`).join("")}</article>
      <article class="panel"><h2>今日建議</h2><p>先讀第八課課文，再完成重點摘要。遇到不懂的字詞，可以打開字詞卡看例句。</p><button class="secondary" data-jump="studentBook">前往課文練習</button></article>
    </section>
  `);
  document.querySelectorAll(".do-task").forEach((btn) => btn.addEventListener("click", () => {
    const task = state.tasks.find((t) => t.id === btn.dataset.task);
    task.done = Math.min(state.students.length, task.done + 1);
    state.logs.unshift({ student: "陳柏宇", event: `完成${task.title}`, score: 88, time: "剛剛" });
    saveState();
    render();
    toast("任務完成，學習紀錄已更新。");
  }));
  bindJumps();
}

function studentBook() {
  ebook();
}

function studentQuiz() {
  const q = state.quizzes[0];
  shell(`
    <header class="page-head"><div><h1>能力小測</h1><p>作答後會自動記錄到你的學習歷程。</p></div></header>
    <section class="panel">
      <h2>${q.ability}</h2>
      <p>${q.q}</p>
      ${q.options.map((option, i) => `<button class="quiz-option ${quizAnswered === i && i === q.answer ? "correct" : ""}" data-answer="${i}">${option}</button>`).join("")}
      <div class="hint">${quizAnswered === null ? "請選出最適合的答案。" : quizAnswered === q.answer ? "答對了！你能辨識句子的修辭效果。" : "再想想：這句把種子比成小傘，讓畫面更清楚。"}</div>
    </section>
  `);
  document.querySelectorAll("[data-answer]").forEach((btn) => btn.addEventListener("click", () => {
    quizAnswered = Number(btn.dataset.answer);
    if (quizAnswered === q.answer) {
      state.logs.unshift({ student: "陳柏宇", event: "完成能力小測：修辭賞析", score: 100, time: "剛剛" });
      saveState();
    }
    render();
  }));
}

function studentRecord() {
  shell(`
    <header class="page-head"><div><h1>我的學習紀錄</h1><p>看看自己最近完成了哪些練習。</p></div></header>
    <section class="grid two">
      <article class="panel"><h2>能力雷達</h2>${Object.entries(state.students[1].abilities).map(([k, v]) => abilityRow(k, v)).join("")}</article>
      <article class="panel"><h2>近期紀錄</h2>${state.logs.filter((l) => l.student === "陳柏宇").map((l) => `<div class="task-card"><strong>${l.event}</strong><span>${l.time}</span><span class="badge green">${l.score} 分</span></div>`).join("") || "<p>完成任務後會出現在這裡。</p>"}</article>
    </section>
  `);
}

function bindJumps() {
  document.querySelectorAll("[data-jump]").forEach((btn) => btn.addEventListener("click", () => {
    page = btn.dataset.jump;
    render();
  }));
}

function render() {
  if (view === "login") return loginScreen();
  const pages = { dashboard, ebook, prep, assessment, records, analytics, studentHome, studentBook, studentQuiz, studentRecord };
  pages[page]();
}

render();
