import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Optional
from pydantic import BaseModel
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="TeacherAssist AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (React build)
STATIC_DIR = Path(__file__).resolve().parent / "static"

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)


def get_model():
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY が設定されていません")
    return genai.GenerativeModel("gemini-2.0-flash")


# --- 指導案設計AI ---

class LessonPlanRequest(BaseModel):
    subject: str
    unit: str
    grade: str
    hours: int
    objective: str
    plan_type: str = "略案"          # "細案" or "略案"
    material_note: Optional[str] = None    # 教材について
    student_note: Optional[str] = None     # 生徒・児童について
    teaching_note: Optional[str] = None    # 指導について
    content_points: Optional[str] = None  # 学習内容のポイント


def build_lesson_prompt(req: LessonPlanRequest) -> str:
    # 共通の基本情報
    base_info = f"""【教科】{req.subject}
【学年】{req.grade}
【単元名】{req.unit}
【時間数】{req.hours}時間
【学習目標】{req.objective}"""

    # 単元設定の理由（入力があれば追加）
    reason_parts = []
    if req.material_note:
        reason_parts.append(f"・教材について: {req.material_note}")
    if req.student_note:
        reason_parts.append(f"・生徒・児童について: {req.student_note}")
    if req.teaching_note:
        reason_parts.append(f"・指導について: {req.teaching_note}")

    reason_section = ""
    if reason_parts:
        reason_section = "\n\n【単元設定の理由】\n" + "\n".join(reason_parts)

    content_section = ""
    if req.content_points:
        content_section = f"\n\n【学習内容のポイント】\n{req.content_points}"

    input_info = base_info + reason_section + content_section

    if req.plan_type == "細案":
        return f"""あなたは経験豊富な日本の学校教師です。学習指導要領に基づき、以下の情報をもとに正式な細案形式の指導案を作成してください。

{input_info}

以下の正式フォーマットで指導案を生成してください：

## １ 単元名
（単元名を記述）

## ２ 単元設定の理由
### (1) 教材について
（何を学ぶか・何ができるようになるか）

### (2) 児童・生徒について
（実態・学習履歴・既習事項）

### (3) 指導について
（指導方法・アプローチ・工夫点）

## ３ 単元の目標
・**知識・技能**：
・**思考力・判断力・表現力等**：
・**学びに向かう力・人間性等**：

## ４ 単元の評価規準

| 知識・技能 | 思考力・判断力・表現力等 | 主体的に学習に取り組む態度 |
|-----------|----------------------|------------------------|
| （具体的な評価規準） | （具体的な評価規準） | （具体的な評価規準） |

## ５ 単元の指導計画（全{req.hours}時間）

| 過程 | 主な学習活動 | 評価規準 | 時間 |
|------|------------|---------|------|
| 導入 | （学習問題・学習計画の立案） | | 1時間 |
| 展開 | （調べる・考える活動） | | （適切な時間） |
| 終末 | （まとめ・振り返り・いかす活動） | | 1時間 |

## ６ 本時案（第○時）
### (1) 本時のねらい
（「～することができる」形式で記述）

### (2) 本時の評価規準
（3観点から1〜2つ選択して記述）

### (3) 展開

| 過程 | 時間 | 主な学習活動と生徒の意識 | 教師の手立て（評価） |
|------|------|----------------------|------------------|
| 導入 | 〇分 | （学習問題の確認・見通し） | （教師の働きかけ） |
| 展開 | 〇分 | （中心的な学習活動） | （支援・評価方法） |
| 終末 | 〇分 | （まとめ・振り返り） | （次時への見通し） |

教科・学年・単元に応じた具体的な内容を記述し、実際の授業で使えるレベルの指導案を作成してください。"""

    else:  # 略案
        return f"""あなたは経験豊富な日本の学校教師です。学習指導要領に基づき、以下の情報をもとに略案形式の指導案を作成してください。

{input_info}

以下の略案フォーマットで指導案を生成してください：

## １ 単元名
（単元名を記述）

## ２ 単元の目標
・**知識・技能**：
・**思考力・判断力・表現力等**：
・**学びに向かう力・人間性等**：

## ３ 本時（全{req.hours}時間中の第○時）

### (1) 本時の目標
（「～することができる」形式で1〜2つ記述）

### (2) 本時の展開

| 過程 | 時間 | 主な学習活動 | 指導上の留意点 | 評価 |
|------|------|------------|--------------|------|
| 導入 | 〇分 | （学習問題の把握・見通し） | （教師の留意点） | |
| 展開 | 〇分 | （中心的な学習活動） | （支援・工夫） | （評価規準・方法） |
| 終末 | 〇分 | （まとめ・振り返り） | （次時への接続） | |

教科・学年・単元に応じた具体的な内容を記述し、実際の授業で使えるレベルの指導案を作成してください。"""


@app.post("/api/lesson-plan")
async def generate_lesson_plan(req: LessonPlanRequest):
    model = get_model()
    prompt = build_lesson_prompt(req)

    try:
        response = model.generate_content(prompt)
        return {"result": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 要録参考AI ---

class StudentRecordRequest(BaseModel):
    # 学習の記録
    strong_subjects: list[str] = []
    study_attitude: list[str] = []
    study_note: Optional[str] = None
    # 行動・生活の記録
    personality: list[str] = []
    school_life: list[str] = []
    behavior_note: Optional[str] = None
    # 特別活動・その他
    club: Optional[str] = None
    committee: Optional[str] = None
    achievements: list[str] = []
    activity_note: Optional[str] = None
    # 総合的な特記事項
    general_note: Optional[str] = None


def build_student_info(req: StudentRecordRequest) -> str:
    sections = []

    # 学習の記録
    learning_parts = []
    if req.strong_subjects:
        learning_parts.append(f"得意・頑張った教科: {', '.join(req.strong_subjects)}")
    if req.study_attitude:
        learning_parts.append(f"学習への取り組み: {', '.join(req.study_attitude)}")
    if req.study_note:
        learning_parts.append(f"補足: {req.study_note}")
    if learning_parts:
        sections.append("【学習の記録】\n" + "\n".join(learning_parts))

    # 行動・生活の記録
    behavior_parts = []
    if req.personality:
        behavior_parts.append(f"性格・人柄: {', '.join(req.personality)}")
    if req.school_life:
        behavior_parts.append(f"学校生活の様子: {', '.join(req.school_life)}")
    if req.behavior_note:
        behavior_parts.append(f"補足: {req.behavior_note}")
    if behavior_parts:
        sections.append("【行動・生活の記録】\n" + "\n".join(behavior_parts))

    # 特別活動・その他
    activity_parts = []
    if req.club:
        activity_parts.append(f"部活動: {req.club}")
    if req.committee:
        activity_parts.append(f"委員会・役割: {req.committee}")
    if req.achievements:
        activity_parts.append(f"特記すべき活躍: {', '.join(req.achievements)}")
    if req.activity_note:
        activity_parts.append(f"補足: {req.activity_note}")
    if activity_parts:
        sections.append("【特別活動・その他】\n" + "\n".join(activity_parts))

    # 総合的な特記事項
    if req.general_note:
        sections.append(f"【総合的な特記事項】\n{req.general_note}")

    return "\n\n".join(sections)


@app.post("/api/student-record")
async def generate_student_record(req: StudentRecordRequest):
    model = get_model()
    student_info = build_student_info(req)

    if not student_info.strip():
        raise HTTPException(status_code=400, detail="少なくとも1つの項目を入力してください")

    prompt = f"""あなたは経験豊富な日本の学校教師です。以下の生徒の情報をもとに、指導要録の所見文を3パターン作成してください。

{student_info}

以下の形式で、異なるトーン・表現の3パターンを出力してください。各パターンは区切り文字「---」で区切ってください：

パターン1の所見文をここに書く

---

パターン2の所見文をここに書く

---

パターン3の所見文をここに書く

重要なルール：
- 各パターンは150〜250字程度で書いてください
- 指導要録にそのまま記載できる丁寧な文体で書いてください
- 「パターン1」「パターン2」等の見出しは付けず、所見文の本文のみを出力してください
- 3パターンは異なる表現・構成にしてください
- 入力された情報を自然に盛り込んでください"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        patterns = [p.strip() for p in text.split("---") if p.strip()]
        # Ensure exactly 3 patterns
        while len(patterns) < 3:
            patterns.append(patterns[-1] if patterns else "生成に失敗しました")
        return {"patterns": patterns[:3]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health():
    return {"status": "ok"}


# --- Serve React frontend ---
if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
