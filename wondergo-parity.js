(function () {
  const publisherUnits = [
    { publisher: "康軒", unit: "第八課：在風中旅行的種子" },
    { publisher: "翰林", unit: "第九課：山城書信" },
    { publisher: "南一", unit: "第十課：辯論會開始" },
    { publisher: "自編教材", unit: "班級閱讀專題" }
  ];

  const defaultMaterials = [
    {
      id: "m01",
      title: "說明文段落摘要包",
      lessonId: "l01",
      type: "閱讀理解",
      question: "請找出課文中描述種子旅行的三個重點，整理成 60 字摘要。",
      answer: "能指出離開母株、順風尋土、雨後萌芽等重點，並用自己的話摘要。",
      published: true
    },
    {
      id: "m02",
      title: "情感描寫仿寫單",
      lessonId: "l02",
      type: "寫作表達",
      question: "仿照「屋簷滴水像慢慢數著日子」，寫一句有畫面感的情感句。",
      answer: "句子能同時呈現景物與人物心情，並使用譬喻或擬人。",
      published: false
    }
  ];

  function ensureMaterials() {
    if (!Array.isArray(state.materials)) {
      state.materials = structuredClone(defaultMaterials);
      saveState();
    }
  }

  function lessonTitle(id) {
    const lesson = state.lessons.find((item) => item.id === id);
    return lesson ? lesson.title : "未指定課程";
  }

  function publisherPlanner() {
    return `
      <article class="panel">
        <h2>出版社與單元設定</h2>
        <p>參考電子書平台的備課流程，老師可以先選版本與單元，再建立課程資料、教材與任務。</p>
        <div class="resource-grid">
          ${publisherUnits.map((item) => `
            <div class="resource">
              <strong>${item.publisher}</strong>
              <span>${item.unit}</span>
              <button class="secondary use-unit" data-unit="${item.unit}" data-publisher="${item.publisher}">套用到備課</button>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }

  function materialCenter() {
    ensureMaterials();
    const published = state.materials.filter((item) => item.published).length;
    const lessonOptions = state.lessons.map((lesson) => `<option value="${lesson.id}">${lesson.title}</option>`).join("");
    shell(`
      <header class="page-head">
        <div>
          <h1>教材管理</h1>
          <p>建立老師自己的課程教材、題組與參考答案，發布後可接到任務、評量與學生端。</p>
        </div>
        <div class="actions"><button class="secondary" data-jump="courses">上傳課程資料</button></div>
      </header>
      <section class="stats">
        <div class="stat"><span>教材總數</span><strong>${state.materials.length}</strong></div>
        <div class="stat"><span>已發布</span><strong>${published}</strong></div>
        <div class="stat"><span>題組數</span><strong>${state.materials.length}</strong></div>
        <div class="stat"><span>連動課程</span><strong>${state.lessons.length}</strong></div>
      </section>
      <section class="grid two">
        <article class="panel">
          <h2>新增教材或題組</h2>
          <div class="form-grid">
            <label class="field">教材名稱<input id="materialTitle" placeholder="例：第八課閱讀理解題組" /></label>
            <label class="field">對應課程<select id="materialLesson">${lessonOptions}</select></label>
            <label class="field">能力分類<select id="materialType">
              <option>字詞理解</option>
              <option>文意統整</option>
              <option>修辭賞析</option>
              <option>寫作表達</option>
              <option>閱讀策略</option>
            </select></label>
            <label class="field">是否發布<select id="materialPublished"><option value="true">立即發布給學生</option><option value="false">先存成草稿</option></select></label>
            <label class="field wide">題目或教學活動<textarea id="materialQuestion" rows="4" placeholder="輸入題目、討論任務、閱讀任務或寫作任務"></textarea></label>
            <label class="field wide">參考答案或評分規準<textarea id="materialAnswer" rows="4" placeholder="輸入答案、觀察重點或評分規準"></textarea></label>
          </div>
          <button class="primary" id="addMaterial">建立教材</button>
        </article>
        ${publisherPlanner()}
      </section>
      <section class="panel">
        <h2>目前教材庫</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>教材</th><th>課程</th><th>能力</th><th>狀態</th><th>操作</th></tr></thead>
            <tbody>
              ${state.materials.map((item) => `
                <tr>
                  <td><strong>${item.title}</strong><br><small>${item.question}</small></td>
                  <td>${lessonTitle(item.lessonId)}</td>
                  <td>${item.type}</td>
                  <td><span class="badge ${item.published ? "green" : "yellow"}">${item.published ? "已發布" : "草稿"}</span></td>
                  <td><button class="secondary toggle-material" data-id="${item.id}">${item.published ? "改為草稿" : "發布"}</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `);

    document.querySelector("#addMaterial").addEventListener("click", () => {
      const title = document.querySelector("#materialTitle").value.trim();
      const question = document.querySelector("#materialQuestion").value.trim();
      const answer = document.querySelector("#materialAnswer").value.trim();
      if (!title || !question) {
        toast("請至少輸入教材名稱與題目內容。");
        return;
      }
      state.materials.unshift({
        id: `m${Date.now()}`,
        title,
        lessonId: document.querySelector("#materialLesson").value,
        type: document.querySelector("#materialType").value,
        question,
        answer: answer || "教師尚未填寫參考答案。",
        published: document.querySelector("#materialPublished").value === "true"
      });
      saveState();
      render();
      toast("教材已加入教材庫。");
    });

    document.querySelectorAll(".toggle-material").forEach((btn) => btn.addEventListener("click", () => {
      const material = state.materials.find((item) => item.id === btn.dataset.id);
      material.published = !material.published;
      saveState();
      render();
      toast(material.published ? "教材已發布給學生。" : "教材已改為草稿。");
    }));

    document.querySelectorAll(".use-unit").forEach((btn) => btn.addEventListener("click", () => {
      const lesson = state.lessons.find((item) => item.title === btn.dataset.unit);
      if (lesson) selectedLesson = lesson.id;
      page = "prep";
      render();
      toast(`${btn.dataset.publisher} ${btn.dataset.unit} 已套用到備課中心。`);
    }));
    bindJumps();
  }

  function studentPreview() {
    const student = state.students[1] || state.students[0];
    const publishedMaterials = (state.materials || defaultMaterials).filter((item) => item.published);
    shell(`
      <header class="page-head">
        <div>
          <h1>學生端預覽</h1>
          <p>老師可以用學生視角檢查任務、教材、徽章與能力回饋是否清楚。</p>
        </div>
        <div class="actions"><button class="secondary" data-jump="assessment">前往指派任務</button></div>
      </header>
      <section class="grid two">
        <article class="panel">
          <h2>${student.name} 的今日任務</h2>
          <div class="task-card"><strong>主線任務：閱讀理解</strong><span>完成指定課文重點摘要</span><span class="badge green">+80 XP</span></div>
          <div class="task-card"><strong>補強任務：修辭賞析</strong><span>挑戰譬喻、擬人與排比辨識</span><span class="badge yellow">+50 XP</span></div>
          <div class="task-card"><strong>寫作挑戰：短文表達</strong><span>用 80 字寫出一段有畫面感的描述</span><span class="badge green">+100 XP</span></div>
          <h3>老師已發布教材</h3>
          ${publishedMaterials.map((item) => `<div class="resource"><strong>${item.title}</strong><span>${item.type}｜${lessonTitle(item.lessonId)}</span></div>`).join("") || "<p>教材發布後會出現在學生端。</p>"}
        </article>
        <article class="panel">
          <h2>學習等級與徽章</h2>
          <div class="level-card">
            <span>Lv.3 閱讀探索者</span>
            <strong>${student.completion}%</strong>
            <div class="bar"><i style="width:${student.completion}%"></i></div>
          </div>
          <div class="badge-wall">
            <span>修辭偵探</span>
            <span>摘要高手</span>
            <span>詞語收藏家</span>
            <span>辯論小講師</span>
            <span>寫作星光</span>
          </div>
          <h3>五面向能力回饋</h3>
          ${Object.entries(student.abilities).map(([key, value]) => abilityRow(key, value)).join("")}
        </article>
      </section>
      <section class="panel">
        <h2>學生端提醒文字</h2>
        <p>今天先完成課文閱讀，再挑戰能力小測。答錯的題目會自動進入訂正清單，老師也能在數位儀表板看到你的進步軌跡。</p>
      </section>
    `);
    bindJumps();
  }

  const baseShell = shell;
  shell = function (content) {
    baseShell(content);
    if (view !== "teacher") return;
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const insertBefore = nav.querySelector("[data-page='records']") || nav.querySelector("[data-page='analytics']");
    [
      ["materials", "教材管理"],
      ["studentPreview", "學生端預覽"]
    ].forEach(([id, label]) => {
      if (nav.querySelector(`[data-page='${id}']`)) return;
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.dataset.page = id;
      if (page === id) btn.classList.add("active");
      btn.addEventListener("click", () => {
        page = id;
        render();
      });
      nav.insertBefore(btn, insertBefore);
    });
  };

  const baseRender = render;
  render = function () {
    if (view === "teacher" && page === "materials") return materialCenter();
    if (view === "teacher" && page === "studentPreview") return studentPreview();
    return baseRender();
  };
})();
