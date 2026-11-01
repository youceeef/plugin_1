import subprocess
from pathlib import Path
from fastmcp import FastMCP
from starlette.responses import JSONResponse

mcp = FastMCP("aitrends-2d-studio")

KIT_DIR = Path(__file__).parent.resolve()
SKILLS_DIR = KIT_DIR.parent.parent.resolve()

# 1. Health check & discovery routes at root to satisfy Gemini's probe
@mcp.custom_route("/", methods=["GET", "HEAD", "POST"])
async def root_handler(request):
    return JSONResponse({
        "status": "healthy",
        "name": "aitrends-2d-studio",
        "mcp_endpoint": "/mcp"
    })

# 2. Studio Tools
@mcp.tool()
def read_studio_docs(doc_name: str = "SKILL.md") -> str:
    """Read docs: 'SKILL.md', 'engine-api.md', 'style-bible.md', 'story-breakdown.md', 'sound-design.md', 'render-qc.md', 'install.md'"""
    if doc_name == "SKILL.md":
        target = SKILLS_DIR / "make-2d-video" / "SKILL.md"
    else:
        target = SKILLS_DIR / "make-2d-video" / "references" / doc_name
    if not target.exists():
        return f"File not found: {target}"
    return target.read_text(encoding="utf-8")

@mcp.tool()
def read_example_project(relative_path: str = "config.json") -> str:
    """Read files from reaction-time example project: 'config.json', 'story/shots.json', 'scenes/cast.js', 'scenes/shots/01_cafe.js'"""
    target = (KIT_DIR / "examples" / "reaction-time" / relative_path).resolve()
    if not target.exists():
        return f"Example file not found: {target}"
    return target.read_text(encoding="utf-8")

@mcp.tool()
def write_project_file(relative_path: str, content: str) -> str:
    """Write or update a file inside the kit folder (e.g., 'projects/my-video/scenes/shots/01_intro.js')"""
    target = (KIT_DIR / relative_path).resolve()
    if not str(target).startswith(str(KIT_DIR)):
        return "Error: Path must stay inside the kit directory."
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")
    return f"Successfully wrote {len(content)} characters to {relative_path}"

@mcp.tool()
def run_kit_command(command_type: str, args: list[str] = []) -> str:
    """Run tools locally: 'new_project', 'doctor', 'verify_kit', 'parse_script', 'beats', 'mix_audio', 'render'"""
    cmd_map = {
        "new_project": ["python", "tools/new_project.py"],
        "doctor": ["python", "tools/doctor.py"],
        "verify_kit": ["python", "tools/verify_kit.py"],
        "parse_script": ["python", "tools/parse_script.py"],
        "beats": ["python", "tools/beats.py"],
        "mix_audio": ["python", "audio/mix.py"],
        "render": ["node", "render.mjs"],
    }
    if command_type not in cmd_map:
        return f"Unknown command_type. Choose from: {list(cmd_map.keys())}"
    res = subprocess.run(cmd_map[command_type] + args, cwd=str(KIT_DIR), capture_output=True, text=True, timeout=300)
    return f"STDOUT:\n{res.stdout}\nSTDERR:\n{res.stderr}"

if __name__ == "__main__":
    mcp.run(
        transport="streamable-http",
        host="127.0.0.1",
        port=8000
    )