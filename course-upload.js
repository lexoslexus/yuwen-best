(function(){
  const oldShell = shell;
  shell = function(content) {
    oldShell(content);
    if (view !== "teacher") return;
    const nav = document.querySelector(".nav");
    if (!nav || document.querySelector("[data-page='courses']")) return;
    const btn = document.createElement("button");
    btn.textContent = "課程資料";
    btn.dataset.page = "courses";
    if (page === "courses") btn.className = "active";
    btn.addEventListener("click", () => { page = "courses"; render(); });
    const prep = [...nav.querySelectorAll("button")].find((item) => item.textContent === "備課中心");
    nav.insertBefore(btn, prep || nav.children[2]);
  };

  function splitList(value, fallback) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === "string") return value.split(/[,，、\n]/).map((item) => item.trim()).filter(Boolean);
    return fallback;
  }

  function normalizeCourse(raw, index = 0) {
    raw = raw || {};
    return {
      id: raw.id || `c${Date.now()}${index}`,
      title: String(raw.title || raw.courseName || raw.name || `自訂課程 ${index + 1}`).trim(),
      theme: String(raw.theme || raw.unit || raw.type || "自訂課程").trim(),
      goal: String(raw.goal || raw.objective || raw.description || "由老師上傳的課程資料，可用於備課、教學與評量任務。").trim(),
      text: String(raw.text || raw.content || raw.article || "請補上課文、閱讀文本或教學重點。").trim(),
      vocab: splitList(raw.vocab || raw.keywords, ["課程重點"]),
      strategies: splitList(raw.strategies || raw.methods, ["預習提問", "分段摘要", "課後檢核"]),
      custom: true
    };
  }

  function courses() {
    shell(`
      <header class="page-head">
        <div><h1>課程資料上傳</h1><p>老師可新增不同課程的基本資料，系統會同步到電子書、備課與任務指派。</p></div>
        <div class="actions"><button class="secondary" id="downloadTemplate">下載 JSON 範本</button></div>
      </header>
      <section class="grid two">
        <article class="panel">
          <h2>新增單一課程</h2>
          <label class="field">課程名稱<input id="courseTitle" placeholder="例：第十一課：城市裡的森林" /></label>
          <label class="field">主題類型<input id="courseTheme" placeholder="例：環境議題與說明文" /></label>
          <label class="field">學習目標<textarea id="courseGoal" placeholder="例：能找出段落重點，說明作者如何安排材料。"></textarea></label>
          <label class="field">課文或教學重點<textarea id="courseText" placeholder="貼上課文摘要、閱讀文本或課堂重點。"></textarea></label>
          <label class="field">重要字詞<input id="courseVocab" placeholder="例：棲地、永續、觀察、遷徙" /></label>
          <label class="field">閱讀策略<input id="courseStrategies" placeholder="例：標題預測、因果線索、圖文對照" /></label>
          <button class="primary" id="addCourse">加入課程資料庫</button>
        </article>
        <article class="panel">
          <h2>批次上傳 JSON</h2>
          <p>可上傳單一課程物件，或多筆課程陣列。欄位支援 title、theme、goal、text、vocab、strategies。</p>
          <label class="field">選擇課程 JSON 檔<input id="courseFile" type="file" accept=".json,application/json" /></label>
          <button class="secondary" id="importCourse">匯入課程檔</button>
          <div class="hint">JSON 可是單筆物件或多筆陣列。新增後會出現在電子書教學與備課中心。</div>
        </article>
      </section>
      <section class="card" style="margin-top:16px">
        <h2>目前課程資料</h2>
        <table>
          <thead><tr><th>課程</th><th>主題</th><th>字詞</th><th>策略</th><th>管理</th></tr></thead>
          <tbody>${state.lessons.map((lesson) => `
            <tr>
              <td>${lesson.title}</td><td>${lesson.theme}</td><td>${lesson.vocab.join("、")}</td><td>${lesson.strategies.join("、")}</td>
              <td>${lesson.custom ? `<button class="secondary delete-course" data-id="${lesson.id}">刪除</button>` : `<span class="badge">內建</span>`}</td>
            </tr>`).join("")}</tbody>
        </table>
      </section>
    `);

    document.querySelector("#addCourse").addEventListener("click", () => {
      const course = normalizeCourse({
        title: courseTitle.value,
        theme: courseTheme.value,
        goal: courseGoal.value,
        text: courseText.value,
        vocab: courseVocab.value,
        strategies: courseStrategies.value
      });
      state.lessons.push(course);
      selectedLesson = course.id;
      saveState();
      render();
      toast("課程已加入，可在電子書教學與備課中心使用。");
    });

    document.querySelector("#importCourse").addEventListener("click", () => {
      const file = courseFile.files[0];
      if (!file) return toast("請先選擇 JSON 檔。");
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.lessons) ? parsed.lessons : Array.isArray(parsed.courses) ? parsed.courses : [parsed];
          const courses = list.map(normalizeCourse);
          state.lessons.push(...courses);
          selectedLesson = courses[0].id;
          saveState();
          render();
          toast(`已匯入 ${courses.length} 筆課程資料。`);
        } catch {
          toast("JSON 格式無法讀取，請檢查檔案內容。");
        }
      };
      reader.readAsText(file, "utf-8");
    });

    document.querySelector("#downloadTemplate").addEventListener("click", () => {
      const template = { title: "第十一課：城市裡的森林", theme: "環境議題與說明文", goal: "能辨識說明文結構，整理重點並提出自己的觀察。", text: "城市中的公園像一座小森林。", vocab: ["棲地", "永續"], strategies: ["因果線索", "段落摘要"] };
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "course-template.json";
      link.click();
      URL.revokeObjectURL(link.href);
    });

    document.querySelectorAll(".delete-course").forEach((btn) => btn.addEventListener("click", () => {
      state.lessons = state.lessons.filter((lesson) => lesson.id !== btn.dataset.id);
      selectedLesson = state.lessons[0].id;
      saveState();
      render();
      toast("自訂課程已刪除。");
    }));
  }

  const oldRender = render;
  render = function() {
    if (page === "courses") return courses();
    return oldRender();
  };
})();
